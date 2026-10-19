-- Add explicit lifetime and revocation for bearer-token report access.
alter table public.reports
  add column if not exists verification_expires_at timestamptz,
  add column if not exists verification_revoked_at timestamptz;

alter table public.reports
  alter column verification_expires_at set default (now() + interval '365 days');

update public.reports
set verification_expires_at = coalesce(verification_expires_at, created_at + interval '365 days')
where verification_expires_at is null;

create unique index if not exists reports_verification_token_hash_uidx
  on public.reports(verification_token_hash)
  where verification_token_hash is not null;

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
    'expiresAt', r.verification_expires_at,
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
    and r.verification_revoked_at is null
    and (r.verification_expires_at is null or r.verification_expires_at > now())
  limit 1;
$$;

create or replace function private.admin_revoke_public_report(p_report_id uuid)
returns table(id uuid, verification_revoked_at timestamptz)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_organization_id uuid;
  v_revoked_at timestamptz;
begin
  if auth.uid() is null then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;

  select r.organization_id into v_organization_id
  from public.reports r
  where r.id = p_report_id
  for update;

  if not found then
    raise exception 'Report not found' using errcode = 'P0002';
  end if;

  if not exists (
    select 1 from public.memberships m
    where m.user_id = auth.uid()
      and m.organization_id = v_organization_id
      and m.status = 'active'
      and m.role in ('SUPER_ADMIN','ORG_ADMIN')
  ) then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;

  update public.reports
  set verification_revoked_at = coalesce(verification_revoked_at, now()),
      verification_token_hash = null,
      updated_at = now()
  where reports.id = p_report_id
  returning reports.verification_revoked_at into v_revoked_at;

  insert into public.audit_logs (organization_id,actor_id,action,entity_type,entity_id,after_data)
  values (v_organization_id,auth.uid(),'revoked public report link','report',p_report_id,
          jsonb_build_object('verification_revoked_at',v_revoked_at));

  return query select p_report_id,v_revoked_at;
end;
$$;

create or replace function public.admin_revoke_public_report(p_report_id uuid)
returns table(id uuid, verification_revoked_at timestamptz)
language sql
security invoker
set search_path = public, private, pg_temp
as $$
  select * from private.admin_revoke_public_report(p_report_id);
$$;

revoke all on function private.admin_revoke_public_report(uuid) from public;
grant execute on function private.admin_revoke_public_report(uuid) to authenticated;
revoke all on function public.admin_revoke_public_report(uuid) from public,anon;
grant execute on function public.admin_revoke_public_report(uuid) to authenticated;
