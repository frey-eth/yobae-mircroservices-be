# Database Schema (PostgreSQL)

User-to-user booking (book another user for hangout, hotel-style). No separate Friend service.

## Users (User Service)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  gender VARCHAR(20) NOT NULL,
  balance DECIMAL(12,2) NOT NULL DEFAULT 0,
  kyc_status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending | verified | rejected
  price_per_hour DECIMAL(10,2),  -- NULL = not bookable; set for users who can be booked for hangout
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_kyc_status ON users(kyc_status);
CREATE INDEX idx_users_price_per_hour ON users(price_per_hour) WHERE price_per_hour IS NOT NULL;
```

## Bookings (Booking Service)

Book one user (host) by another (booker). Unique (host_id, start_at) prevents double booking.

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,           -- booker
  host_id UUID NOT NULL,           -- user being booked (hangout partner)
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  idempotency_key VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending | confirmed | failed | cancelled
  amount DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_booking_times CHECK (end_at > start_at),
  CONSTRAINT uq_host_start UNIQUE (host_id, start_at)
);
CREATE UNIQUE INDEX idx_bookings_idempotency ON bookings(idempotency_key);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_host_id ON bookings(host_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);
```

## Payments & Transactions (Payment Service)

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL,
  user_id UUID NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  type VARCHAR(20) NOT NULL,       -- deduct | refund
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending | completed | failed
  idempotency_key VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_payments_idempotency ON payments(idempotency_key);
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  amount DECIMAL(12,2) NOT NULL,  -- signed: negative = debit, positive = credit
  type VARCHAR(20) NOT NULL,
  reference_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_reference_id ON transactions(reference_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
```

## Messages (Chat Service)

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL,
  user_id UUID NOT NULL,   -- booker
  host_id UUID NOT NULL,   -- user booked
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_conversations_booking ON conversations(booking_id);
CREATE UNIQUE INDEX idx_conversations_booking_unique ON conversations(booking_id);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(conversation_id, created_at);
```

## Read replicas

- **Write:** Use primary connection for INSERT/UPDATE/DELETE.
- **Read-heavy:** Use replica(s) for SELECT (list users, get profile, transaction history, messages).
- **Connection pooling:** PgBouncer or app pool to avoid exhausting connections.
