import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { Link } from "react-router-dom";

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 13 Notes</title>
      <DayNav day="day13-layered-architecture" current="notes" />
      <header className="lecture-header">
        <p className="eyebrow">Week 3 · Day 13 · Notes</p>
        <h1>Layered Architecture</h1>
        <p className="subtitle">Executive summary → full walkthrough</p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2>Section 1 — Executive Summary</h2>
        <p>The essentials — what you must be able to do by the end of today:</p>
        <ul>
          <li>
            Structure an app into controller → service → repository, each with one responsibility
          </li>
          <li>
            Explain what an ORM is and why it replaces hand-written SQL in the repository layer
          </li>
          <li>Put business logic (a status state machine) in the service layer, not the controller</li>
          <li>Write a custom middleware, and say where it runs relative to a route handler</li>
          <li>Centralize error handling with custom error classes and one error-handling middleware</li>
          <li>Implement a cache-aside pattern with Redis for a read-heavy, rarely-changing resource</li>
        </ul>
        <p>
          Want more? <Link to="/week3/day13-layered-architecture/concepts">View all concepts?</Link>
        </p>
      </section>

      <section id="full-walkthrough">
        <h2>Section 2 — Full Walkthrough</h2>

        {/* ================================================================= */}
        {/* 1. Controller / Service / Repository                               */}
        {/* ================================================================= */}
        <h3>1. Controller → Service → Repository</h3>
        <p>
          Days 11–12 wrote SQL and routing logic directly inside a route handler. That stops scaling
          once ten endpoints all need the same validation and the same error shape — so each concern
          gets its own layer instead:
        </p>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Layer</th>
              <th>Job</th>
              <th>Never touches</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Controller</td>
              <td>Parse the request, call one service method, send the response</td>
              <td>SQL, business rules</td>
            </tr>
            <tr>
              <td>Service</td>
              <td>Validation, workflow rules, orchestrating repositories</td>
              <td><code>req</code>/<code>res</code>, SQL</td>
            </tr>
            <tr>
              <td>Repository</td>
              <td>Read and write rows</td>
              <td>Business rules, HTTP</td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          Each layer only talks to the one directly below it: controller → service → repository.
        </p>

        <h4 className="topic">Repository — the data-access layer</h4>
        <p>
          A repository's whole job is reading and writing rows for one table. Nothing about "is this
          allowed" lives here — just the queries:
        </p>
        <CodeBlock
          language="typescript"
          code={`import { pool } from "../../db/client";

export const productRepository = {
  async create(data: { sku: string; name: string; priceCents: number }) {
    const result = await pool.query(
      "INSERT INTO products (sku, name, price_cents) VALUES ($1, $2, $3) RETURNING *",
      [data.sku, data.name, data.priceCents],
    );
    return result.rows[0];
  },

  async findById(id: number) {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    return result.rows[0] ?? null;
  },
};`}
        />
        <p className="callout">
          Notice what's missing: no "does this SKU already exist" check, no "throw if not found." A
          repository returns what the database has — <code>null</code> if nothing matched — and
          leaves what that <em>means</em> to the service.
        </p>

        <h4 className="topic">An ORM does this for you</h4>
        <p>
          Hand-written SQL for every table is repetitive and easy to typo, and it gives you no type
          checking on column names. An <strong>ORM</strong> (Object-Relational Mapper) maps rows to
          objects and generates the SQL underneath a method call instead:
        </p>
        <div className="code-compare">
          <div>
            <p className="compare-label compare-bad">Raw SQL</p>
            <CodeBlock
              language="typescript"
              code={`const result = await pool.query(
  "SELECT * FROM products WHERE id = $1",
  [id],
);
return result.rows[0] ?? null;`}
            />
          </div>
          <div>
            <p className="compare-label compare-good">Through an ORM</p>
            <CodeBlock
              language="typescript"
              code={`const [row] = await db
  .select()
  .from(products)
  .where(eq(products.id, id));
return row ?? null;`}
            />
          </div>
        </div>
        <table className="ref-table">
          <thead>
            <tr>
              <th>ORM</th>
              <th>Style</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Prisma</td>
              <td>Its own schema file, generates a fully-typed client (<code>prisma.product.findUnique(...)</code>)</td>
            </tr>
            <tr>
              <td>TypeORM</td>
              <td>Decorators on classes (<code>@Entity</code>, <code>@Column</code>), ActiveRecord or repository style</td>
            </tr>
            <tr>
              <td>Sequelize</td>
              <td>ActiveRecord style — the model instance has its own <code>.save()</code>, <code>.update()</code></td>
            </tr>
            <tr>
              <td>Drizzle</td>
              <td>A query builder that still reads like SQL — what this project uses from here on</td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          None of these is "the right one" — pick based on how much you want the tool deciding things
          for you vs. writing it yourself. The repository/service/controller split above works the
          same regardless of which one sits behind the repository.
        </p>

        <h4 className="topic">Service — where business rules live</h4>
        <p>
          A service is the one place workflow rules, validation and multi-repository orchestration
          live — not scattered across controllers:
        </p>
        <CodeBlock
          language="typescript"
          code={`import { ConflictError, NotFoundError } from "../../errors/app-error";
import { productRepository } from "./product.repository";

export const productService = {
  async createProduct(input: { sku: string; name: string; priceCents: number }) {
    const existing = await productRepository.findBySku(input.sku); // calls the repository layer
    if (existing) throw new ConflictError(\`Product with SKU "\${input.sku}" already exists\`);
    return productRepository.create(input);
  },

  async getProduct(id: number) {
    const product = await productRepository.findById(id); // calls the repository layer
    if (!product) throw new NotFoundError(\`Product \${id} not found\`);
    return product;
  },
};`}
        />
        <p className="callout">
          No <code>req</code>/<code>res</code>, no SQL — just the rules a repository can't know on
          its own.
        </p>

        <h4 className="topic">Controller — handling request and response</h4>
        <p>
          The controller's whole job: read what's on the request — params, query, body, headers —
          call one service method, and send back a response with a status code and body:
        </p>
        <CodeBlock
          language="typescript"
          code={`import { Request, Response } from "express";
import { productService } from "./product.service";

export const productController = {
  async create(req: Request, res: Response) {
    const { sku, name, priceCents } = req.body;             // BODY — the data being created
    const product = await productService.createProduct({ sku, name, priceCents }); // calls the service layer
    res.status(201).json(product);                          // 201 + the resource that now exists
  },

  async list(req: Request, res: Response) {
    const { search } = req.query;                           // QUERY — how to filter the list
    const products = await productService.listProducts(search as string | undefined); // calls the service layer
    res.status(200).json(products);
  },

  async getById(req: Request, res: Response) {
    const { id } = req.params;                              // PARAMS — which product
    const product = await productService.getProduct(Number(id)); // calls the service layer
    res.status(200).json(product);
  },
};`}
        />
        <p className="callout">
          Same four sources Day 11 covered — params/query/body/headers — just destructured once at
          the top of each method. A header (like Day 11's <code>Idempotency-Key</code>) is read the
          same way: <code>req.headers["idempotency-key"]</code>.
        </p>

        <h4 className="topic">Validating the body with Zod</h4>
        <p>
          The <code>create</code> handler above just trusts that <code>req.body</code> is the right
          shape. Checking that by hand, one <code>if</code> per field, is what Day 11 did:
        </p>
        <CodeBlock
          language="typescript"
          bad={[3]}
          code={`async create(req: Request, res: Response) {
  const { sku, name, priceCents } = req.body;
  // repetitive, easy to miss a case, and not reusable across other routes that need the same checks
  if (typeof sku !== "string" || sku.length === 0 || sku.length > 64) {
    res.status(400).json({ error: { message: "sku must be a non-empty string up to 64 characters" } });
    return;
  }
  if (typeof name !== "string" || name.length === 0 || name.length > 160) {
    res.status(400).json({ error: { message: "name must be a non-empty string up to 160 characters" } });
    return;
  }
  if (typeof priceCents !== "number" || priceCents < 0) {
    res.status(400).json({ error: { message: "priceCents must be a non-negative number" } });
    return;
  }

  const product = await productService.createProduct({ sku, name, priceCents });
  res.status(201).json(product);
},`}
        />
        <p className="callout">
          That's three fields. A real resource has ten, and every one of them needs its own{" "}
          <code>if</code>, its own message, and its own edge cases — an email format, a min length, a
          number that can't be negative. It scales linearly with every field and every rule, and it's
          easy to miss one.
        </p>
        <p>
          A schema-validation library like <strong>Zod</strong> describes all of those rules once, as
          data, and either hands back a parsed, typed object or throws on your behalf:
        </p>
        <CodeBlock
          language="typescript"
          good={[8]}
          code={`import { z } from "zod";

const createProductSchema = z.object({
  sku: z.string().min(1).max(64),
  name: z.string().min(1).max(160),
  priceCents: z.number().int().nonnegative(),
});

async create(req: Request, res: Response) {
  const input = createProductSchema.parse(req.body); // validates AND returns the typed body
  const product = await productService.createProduct(input); // calls the service layer
  res.status(201).json(product);
},`}
        />
        <p className="callout">
          If you find yourself writing an <code>if</code> that checks a business condition inside a
          controller, that check belongs one layer down, in the service. Zod checks the request's{" "}
          <em>shape</em> ("is this even a valid product?") — not business rules like "does this SKU
          already exist," which is what the service is for.
        </p>

        <h4 className="topic">Routes — wiring a URL + method to a controller method</h4>
        <p>
          None of this runs until something tells Express which URL and HTTP method calls which
          controller method — that's a <strong>router</strong>. One per resource, mounted onto the
          app under that resource's path:
        </p>
        <CodeBlock
          language="typescript"
          code={`// product.routes.ts
import { Router } from "express";
import { productController } from "./product.controller";

export const productRoutes = Router();

productRoutes.post("/", productController.create);      // POST   /products
productRoutes.get("/", productController.list);          // GET    /products
productRoutes.get("/:id", productController.getById);    // GET    /products/:id

// app.ts — every resource's router gets mounted once, under its own path
app.use("/products", productRoutes);`}
        />
        <p className="callout">
          This is the piece outside the three layers, and the app can't run without it — the router
          is what turns a plain function into an actual endpoint a client can call.
        </p>

        <h4 className="topic">Putting it together — the order status state machine</h4>
        <p>
          An order can't jump from <code>placed</code> straight to <code>delivered</code> — the
          allowed transitions are a business rule, so they're encoded once, in the service, and every
          layer sticks to its own job:
        </p>
        <CodeBlock
          language="typescript"
          code={`// order.repository.ts — DATA ACCESS ONLY, no rules about what's a valid transition
export const orderRepository = {
  async findById(id: number) {
    const result = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
    return result.rows[0] ?? null;
  },
  async updateStatus(id: number, to: OrderStatus) {
    const result = await pool.query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
      [to, id],
    );
    return result.rows[0];
  },
};`}
        />
        <CodeBlock
          language="typescript"
          code={`// order.service.ts — THE RULE lives here, in one place, as data not scattered ifs
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  placed: ["routed", "cancelled"],
  routed: ["picking", "cancelled"],
  picking: ["packed", "routed"], // sent back to routing on a stock mismatch
  packed: ["shipped"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export const orderService = {
  async updateStatus(id: number, to: OrderStatus) {
    const order = await orderRepository.findById(id); // calls the repository layer
    if (!order) throw new NotFoundError(\`Order \${id} not found\`);
    if (order.status === to) return { order, changed: false }; // re-applying is a safe no-op
    if (!ALLOWED_TRANSITIONS[order.status]?.includes(to)) {
      throw new InvalidStatusTransitionError(\`Cannot move order from "\${order.status}" to "\${to}"\`);
    }
    return { order: await orderRepository.updateStatus(id, to), changed: true };
  },
};`}
        />
        <CodeBlock
          language="typescript"
          code={`// order.controller.ts — HTTP IN, HTTP OUT, no idea the transition table even exists
export const orderController = {
  async updateStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;
    const result = await orderService.updateStatus(Number(id), status); // calls the service layer
    res.status(200).json(result);
  },
};`}
        />
        <CodeBlock
          language="typescript"
          code={`// order.routes.ts — the piece outside the three layers, and none of the above runs without it
export const orderRoutes = Router();

orderRoutes.patch("/:id/status", orderController.updateStatus); // PATCH /orders/:id/status

// app.ts
app.use("/orders", orderRoutes);`}
        />
        <div className="concept">
          <p className="concept-label">Concept — one request, top to bottom</p>
          <ul>
            <li>
              A client sends <code>PATCH /orders/4/status</code>. The router is what matches that
              path and method to <code>orderController.updateStatus</code> — nothing else in the app
              knows this route exists.
            </li>
            <li>
              The controller reads <code>req.params</code>/<code>req.body</code> and calls the
              service — it has no idea what a valid status transition even is.
            </li>
            <li>
              The service checks the transition table and decides: no-op, invalid, or allowed — then
              calls the repository. It never touches <code>req</code>/<code>res</code> or SQL.
            </li>
            <li>
              The repository runs the query and returns a row. It never decides whether the
              transition was <em>allowed</em> — that decision was already made one layer up.
            </li>
          </ul>
        </div>

        {/* ================================================================= */}
        {/* 2. Middleware                                                      */}
        {/* ================================================================= */}
        <h3>2. Middleware</h3>
        <p>
          A middleware is a function that runs <em>between</em> the request arriving and your route
          handler responding — <code>(req, res, next)</code>. It looks at the request, then either
          calls <code>next()</code> to let the next thing run, or sends a response itself and stops
          the chain right there.
        </p>
        <CodeBlock
          language="typescript"
          code={`function logRequest(req: Request, res: Response, next: NextFunction) {
  console.log(req.method, req.url); // e.g. "GET /orders"
  next(); // hand off — to the next middleware, or the route handler
}

app.use(logRequest); // registered once, runs before EVERY route`}
        />
        <p className="callout">
          Skip <code>next()</code> and forget to send a response, and the request just hangs forever
          — nothing after it ever runs.
        </p>
        <p>
          This is how a real app handles things every route needs, without repeating the same code
          in every route handler:
        </p>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Use case</th>
              <th>What it does</th>
              <th>Looks like</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Logging</td>
              <td>Records every request that comes in</td>
              <td><code>console.log(req.method, req.url); next();</code></td>
            </tr>
            <tr>
              <td>Authentication</td>
              <td>Confirms <em>who</em> is making the request (e.g. checks a login token)</td>
              <td><code>if (!isLoggedIn(req)) return res.sendStatus(401); next();</code></td>
            </tr>
            <tr>
              <td>Authorization</td>
              <td>Confirms <em>what</em> that already-known user is allowed to do</td>
              <td><code>if (req.user.role !== "admin") return res.sendStatus(403); next();</code></td>
            </tr>
            <tr>
              <td>Rate limiting</td>
              <td>Rejects a client sending requests too fast</td>
              <td><code>if (tooManyRequests(req.ip)) return res.sendStatus(429); next();</code></td>
            </tr>
            <tr>
              <td>Error handling</td>
              <td>Catches an error thrown anywhere below it — covered next</td>
              <td>↓ Section 3</td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <code>express.json()</code>, <code>cors()</code>, and rate limiters like{" "}
          <code>express-rate-limit</code> are middleware too — usually installed as a package
          instead of hand-written, but the pattern is exactly the same one above.
        </p>

        {/* ================================================================= */}
        {/* 3. Error handling                                                  */}
        {/* ================================================================= */}
        <h3>3. Centralized error handling</h3>
        <p>
          Every layer above throws plain JavaScript errors — a small hierarchy of typed error
          classes, each carrying its own HTTP status code:
        </p>
        <CodeBlock
          language="typescript"
          code={`export class AppError extends Error {
  constructor(message: string, public readonly statusCode: number, public readonly code: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) { super(message, 404, "NOT_FOUND"); }
}

export class ConflictError extends AppError {
  constructor(message: string) { super(message, 409, "CONFLICT"); }
}

export class InvalidStatusTransitionError extends AppError {
  constructor(message: string) { super(message, 409, "INVALID_STATUS_TRANSITION"); }
}`}
        />
        <p>One error-handling middleware, mounted once, turns any of those into a consistent JSON response:</p>
        <CodeBlock
          language="typescript"
          code={`import { ErrorRequestHandler } from "express";
import { AppError } from "../errors/app-error";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: { code: err.code, message: err.message } });
    return;
  }
  console.error(err);
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
};

app.use(errorHandler); // mounted last, after every route`}
        />
        <p className="callout">
          A controller that throws inside an <code>async</code> function needs a small wrapper (or a
          <code>try</code>/<code>catch</code>) to forward that error to <code>next(err)</code> —
          Express doesn't catch it on its own, and without that forwarding it never reaches the
          error handler at all.
        </p>

        <div className="concept">
          <p className="concept-label">Summary — say this in an interview</p>
          <ul>
            <li>
              Every kind of failure gets its own small error class, and each one already knows its
              own HTTP status code — a missing order is a <code>NotFoundError</code>, which is always{" "}
              <code>404</code>.
            </li>
            <li>
              Anywhere in the app — almost always the service layer — a failure is signaled by{" "}
              <em>throwing</em> one of those errors, not by returning <code>null</code> or{" "}
              <code>false</code> and checking for it everywhere.
            </li>
            <li>
              One special middleware is registered last, after every route. Express recognizes it as
              an error handler specifically because it takes <strong>four</strong> parameters (
              <code>err, req, res, next</code>) instead of three.
            </li>
            <li>
              When something throws, Express skips every remaining route and jumps straight to that
              one error handler — no matter which route or service caused it.
            </li>
            <li>
              That handler looks at what kind of error it got, and turns it into one consistent JSON
              response: the right status code, a clear message, and nothing internal (like a raw
              stack trace) leaking out.
            </li>
          </ul>
        </div>

        {/* ================================================================= */}
        {/* 4. Redis caching                                                   */}
        {/* ================================================================= */}
        <h3>4. Cache-aside with Redis</h3>
        <p>
          Product data is read constantly and changes rarely — a good caching candidate. The{" "}
          <strong>cache-aside</strong> pattern: check the cache first, fall back to the repository on
          a miss, populate the cache on the way out, with an expiry so a stale value can't live
          forever:
        </p>
        <CodeBlock
          language="typescript"
          code={`import { redis } from "../../cache/redis-client";
import { productRepository } from "./product.repository";
import { NotFoundError } from "../../errors/app-error";

const TTL_SECONDS = 300;
const cacheKey = (id: number) => \`product:\${id}\`;

export const productService = {
  async getProduct(id: number) {
    const cached = await redis.get(cacheKey(id));
    if (cached) return JSON.parse(cached); // cache hit — skip the database entirely

    const product = await productRepository.findById(id); // cache miss — go to the repository
    if (!product) throw new NotFoundError(\`Product \${id} not found\`);

    await redis.set(cacheKey(id), JSON.stringify(product), "EX", TTL_SECONDS);
    return product;
  },

  async updateProduct(id: number, input: { name?: string; priceCents?: number }) {
    const updated = await productRepository.update(id, input);
    if (!updated) throw new NotFoundError(\`Product \${id} not found\`);
    await redis.del(cacheKey(id)); // invalidate on write — never serve a stale price
    return updated;
  },
};`}
        />
        <table className="ref-table">
          <thead>
            <tr>
              <th>Piece</th>
              <th>What it demonstrates</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>redis.get(cacheKey(id))</code></td>
              <td>Check the cache before touching the database at all</td>
            </tr>
            <tr>
              <td><code>productRepository.findById(id)</code></td>
              <td>The service still calls the repository on a miss — the repository never knows caching exists</td>
            </tr>
            <tr>
              <td><code>"EX", TTL_SECONDS</code></td>
              <td>An expiry as a safety net, independent of explicit invalidation</td>
            </tr>
            <tr>
              <td><code>redis.del(cacheKey(id))</code> in <code>updateProduct</code></td>
              <td>Invalidate on write so a price change is never served stale from cache</td>
            </tr>
          </tbody>
        </table>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>Cache what's read far more than it's written — inventory counts change too fast to be a good fit; product catalog data is.</li>
            <li>Every cache read is a potential miss — the repository call underneath it must still exist and still work.</li>
            <li>An expiry (TTL) matters even with explicit invalidation — it's what limits the damage of an invalidation bug you haven't found yet.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
