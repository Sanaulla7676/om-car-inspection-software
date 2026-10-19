-- Atomic, one-time finalization. The report snapshot and all relational results commit together.
create or replace function public.finalize_inspection(
  p_inspection_id uuid,
  p_organization_id uuid,
  p_user_id uuid,
  p_payload jsonb,
  p_item_results jsonb,
  p_findings jsonb,
  p_score jsonb,
  p_recommendation text,
  p_snapshot jsonb,
  p_token_hash text
)
returns table(report_id uuid, current_version integer)
language plpgsql
security invoker
set search_path = public, private
as $$
declare
  v_status text;
  v_report_id uuid;
begin
  if auth.uid() is null or auth.uid() <> p_user_id then
    raise exception 'Not authorized to finalize this inspection' using errcode = '42501';
  end if;

  if not exists (
    select 1 from public.memberships m
    where m.user_id = auth.uid()
      and m.organization_id = p_organization_id
      and m.status = 'active'
      and m.role in ('SUPER_ADMIN','ORG_ADMIN','REVIEWER','INSPECTOR')
  ) then
    raise exception 'Active staff membership required' using errcode = '42501';
  end if;

  select i.status into v_status
  from public.inspections i
  where i.id = p_inspection_id and i.organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Inspection not found' using errcode = 'P0002';
  end if;

  if v_status = 'COMPLETED' or exists (
    select 1 from public.reports r where r.inspection_id = p_inspection_id
  ) then
    raise exception 'Inspection already finalized; create a new inspection for a revised assessment' using errcode = '23505';
  end if;

  insert into public.inspection_item_results (
    organization_id, inspection_id, item_code, item_label, status, severity, value, notes, inspector_id
  )
  select
    p_organization_id,
    p_inspection_id,
    item->>'item_code',
    item->>'item_label',
    nullif(item->>'status',''),
    nullif(item->>'severity',''),
    item->'value',
    nullif(item->>'notes',''),
    p_user_id
  from jsonb_array_elements(coalesce(p_item_results, '[]'::jsonb)) as item;

  insert into public.inspection_findings (
    organization_id, inspection_id, system, title, severity, description, recommendation, status, created_by
  )
  select
    p_organization_id,
    p_inspection_id,
    nullif(item->>'system',''),
    item->>'name',
    item->>'severity',
    nullif(item->>'default_description',''),
    nullif(item->>'recommendation',''),
    'OPEN',
    p_user_id
  from jsonb_array_elements(coalesce(p_findings, '[]'::jsonb)) as item;

  insert into public.inspection_scores (
    organization_id, inspection_id, overall_score, recommendation,
    major_count, minor_count, moderate_count, cosmetic_count, critical_count, calculated_at
  ) values (
    p_organization_id,
    p_inspection_id,
    coalesce((p_score->>'overall')::numeric, 100),
    p_recommendation,
    coalesce((p_score->'counts'->>'Major')::integer, 0),
    coalesce((p_score->'counts'->>'Minor')::integer, 0),
    coalesce((p_score->'counts'->>'Moderate')::integer, 0),
    coalesce((p_score->'counts'->>'Cosmetic')::integer, 0),
    coalesce((p_score->'counts'->>'Critical')::integer, 0),
    now()
  )
  on conflict (inspection_id) do update set
    overall_score = excluded.overall_score,
    recommendation = excluded.recommendation,
    major_count = excluded.major_count,
    minor_count = excluded.minor_count,
    moderate_count = excluded.moderate_count,
    cosmetic_count = excluded.cosmetic_count,
    critical_count = excluded.critical_count,
    calculated_at = excluded.calculated_at;

  insert into public.reports (
    organization_id, inspection_id, current_version, status, verification_token_hash, updated_at
  ) values (
    p_organization_id, p_inspection_id, 1, 'READY', p_token_hash, now()
  )
  returning id into v_report_id;

  insert into public.report_versions (
    organization_id, report_id, version_number, snapshot_json, created_by
  ) values (
    p_organization_id, v_report_id, 1, p_snapshot, p_user_id
  );

  update public.inspections
  set draft_payload = p_payload,
      status = 'COMPLETED',
      completed_at = now(),
      updated_at = now()
  where id = p_inspection_id and organization_id = p_organization_id;

  insert into public.audit_logs (
    organization_id, actor_id, action, entity_type, entity_id, after_data
  ) values (
    p_organization_id, p_user_id, 'generated report', 'inspection', p_inspection_id,
    jsonb_build_object('score', p_score->>'overall', 'recommendation', p_recommendation, 'report_id', v_report_id)
  );

  return query select v_report_id, 1;
end;
$$;

revoke all on function public.finalize_inspection(uuid,uuid,uuid,jsonb,jsonb,jsonb,jsonb,text,jsonb,text) from public, anon;
grant execute on function public.finalize_inspection(uuid,uuid,uuid,jsonb,jsonb,jsonb,jsonb,text,jsonb,text) to authenticated;
