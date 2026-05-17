-- ZIYOKOR NONLARI Database Schema
-- PostgreSQL + Redis (for cache/realtime)

-- ====== ENUMS ======
CREATE TYPE user_role AS ENUM ('customer', 'seller', 'driver', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'accepted', 'baking', 'ready', 'delivering', 'delivered', 'rejected');
CREATE TYPE driver_status AS ENUM ('free', 'delivering', 'offline');
CREATE TYPE bakery_status AS ENUM ('open', 'closed', 'busy');

-- ====== USERS ======
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  role          user_role NOT NULL DEFAULT 'customer',
  name          VARCHAR(100) NOT NULL,
  phone         VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url    TEXT,
  rating        DECIMAL(2,1) DEFAULT 5.0,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_phone ON users(phone);

-- ====== BAKERIES ======
CREATE TABLE bakeries (
  id            SERIAL PRIMARY KEY,
  seller_id     INTEGER REFERENCES users(id),
  name          VARCHAR(200) NOT NULL,
  address       TEXT NOT NULL,
  lat           DECIMAL(10,7) NOT NULL,
  lng           DECIMAL(10,7) NOT NULL,
  phone         VARCHAR(20),
  status        bakery_status DEFAULT 'closed',
  rating        DECIMAL(2,1) DEFAULT 5.0,
  total_orders  INTEGER DEFAULT 0,
  image_url     TEXT,
  open_time     TIME DEFAULT '06:00',
  close_time    TIME DEFAULT '21:00',
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bakeries_location ON bakeries(lat, lng);
CREATE INDEX idx_bakeries_seller ON bakeries(seller_id);

-- ====== PRODUCTS ======
CREATE TABLE products (
  id            SERIAL PRIMARY KEY,
  bakery_id     INTEGER REFERENCES bakeries(id),
  name          VARCHAR(200) NOT NULL,
  description   TEXT,
  price         INTEGER NOT NULL CHECK (price > 0),
  category      VARCHAR(50),
  image_url     TEXT,
  stock         INTEGER DEFAULT 999,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_bakery ON products(bakery_id);
CREATE INDEX idx_products_category ON products(category);

-- ====== ORDERS ======
CREATE TABLE orders (
  id            SERIAL PRIMARY KEY,
  customer_id   INTEGER REFERENCES users(id),
  bakery_id     INTEGER REFERENCES bakeries(id),
  driver_id     INTEGER REFERENCES users(id),
  status        order_status DEFAULT 'pending',
  total         INTEGER NOT NULL,
  address       TEXT NOT NULL,
  lat           DECIMAL(10,7),
  lng           DECIMAL(10,7),
  note          TEXT,
  payment_method VARCHAR(20),
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_bakery ON orders(bakery_id);
CREATE INDEX idx_orders_driver ON orders(driver_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- ====== ORDER ITEMS ======
CREATE TABLE order_items (
  id            SERIAL PRIMARY KEY,
  order_id      INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id    INTEGER REFERENCES products(id),
  product_name  VARCHAR(200),
  quantity      INTEGER NOT NULL CHECK (quantity > 0),
  price         INTEGER NOT NULL
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ====== DELIVERIES ======
CREATE TABLE deliveries (
  id            SERIAL PRIMARY KEY,
  order_id      INTEGER REFERENCES orders(id) UNIQUE,
  driver_id     INTEGER REFERENCES users(id),
  status        VARCHAR(20) DEFAULT 'assigned',
  picked_at     TIMESTAMP,
  delivered_at  TIMESTAMP,
  rating        INTEGER CHECK (rating BETWEEN 1 AND 5)
);

CREATE INDEX idx_deliveries_driver ON deliveries(driver_id);

-- ====== DRIVER LOCATIONS (Redis cached, but logged here) ======
CREATE TABLE driver_locations (
  id            SERIAL PRIMARY KEY,
  driver_id     INTEGER REFERENCES users(id),
  lat           DECIMAL(10,7) NOT NULL,
  lng           DECIMAL(10,7) NOT NULL,
  logged_at     TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_driver_locations_driver ON driver_locations(driver_id);
CREATE INDEX idx_driver_locations_time ON driver_locations(logged_at DESC);

-- ====== PAYMENTS ======
CREATE TABLE payments (
  id            SERIAL PRIMARY KEY,
  order_id      INTEGER REFERENCES orders(id),
  method        VARCHAR(20) NOT NULL,
  amount        INTEGER NOT NULL,
  status        VARCHAR(20) DEFAULT 'pending',
  transaction_id VARCHAR(100),
  created_at    TIMESTAMP DEFAULT NOW()
);

-- ====== REVIEWS ======
CREATE TABLE reviews (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER REFERENCES users(id),
  bakery_id     INTEGER REFERENCES bakeries(id),
  order_id      INTEGER REFERENCES orders(id) UNIQUE,
  rating        INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- ====== NOTIFICATIONS ======
CREATE TABLE notifications (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER REFERENCES users(id),
  title         VARCHAR(200),
  body          TEXT,
  type          VARCHAR(50),
  is_read       BOOLEAN DEFAULT false,
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

-- ====== FUNCTIONS & TRIGGERS ======
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ====== SEED DATA ======
INSERT INTO users (role, name, phone, password_hash, rating) VALUES
  ('seller', 'Raximjon Nonvoy', '+998993921157', '$2b$10$seedhash', 4.9),
  ('seller', 'ZIYOKOR Nonlari', '+998993921158', '$2b$10$seedhash', 4.8),
  ('driver', 'Akmaljon', '+998991234567', '$2b$10$seedhash', 4.9),
  ('driver', 'Bobur', '+998992345678', '$2b$10$seedhash', 4.7),
  ('driver', 'Dilshod', '+998993456789', '$2b$10$seedhash', 4.8),
  ('driver', 'Eldor', '+998994567890', '$2b$10$seedhash', 4.6);
