-- Add a supporting index for each public-schema foreign key that lacks one.
-- This reduces joins and referential checks degrading as inspection history grows.
do $$
declare
  r record;
  v_index_name text;
  v_count integer := 0;
begin
  for r in
    select
      c.oid as table_oid,
      c.oid::regclass as table_ref,
      c.relname as table_name,
      con.conname as constraint_name,
      con.conkey as key_columns,
      string_agg(format('%I', a.attname), ', ' order by k.ord) as columns_sql
    from pg_constraint con
    join pg_class c on c.oid = con.conrelid
    join pg_namespace n on n.oid = c.relnamespace
    cross join lateral unnest(con.conkey) with ordinality as k(attnum,ord)
    join pg_attribute a on a.attrelid = c.oid and a.attnum = k.attnum
    where con.contype = 'f'
      and n.nspname = 'public'
      and not exists (
        select 1
        from pg_index i
        where i.indrelid = con.conrelid
          and i.indisvalid
          and i.indisready
          and i.indpred is null
          and (
            select array_agg(u.attnum::smallint order by u.ord)
            from unnest(i.indkey) with ordinality as u(attnum,ord)
            where u.ord <= cardinality(con.conkey)
          ) = con.conkey
      )
    group by c.oid,c.relname,con.conname,con.conkey
  loop
    v_index_name := 'idx_fk_' || substr(md5(r.table_oid::text || ':' || r.constraint_name),1,16);
    execute format('create index if not exists %I on %s (%s)', v_index_name, r.table_ref, r.columns_sql);
    v_count := v_count + 1;
  end loop;
  raise notice 'Ensured foreign-key indexes for % constraints', v_count;
end $$;
