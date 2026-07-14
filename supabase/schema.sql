-- Supabase SQL Editor'da bir kez çalıştırın.
create extension if not exists pgcrypto;

create table if not exists public.site_content (
  id text primary key check (id = 'main'),
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'Yeni' check (status in ('Yeni', 'Görüldü', 'İletişime Geçildi', 'Görüşüldü', 'Tamamlandı')),
  service text not null check (char_length(service) between 1 and 120),
  date text not null default '',
  time text not null default '',
  format text not null default '',
  name text not null check (char_length(name) between 2 and 100),
  phone text not null check (char_length(phone) between 7 and 30),
  email text not null check (char_length(email) <= 160),
  note text not null default '' check (char_length(note) <= 1000)
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'Yeni' check (status in ('Yeni', 'Görüldü', 'Yanıtlandı', 'Görüşüldü')),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) <= 160),
  phone text not null default '' check (char_length(phone) <= 30),
  message text not null check (char_length(message) between 10 and 3000)
);

create table if not exists public.blog_metrics (
  slug text primary key check (char_length(slug) between 1 and 160),
  views bigint not null default 0 check (views >= 0),
  likes bigint not null default 0 check (likes >= 0)
);

create index if not exists appointments_created_at_idx on public.appointments (created_at desc);
create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);

alter table public.site_content enable row level security;
alter table public.appointments enable row level security;
alter table public.contact_messages enable row level security;
alter table public.blog_metrics enable row level security;

revoke all on table public.site_content from anon, authenticated;
revoke all on table public.appointments from anon, authenticated;
revoke all on table public.contact_messages from anon, authenticated;
revoke all on table public.blog_metrics from anon, authenticated;
grant all on table public.site_content to service_role;
grant all on table public.appointments to service_role;
grant all on table public.contact_messages to service_role;
grant all on table public.blog_metrics to service_role;

create or replace function public.increment_blog_metric(target_slug text, metric_name text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare result bigint;
begin
  if char_length(target_slug) < 1 or char_length(target_slug) > 160 then
    raise exception 'invalid slug';
  end if;
  insert into public.blog_metrics (slug) values (target_slug) on conflict (slug) do nothing;
  if metric_name = 'views' then
    update public.blog_metrics set views = views + 1 where slug = target_slug returning views into result;
  elsif metric_name = 'likes' then
    update public.blog_metrics set likes = likes + 1 where slug = target_slug returning likes into result;
  else
    raise exception 'invalid metric';
  end if;
  return result;
end;
$$;

revoke all on function public.increment_blog_metric(text, text) from public, anon, authenticated;
grant execute on function public.increment_blog_metric(text, text) to service_role;
