create extension if not exists pgcrypto;

create sequence if not exists public.orders_order_number_seq start 1001;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint not null default nextval('public.orders_order_number_seq'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  customer_name text not null,
  phone text not null,
  service text not null check (service in ('Recoger en el local','A domicilio')),
  address text,
  notes text,
  items jsonb not null,
  total numeric(10,2) not null check (total >= 0),
  status text not null default 'nuevo' check (status in ('nuevo','aceptado','preparando','listo','entregado','cancelado'))
);

create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists orders_status_idx on public.orders(status);

alter table public.orders enable row level security;
-- El navegador NO accede directamente a esta tabla. Solo las Vercel Functions usando la service role key.
-- No crees policies públicas para orders.
