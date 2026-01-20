Supabase setup for Messages table

1) Create table SQL:

```sql
create table public.messages (
  id bigserial primary key,
  name text not null,
  message text not null,
  created_at timestamptz default now()
);
```

2) Simple RLS (optional):

- If you want to allow anonymous inserts but limit spam, you can enable Row Level Security and add a policy:

```sql
-- allow inserts with some basic checks (e.g., message length)
alter table public.messages enable row level security;

-- Correct INSERT policy: INSERT policies should use WITH CHECK only
create policy "anon_insert_messages"
  on public.messages
  for insert
  with check (
    char_length(message) > 2
    and char_length(message) < 200
  );

-- Optional: allow public reads via a separate SELECT policy
create policy "anon_select_messages"
  on public.messages
  for select
  using (true);

-- Stronger validation example (also validate name length):
-- create policy "anon_insert_messages_validated"
--   on public.messages
--   for insert
--   with check (
--     char_length(message) between 3 and 200
--     and char_length(name) between 1 and 80
--   );
```

3) Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to a frontend `.env` file (not committed):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4) Install client and run:

```bash
cd frontend
npm install
npm run dev
```

5) Deploy to GitHub Pages (if desired): build and deploy the `dist` folder.

```bash
npm run build
npm run deploy
```

Security notes:
- Public anon keys allow anyone to write. Use RLS to add length checks or rate limits.
- For production, consider using a small server to sign requests or add a captcha on the client.

Client-side mitigations included in this repo:
- Honeypot field: a hidden `website` input that bots often fill; submissions with a non-empty honeypot are rejected client-side.
- Rate limit: simple per-browser rate limiting (30s) using `localStorage` key `lastMessageAt`.
- Duplicate suppression: the last-sent message text is cached in `localStorage` to avoid immediate duplicate sends.

These are lightweight defenses — for robust anti-spam consider adding a captcha (hCaptcha, reCAPTCHA) or a small server that issues signed tokens.
