# Business rules

## Coupons

- `SAVE10`: 10% off the subtotal, rounded to the nearest cent.
- `FIVEOFF`: $5.00 off, only when the subtotal is at least $20.00; otherwise the order is rejected with 400.
- Any other code is rejected with 400. A discount can never push the total below $0.00.

## Stock

- Stock never goes below zero. An order for more than the stock is rejected with 409.
- Placing an order decrements stock; cancelling a placed order restores it.

## Order status

- `placed` -> `cancelled`. A cancelled order cannot be cancelled again (409).

## Low stock

- A book is "low stock" when `stock <= threshold`. The default threshold is 5.
