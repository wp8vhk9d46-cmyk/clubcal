alter table public.events
  add column if not exists sequence integer not null default 0,
  add column if not exists cancelled boolean not null default false;

create index if not exists events_club_id_cancelled_idx
  on public.events (club_id, cancelled);
