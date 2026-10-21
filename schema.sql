-- Northstar Family Edition: initial Supabase schema scaffold.
-- Run only in a development project first. Review and test before production.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  module_preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 1 and 100),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.household_members (
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (household_id, user_id)
);

create table if not exists public.shared_records (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  record_type text not null check (record_type in (
    'recipe','meal_plan','shopping_list','shopping_item','pantry_item',
    'chore','calendar_event','noticeboard_post','checklist','emergency_contact'
  )),
  data jsonb not null default '{}'::jsonb,
  version bigint not null default 1,
  created_by uuid not null references auth.users(id),
  updated_by uuid not null references auth.users(id),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.private_records (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  record_type text not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Store only a hash of each random invitation token. Redemption should be
-- performed by a trusted server-side function/Edge Function, not by a broad
-- client INSERT policy. The token itself must never be stored here.
create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  token_hash text not null unique,
  created_by uuid not null references auth.users(id),
  expires_at timestamptz not null,
  max_uses integer not null default 1 check (max_uses between 1 and 50),
  uses integer not null default 0 check (uses >= 0),
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.households enable row level security;
alter table public.household_members enable row level security;
alter table public.shared_records enable row level security;
alter table public.private_records enable row level security;
alter table public.invitations enable row level security;

-- Small security-definer helper avoids recursive membership-policy evaluation.
create or replace function public.is_household_member(target_household uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.household_members hm
    where hm.household_id = target_household and hm.user_id = (select auth.uid())
  );
$$;
revoke all on function public.is_household_member(uuid) from public;
grant execute on function public.is_household_member(uuid) to authenticated;

create policy "profile owner can read" on public.profiles
for select to authenticated using (id = (select auth.uid()));
create policy "profile owner can insert" on public.profiles
for insert to authenticated with check (id = (select auth.uid()));
create policy "profile owner can update" on public.profiles
for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "members can view household" on public.households
for select to authenticated using (public.is_household_member(id));
create policy "authenticated users can create household" on public.households
for insert to authenticated with check (created_by = (select auth.uid()));

create policy "members can view membership list" on public.household_members
for select to authenticated using (public.is_household_member(household_id));
-- Intentionally no client-side INSERT/DELETE policy for membership. Use a
-- validated Edge Function for invite redemption and membership removal.

create policy "members can read shared records" on public.shared_records
for select to authenticated using (public.is_household_member(household_id));
create policy "members can create shared records" on public.shared_records
for insert to authenticated with check (
  public.is_household_member(household_id) and created_by = (select auth.uid())
  and updated_by = (select auth.uid())
);
create policy "members can update shared records" on public.shared_records
for update to authenticated using (public.is_household_member(household_id))
with check (public.is_household_member(household_id) and updated_by = (select auth.uid()));
create policy "members can delete shared records" on public.shared_records
for delete to authenticated using (public.is_household_member(household_id));

create policy "private record owner only read" on public.private_records
for select to authenticated using (owner_id = (select auth.uid()));
create policy "private record owner only insert" on public.private_records
for insert to authenticated with check (owner_id = (select auth.uid()));
create policy "private record owner only update" on public.private_records
for update to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy "private record owner only delete" on public.private_records
for delete to authenticated using (owner_id = (select auth.uid()));

-- No client policies on invitations by design. Create/revoke/redeem through
-- trusted server-side functions that validate the authenticated caller.
