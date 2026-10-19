-- Allow a public report bearer token to authorize read-only access to its own evidence photos.
-- Uploads remain private by default; anonymous reads are permitted only for an active,
-- unexpired report whose SHA-256 token matches the third path segment.
create or replace function private.can_read_report_evidence(p_name text)
returns boolean
language plpgsql
stable
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  v_org text := split_part(p_name, '/', 1);
  v_inspection text := split_part(p_name, '/', 2);
  v_token text := split_part(p_name, '/', 3);
begin
  if v_org !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
     or v_inspection !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
     or v_token !~ '^[a-f0-9]{64}$' then
    return false;
  end if;

  return exists (
    select 1
    from public.reports r
    where r.organization_id = v_org::uuid
      and r.inspection_id = v_inspection::uuid
      and r.verification_token_hash = encode(extensions.digest(v_token, 'sha256'), 'hex')
      and r.verification_revoked_at is null
      and (r.verification_expires_at is null or r.verification_expires_at > now())
  );
end;
$$;

revoke all on function private.can_read_report_evidence(text) from public;
grant usage on schema private to anon, authenticated;
grant execute on function private.can_read_report_evidence(text) to anon, authenticated;

drop policy if exists inspection_media_public_report_token_select on storage.objects;
create policy inspection_media_public_report_token_select
on storage.objects for select to anon, authenticated
using (
  bucket_id = 'inspection-media'
  and private.can_read_report_evidence(name)
);

-- Keep server-side and Storage upload limits aligned with the UI's 30 MB guard.
update storage.buckets
set file_size_limit = 31457280
where id = 'inspection-media';
