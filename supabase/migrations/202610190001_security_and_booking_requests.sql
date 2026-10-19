-- Security hardening and public booking request intake.
-- Generic reference data remains read-only; organisation-specific rows stay tenant-scoped.
create schema if not exists private;

alter table public.inspection_templates enable row level security;
alter table public.template_sections enable row level security;
alter table public.template_items enable row level security;
alter table public.faults enable row level security;
alter table public.scoring_rules enable row level security;

revoke all on table public.inspection_templates, public.template_sections, public.template_items, public.faults, public.scoring_rules from anon, authenticated, public;
grant select on table public.inspection_templates, public.template_sections, public.template_items, public.faults, public.scoring_rules to anon, authenticated;

drop policy if exists inspection_templates_public_read on public.inspection_templates;
drop policy if exists inspection_templates_staff_read on public.inspection_templates;
create policy inspection_templates_public_read on public.inspection_templates
  for select to anon using (organization_id is null and published = true);
create policy inspection_templates_staff_read on public.inspection_templates
  for select to authenticated
  using (published = true and (organization_id is null or organization_id = any(private.current_org_ids())));

drop policy if exists template_sections_public_read on public.template_sections;
drop policy if exists template_sections_staff_read on public.template_sections;
create policy template_sections_public_read on public.template_sections
  for select to anon
  using (
    organization_id is null
    and exists (
      select 1 from public.inspection_templates t
      where t.id = template_id and t.organization_id is null and t.published = true
    )
  );
create policy template_sections_staff_read on public.template_sections
  for select to authenticated
  using (
    (organization_id is null or organization_id = any(private.current_org_ids()))
    and exists (
      select 1 from public.inspection_templates t
      where t.id = template_id and t.published = true
        and (t.organization_id is null or t.organization_id = any(private.current_org_ids()))
    )
  );

drop policy if exists template_items_public_read on public.template_items;
drop policy if exists template_items_staff_read on public.template_items;
create policy template_items_public_read on public.template_items
  for select to anon
  using (
    organization_id is null
    and exists (
      select 1
      from public.template_sections s
      join public.inspection_templates t on t.id = s.template_id
      where s.id = section_id
        and s.organization_id is null
        and t.organization_id is null
        and t.published = true
    )
  );
create policy template_items_staff_read on public.template_items
  for select to authenticated
  using (
    (organization_id is null or organization_id = any(private.current_org_ids()))
    and exists (
      select 1
      from public.template_sections s
      join public.inspection_templates t on t.id = s.template_id
      where s.id = section_id
        and (s.organization_id is null or s.organization_id = any(private.current_org_ids()))
        and t.published = true
        and (t.organization_id is null or t.organization_id = any(private.current_org_ids()))
    )
  );

drop policy if exists faults_public_read on public.faults;
drop policy if exists faults_staff_read on public.faults;
create policy faults_public_read on public.faults
  for select to anon using (organization_id is null and active = true);
create policy faults_staff_read on public.faults
  for select to authenticated
  using (active = true and (organization_id is null or organization_id = any(private.current_org_ids())));

drop policy if exists scoring_rules_public_read on public.scoring_rules;
drop policy if exists scoring_rules_staff_read on public.scoring_rules;
create policy scoring_rules_public_read on public.scoring_rules
  for select to anon using (organization_id is null and enabled = true);
create policy scoring_rules_staff_read on public.scoring_rules
  for select to authenticated
  using (enabled = true and (organization_id is null or organization_id = any(private.current_org_ids())));

-- Booking requests are accepted only through the server-side service-role API.
create table if not exists public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  request_type text not null check (request_type in ('inspection','masterclass')),
  full_name text not null check (length(trim(full_name)) between 2 and 120),
  mobile text not null check (length(regexp_replace(mobile, '[^0-9]', '', 'g')) between 8 and 15),
  email text,
  vehicle_make_model text,
  model_year integer,
  inspection_type text,
  preferred_date date,
  vehicle_location text,
  notes text,
  experience_level text,
  learning_goals text,
  status text not null default 'NEW' check (status in ('NEW','CONTACTED','CONFIRMED','COMPLETED','CANCELLED')),
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists booking_requests_status_created_idx on public.booking_requests(status, created_at desc);
create index if not exists booking_requests_type_created_idx on public.booking_requests(request_type, created_at desc);

alter table public.booking_requests enable row level security;
revoke all on table public.booking_requests from anon, authenticated, public;
grant all on table public.booking_requests to service_role;

comment on table public.booking_requests is 'Public website enquiry intake; accessible only to server-side service-role handlers after validation and to authenticated admins through server APIs.';
