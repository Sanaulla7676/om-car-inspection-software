-- Storage RLS for inspection evidence and report files
alter table storage.objects enable row level security;

drop policy if exists inspection_media_objects_select on storage.objects;
drop policy if exists inspection_media_objects_insert on storage.objects;
drop policy if exists inspection_media_objects_update on storage.objects;
drop policy if exists inspection_media_objects_delete on storage.objects;

create policy inspection_media_objects_select
on storage.objects for select to authenticated
using (
  bucket_id in ('inspection-media','reports')
  and split_part(name,'/',1) ~* '^[0-9a-f-]{36}$'
  and (split_part(name,'/',1))::uuid = any(private.current_org_ids())
);

create policy inspection_media_objects_insert
on storage.objects for insert to authenticated
with check (
  bucket_id in ('inspection-media','reports')
  and split_part(name,'/',1) ~* '^[0-9a-f-]{36}$'
  and (split_part(name,'/',1))::uuid = any(private.current_org_ids())
);

create policy inspection_media_objects_update
on storage.objects for update to authenticated
using (
  bucket_id in ('inspection-media','reports')
  and split_part(name,'/',1) ~* '^[0-9a-f-]{36}$'
  and (split_part(name,'/',1))::uuid = any(private.current_org_ids())
)
with check (
  bucket_id in ('inspection-media','reports')
  and split_part(name,'/',1) ~* '^[0-9a-f-]{36}$'
  and (split_part(name,'/',1))::uuid = any(private.current_org_ids())
);

create policy inspection_media_objects_delete
on storage.objects for delete to authenticated
using (
  bucket_id in ('inspection-media','reports')
  and split_part(name,'/',1) ~* '^[0-9a-f-]{36}$'
  and (split_part(name,'/',1))::uuid = any(private.current_org_ids())
);