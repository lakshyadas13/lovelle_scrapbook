-- ============================================================================
-- Lovelle Scrapbook: Complete Supabase Schema (Multi-User Platform Edition)
-- ============================================================================
-- Run this script directly in the Supabase SQL Editor.
-- It safely cleans up old couple-specific tables (from the previous single-couple
-- version) and provisions the new multi-user platform architecture with full RLS.
-- ============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- ============================================================================
-- 2. SAFE CLEANUP OF PREVIOUS SINGLE-COUPLE TABLES & FUNCTIONS
-- ============================================================================
-- Drops the old couple-specific triggers & functions
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user() cascade;
drop function if exists public.handle_new_scrapbook() cascade;
drop function if exists public.link_couples(text, text) cascade;
drop function if exists public.is_scrapbook_member(uuid) cascade;
drop function if exists public.is_scrapbook_owner(uuid) cascade;
drop function if exists public.join_scrapbook_by_code(text) cascade;

-- Drops old/previous tables safely (in reverse dependency order)
drop table if exists public.deck_cards cascade;
drop table if exists public.card_decks cascade;
drop table if exists public.vault_letters cascade;
drop table if exists public.love_letters cascade;
drop table if exists public.things_to_work_on cascade;
drop table if exists public.oopsies cascade;
drop table if exists public.daily_highlights cascade;
drop table if exists public.good_things cascade;
drop table if exists public.plans_checklist cascade;
drop table if exists public.plans cascade;
drop table if exists public.memories cascade;
drop table if exists public.interactive_counters cascade;
drop table if exists public.love_taps cascade;
drop table if exists public.moods cascade;
drop table if exists public.scrapbook_invites cascade;
drop table if exists public.scrapbook_members cascade;
drop table if exists public.scrapbooks cascade;
drop table if exists public.couple_settings cascade;
drop table if exists public.couples cascade;
drop table if exists public.profiles cascade;

-- ============================================================================
-- 3. CORE USER & PLATFORM TABLES
-- ============================================================================

-- 3.1 PROFILES TABLE
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    display_name text not null,
    avatar_url text,
    profile_title text default 'Little Dreamer',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- 3.2 SCRAPBOOKS TABLE (Multiple per user)
