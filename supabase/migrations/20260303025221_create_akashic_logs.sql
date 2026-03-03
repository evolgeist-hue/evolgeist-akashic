create table if not exists akashic_logs (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  question text not null,
  answer text not null,
  created_at timestamp with time zone default now()
);