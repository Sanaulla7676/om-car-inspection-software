-- Secure OMCAR admin portal. This migration adds isolated admin-only tables and signed RPC entry points.
create schema if not exists private;
create extension if not exists pgcrypto with schema extensions;

create table if not exists private.admin_portal_config (
  singleton boolean primary key default true check (singleton),
  rpc_secret text not null,
  whatsapp_phone text not null default '918880339999',
  updated_at timestamptz not null default now()
);
alter table private.admin_portal_config enable row level security;
revoke all on table private.admin_portal_config from public, anon, authenticated;

create table if not exists private.admin_portal_accounts (
  id uuid primary key default extensions.gen_random_uuid(),
  login_id text not null,
  login_id_normalized text not null unique,
  password_salt text not null,
  password_hash text not null,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table private.admin_portal_accounts enable row level security;
revoke all on table private.admin_portal_accounts from public, anon, authenticated;

create table if not exists private.admin_portal_sessions (
  token_hash text primary key,
  account_id uuid not null references private.admin_portal_accounts(id) on delete cascade,
  expires_at timestamptz not null,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists admin_portal_sessions_account_idx on private.admin_portal_sessions(account_id);
create index if not exists admin_portal_sessions_expiry_idx on private.admin_portal_sessions(expires_at);
alter table private.admin_portal_sessions enable row level security;
revoke all on table private.admin_portal_sessions from public, anon, authenticated;

create table if not exists private.admin_portal_login_attempts (
  id uuid primary key default extensions.gen_random_uuid(),
  login_id_normalized text not null,
  client_hash text not null,
  status text not null default 'pending' check (status in ('pending','failed','success')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists admin_portal_attempts_login_idx on private.admin_portal_login_attempts(login_id_normalized, created_at desc);
create index if not exists admin_portal_attempts_client_idx on private.admin_portal_login_attempts(client_hash, created_at desc);
alter table private.admin_portal_login_attempts enable row level security;
revoke all on table private.admin_portal_login_attempts from public, anon, authenticated;

create table if not exists private.admin_portal_otp_challenges (
  session_hash text primary key references private.admin_portal_sessions(token_hash) on delete cascade,
  otp_hash text not null,
  attempts integer not null default 0 check (attempts between 0 and 5),
  expires_at timestamptz not null,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);
alter table private.admin_portal_otp_challenges enable row level security;
revoke all on table private.admin_portal_otp_challenges from public, anon, authenticated;

create or replace function private.verify_admin_rpc(p_action text, p_payload_text text, p_signature text)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, private, extensions
as $$
declare
  v_secret text;
  v_expected text;
begin
  select rpc_secret into v_secret from private.admin_portal_config where singleton = true;
  if v_secret is null or p_action is null or p_payload_text is null or p_signature is null then return false; end if;
  v_expected := encode(extensions.hmac(convert_to(p_action || '.' || p_payload_text, 'UTF8'), convert_to(v_secret, 'UTF8'), 'sha256'), 'hex');
  return length(p_signature) = 64 and v_expected = lower(p_signature);
exception when others then return false;
end;
$$;
revoke all on function private.verify_admin_rpc(text,text,text) from public, anon, authenticated;

create or replace function public.omcar_admin_get_login_credential(p_payload_text text, p_signature text)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, private, extensions
as $$
declare
  v jsonb := p_payload_text::jsonb;
  v_login text := lower(regexp_replace(trim(coalesce(v->>'login_id_normalized','')), '\s+', ' ', 'g'));
  v_client text := coalesce(v->>'client_hash','unknown');
  v_account private.admin_portal_accounts%rowtype;
  v_attempt uuid;
  v_recent integer;
begin
  if not private.verify_admin_rpc('login-credential', p_payload_text, p_signature) then raise exception 'Not authorised' using errcode = '42501'; end if;
  if length(v_login) < 3 or length(v_login) > 80 or length(v_client) < 16 or length(v_client) > 128 then raise exception 'Invalid request' using errcode = '22023'; end if;
  delete from private.admin_portal_login_attempts where created_at < now() - interval '2 days';
  delete from private.admin_portal_sessions where expires_at < now();
  select count(*) into v_recent from private.admin_portal_login_attempts
    where created_at > now() - interval '15 minutes' and status = 'failed'
      and (login_id_normalized = v_login or client_hash = v_client);
  if v_recent >= 8 then return jsonb_build_object('ok', false, 'rate_limited', true); end if;
  insert into private.admin_portal_login_attempts(login_id_normalized, client_hash) values (v_login, v_client) returning id into v_attempt;
  select * into v_account from private.admin_portal_accounts where login_id_normalized = v_login and enabled = true limit 1;
  if not found then
    return jsonb_build_object('ok', true, 'found', false, 'attempt_id', v_attempt,
      'salt', encode(extensions.gen_random_bytes(16),'hex'), 'password_hash', encode(extensions.gen_random_bytes(64),'hex'));
  end if;
  return jsonb_build_object('ok', true, 'found', true, 'attempt_id', v_attempt, 'salt', v_account.password_salt, 'password_hash', v_account.password_hash);
end;
$$;

create or replace function public.omcar_admin_fail_login(p_payload_text text, p_signature text)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare v jsonb := p_payload_text::jsonb;
begin
  if not private.verify_admin_rpc('login-fail', p_payload_text, p_signature) then raise exception 'Not authorised' using errcode = '42501'; end if;
  update private.admin_portal_login_attempts set status='failed', updated_at=now()
    where id = (v->>'attempt_id')::uuid and status='pending' and created_at > now() - interval '5 minutes';
  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.omcar_admin_create_session(p_payload_text text, p_signature text)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v jsonb := p_payload_text::jsonb;
  v_attempt private.admin_portal_login_attempts%rowtype;
  v_account private.admin_portal_accounts%rowtype;
  v_login text := lower(regexp_replace(trim(coalesce(v->>'login_id_normalized','')), '\s+', ' ', 'g'));
  v_hash text := coalesce(v->>'session_hash','');
  v_expiry timestamptz := now() + interval '12 hours';
begin
  if not private.verify_admin_rpc('login-success', p_payload_text, p_signature) then raise exception 'Not authorised' using errcode = '42501'; end if;
  if length(v_hash) <> 64 or v_hash !~ '^[0-9a-f]{64}$' then raise exception 'Invalid session token' using errcode = '22023'; end if;
  select * into v_attempt from private.admin_portal_login_attempts where id=(v->>'attempt_id')::uuid and status='pending' and created_at > now() - interval '5 minutes' for update;
  if not found then return jsonb_build_object('ok', false); end if;
  select * into v_account from private.admin_portal_accounts where login_id_normalized=v_login and enabled=true for update;
  if not found then
    update private.admin_portal_login_attempts set status='failed', updated_at=now() where id=v_attempt.id;
    return jsonb_build_object('ok', false);
  end if;
  update private.admin_portal_login_attempts set status='success', updated_at=now() where id=v_attempt.id;
  insert into private.admin_portal_sessions(token_hash, account_id, expires_at) values (v_hash, v_account.id, v_expiry);
  return jsonb_build_object('ok', true, 'login_id', v_account.login_id, 'expires_at', v_expiry);
end;
$$;

create or replace function public.omcar_admin_get_session(p_payload_text text, p_signature text)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare v jsonb := p_payload_text::jsonb; v_session private.admin_portal_sessions%rowtype; v_account private.admin_portal_accounts%rowtype;
begin
  if not private.verify_admin_rpc('session', p_payload_text, p_signature) then raise exception 'Not authorised' using errcode = '42501'; end if;
  select s.* into v_session from private.admin_portal_sessions s join private.admin_portal_accounts a on a.id=s.account_id and a.enabled=true
    where s.token_hash=coalesce(v->>'session_hash','') and s.expires_at>now() limit 1;
  if not found then return jsonb_build_object('ok',false); end if;
  update private.admin_portal_sessions set last_seen_at=now() where token_hash=v_session.token_hash;
  select * into v_account from private.admin_portal_accounts where id=v_session.account_id;
  return jsonb_build_object('ok',true,'login_id',v_account.login_id,'expires_at',v_session.expires_at);
end;
$$;

create or replace function public.omcar_admin_end_session(p_payload_text text, p_signature text)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare v jsonb := p_payload_text::jsonb;
begin
  if not private.verify_admin_rpc('logout', p_payload_text, p_signature) then raise exception 'Not authorised' using errcode = '42501'; end if;
  delete from private.admin_portal_sessions where token_hash=coalesce(v->>'session_hash','');
  return jsonb_build_object('ok',true);
end;
$$;

create or replace function public.omcar_admin_get_config(p_payload_text text, p_signature text)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare v jsonb := p_payload_text::jsonb; v_phone text;
begin
  if not private.verify_admin_rpc('get-config', p_payload_text, p_signature) then raise exception 'Not authorised' using errcode = '42501'; end if;
  select whatsapp_phone into v_phone from private.admin_portal_config where singleton=true;
  return jsonb_build_object('ok',true,'whatsapp_phone',v_phone);
end;
$$;

create or replace function public.omcar_admin_overview(p_payload_text text, p_signature text)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v jsonb := p_payload_text::jsonb; v_hash text := coalesce(v->>'session_hash','');
  v_inspections bigint; v_completed bigint; v_review bigint; v_active bigint;
  v_vehicles bigint; v_customers bigint; v_reports bigint;
begin
  if not private.verify_admin_rpc('overview', p_payload_text, p_signature) then raise exception 'Not authorised' using errcode = '42501'; end if;
  if not exists(select 1 from private.admin_portal_sessions s join private.admin_portal_accounts a on a.id=s.account_id and a.enabled=true where s.token_hash=v_hash and s.expires_at>now()) then
    return jsonb_build_object('ok',false);
  end if;
  select count(*),count(*) filter(where status='COMPLETED'),
    count(*) filter(where status in ('IN_REVIEW','CHANGES_REQUESTED')),
    count(*) filter(where status in ('DRAFT','IN_PROGRESS'))
  into v_inspections,v_completed,v_review,v_active from public.inspections;
  select count(*) into v_vehicles from public.vehicles;
  select count(*) into v_customers from public.customers;
  select count(*) into v_reports from public.reports;
  return jsonb_build_object('ok',true,'inspections',v_inspections,'completed',v_completed,'awaiting_review',v_review,'in_progress',v_active,'vehicles',v_vehicles,'customers',v_customers,'reports',v_reports);
end;
$$;

create or replace function public.omcar_admin_store_otp(p_payload_text text, p_signature text)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare v jsonb := p_payload_text::jsonb; v_hash text := coalesce(v->>'session_hash',''); v_otp_hash text := coalesce(v->>'otp_hash','');
begin
  if not private.verify_admin_rpc('otp-store', p_payload_text, p_signature) then raise exception 'Not authorised' using errcode = '42501'; end if;
  if length(v_otp_hash) <> 64 or v_otp_hash !~ '^[0-9a-f]{64}$' then raise exception 'Invalid OTP challenge' using errcode = '22023'; end if;
  if not exists(select 1 from private.admin_portal_sessions s join private.admin_portal_accounts a on a.id=s.account_id and a.enabled=true where s.token_hash=v_hash and s.expires_at>now()) then return jsonb_build_object('ok',false); end if;
  if exists(select 1 from private.admin_portal_otp_challenges c where c.session_hash=v_hash and c.created_at>now()-interval '60 seconds' and c.expires_at>now() and c.verified_at is null) then
    return jsonb_build_object('ok',false,'rate_limited',true);
  end if;
  insert into private.admin_portal_otp_challenges(session_hash,otp_hash,attempts,expires_at,verified_at,created_at)
    values(v_hash,v_otp_hash,0,now()+interval '10 minutes',null,now())
    on conflict(session_hash) do update set otp_hash=excluded.otp_hash,attempts=0,expires_at=excluded.expires_at,verified_at=null,created_at=now();
  return jsonb_build_object('ok',true,'expires_at',now()+interval '10 minutes');
end;
$$;

create or replace function public.omcar_admin_clear_otp(p_payload_text text, p_signature text)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare v jsonb := p_payload_text::jsonb;
begin
  if not private.verify_admin_rpc('otp-clear', p_payload_text, p_signature) then raise exception 'Not authorised' using errcode = '42501'; end if;
  delete from private.admin_portal_otp_challenges where session_hash=coalesce(v->>'session_hash','');
  return jsonb_build_object('ok',true);
end;
$$;

create or replace function public.omcar_admin_verify_otp(p_payload_text text, p_signature text)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v jsonb := p_payload_text::jsonb; v_hash text := coalesce(v->>'session_hash',''); v_otp_hash text := coalesce(v->>'otp_hash','');
  v_challenge private.admin_portal_otp_challenges%rowtype;
begin
  if not private.verify_admin_rpc('otp-verify', p_payload_text, p_signature) then raise exception 'Not authorised' using errcode = '42501'; end if;
  select * into v_challenge from private.admin_portal_otp_challenges where session_hash=v_hash for update;
  if not found or v_challenge.expires_at<=now() or v_challenge.verified_at is not null then return jsonb_build_object('ok',false,'error','The code has expired. Request a new code.'); end if;
  if v_challenge.attempts>=5 then delete from private.admin_portal_otp_challenges where session_hash=v_hash; return jsonb_build_object('ok',false,'error','Too many attempts. Request a new code.'); end if;
  if v_challenge.otp_hash<>v_otp_hash then update private.admin_portal_otp_challenges set attempts=attempts+1 where session_hash=v_hash; return jsonb_build_object('ok',false,'error','The verification code is incorrect.'); end if;
  update private.admin_portal_otp_challenges set verified_at=now(),otp_hash='' where session_hash=v_hash;
  return jsonb_build_object('ok',true,'verified_until',now()+interval '5 minutes');
end;
$$;

create or replace function public.omcar_admin_update_credentials(p_payload_text text, p_signature text)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v jsonb := p_payload_text::jsonb; v_session_hash text := coalesce(v->>'session_hash','');
  v_login_id text := trim(coalesce(v->>'login_id',''));
  v_normalized text := lower(regexp_replace(trim(coalesce(v->>'login_id_normalized','')), '\s+', ' ', 'g'));
  v_salt text := coalesce(v->>'password_salt',''); v_password_hash text := coalesce(v->>'password_hash','');
  v_account_id uuid;
begin
  if not private.verify_admin_rpc('credentials-update', p_payload_text, p_signature) then raise exception 'Not authorised' using errcode = '42501'; end if;
  select a.id into v_account_id from private.admin_portal_sessions s join private.admin_portal_accounts a on a.id=s.account_id and a.enabled=true
    where s.token_hash=v_session_hash and s.expires_at>now() for update of a;
  if not found then return jsonb_build_object('ok',false,'error','Your session expired. Sign in again.'); end if;
  if length(v_login_id)<3 or length(v_login_id)>80 or length(v_salt)<>32 or length(v_password_hash)<>128
    or v_salt !~ '^[0-9a-f]{32}$' or v_password_hash !~ '^[0-9a-f]{128}$' then
    return jsonb_build_object('ok',false,'error','Please provide a valid login ID and password.');
  end if;
  if not exists(select 1 from private.admin_portal_otp_challenges c where c.session_hash=v_session_hash and c.verified_at>now()-interval '5 minutes') then
    return jsonb_build_object('ok',false,'error','Verify the WhatsApp code before changing credentials.');
  end if;
  if exists(select 1 from private.admin_portal_accounts a where a.login_id_normalized=v_normalized and a.id<>v_account_id) then
    return jsonb_build_object('ok',false,'error','That login ID is already in use.');
  end if;
  begin
    update private.admin_portal_accounts set login_id=v_login_id,login_id_normalized=v_normalized,password_salt=v_salt,password_hash=v_password_hash,updated_at=now() where id=v_account_id;
  exception when unique_violation then return jsonb_build_object('ok',false,'error','That login ID is already in use.');
  end;
  delete from private.admin_portal_otp_challenges where session_hash=v_session_hash;
  delete from private.admin_portal_sessions where account_id=v_account_id and token_hash<>v_session_hash;
  return jsonb_build_object('ok',true,'login_id',v_login_id);
end;
$$;

revoke all on function public.omcar_admin_get_login_credential(text,text) from public;
revoke all on function public.omcar_admin_fail_login(text,text) from public;
revoke all on function public.omcar_admin_create_session(text,text) from public;
revoke all on function public.omcar_admin_get_session(text,text) from public;
revoke all on function public.omcar_admin_end_session(text,text) from public;
revoke all on function public.omcar_admin_get_config(text,text) from public;
revoke all on function public.omcar_admin_overview(text,text) from public;
revoke all on function public.omcar_admin_store_otp(text,text) from public;
revoke all on function public.omcar_admin_clear_otp(text,text) from public;
revoke all on function public.omcar_admin_verify_otp(text,text) from public;
revoke all on function public.omcar_admin_update_credentials(text,text) from public;

grant execute on function public.omcar_admin_get_login_credential(text,text) to anon, authenticated;
grant execute on function public.omcar_admin_fail_login(text,text) to anon, authenticated;
grant execute on function public.omcar_admin_create_session(text,text) to anon, authenticated;
grant execute on function public.omcar_admin_get_session(text,text) to anon, authenticated;
grant execute on function public.omcar_admin_end_session(text,text) to anon, authenticated;
grant execute on function public.omcar_admin_get_config(text,text) to anon, authenticated;
grant execute on function public.omcar_admin_overview(text,text) to anon, authenticated;
grant execute on function public.omcar_admin_store_otp(text,text) to anon, authenticated;
grant execute on function public.omcar_admin_clear_otp(text,text) to anon, authenticated;
grant execute on function public.omcar_admin_verify_otp(text,text) to anon, authenticated;
grant execute on function public.omcar_admin_update_credentials(text,text) to anon, authenticated;
