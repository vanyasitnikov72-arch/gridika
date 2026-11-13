-- Gridika orders (PostgreSQL / Yandex Managed PostgreSQL).
-- Run once in the database's SQL console before the function goes live.

CREATE TABLE IF NOT EXISTS orders (
  id            VARCHAR(32)  PRIMARY KEY,                -- 'GR-7Q4K2D'
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  paid_at       TIMESTAMPTZ,
  email         VARCHAR(254) NOT NULL,
  items         JSONB        NOT NULL,                   -- the effects' settings (what the codes are built from)
  codes_count   INT          NOT NULL,
  total         INT          NOT NULL,                   -- ₽, computed on the server
  discount      INT          NOT NULL DEFAULT 0,
  payment_id    VARCHAR(128) UNIQUE,                     -- YooKassa payment id
  status        VARCHAR(16)  NOT NULL DEFAULT 'pending', -- pending | paid | canceled | refunded
  email_status  VARCHAR(16)  NOT NULL DEFAULT 'none',    -- none | sent | failed
  order_url     TEXT,                                    -- signed link, set once paid
  access_token  VARCHAR(64)  NOT NULL,                   -- lets the buyer's browser pick up its own order after paying
  source        VARCHAR(128) NOT NULL DEFAULT 'direct',
  note          TEXT         NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_orders_email      ON orders (email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status     ON orders (status);

CREATE TABLE IF NOT EXISTS order_events (
  id          SERIAL       PRIMARY KEY,
  order_id    VARCHAR(32)  NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  event_type  VARCHAR(32)  NOT NULL,                     -- created | payment | email_sent | email_failed | email_resent | refund | canceled
  description TEXT         NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_events_order_id ON order_events (order_id);
