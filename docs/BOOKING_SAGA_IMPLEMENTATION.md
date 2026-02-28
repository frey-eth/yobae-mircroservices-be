# Booking Saga Implementation Outline

User-to-user booking (book another user for hangout). No Friend service; Booking → User + Payment only.

## Flow

1. **Client** sends CreateBooking (with `idempotency_key`, `userId`, `hostId`, `startAt`, `endAt`) to API Gateway → Booking Service (via RMQ `create_booking` or HTTP).
2. **Booking Service:**
   - **Idempotency:** If `idempotency_key` seen (Redis/DB), return stored response.
   - **Get host price:** gRPC `UserService.FindById(hostId)` → host’s `price_per_hour`. Amount = duration × price_per_hour.
   - **Payment:** gRPC `PaymentService.DeductBalance(userId, amount, bookingId, idempotencyKey)`. On failure → emit `booking.failed`, return error (no slot to release).
   - **On success:** Persist booking (user_id, host_id, start_at, end_at, amount, status = confirmed), emit `booking.confirmed` and `payment.completed`. Return success.
3. **Payment Service:** Deduct is idempotent (same `idempotency_key` → return existing result). Debit balance; insert into `payments` and `transactions`.
4. **No double booking:** Unique (host_id, start_at) on bookings table; insert fails if that slot is already taken.

## Idempotency

- **Booking:** Redis key `idempotency:{key}` → { response } with TTL, or `bookings.idempotency_key` UNIQUE.
- **Payment:** UNIQUE(idempotency_key) in `payments`; duplicate deduct returns same payment_id and success.

## Events Emitted (Topic Exchange: booking_events)

| Event             | When                 |
|-------------------|----------------------|
| booking.confirmed | After payment success |
| booking.failed    | After payment failure |
| booking.cancelled | User or system cancels |
| payment.completed | After successful deduct |
| payment.failed    | When deduct fails    |

Payloads use `userId` (booker), `hostId` (user being booked), `startAt`, `endAt`, `amount`.

## Code Locations

- **Event publisher:** `shared/rabbitmq/booking-events.publisher.ts`
- **Booking saga:** `apps/bookings-service/src/bookings-service.service.ts` (createBooking: User.FindById → Payment.DeductBalance → emit events)
- **Consumer:** `apps/notifications-service` subscribes to `booking_events` with `booking.#` and `payment.#`.

## Dead-Letter Queue (DLQ)

On consumer error after N retries, publish to DLQ or use RabbitMQ dead-letter exchange.
