-- Gridika Orders Database Schema
-- Compatible with PostgreSQL and YDB (Yandex Database) in PostgreSQL mode

-- 1. Orders table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(32) PRIMARY KEY,                    -- e.g. 'GR-7Q4K2D'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email VARCHAR(255) NOT NULL,                   -- customer email
  items JSONB NOT NULL DEFAULT '[]'::jsonb,      -- purchased effects settings array
  codes_count INT NOT NULL DEFAULT 1,            -- number of codes in the order
  total INT NOT NULL DEFAULT 0,                  -- total paid in rubles (e.g. 3290)
  discount INT NOT NULL DEFAULT 0,               -- discount in rubles (e.g. 1180)
  payment_id VARCHAR(128) UNIQUE,                -- YooKassa payment ID
  payment_provider VARCHAR(32) DEFAULT 'yookassa',
  status VARCHAR(32) NOT NULL DEFAULT 'paid',    -- 'paid' | 'refunded' | 'failed'
  email_status VARCHAR(32) NOT NULL DEFAULT 'sent', -- 'sent' | 'bounced' | 'resent'
  order_url TEXT NOT NULL,                       -- signed link (/thanks#order=...&items=...&sig=...)
  source VARCHAR(128) DEFAULT 'direct',          -- utm_source / referral
  note TEXT DEFAULT ''                           -- admin note
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders (email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);

-- 2. Events audit log table
CREATE TABLE IF NOT EXISTS order_events (
  id VARCHAR(64) PRIMARY KEY,
  order_id VARCHAR(32) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  event_type VARCHAR(32) NOT NULL,               -- 'payment' | 'email_sent' | 'email_resent' | 'link_opened' | 'refund'
  description TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_events_order_id ON order_events (order_id);
