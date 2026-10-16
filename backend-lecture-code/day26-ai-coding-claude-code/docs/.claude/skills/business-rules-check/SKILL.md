---
name: business-rules-check
description: Check a change against this bookshop's business rules (coupons, stock, order status).
---

# Business-rules check

1. Read `docs/business-rules.md`.
2. Look at the current diff (`git diff`) and the code it touches in `src/services`.
3. For each rule (coupons, stock, order status, low stock), say whether the change keeps it,
   breaks it, or does not touch it.
4. Pay extra attention to: stock going negative, totals below $0.00, and cancelled orders
   being cancelled twice.
5. Report violations first, each with the rule and the file.