create table public.scrapbooks (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid references public.profiles(id) on delete cascade not null,
    title text not null,
    description text,
    cover_image_url text,
    theme text not null default 'pink_doodle' check (theme in ('pink_doodle', 'lavender_dreams', 'vintage_journal', 'cozy_memories', 'minimal_pastel')),
    privacy text not null default 'private' check (privacy in ('private', 'collaborative')),
    start_date date default current_date,
    show_counter boolean default true,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- 3.3 SCRAPBOOK MEMBERS TABLE (Collaboration & Permissions)
create table public.scrapbook_members (
    id uuid primary key default gen_random_uuid(),
    scrapbook_id uuid references public.scrapbooks(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    role text not null default 'collaborator' check (role in ('owner', 'collaborator', 'viewer')),
    member_nickname text,
    joined_at timestamp with time zone default now(),
    unique (scrapbook_id, user_id)
);

-- 3.4 SCRAPBOOK INVITES TABLE
create table public.scrapbook_invites (
    id uuid primary key default gen_random_uuid(),
    scrapbook_id uuid references public.scrapbooks(id) on delete cascade not null,
    invite_code text unique not null,
    created_by uuid references public.profiles(id) on delete cascade not null,
    created_at timestamp with time zone default now()
);

-- ============================================================================
-- 4. SCRAPBOOK CONTENT TABLES
-- ============================================================================

-- 4.1 MOODS (Scrapbook scoped)
create table public.moods (
    id uuid primary key default gen_random_uuid(),
    scrapbook_id uuid references public.scrapbooks(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    mood_type text not null check (mood_type in ('happy', 'dreaming', 'sleepy', 'inspired', 'cozy', 'in_love', 'miss_you', 'angry')),
    updated_at timestamp with time zone default now(),
    unique (scrapbook_id, user_id)
);

-- 4.2 INTERACTIVE COUNTERS / CHEER TAPS
create table public.interactive_counters (
    id uuid primary key default gen_random_uuid(),
    scrapbook_id uuid references public.scrapbooks(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    count integer not null default 0,
    updated_at timestamp with time zone default now(),
    unique (scrapbook_id, user_id)
);

-- 4.3 DAILY HIGHLIGHTS (formerly good_things)
create table public.daily_highlights (
    id uuid primary key default gen_random_uuid(),
    scrapbook_id uuid references public.scrapbooks(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    title text not null,
    description text,
    time text,
    tags text[] default '{}'::text[],
    image_url text,
    created_at timestamp with time zone default now()
);

-- 4.4 THINGS TO WORK ON (formerly oopsies)
create table public.things_to_work_on (
    id uuid primary key default gen_random_uuid(),
    scrapbook_id uuid references public.scrapbooks(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    title text not null,
    description text,
    tags text[] default '{}'::text[],
    image_url text,
    status text default 'pending' check (status in ('pending', 'promised')),
    created_at timestamp with time zone default now()
);

-- 4.5 PLANS (Plans & Activities)
create table public.plans (
    id uuid primary key default gen_random_uuid(),
    scrapbook_id uuid references public.scrapbooks(id) on delete cascade not null,
    title text not null,
    description text,
    time text,
    image_url text,
    tags text[] default '{}'::text[],
    date date not null default current_date,
    created_at timestamp with time zone default now()
);

-- 4.6 PLANS CHECKLIST
create table public.plans_checklist (
    id uuid primary key default gen_random_uuid(),
    scrapbook_id uuid references public.scrapbooks(id) on delete cascade not null,
    task text not null,
    is_completed boolean default false not null,
    created_at timestamp with time zone default now()
);

-- 4.7 VAULT LETTERS (Letter Vault / Time Capsules)
create table public.vault_letters (
    id uuid primary key default gen_random_uuid(),
    scrapbook_id uuid references public.scrapbooks(id) on delete cascade not null,
    sender_id uuid references public.profiles(id) on delete cascade not null,
    category text not null check (category in ('sad', 'miss_me', 'motivation', 'celebration', 'general')),
    title text not null,
    content text not null,
    created_at timestamp with time zone default now()
);

-- 4.8 MEMORIES (Polaroid Timeline)
create table public.memories (
    id uuid primary key default gen_random_uuid(),
    scrapbook_id uuid references public.scrapbooks(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    title text not null,
    description text,
    image_url text not null,
    memory_date date not null default current_date,
    created_at timestamp with time zone default now()
);

-- 4.9 CARD DECKS (Customizable Card Decks)
create table public.card_decks (
    id uuid primary key default gen_random_uuid(),
    scrapbook_id uuid references public.scrapbooks(id) on delete cascade not null,
    title text not null,
    description text,
    icon text default 'auto_awesome',
    created_at timestamp with time zone default now()
);

-- 4.10 DECK CARDS
create table public.deck_cards (
    id uuid primary key default gen_random_uuid(),
    deck_id uuid references public.card_decks(id) on delete cascade not null,
    card_number integer not null,
    content text not null,
    is_revealed boolean default false,
    created_at timestamp with time zone default now()
);

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS) HELPER FUNCTIONS
-- ============================================================================

-- Function: Checks if authenticated user is a member of the scrapbook
create or replace function public.is_scrapbook_member(p_scrapbook_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.scrapbook_members
    where scrapbook_id = p_scrapbook_id
      and user_id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- Function: Checks if authenticated user is the owner of the scrapbook
create or replace function public.is_scrapbook_owner(p_scrapbook_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.scrapbooks
    where id = p_scrapbook_id
      and owner_id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- ============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- 6.1 Profiles
alter table public.profiles enable row level security;
create policy "Authenticated users can read profiles" on public.profiles for select using (auth.role() = 'authenticated');
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);

-- 6.2 Scrapbooks
alter table public.scrapbooks enable row level security;
create policy "Members can view scrapbooks" on public.scrapbooks for select using (public.is_scrapbook_member(id) or owner_id = auth.uid());
create policy "Authenticated users can create scrapbooks" on public.scrapbooks for insert with check (auth.uid() = owner_id);
create policy "Owners can update their scrapbook" on public.scrapbooks for update using (owner_id = auth.uid());
create policy "Owners can delete their scrapbook" on public.scrapbooks for delete using (owner_id = auth.uid());

-- 6.3 Scrapbook Members
alter table public.scrapbook_members enable row level security;
create policy "Members can view membership" on public.scrapbook_members for select using (public.is_scrapbook_member(scrapbook_id) or user_id = auth.uid());
create policy "Owners or self can insert members" on public.scrapbook_members for insert with check (public.is_scrapbook_owner(scrapbook_id) or user_id = auth.uid());
create policy "Members can update their own nickname" on public.scrapbook_members for update using (user_id = auth.uid());
create policy "Owners or self can leave/remove members" on public.scrapbook_members for delete using (public.is_scrapbook_owner(scrapbook_id) or user_id = auth.uid());

-- 6.4 Scrapbook Invites
alter table public.scrapbook_invites enable row level security;
create policy "Authenticated can read invites" on public.scrapbook_invites for select using (auth.role() = 'authenticated');
create policy "Members can create invites" on public.scrapbook_invites for insert with check (public.is_scrapbook_member(scrapbook_id));
create policy "Owners can delete invites" on public.scrapbook_invites for delete using (public.is_scrapbook_owner(scrapbook_id));

-- 6.5 Content Tables RLS (All isolated strictly by scrapbook membership)
alter table public.moods enable row level security;
create policy "Members manage moods" on public.moods for all using (public.is_scrapbook_member(scrapbook_id)) with check (public.is_scrapbook_member(scrapbook_id));

alter table public.interactive_counters enable row level security;
create policy "Members manage counters" on public.interactive_counters for all using (public.is_scrapbook_member(scrapbook_id)) with check (public.is_scrapbook_member(scrapbook_id));

alter table public.daily_highlights enable row level security;
create policy "Members manage daily highlights" on public.daily_highlights for all using (public.is_scrapbook_member(scrapbook_id)) with check (public.is_scrapbook_member(scrapbook_id));

alter table public.things_to_work_on enable row level security;
create policy "Members manage things to work on" on public.things_to_work_on for all using (public.is_scrapbook_member(scrapbook_id)) with check (public.is_scrapbook_member(scrapbook_id));

alter table public.plans enable row level security;
create policy "Members manage plans" on public.plans for all using (public.is_scrapbook_member(scrapbook_id)) with check (public.is_scrapbook_member(scrapbook_id));

alter table public.plans_checklist enable row level security;
create policy "Members manage plans checklist" on public.plans_checklist for all using (public.is_scrapbook_member(scrapbook_id)) with check (public.is_scrapbook_member(scrapbook_id));

alter table public.vault_letters enable row level security;
create policy "Members manage vault letters" on public.vault_letters for all using (public.is_scrapbook_member(scrapbook_id)) with check (public.is_scrapbook_member(scrapbook_id));

alter table public.memories enable row level security;
create policy "Members manage memories" on public.memories for all using (public.is_scrapbook_member(scrapbook_id)) with check (public.is_scrapbook_member(scrapbook_id));

alter table public.card_decks enable row level security;
create policy "Members manage card decks" on public.card_decks for all using (public.is_scrapbook_member(scrapbook_id)) with check (public.is_scrapbook_member(scrapbook_id));

alter table public.deck_cards enable row level security;
create policy "Members manage deck cards" on public.deck_cards for all using (
    exists (select 1 from public.card_decks cd where cd.id = deck_id and public.is_scrapbook_member(cd.scrapbook_id))
) with check (
    exists (select 1 from public.card_decks cd where cd.id = deck_id and public.is_scrapbook_member(cd.scrapbook_id))
);

-- ============================================================================
-- 7. TRIGGERS & RPC PROCEDURES
-- ============================================================================

-- 7.1 Auto-Create Profile When a User Signs Up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url, profile_title)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', 'Doodle Friend'),
    coalesce(new.raw_user_meta_data->>'avatar_url', null),
    coalesce(new.raw_user_meta_data->>'profile_title', 'Little Dreamer')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 7.2 Auto-Add Owner to scrapbook_members Table When Scrapbook Is Created
create or replace function public.handle_new_scrapbook()
returns trigger as $$
begin
  insert into public.scrapbook_members (scrapbook_id, user_id, role, member_nickname)
  values (
    new.id, 
    new.owner_id, 
    'owner', 
    (select display_name from public.profiles where id = new.owner_id)
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_scrapbook_created on public.scrapbooks;
create trigger on_scrapbook_created
  after insert on public.scrapbooks
  for each row execute procedure public.handle_new_scrapbook();

-- 7.3 RPC: Join Scrapbook via 6-Character Invite Code
create or replace function public.join_scrapbook_by_code(p_invite_code text)
returns json as $$
declare
  v_user_id uuid;
  v_invite record;
  v_already_member boolean;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select * into v_invite from public.scrapbook_invites
  where upper(invite_code) = upper(trim(p_invite_code));

  if not found then
    raise exception 'Invalid invite code';
  end if;

  select exists(
    select 1 from public.scrapbook_members
    where scrapbook_id = v_invite.scrapbook_id and user_id = v_user_id
  ) into v_already_member;

  if v_already_member then
    return json_build_object('success', true, 'scrapbook_id', v_invite.scrapbook_id, 'message', 'Already a member');
  end if;

  insert into public.scrapbook_members (scrapbook_id, user_id, role, member_nickname)
  values (
    v_invite.scrapbook_id,
    v_user_id,
    'collaborator',
    (select display_name from public.profiles where id = v_user_id)
  );

  return json_build_object('success', true, 'scrapbook_id', v_invite.scrapbook_id);
end;
$$ language plpgsql security definer;

-- ============================================================================
-- 8. REALTIME REPLICATION CONFIGURATION
-- ============================================================================
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table 
    public.scrapbooks,
    public.scrapbook_members,
    public.moods, 
    public.interactive_counters, 
    public.daily_highlights, 
    public.things_to_work_on, 
    public.plans, 
    public.plans_checklist,
    public.vault_letters,
    public.memories,
    public.card_decks,
    public.deck_cards;
commit;
