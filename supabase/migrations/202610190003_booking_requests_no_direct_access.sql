-- Explicit deny policy documents that browser roles cannot access booking records.
drop policy if exists booking_requests_deny_direct_access on public.booking_requests;
create policy booking_requests_deny_direct_access
on public.booking_requests
for all
to anon, authenticated
using (false)
with check (false);
