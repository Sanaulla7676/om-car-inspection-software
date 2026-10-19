-- Keep public RPC entry points invoker-security and move the privileged body into
-- the non-exposed private schema. This avoids exposing SECURITY DEFINER functions
-- directly through PostgREST while retaining the intended validated workflows.
grant usage on schema private to anon, authenticated;

create or replace function private.create_public_booking_request(
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

create or replace function public.create_public_booking_request(
  p_request_type text,p_full_name text,p_mobile text,p_email text,p_vehicle_make_model text,
  p_model_year integer,p_inspection_type text,p_preferred_date date,p_vehicle_location text,
  p_notes text,p_experience_level text,p_learning_goals text
)
returns table(id uuid, created_at timestamptz)
language sql
security invoker
set search_path = public, private, pg_temp
as $$
  select * from private.create_public_booking_request(
    p_request_type,p_full_name,p_mobile,p_email,p_vehicle_make_model,p_model_year,
    p_inspection_type,p_preferred_date,p_vehicle_location,p_notes,p_experience_level,p_learning_goals
  );
$$;

create or replace function private.get_public_report_by_token_hash(p_token_hash text)
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

create or replace function public.get_public_report_by_token_hash(p_token_hash text)
returns jsonb
language sql
stable
security invoker
set search_path = public, private, pg_temp
as $$
  select private.get_public_report_by_token_hash(p_token_hash);
$$;

revoke all on function private.create_public_booking_request(text,text,text,text,text,integer,text,date,text,text,text,text) from public;
grant execute on function private.create_public_booking_request(text,text,text,text,text,integer,text,date,text,text,text,text) to anon, authenticated;
revoke all on function private.get_public_report_by_token_hash(text) from public;
grant execute on function private.get_public_report_by_token_hash(text) to anon, authenticated;
revoke all on function public.create_public_booking_request(text,text,text,text,text,integer,text,date,text,text,text,text) from public;
grant execute on function public.create_public_booking_request(text,text,text,text,text,integer,text,date,text,text,text,text) to anon, authenticated;
revoke all on function public.get_public_report_by_token_hash(text) from public;
grant execute on function public.get_public_report_by_token_hash(text) to anon, authenticated;

drop policy if exists profiles_self on public.profiles;
create policy profiles_self on public.profiles
  for all to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));
