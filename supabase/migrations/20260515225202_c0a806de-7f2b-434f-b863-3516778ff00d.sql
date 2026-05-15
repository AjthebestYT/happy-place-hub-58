
-- Roles
create type public.app_role as enum ('admin','user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique(user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id=_user_id and role=_role)
$$;

create policy "users read own roles" on public.user_roles for select to authenticated using (auth.uid()=user_id);
create policy "admins manage roles" on public.user_roles for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  avatar_url text,
  accent_color text not null default '#a855f7',
  wallpaper text not null default 'spectral-grid',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "profiles select own" on public.profiles for select to authenticated using (auth.uid()=id);
create policy "profiles insert own" on public.profiles for insert to authenticated with check (auth.uid()=id);
create policy "profiles update own" on public.profiles for update to authenticated using (auth.uid()=id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', split_part(new.email,'@',1)));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_touch before update on public.profiles
for each row execute function public.touch_updated_at();

-- AI messages
create table public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  created_at timestamptz not null default now()
);
alter table public.ai_messages enable row level security;
create index ai_messages_user_idx on public.ai_messages(user_id, created_at);

create policy "ai_messages select own" on public.ai_messages for select to authenticated using (auth.uid()=user_id);
create policy "ai_messages insert own" on public.ai_messages for insert to authenticated with check (auth.uid()=user_id);
create policy "ai_messages delete own" on public.ai_messages for delete to authenticated using (auth.uid()=user_id);
