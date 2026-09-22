# Payment Gateway API

A small Express + TypeScript CRUD API that manages transactions within a payment processing
system, letting merchants and customers create, retrieve, update, list, and delete transactions.

Transaction data is stored in `data/transactions.json`.

## Transaction shape

```json
{
  "transactionId": "76774508-778b-42e5-9b1a-0f2c3d4e5f6a",
  "amount": 683.16,
  "currency": "EUR",
  "userId": "user_nbiylfqf",
  "status": "Pending"
}
```

`status` is either `"Pending"` or `"Completed"`. A transaction starts as `"Pending"`.

## Setup

```bash
npm install
npm run dev     # tsx watch src/server.ts — restarts on save
npm test        # runs the test suite once
npm run test:watch  # reruns on save
```

## Where to work

Everything lives in `src/app.ts`. Each route is already declared — fill in the body where the
comment says `// todo:`. Don't split anything out into separate controller/service files; keep it
all in the handler.

`src/app.test.ts` is the spec — every endpoint's status codes and response shapes below are
enforced there. Right now all 8 tests fail, because every route just throws `not implemented`.
Implementing a route correctly should turn its tests green without changing the test file itself.

## Endpoints

### 1. Create a transaction

- `POST /transactions`
- Request body: `{ amount, currency, userId }`
- Creates a transaction with a generated `transactionId`, starting `status: "Pending"`.
- Response: `201 Created` with the created transaction.

### 2. Retrieve a transaction by ID

- `GET /transactions/:transactionId`
- `200 OK` with the transaction if found.
- `404 Not Found` with `{ "message": "Transaction not found" }` if not.

### 3. Update a transaction's status

- `PUT /transactions/:transactionId`
- Request body: `{ "status": "Completed" }`
- `200 OK` with `{ transactionId, status }` if found.
- `404 Not Found` with `{ "message": "Transaction not found" }` if not.

### 4. List all transactions

- `GET /transactions`
- `200 OK` with an array of every transaction.

### 5. Delete a transaction

- `DELETE /transactions/:transactionId`
- `200 OK` with `{ "message": "Transaction deleted successfully" }` if found.
- `404 Not Found` with `{ "message": "Transaction not found" }` if not.
