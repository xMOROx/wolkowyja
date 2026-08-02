# Deployment and Supabase Setup Guide

This guide outlines the configuration of Supabase database schemas and automated GitHub Actions deployment for GitHub Pages.

---

## 1. Supabase Database Schema Setup

To enable real-time multi-user synchronization across all client devices, execute the following SQL script in the Supabase **SQL Editor**:

```sql
-- 1. Create Guests Table (RSVP & Alcohol Preferences)
create table if not exists public.guests (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  status text not null,
  plus_count integer default 0,
  is_drinking boolean default true,
  alcohol_type text,
  bringing text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Checklist Table
create table if not exists public.checklist (
  id uuid default gen_random_uuid() primary key,
  item_name text not null,
  claimed_by text,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Row Level Security Policies
alter table public.guests enable row level security;
alter table public.checklist enable row level security;

create policy "Allow public read and insert on guests"
  on public.guests for all using (true) with check (true);

create policy "Allow public read and insert on checklist"
  on public.checklist for all using (true) with check (true);

-- 4. Enable Realtime Subscriptions
alter publication supabase_realtime add table public.guests;
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

---

## 3. Deployment Workflow

Pushing commits to the `main` branch automatically triggers the `.github/workflows/deploy.yml` action, building the project assets and deploying them to GitHub Pages.
