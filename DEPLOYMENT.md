# Deployment and Supabase Setup Guide

This guide outlines the configuration of Supabase database schemas and automated GitHub Actions deployment for GitHub Pages.

---

## 1. Supabase Database Schema Setup (Migration 002)

To enable real-time multi-user synchronization across all client devices, execute the following SQL script in the Supabase **SQL Editor**:

```sql
-- 1. Tabela konfiguracji wydarzenia (jeden wiersz, id = 1)
create table if not exists public.event_config (
  id int primary key default 1,
  title text not null,
  location_name text not null,
  lat double precision not null,
  lng double precision not null,
  event_date timestamptz not null,
  rsvp_deadline timestamptz not null,
  host_phone_display text not null,
  host_phone_raw text not null,
  arrival_instructions text not null,
  arrival_steps jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default timezone('utc'::text, now()),
  constraint event_config_single_row check (id = 1)
);

alter table public.event_config enable row level security;

create policy "Public can read event config"
  on public.event_config for select using (true);

alter publication supabase_realtime add table public.event_config;

-- Wstawienie domyślnych danych wydarzenia
insert into public.event_config (
  id, title, location_name, lat, lng, event_date, rsvp_deadline,
  host_phone_display, host_phone_raw, arrival_instructions, arrival_steps
) values (
  1,
  'Bieszczadzkie Ognisko w Wołkowyi',
  'Wołkowyja, nad Jeziorem Solińskim',
  49.341933,
  22.433710,
  '2026-09-12T18:00:00+02:00',
  '2026-09-06T23:59:59+02:00',
  '+48 600 000 000',
  '600000000',
  'Jadąc główną drogą z Polańczyka wjeżdżasz do Wołkowyi. Za kapliczką po lewej stronie skręć w utwardzoną drogę szutrową prowadzącą w stronę jeziora. Po około 150 metrach szukaj czarnej bramki po prawej stronie. Gdy będziesz 10 minut przed celem – zadzwoń lub napisz, wyjdziemy na drogę!',
  jsonb_build_array(
    'Wjedź do Wołkowyi od strony Polańczyka główną drogą',
    'Za przydrożną kapliczką skręć w lewo, w utwardzoną drogę szutrową w kierunku jeziora',
    'Jedź ok. 150 metrów — szukaj czarnej bramki po prawej stronie',
    'Gdy jesteś 10 minut przed celem — zadzwoń lub napisz, wyjdziemy na drogę'
  )
)
on conflict (id) do nothing;

-- 2. Tabela dla Gości (RSVP & Alkohol)
create table if not exists public.guests (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  status text not null,
  plus_count integer default 0,
  is_drinking boolean default true,
  alcohol_type text,
  bringing text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint guests_name_unique unique (name)
);

alter table public.guests enable row level security;

create policy "Public can read guests" on public.guests for select using (true);
create policy "Public can insert guests" on public.guests for insert with check (true);
create policy "Public can update guests" on public.guests for update using (true) with check (true);

alter publication supabase_realtime add table public.guests;

-- 3. Tabela Ekwipunku (Checklista)
create table if not exists public.checklist (
  id uuid default gen_random_uuid() primary key,
  item_name text not null,
  claimed_by text,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.checklist enable row level security;

create policy "Public can read checklist" on public.checklist for select using (true);
create policy "Public can insert checklist" on public.checklist for insert with check (true);
create policy "Public can update checklist" on public.checklist for update using (true) with check (true);

alter publication supabase_realtime add table public.checklist;
```

---

## 2. Environment Variables & GitHub Secrets

### Local Development Setup
Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### GitHub Secrets Setup for Automated Deployment
For GitHub Pages deployments using GitHub Actions:

1. Navigate to your GitHub repository -> **Settings** -> **Secrets and variables** -> **Actions**.
2. Add the following repository secrets:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Public Anon Key
3. Under **Settings** -> **Pages**, set **Source** to **`GitHub Actions`**.
