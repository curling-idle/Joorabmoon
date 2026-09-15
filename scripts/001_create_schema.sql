create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  first_name text not null,
  last_name text not null,
  gender text default '',
  birthdate date,
  city text default '',
  country text default '',
  wallet_address text default '',
  role text not null default 'buyer' check (role in ('buyer', 'seller')),
  avatar_url text,
  show_email boolean not null default true,
  show_birthdate boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists shops (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references users(id) on delete cascade,
  shop_name text not null,
  slug text unique not null,
  description text default '',
  location text default '',
  contact_number text default '',
  show_contact boolean not null default false,
  logo_url text,
  banner_url text,
  wallet_address text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops(id) on delete cascade,
  name text not null,
  slug text unique not null,
  description text default '',
  price_ton numeric(12,4) not null default 0,
  price_usd numeric(12,2) not null default 0,
  category text default 'socks',
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  image_urls text[] not null default '{}',
  stock integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references users(id) on delete cascade,
  shop_id uuid not null references shops(id) on delete cascade,
  status text not null default 'pending',
  payment_method text,
  payment_tx_hash text,
  total_ton numeric(12,4),
  total_usd numeric(12,2),
  shipping_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  quantity integer not null default 1,
  size text,
  color text,
  price_ton numeric(12,4) not null
);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops(id) on delete cascade,
  buyer_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(shop_id, buyer_id)
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references users(id) on delete cascade,
  content text not null,
  message_type text default 'text',
  currency text,
  amount numeric(12,4),
  read boolean not null default false,
  created_at timestamptz not null default now()
);
