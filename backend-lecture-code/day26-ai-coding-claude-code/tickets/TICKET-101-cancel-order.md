# TICKET-101: Cancel an order

**Type:** Feature

As a customer I can cancel an order I just placed.

## Acceptance criteria

- `PATCH /orders/:id/cancel` cancels a `placed` order and returns the updated order.
- The stock of every book in the order is restored.
- Cancelling an order that is already cancelled returns 409.
- An unknown order id returns 404.
- Tests cover all of the above.

## Notes

- `cancelOrder` already exists in `src/services/orders.service.ts` as a stub.
- Follow the layers in `docs/architecture.md` and the rules in `docs/business-rules.md`.
