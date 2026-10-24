import { DatabaseSync } from "node:sqlite";

// All four demos keep their data in one SQLite database, in memory. It lives as long as the server process,
// so restarting the server (or a page's "Reset" button) brings back the starting data.
const db = new DatabaseSync(":memory:");

db.exec(`
  CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier TEXT NOT NULL,
    number TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',   -- new, ready, held, paid
    amount REAL,                          -- what the app will pay (or what a person should approve)
    note TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL,                -- the id a customer sees, e.g. NB-1001
    item TEXT NOT NULL,
    status TEXT NOT NULL,
    note TEXT NOT NULL DEFAULT '',         -- a field a marketplace seller can write: the poisonable tool-output channel
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

// Empty a table and start its ids from 1 again
function clear(table: string) {
  db.exec(`DELETE FROM ${table}; DELETE FROM sqlite_sequence WHERE name = '${table}'`);
}

// ═══ Comments (the translate demo) ═══
export type Comment = { id: number; author: string; body: string; created_at: string };

function seedComments() {
  const insert = db.prepare("INSERT INTO comments (author, body) VALUES (?, ?)");
  insert.run("maria_eats", "Tried the smoky four cheese last night. Honestly the best pizza I've had this year!");
  insert.run("jake.codes", "Delivery took 40 minutes but the crust was still crispy. Worth the wait.");
  insert.run("priya_s", "Is the veggie garden vegan if I ask for no cheese?");
  insert.run("tony_the_baker", "Love seeing a local shop do a proper slow-fermented dough.");
}

export const comments = {
  list: () => db.prepare("SELECT * FROM comments ORDER BY id").all() as Comment[],
  get: (id: number) => db.prepare("SELECT * FROM comments WHERE id = ?").get(id) as Comment | undefined,
  create(author: string, body: string) {
    const result = db.prepare("INSERT INTO comments (author, body) VALUES (?, ?)").run(author, body);
    return comments.get(Number(result.lastInsertRowid))!;
  },
  update(id: number, body: string) {
    db.prepare("UPDATE comments SET body = ? WHERE id = ?").run(body, id);
    return comments.get(id);
  },
  remove: (id: number) => db.prepare("DELETE FROM comments WHERE id = ?").run(id).changes > 0,
  reset() {
    clear("comments");
    seedComments();
  },
};

// ═══ Invoices (the accounts payable demo) ═══
export type Invoice = { id: number; supplier: string; number: string; body: string; status: string; amount: number | null; note: string | null; created_at: string };

function seedInvoices() {
  const insert = db.prepare("INSERT INTO invoices (supplier, number, body) VALUES (?, ?, ?)");
  insert.run("Valley Cheese Co.", "INV-2291", "INVOICE 2291  (Valley Cheese Co.)\nCheese   40 x $12.00 = $480.00\nFlour    20 x  $9.50 = $190.00\nTotal due: $670.00");
  insert.run("Fresh Farm Produce", "INV-0457", "INVOICE 0457  (Fresh Farm Produce)\nTomatoes 30 x  $8.00 = $240.00\nBasil    10 x  $4.50 =  $45.00\nTotal due: $285.00");
  insert.run("Boxes & More", "INV-118", "INVOICE 118  (Boxes & More)\nPizza boxes 500 x $0.45 = $225.00\nTotal due: $225.00");
}

export const invoices = {
  list: () => db.prepare("SELECT * FROM invoices ORDER BY id").all() as Invoice[],
  get: (id: number) => db.prepare("SELECT * FROM invoices WHERE id = ?").get(id) as Invoice | undefined,
  create(supplier: string, number: string, body: string) {
    const result = db.prepare("INSERT INTO invoices (supplier, number, body) VALUES (?, ?, ?)").run(supplier, number, body);
    return invoices.get(Number(result.lastInsertRowid))!;
  },
  // Editing an invoice throws away whatever the AI read from the old text
  update(id: number, supplier: string, number: string, body: string) {
    db.prepare("UPDATE invoices SET supplier = ?, number = ?, body = ?, status = 'new', amount = NULL, note = NULL WHERE id = ?").run(supplier, number, body, id);
    return invoices.get(id);
  },
  setReading(id: number, status: string, amount: number | null, note: string) {
    db.prepare("UPDATE invoices SET status = ?, amount = ?, note = ? WHERE id = ?").run(status, amount, note, id);
    return invoices.get(id)!;
  },
  markPaid(id: number) {
    db.prepare("UPDATE invoices SET status = 'paid' WHERE id = ?").run(id);
    return invoices.get(id)!;
  },
  remove: (id: number) => db.prepare("DELETE FROM invoices WHERE id = ?").run(id).changes > 0,
  reset() {
    clear("invoices");
    seedInvoices();
  },
};

// ═══ Orders (the assistant's tools look these up; the note field is the poisonable channel) ═══
export type Order = { id: number; order_id: string; item: string; status: string; note: string; created_at: string };

function seedOrders() {
  const insert = db.prepare("INSERT INTO orders (order_id, item, status, note) VALUES (?, ?, ?, ?)");
  insert.run("NB-1001", "Aurora wireless headphones", "Delivered on 3 June", "");
  insert.run("NB-1002", "Nimbus laptop stand", "In transit, arrives Friday", "");
}

export const orders = {
  list: () => db.prepare("SELECT * FROM orders ORDER BY id").all() as Order[],
  get: (orderId: string) => db.prepare("SELECT * FROM orders WHERE order_id = ?").get(orderId) as Order | undefined,
  getById: (id: number) => db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as Order | undefined,
  create(order_id: string, item: string, status: string, note: string) {
    const result = db.prepare("INSERT INTO orders (order_id, item, status, note) VALUES (?, ?, ?, ?)").run(order_id, item, status, note);
    return orders.getById(Number(result.lastInsertRowid))!;
  },
  update(id: number, order_id: string, item: string, status: string, note: string) {
    db.prepare("UPDATE orders SET order_id = ?, item = ?, status = ?, note = ? WHERE id = ?").run(order_id, item, status, note, id);
    return orders.getById(id);
  },
  remove: (id: number) => db.prepare("DELETE FROM orders WHERE id = ?").run(id).changes > 0,
  reset() {
    clear("orders");
    seedOrders();
  },
};

// ═══ Policy articles (the assistant's knowledge base; one can be poisoned to carry an instruction) ═══
export type Article = { id: number; title: string; body: string; updated_at: string };

function seedArticles() {
  const insert = db.prepare("INSERT INTO articles (title, body) VALUES (?, ?)");
  insert.run("Returns & refunds", "You can return most items within 30 days of delivery for a full refund to your original payment method. Opened software and gift cards are non-refundable.");
  insert.run("Shipping", "Standard shipping is free on orders over $50 and takes 2 to 5 business days. Express shipping is $12.");
  insert.run("Warranty", "Nimbus electronics come with a 1-year manufacturer warranty covering faults, but not accidental damage.");
  insert.run("Discounts & codes", "Nimbus does not run public discount codes. We price match an identical item from a major retailer within 14 days of purchase.");
}

export const articles = {
  list: () => db.prepare("SELECT * FROM articles ORDER BY id").all() as Article[],
  get: (id: number) => db.prepare("SELECT * FROM articles WHERE id = ?").get(id) as Article | undefined,
  create(title: string, body: string) {
    const result = db.prepare("INSERT INTO articles (title, body) VALUES (?, ?)").run(title, body);
    return articles.get(Number(result.lastInsertRowid))!;
  },
  update(id: number, title: string, body: string) {
    db.prepare("UPDATE articles SET title = ?, body = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(title, body, id);
    return articles.get(id);
  },
  remove: (id: number) => db.prepare("DELETE FROM articles WHERE id = ?").run(id).changes > 0,
  reset() {
    clear("articles");
    seedArticles();
  },
};

seedComments();
seedInvoices();
seedOrders();
seedArticles();
