-- Privileged booking administration lives in the non-exposed schema.
create or replace function private.admin_list_booking_requests()
returns table(
  id uuid, request_type text, full_name text, mobile text, email text,
  vehicle_make_model text, model_year integer, inspection_type text, preferred_date date,
  vehicle_location text, notes text, experience_level text, learning_goals text,
  status text, source text, created_at timestamptz, updated_at timestamptz
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null or not exists (
    select 1 from public.memberships m
    where m.user_id = auth.uid() and m.status = 'active'
      and m.role in ('SUPER_ADMIN','ORG_ADMIN')
  ) then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;

  return query
  select b.id,b.request_type,b.full_name,b.mobile,b.email,b.vehicle_make_model,b.model_year,
    b.inspection_type,b.preferred_date,b.vehicle_location,b.notes,b.experience_level,
    b.learning_goals,b.status,b.source,b.created_at,b.updated_at
  from public.booking_requests b
  order by b.created_at desc
  limit 200;
end;
$$;

create or replace function public.admin_list_booking_requests()
returns table(
  id uuid, request_type text, full_name text, mobile text, email text,
  vehicle_make_model text, model_year integer, inspection_type text, preferred_date date,
  vehicle_location text, notes text, experience_level text, learning_goals text,
  status text, source text, created_at timestamptz, updated_at timestamptz
)
language sql
security invoker
set search_path = public, private, pg_temp
as $$
  select * from private.admin_list_booking_requests();
$$;

create or replace function private.admin_update_booking_request_status(p_id uuid, p_status text)
returns table(id uuid, status text, updated_at timestamptz)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null or not exists (
    select 1 from public.memberships m
    where m.user_id = auth.uid() and m.status = 'active'
      and m.role in ('SUPER_ADMIN','ORG_ADMIN')
  ) then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;
  if p_status not in ('NEW','CONTACTED','CONFIRMED','COMPLETED','CANCELLED') then
    raise exception 'Invalid request status' using errcode = '22023';
  end if;

  return query
  update public.booking_requests b
  set status = p_status, updated_at = now()
  where b.id = p_id
  returning b.id,b.status,b.updated_at;
end;
$$;

create or replace function public.admin_update_booking_request_status(p_id uuid, p_status text)
returns table(id uuid, status text, updated_at timestamptz)
language sql
security invoker
set search_path = public, private, pg_temp
as $$
  select * from private.admin_update_booking_request_status(p_id,p_status);
$$;

revoke all on function private.admin_list_booking_requests() from public;
grant execute on function private.admin_list_booking_requests() to authenticated;
revoke all on function private.admin_update_booking_request_status(uuid,text) from public;
grant execute on function private.admin_update_booking_request_status(uuid,text) to authenticated;
revoke all on function public.admin_list_booking_requests() from public,anon;
grant execute on function public.admin_list_booking_requests() to authenticated;
revoke all on function public.admin_update_booking_request_status(uuid,text) from public,anon;
grant execute on function public.admin_update_booking_request_status(uuid,text) to authenticated;
