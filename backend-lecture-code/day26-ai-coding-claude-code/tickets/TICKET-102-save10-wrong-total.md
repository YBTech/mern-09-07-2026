# TICKET-102: SAVE10 gives the wrong total

**Type:** Bug

A customer used `SAVE10` and the order total looked wrong.

## Steps to reproduce

1. `POST /orders` with two copies of book `b3` and `"couponCode": "SAVE10"`.
2. Look at `discountCents` and `totalCents` in the response.

## Expected

10% off the subtotal.

## Actual

The numbers are far too large. `npm test` shows a failing test for this.

## Acceptance criteria

- Find the root cause, not just the symptom.
- The failing test passes and no other test breaks.
