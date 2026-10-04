-- OM Car Inspection production schema
create extension if not exists pgcrypto;
create schema if not exists private;

create table if not exists public.organizations(
  id uuid primary key default gen_random_uuid(), name text not null, logo_url text, phone text, email text, website text,
  address text, timezone text not null default 'Asia/Kolkata', default_language text not null default 'English',
  report_prefix text not null default 'INS-', settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.profiles(
  id uuid primary key references auth.users(id) on delete cascade, full_name text, phone text, avatar_url text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.branches(
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null, code text, address text, phone text, active boolean not null default true, created_at timestamptz not null default now(),
  unique(organization_id,code)
);
create table if not exists public.memberships(
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade, branch_id uuid references public.branches(id) on delete set null,
  role text not null check(role in('SUPER_ADMIN','ORG_ADMIN','REVIEWER','INSPECTOR','CUSTOMER')),
  status text not null default 'active' check(status in('active','invited','suspended')), created_at timestamptz not null default now(),
  unique(organization_id,user_id)
);
create table if not exists public.customers(
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null, phone text, email text, customer_type text not null default 'Buyer',
  address text, notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.vehicles(
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  registration_number text not null, vin text, chassis_number text, engine_number text, make text, model text, variant text,
  manufacturing_year integer, fuel_type text, transmission text, color text, odometer integer, ownership_count integer,
  metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(organization_id,registration_number), unique(organization_id,vin)
);
create table if not exists public.vehicle_lookup_logs(
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  vehicle_id uuid references public.vehicles(id) on delete set null, provider text not null, request jsonb, response_summary jsonb,
  status text not null, requested_by uuid references auth.users(id) on delete set null, created_at timestamptz not null default now()
);

create table if not exists public.inspection_templates(
  id uuid primary key default gen_random_uuid(), organization_id uuid references public.organizations(id) on delete cascade,
  name text not null, inspection_type text not null, description text, version integer not null default 1,
  published boolean not null default false, schema jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.template_sections(
  id uuid primary key default gen_random_uuid(), organization_id uuid references public.organizations(id) on delete cascade,
  template_id uuid not null references public.inspection_templates(id) on delete cascade, name text not null,
  sort_order integer not null, conditional_rule jsonb, created_at timestamptz not null default now()
);
create table if not exists public.template_items(
  id uuid primary key default gen_random_uuid(), organization_id uuid references public.organizations(id) on delete cascade,
  section_id uuid not null references public.template_sections(id) on delete cascade, code text not null, label text not null,
  description text, input_type text not null default 'select',
  status_options jsonb not null default '["Good","Fair","Poor","Not tested"]'::jsonb,
  severity_options jsonb not null default '["Cosmetic","Minor","Moderate","Major","Critical"]'::jsonb,
  required boolean not null default false, photo_required boolean not null default false, video_required boolean not null default false,
  scoring_weight numeric not null default 1, active boolean not null default true, sort_order integer not null default 0
);
create table if not exists public.faults(
  id uuid primary key default gen_random_uuid(), organization_id uuid references public.organizations(id) on delete cascade,
  code text, system text not null, name text not null, severity text not null check(severity in('Cosmetic','Minor','Moderate','Major','Critical')),
  default_description text, recommendation text, photo_required boolean not null default false, active boolean not null default true, created_at timestamptz not null default now()
);
create table if not exists public.scoring_rules(
  id uuid primary key default gen_random_uuid(), organization_id uuid references public.organizations(id) on delete cascade,
  severity text not null check(severity in('Cosmetic','Minor','Moderate','Major','Critical')), penalty numeric not null,
  requires_review boolean not null default false, enabled boolean not null default true, created_at timestamptz not null default now()
);

create table if not exists public.inspections(
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  inspection_number text not null, vehicle_id uuid not null references public.vehicles(id) on delete restrict,
  customer_id uuid references public.customers(id) on delete set null, inspector_id uuid references auth.users(id) on delete set null,
  reviewer_id uuid references auth.users(id) on delete set null, template_version_id uuid references public.inspection_templates(id) on delete set null,
  inspection_type text not null, status text not null default 'DRAFT', priority text not null default 'Normal',
  draft_payload jsonb not null default '{}'::jsonb, started_at timestamptz, completed_at timestamptz, submitted_at timestamptz,
  reviewed_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(organization_id,inspection_number)
);
create table if not exists public.inspection_drafts(
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  inspection_id uuid not null unique references public.inspections(id) on delete cascade, version integer not null default 1,
  payload jsonb not null, device_id text, updated_by uuid references auth.users(id) on delete set null, updated_at timestamptz not null default now()
);
create table if not exists public.inspection_item_results(
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  inspection_id uuid not null references public.inspections(id) on delete cascade, template_item_id uuid references public.template_items(id) on delete set null,
  item_code text not null, item_label text not null, status text, severity text, value jsonb, notes text,
  inspector_id uuid references auth.users(id) on delete set null, updated_at timestamptz not null default now(),
  unique(organization_id,inspection_id,item_code)
);
create table if not exists public.inspection_findings(
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  inspection_id uuid not null references public.inspections(id) on delete cascade, fault_id uuid references public.faults(id) on delete set null,
  item_result_id uuid references public.inspection_item_results(id) on delete set null, system text, title text not null,
  severity text not null check(severity in('Cosmetic','Minor','Moderate','Major','Critical')), description text, recommendation text,
  status text not null default 'OPEN', previous_finding_id uuid references public.inspection_findings(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.inspection_media(
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  inspection_id uuid not null references public.inspections(id) on delete cascade, section_name text,
  item_result_id uuid references public.inspection_item_results(id) on delete set null, finding_id uuid references public.inspection_findings(id) on delete set null,
  file_path text not null, media_type text not null, original_filename text, mime_type text, file_size bigint, checksum text,
  captured_at timestamptz, captured_by uuid references auth.users(id) on delete set null, device_id text, latitude numeric, longitude numeric,
  metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);
create table if not exists public.media_annotations(
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  media_id uuid not null references public.inspection_media(id) on delete cascade, annotation_type text not null, geometry jsonb not null,
  label text, style jsonb not null default '{}'::jsonb, created_by uuid references auth.users(id) on delete set null, created_at timestamptz not null default now()
);
create table if not exists public.inspection_scores(
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  inspection_id uuid not null unique references public.inspections(id) on delete cascade, overall_score numeric not null default 100 check(overall_score between 0 and 100),
  recommendation text, major_count integer not null default 0, minor_count integer not null default 0, cosmetic_count integer not null default 0,
  moderate_count integer not null default 0, critical_count integer not null default 0, calculated_at timestamptz not null default now()
);
create table if not exists public.category_scores(
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  inspection_id uuid not null references public.inspections(id) on delete cascade, category text not null,
  score numeric not null check(score between 0 and 100), findings_count integer not null default 0, unique(organization_id,inspection_id,category)
);
create table if not exists public.reinspections(
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  previous_inspection_id uuid not null references public.inspections(id) on delete restrict, current_inspection_id uuid references public.inspections(id) on delete set null,
  reason text, due_date date, created_by uuid references auth.users(id) on delete set null, created_at timestamptz not null default now()
);
create table if not exists public.reinspection_findings(
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  reinspection_id uuid not null references public.reinspections(id) on delete cascade,
  previous_finding_id uuid references public.inspection_findings(id) on delete set null, current_finding_id uuid references public.inspection_findings(id) on delete set null,
  status text not null, previous_value jsonb, current_value jsonb, created_at timestamptz not null default now()
);
create table if not exists public.reports(
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  inspection_id uuid not null unique references public.inspections(id) on delete cascade, current_version integer not null default 1,
  status text not null default 'QUEUED', verification_token_hash text not null unique, share_count integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.report_versions(
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  report_id uuid not null references public.reports(id) on delete cascade, version_number integer not null,
  snapshot_json jsonb not null, pdf_path text, created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(), unique(organization_id,report_id,version_number)
);
create table if not exists public.notifications(
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade, channel text not null,type text not null,title text not null,body text,
  entity_type text,entity_id uuid,status text not null default 'PENDING',provider_message_id text,sent_at timestamptz,created_at timestamptz not null default now()
);
create table if not exists public.audit_logs(
  id uuid primary key default gen_random_uuid(),organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,action text not null,entity_type text,entity_id uuid,before_data jsonb,after_data jsonb,
  metadata jsonb not null default '{}'::jsonb,created_at timestamptz not null default now()
);
create table if not exists public.sync_operations(
  id uuid primary key default gen_random_uuid(),organization_id uuid not null references public.organizations(id) on delete cascade,
  device_id text not null,operation_id text not null,entity_type text not null,entity_id uuid,
  operation text not null check(operation in('UPSERT','DELETE')),payload jsonb not null,status text not null default 'PENDING',
  error_message text,created_at timestamptz not null default now(),processed_at timestamptz,unique(organization_id,operation_id)
);

create or replace function private.current_org_ids() returns uuid[] language sql stable security definer set search_path='' as
$$ select coalesce(array_agg(m.organization_id),'{}'::uuid[]) from public.memberships m where m.user_id=auth.uid() and m.status='active' $$;
create or replace function private.has_org_role(target_org uuid, roles text[]) returns boolean language sql stable security definer set search_path='' as
$$ select exists(select 1 from public.memberships m where m.organization_id=target_org and m.user_id=auth.uid() and m.status='active' and m.role=any(roles)) $$;
create or replace function private.org_has_members(target_org uuid) returns boolean language sql stable security definer set search_path='' as
$$ select exists(select 1 from public.memberships m where m.organization_id=target_org) $$;
create or replace function private.handle_new_user() returns trigger language plpgsql security definer set search_path='' as
$$ begin insert into public.profiles(id,full_name) values(new.id,new.raw_user_meta_data->>'full_name') on conflict(id) do nothing; return new; end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure private.handle_new_user();

grant usage on schema public to authenticated;
grant select,insert,update,delete on all tables in schema public to authenticated;
grant usage,select on all sequences in schema public to authenticated;
grant execute on function private.current_org_ids() to authenticated;
grant execute on function private.has_org_role(uuid,text[]) to authenticated;
grant execute on function private.org_has_members(uuid) to authenticated;

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.memberships enable row level security;
alter table public.branches enable row level security;
alter table public.customers enable row level security;
alter table public.vehicles enable row level security;
alter table public.vehicle_lookup_logs enable row level security;
alter table public.inspection_templates enable row level security;
alter table public.template_sections enable row level security;
alter table public.template_items enable row level security;
alter table public.faults enable row level security;
alter table public.scoring_rules enable row level security;
alter table public.inspections enable row level security;
alter table public.inspection_drafts enable row level security;
alter table public.inspection_item_results enable row level security;
alter table public.inspection_findings enable row level security;
alter table public.inspection_media enable row level security;
alter table public.media_annotations enable row level security;
alter table public.inspection_scores enable row level security;
alter table public.category_scores enable row level security;
alter table public.reinspections enable row level security;
alter table public.reinspection_findings enable row level security;
alter table public.reports enable row level security;
alter table public.report_versions enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;
alter table public.sync_operations enable row level security;

drop policy if exists organizations_select on public.organizations;
drop policy if exists organizations_insert on public.organizations;
drop policy if exists organizations_update on public.organizations;
create policy organizations_select on public.organizations for select to authenticated using(id=any(private.current_org_ids()));
create policy organizations_insert on public.organizations for insert to authenticated with check(true);
create policy organizations_update on public.organizations for update to authenticated using(id=any(private.current_org_ids())) with check(id=any(private.current_org_ids()));

drop policy if exists profiles_select on public.profiles; drop policy if exists profiles_insert on public.profiles; drop policy if exists profiles_update on public.profiles;
create policy profiles_select on public.profiles for select to authenticated using(id=auth.uid());
create policy profiles_insert on public.profiles for insert to authenticated with check(id=auth.uid());
create policy profiles_update on public.profiles for update to authenticated using(id=auth.uid()) with check(id=auth.uid());

drop policy if exists memberships_select on public.memberships; drop policy if exists memberships_insert on public.memberships; drop policy if exists memberships_update on public.memberships; drop policy if exists memberships_delete on public.memberships;
create policy memberships_select on public.memberships for select to authenticated using(organization_id=any(private.current_org_ids()));
create policy memberships_insert on public.memberships for insert to authenticated with check(user_id=auth.uid() and (not private.org_has_members(organization_id) or private.has_org_role(organization_id,array['SUPER_ADMIN','ORG_ADMIN'])));
create policy memberships_update on public.memberships for update to authenticated using(private.has_org_role(organization_id,array['SUPER_ADMIN','ORG_ADMIN'])) with check(private.has_org_role(organization_id,array['SUPER_ADMIN','ORG_ADMIN']));
create policy memberships_delete on public.memberships for delete to authenticated using(private.has_org_role(organization_id,array['SUPER_ADMIN','ORG_ADMIN']));

do $$
declare t text;
begin
 foreach t in array['branches','customers','vehicles','vehicle_lookup_logs','inspection_drafts','inspection_item_results','inspection_findings','inspection_media','media_annotations','inspection_scores','category_scores','reinspections','reinspection_findings','reports','report_versions','notifications','audit_logs','sync_operations'] loop
  execute format('drop policy if exists %I_select on public.%I',t,t);
  execute format('drop policy if exists %I_insert on public.%I',t,t);
  execute format('drop policy if exists %I_update on public.%I',t,t);
  execute format('drop policy if exists %I_delete on public.%I',t,t);
  execute format('create policy %I_select on public.%I for select to authenticated using(organization_id=any(private.current_org_ids()))',t||'_select',t);
  execute format('create policy %I_insert on public.%I for insert to authenticated with check(organization_id=any(private.current_org_ids()))',t||'_insert',t);
  execute format('create policy %I_update on public.%I for update to authenticated using(organization_id=any(private.current_org_ids())) with check(organization_id=any(private.current_org_ids()))',t||'_update',t);
  execute format('create policy %I_delete on public.%I for delete to authenticated using(organization_id=any(private.current_org_ids()))',t||'_delete',t);
 end loop;
end $$;

drop policy if exists inspection_templates_select on public.inspection_templates;
drop policy if exists inspection_templates_insert on public.inspection_templates;
drop policy if exists inspection_templates_update on public.inspection_templates;
drop policy if exists inspection_templates_delete on public.inspection_templates;
create policy inspection_templates_select on public.inspection_templates for select to authenticated using(organization_id is null or organization_id=any(private.current_org_ids()));
create policy inspection_templates_insert on public.inspection_templates for insert to authenticated with check(private.has_org_role(organization_id,array['SUPER_ADMIN','ORG_ADMIN']));
create policy inspection_templates_update on public.inspection_templates for update to authenticated using(private.has_org_role(organization_id,array['SUPER_ADMIN','ORG_ADMIN'])) with check(private.has_org_role(organization_id,array['SUPER_ADMIN','ORG_ADMIN']));
create policy inspection_templates_delete on public.inspection_templates for delete to authenticated using(private.has_org_role(organization_id,array['SUPER_ADMIN','ORG_ADMIN']));

drop policy if exists template_sections_select on public.template_sections; drop policy if exists template_sections_insert on public.template_sections; drop policy if exists template_sections_update on public.template_sections; drop policy if exists template_sections_delete on public.template_sections;
create policy template_sections_select on public.template_sections for select to authenticated using(organization_id is null or organization_id=any(private.current_org_ids()));
create policy template_sections_insert on public.template_sections for insert to authenticated with check(private.has_org_role(organization_id,array['SUPER_ADMIN','ORG_ADMIN']));
create policy template_sections_update on public.template_sections for update to authenticated using(private.has_org_role(organization_id,array['SUPER_ADMIN','ORG_ADMIN'])) with check(private.has_org_role(organization_id,array['SUPER_ADMIN','ORG_ADMIN']));
create policy template_sections_delete on public.template_sections for delete to authenticated using(private.has_org_role(organization_id,array['SUPER_ADMIN','ORG_ADMIN']));

drop policy if exists template_items_select on public.template_items; drop policy if exists template_items_insert on public.template_items; drop policy if exists template_items_update on public.template_items; drop policy if exists template_items_delete on public.template_items;
create policy template_items_select on public.template_items for select to authenticated using(organization_id is null or organization_id=any(private.current_org_ids()));
create policy template_items_insert on public.template_items for insert to authenticated with check(private.has_org_role(organization_id,array['SUPER_ADMIN','ORG_ADMIN']));
create policy template_items_update on public.template_items for update to authenticated using(private.has_org_role(organization_id,array['SUPER_ADMIN','ORG_ADMIN'])) with check(private.has_org_role(organization_id,array['SUPER_ADMIN','ORG_ADMIN']));
create policy template_items_delete on public.template_items for delete to authenticated using(private.has_org_role(organization_id,array['SUPER_ADMIN','ORG_ADMIN']));

drop policy if exists faults_select on public.faults; drop policy if exists faults_insert on public.faults; drop policy if exists faults_update on public.faults; drop policy if exists faults_delete on public.faults;
create policy faults_select on public.faults for select to authenticated using(organization_id is null or organization_id=any(private.current_org_ids()));
create policy faults_insert on public.faults for insert to authenticated with check(private.has_org_role(organization_id,array['SUPER_ADMIN','ORG_ADMIN']));
create policy faults_update on public.faults for update to authenticated using(private.has_org_role(organization_id,array['SUPER_ADMIN','ORG_ADMIN'])) with check(private.has_org_role(organization_id,array['SUPER_ADMIN','ORG_ADMIN']));
create policy faults_delete on public.faults for delete to authenticated using(private.has_org_role(organization_id,array['SUPER_ADMIN','ORG_ADMIN']));

drop policy if exists scoring_rules_select on public.scoring_rules; drop policy if exists scoring_rules_insert on public.scoring_rules; drop policy if exists scoring_rules_update on public.scoring_rules; drop policy if exists scoring_rules_delete on public.scoring_rules;
create policy scoring_rules_select on public.scoring_rules for select to authenticated using(organization_id is null or organization_id=any(private.current_org_ids()));
create policy scoring_rules_insert on public.scoring_rules for insert to authenticated with check(private.has_org_role(organization_id,array['SUPER_ADMIN','ORG_ADMIN']));
create policy scoring_rules_update on public.scoring_rules for update to authenticated using(private.has_org_role(organization_id,array['SUPER_ADMIN','ORG_ADMIN'])) with check(private.has_org_role(organization_id,array['SUPER_ADMIN','ORG_ADMIN']));
create policy scoring_rules_delete on public.scoring_rules for delete to authenticated using(private.has_org_role(organization_id,array['SUPER_ADMIN','ORG_ADMIN']));

insert into storage.buckets(id,name,public) values('inspection-media','inspection-media',false) on conflict(id) do nothing;
insert into storage.buckets(id,name,public) values('reports','reports',false) on conflict(id) do nothing;
drop policy if exists inspection_media_objects_select on storage.objects;
drop policy if exists inspection_media_objects_insert on storage.objects;
drop policy if exists inspection_media_objects_update on storage.objects;
drop policy if exists inspection_media_objects_delete on storage.objects;
create policy inspection_media_objects_select on storage.objects for select to authenticated using(bucket_id in('inspection-media','reports') and split_part(name,'/',1) ~* '^[0-9a-f-]{36}$' and (split_part(name,'/',1))::uuid=any(private.current_org_ids()));
create policy inspection_media_objects_insert on storage.objects for insert to authenticated with check(bucket_id in('inspection-media','reports') and split_part(name,'/',1) ~* '^[0-9a-f-]{36}$' and (split_part(name,'/',1))::uuid=any(private.current_org_ids()));
create policy inspection_media_objects_update on storage.objects for update to authenticated using(bucket_id in('inspection-media','reports') and split_part(name,'/',1) ~* '^[0-9a-f-]{36}$' and (split_part(name,'/',1))::uuid=any(private.current_org_ids())) with check(bucket_id in('inspection-media','reports') and split_part(name,'/',1) ~* '^[0-9a-f-]{36}$' and (split_part(name,'/',1))::uuid=any(private.current_org_ids()));
create policy inspection_media_objects_delete on storage.objects for delete to authenticated using(bucket_id in('inspection-media','reports') and split_part(name,'/',1) ~* '^[0-9a-f-]{36}$' and (split_part(name,'/',1))::uuid=any(private.current_org_ids()));

insert into public.faults(organization_id,code,system,name,severity,default_description,recommendation,photo_required)
select null,v.code,v.system,v.name,v.severity,v.description,v.recommendation,v.photo_required from (values
('F-ENG-001','Engine','Oil leakage','Major','Visible oil leakage observed around engine area.','Mechanical assessment is recommended.',true),
('F-ENG-002','Engine','Coolant leakage','Major','Coolant leakage observed in engine bay.','Pressure-test and mechanical inspection recommended.',true),
('F-BDY-001','Body','Exterior scratch','Cosmetic','Visible surface scratches observed on inspected body panel.','Cosmetic repair may be considered.',true),
('F-BDY-002','Body','Dent','Minor','Visible dent observed on inspected panel.','Repair assessment may be required.',true),
('F-BDY-003','Body','Panel repaint','Moderate','Paint finish differs from surrounding panel.','Review previous repair history.',true),
('F-TYR-001','Tyres','Tyre wear','Moderate','Tread wear observed.','Replacement assessment recommended.',true),
('F-HVA-001','HVAC','AC cooling weak','Minor','Cooling performance below expected level.','HVAC diagnosis recommended.',false),
('F-ELE-001','Electrical','Warning light','Major','Warning indicator observed on instrument cluster.','Diagnostic assessment recommended.',true),
('F-BRK-001','Brakes','Brake noise','Moderate','Brake noise reported or observed during inspection.','Brake-system inspection recommended.',true),
('F-STR-001','Steering','Steering play','Major','Steering play observed during assessment.','Immediate steering-system assessment recommended.',true),
('F-GLS-001','Glass','Cracked windshield','Major','Visible windshield crack.','Replacement assessment recommended.',true),
('F-ELE-002','Electrical','Battery weak','Moderate','Battery performance may require testing.','Battery test recommended.',false)
) v(code,system,name,severity,description,recommendation,photo_required)
where not exists(select 1 from public.faults f where f.organization_id is null and f.name=v.name);

insert into public.scoring_rules(organization_id,severity,penalty,requires_review,enabled)
select null,v.severity,v.penalty,v.review,true from (values('Cosmetic',1,false),('Minor',3,false),('Moderate',6,false),('Major',10,true),('Critical',20,true)) v(severity,penalty,review)
where not exists(select 1 from public.scoring_rules s where s.organization_id is null and s.severity=v.severity);

insert into public.inspection_templates(organization_id,name,inspection_type,description,published)
select null,'Used Car — Standard','Used Car','Starter template aligned with the 11-step OM Car Inspection workflow.',true
where not exists(select 1 from public.inspection_templates t where t.organization_id is null and t.name='Used Car — Standard');

do $$
declare tid uuid; sid uuid; s text; i integer;
begin
 select id into tid from public.inspection_templates where organization_id is null and name='Used Car — Standard' limit 1;
 if tid is not null and not exists(select 1 from public.template_sections where template_id=tid) then
  for i in 1..6 loop
   sid:=gen_random_uuid(); s:=(array['Exterior','Interior','Mechanical','Electrical','Tyres','Test Drive'])[i];
   insert into public.template_sections(id,organization_id,template_id,name,sort_order) values(sid,null,tid,s,i);
  end loop;
 end if;
end $$;
