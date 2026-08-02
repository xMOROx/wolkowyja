# 📖 Instrukcja Konfiguracji Supabase i Bezpiecznego Wdrożenia (GitHub Secrets & Pages)

---

## 🔒 Ważna informacja o kluczach Supabase

W Supabase istnieją dwa rodzaje kluczy:
1. **`anon` (public key)** – jest to **jawny klucz kliencki**. Służy do autoryzacji zapytań wysyłanych z przeglądarki użytkownika. Przeglądarka i tak musi go pobrać, aby połączyć się z bazą. W Supabase dostęp jest bezpiecznie chroniony przez reguły bazy danych (**RLS - Row Level Security**).
2. **`service_role` (secret key)** – tego klucza **NIGDY NIE UŻYWAMY** w aplikacji frontendowej ani nie wrzucamy na GitHub!

Dla zachowania porządku w kodzie i nieprzechowywania kluczy na sztywno w plikach Git, użyliśmy **Zmiennych Środowiskowych (`.env`)** oraz **GitHub Secrets**.

---

## 🛠️ Jak ustawić klucze w projektach?

### Option A: Dla pracy lokalnej (na Twoim komputerze)
1. Utwórz w folderze projektu plik o nazwie `.env.local` (jest on automatycznie ukryty w pliku `.gitignore`).
2. Wklej do niego swoje dane z Supabase:
   ```env
   VITE_SUPABASE_URL=https://twoj-id.supabase.co
   VITE_SUPABASE_ANON_KEY=twoj-anon-public-key
   ```

---

### Option B: Dla GitHub Pages (GitHub Secrets) – NAJBEZPIECZNIEJSZA METODA
Jeśli publikujesz stronę na GitHubie i nie chcesz wpisywać kluczy w plikach kodu:

1. Wejdź na stronę swojego repozytorium na GitHubie.
2. Przejdź do: **Settings** -> **Secrets and variables** -> **Actions**.
3. Kliknij przycisk **"New repository secret"** i dodaj dwa sekrety:
   - Secret 1:
     - **Name**: `VITE_SUPABASE_URL`
     - **Secret**: `https://twoj-id.supabase.co`
   - Secret 2:
     - **Name**: `VITE_SUPABASE_ANON_KEY`
     - **Secret**: `twoj-anon-public-key`

4. Po dodaniu sekretów, w pliku `.github/workflows/deploy.yml` utworzyliśmy automatyczny proces (GitHub Action). Każdy Twój `git push` automatycznie zbuduje i opublikuje stronę na GitHub Pages używając tych sekretów!

---

## 🗄️ Baza Danych Supabase - Skrypt SQL (Krótkie przypomnienie)

Wklej ten kod w Supabase (**SQL Editor** -> **Run**):

```sql
create table if not exists public.guests (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  status text not null,
  plus_count integer default 0,
  transport text,
  bringing text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.guests enable row level security;

create policy "Pozwól wszystkim czytać i zapisywać"
  on public.guests for all
  using (true)
  with check (true);

alter publication supabase_realtime add table public.guests;
```
