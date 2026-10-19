-- Create the vehicle, customer, inspection, draft and audit entry in one transaction.
create or replace function public.create_inspection(
  p_organization_id uuid,
  p_user_id uuid,
  p_draft jsonb
)
returns table(id uuid, inspection_number text)
language plpgsql
security invoker
set search_path = public, private
as $$
declare
  v_registration text;
  v_vehicle_id uuid;
  v_customer_id uuid;
  v_inspection_id uuid;
  v_inspection_number text;
  v_customer_name text;
  v_customer_phone text;
  v_customer_email text;
  v_vehicle jsonb;
  v_customer jsonb;
begin
  if auth.uid() is null or auth.uid() <> p_user_id then
    raise exception 'Not authorized to create this inspection' using errcode = '42501';
  end if;
  if not exists (
    select 1 from public.memberships m
    where m.user_id = auth.uid() and m.organization_id = p_organization_id
      and m.status = 'active' and m.role in ('SUPER_ADMIN','ORG_ADMIN','REVIEWER','INSPECTOR')
  ) then
    raise exception 'Active staff membership required' using errcode = '42501';
  end if;

  v_vehicle := coalesce(p_draft->'vehicle','{}'::jsonb);
  v_customer := coalesce(p_draft->'customer','{}'::jsonb);
  v_registration := upper(trim(coalesce(v_vehicle->>'registration','')));
  if length(v_registration) < 4 or length(v_registration) > 24 then
    raise exception 'Registration number is required' using errcode = '22023';
  end if;

  insert into public.vehicles (
    organization_id,registration_number,vin,chassis_number,make,model,variant,
    manufacturing_year,fuel_type,transmission,color,odometer,engine_number
  ) values (
    p_organization_id,
    v_registration,
    nullif(trim(coalesce(v_vehicle->>'vin','')),''),
    nullif(trim(coalesce(v_vehicle->>'vin','')),''),
    nullif(trim(coalesce(v_vehicle->>'make','')),''),
    nullif(trim(coalesce(v_vehicle->>'model','')),''),
    nullif(trim(coalesce(v_vehicle->>'variant','')),''),
    nullif(v_vehicle->>'year','')::integer,
    nullif(trim(coalesce(v_vehicle->>'fuel','')),''),
    nullif(trim(coalesce(v_vehicle->>'transmission','')),''),
    nullif(trim(coalesce(v_vehicle->>'color','')),''),
    nullif(regexp_replace(coalesce(v_vehicle->>'odometer',''),'[^0-9.]','','g'),'')::numeric,
    nullif(trim(coalesce(v_vehicle->>'engineNumber','')),'')
  )
  on conflict (organization_id,registration_number) do update set
    vin = coalesce(excluded.vin, public.vehicles.vin),
    chassis_number = coalesce(excluded.chassis_number, public.vehicles.chassis_number),
    make = coalesce(excluded.make, public.vehicles.make),
    model = coalesce(excluded.model, public.vehicles.model),
    variant = coalesce(excluded.variant, public.vehicles.variant),
    manufacturing_year = coalesce(excluded.manufacturing_year, public.vehicles.manufacturing_year),
    fuel_type = coalesce(excluded.fuel_type, public.vehicles.fuel_type),
    transmission = coalesce(excluded.transmission, public.vehicles.transmission),
    color = coalesce(excluded.color, public.vehicles.color),
    odometer = coalesce(excluded.odometer, public.vehicles.odometer),
    engine_number = coalesce(excluded.engine_number, public.vehicles.engine_number)
  returning vehicles.id into v_vehicle_id;

  v_customer_name := nullif(trim(coalesce(v_customer->>'name','')),'');
  v_customer_phone := nullif(trim(coalesce(v_customer->>'phone','')),'');
  v_customer_email := nullif(trim(coalesce(v_customer->>'email','')),'');

  if v_customer_name is not null then
    select c.id into v_customer_id
    from public.customers c
    where c.organization_id = p_organization_id
      and lower(c.name) = lower(v_customer_name)
      and c.phone is not distinct from v_customer_phone
    order by c.created_at asc
    limit 1;

    if v_customer_id is null then
      insert into public.customers (organization_id,name,phone,email,customer_type)
      values (
        p_organization_id,
        v_customer_name,
        v_customer_phone,
        v_customer_email,
        coalesce(nullif(trim(coalesce(v_customer->>'type','')),''),'Buyer')
      )
      returning customers.id into v_customer_id;
    end if;
  end if;

  v_inspection_number := 'INS-' || to_char(now(),'YYYY') || '-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));

  insert into public.inspections (
    organization_id,inspection_number,vehicle_id,customer_id,inspector_id,
    inspection_type,status,priority,started_at,draft_payload
  ) values (
    p_organization_id,
    v_inspection_number,
    v_vehicle_id,
    v_customer_id,
    p_user_id,
    coalesce(nullif(trim(coalesce(p_draft->>'inspectionType','')),''),'Used Car'),
    'IN_PROGRESS',
    'Normal',
    now(),
    p_draft
  )
  returning inspections.id into v_inspection_id;

  insert into public.inspection_drafts (
    organization_id,inspection_id,version,payload,updated_by,updated_at
  ) values (
    p_organization_id,v_inspection_id,1,p_draft,p_user_id,now()
  );

  insert into public.audit_logs (
    organization_id,actor_id,action,entity_type,entity_id,after_data
  ) values (
    p_organization_id,p_user_id,'created inspection','inspection',v_inspection_id,
    jsonb_build_object('inspection_number',v_inspection_number,'vehicle_id',v_vehicle_id)
  );

  return query select v_inspection_id, v_inspection_number;
end;
$$;

revoke all on function public.create_inspection(uuid,uuid,jsonb) from public, anon;
grant execute on function public.create_inspection(uuid,uuid,jsonb) to authenticated;
