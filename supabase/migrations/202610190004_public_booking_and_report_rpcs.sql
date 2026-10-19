-- Use narrowly scoped database functions instead of exposing service-role credentials to the website.
create or replace function public.create_public_booking_request(
  p_request_type text,
  p_full_name text,
  p_mobile text,
  p_email text,
  p_vehicle_make_model text,
  p_model_year integer,
  p_inspection_type text,
  p_preferred_date date,
  p_vehicle_location text,
  p_notes text,
  p_experience_level text,
  p_learning_goals text
)
returns table(id uuid, created_at timestamptz)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
  v_created_at timestamptz;
begin
  if p_request_type not in ('inspection','masterclass') then
    raise exception 'Invalid request type' using errcode = '22023';
  end if;
  if length(trim(coalesce(p_full_name,''))) not between 2 and 120 then
    raise exception 'Enter a valid full name' using errcode = '22023';
  end if;
  if length(regexp_replace(coalesce(p_mobile,''),'[^0-9]','','g')) not between 8 and 15 then
    raise exception 'Enter a valid mobile number' using errcode = '22023';
  end if;
  if p_email is not null and length(trim(p_email)) > 254 then
    raise exception 'Email address is too long' using errcode = '22023';
  end if;
  if p_email is not null and trim(p_email) !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'Enter a valid email address' using errcode = '22023';
  end if;
  if p_preferred_date is null then
    raise exception 'Choose a preferred date' using errcode = '22023';
  end if;
  if p_request_type = 'inspection' and (
    nullif(trim(coalesce(p_vehicle_make_model,'')),'') is null
    or nullif(trim(coalesce(p_vehicle_location,'')),'') is null
    or nullif(trim(coalesce(p_inspection_type,'')),'') is null
  ) then
    raise exception 'Vehicle, inspection type and location are required' using errcode = '22023';
  end if;
  if p_request_type = 'masterclass' and nullif(trim(coalesce(p_experience_level,'')),'') is null then
    raise exception 'Choose an experience level' using errcode = '22023';
  end if;
  if p_model_year is not null and p_model_year not between 1950 and extract(year from now())::integer + 1 then
    raise exception 'Invalid model year' using errcode = '22023';
  end if;

  insert into public.booking_requests (
    request_type,full_name,mobile,email,vehicle_make_model,model_year,inspection_type,
    preferred_date,vehicle_location,notes,experience_level,learning_goals,status,source
  ) values (
    p_request_type,trim(p_full_name),trim(p_mobile),nullif(trim(p_email),''),
    nullif(trim(p_vehicle_make_model),''),p_model_year,nullif(trim(p_inspection_type),''),
    p_preferred_date,nullif(trim(p_vehicle_location),''),nullif(trim(p_notes),''),
    nullif(trim(p_experience_level),''),nullif(trim(p_learning_goals),''),'NEW','public-website'
  ) returning booking_requests.id, booking_requests.created_at into v_id, v_created_at;

  return query select v_id, v_created_at;
end;
$$;

create or replace function public.admin_list_booking_requests()
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

create or replace function public.admin_update_booking_request_status(p_id uuid, p_status text)
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

create or replace function public.get_public_report_by_token_hash(p_token_hash text)
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select jsonb_build_object(
    'reportId', r.id,
    'status', r.status,
    'version', r.current_version,
    'createdAt', r.created_at,
    'organization', jsonb_build_object('name', o.name),
    'inspection', jsonb_build_object(
      'inspection_number', i.inspection_number,
      'inspection_type', i.inspection_type,
      'vehicles', case when v.id is null then null else jsonb_build_object(
        'make',v.make,'model',v.model,'registration_number',v.registration_number
      ) end
    ),
    'snapshot', rv.snapshot_json
  )
  from public.reports r
  join public.organizations o on o.id = r.organization_id
  join public.inspections i on i.id = r.inspection_id
  left join public.vehicles v on v.id = i.vehicle_id
  left join public.report_versions rv on rv.report_id = r.id and rv.version_number = r.current_version
  where r.verification_token_hash = p_token_hash
  limit 1;
$$;

revoke all on function public.create_public_booking_request(text,text,text,text,text,integer,text,date,text,text,text,text) from public;
grant execute on function public.create_public_booking_request(text,text,text,text,text,integer,text,date,text,text,text,text) to anon, authenticated;

revoke all on function public.admin_list_booking_requests() from public, anon;
grant execute on function public.admin_list_booking_requests() to authenticated;
revoke all on function public.admin_update_booking_request_status(uuid,text) from public, anon;
grant execute on function public.admin_update_booking_request_status(uuid,text) to authenticated;

revoke all on function public.get_public_report_by_token_hash(text) from public;
grant execute on function public.get_public_report_by_token_hash(text) to anon, authenticated;
