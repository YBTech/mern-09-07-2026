import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { Link } from "react-router-dom";
import { En, Zh } from "../../components/Lang";

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 13 Notes</title>
      <DayNav day="day13-layered-architecture" current="notes" />
      <header className="lecture-header">
        <p className="eyebrow">Week 3 · Day 13 · Notes</p>
        <h1><En>Layered Architecture</En><Zh>分层架构</Zh></h1>
        <p className="subtitle"><En>Executive summary → full walkthrough</En><Zh>执行摘要 → 完整讲解</Zh></p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2><En>Section 1 — Executive Summary</En><Zh>第一节 — 执行摘要</Zh></h2>
        <p><En>The essentials — what you must be able to do by the end of today:</En><Zh>今天结束时你必须掌握的核心内容：</Zh></p>
        <ul>
          <li>
            <En>Structure an app into controller → service → repository, each with one responsibility</En>
            <Zh>将应用拆分为 controller → service → repository 三层，每层只负责一件事</Zh>
          </li>
          <li>
            <En>Explain what an ORM is and why it replaces hand-written SQL in the repository layer</En>
            <Zh>说明 ORM 是什么，以及为什么用它替代 repository 层中手写的 SQL</Zh>
          </li>
          <li><En>Put business logic (a status state machine) in the service layer, not the controller</En><Zh>将业务逻辑（如状态机）放在 service 层，而不是 controller 层</Zh></li>
          <li><En>Write a custom middleware, and say where it runs relative to a route handler</En><Zh>编写自定义 middleware，并说明它相对于路由处理器的执行位置</Zh></li>
          <li><En>Centralize error handling with custom error classes and one error-handling middleware</En><Zh>使用自定义错误类和统一的错误处理 middleware 集中管理错误</Zh></li>
          <li><En>Implement a cache-aside pattern with Redis for a read-heavy, rarely-changing resource</En><Zh>对读多写少的资源用 Redis 实现 cache-aside 模式</Zh></li>
        </ul>
        <p>
          <En>Want more? <Link to="/week3/day13-layered-architecture/concepts">View all concepts?</Link></En>
          <Zh>想深入了解？<Link to="/week3/day13-layered-architecture/concepts">查看所有概念</Link></Zh>
        </p>
      </section>

      <section id="full-walkthrough">
        <h2><En>Section 2 — Full Walkthrough</En><Zh>第二节 — 完整讲解</Zh></h2>

        {/* ================================================================= */}
        {/* 1. Controller / Service / Repository                               */}
        {/* ================================================================= */}
        <h3><En>1. Controller → Service → Repository</En><Zh>1. Controller → Service → Repository</Zh></h3>
        <p>
          <En>Days 11–12 wrote SQL and routing logic directly inside a route handler. That stops scaling
          once ten endpoints all need the same validation and the same error shape — so each concern
          gets its own layer instead:</En>
          <Zh>之前我们把 SQL 和路由逻辑直接写在路由处理器里。当十个接口都需要相同的校验和相同的错误格式时，这种方式就难以维护了——因此每个关注点需要有自己的层：</Zh>
        </p>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Layer</En><Zh>层</Zh></th>
              <th><En>Job</En><Zh>职责</Zh></th>
              <th><En>Never touches</En><Zh>不接触</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Controller</td>
              <td><En>Parse the request, call one service method, send the response</En><Zh>解析请求，调用一个 service 方法，返回响应</Zh></td>
              <td><En>SQL, business rules</En><Zh>SQL、业务规则</Zh></td>
            </tr>
            <tr>
              <td>Service</td>
              <td><En>Validation, workflow rules, orchestrating repositories</En><Zh>数据校验、流程规则、协调 repository</Zh></td>
              <td><code>req</code>/<code>res</code>, SQL</td>
            </tr>
            <tr>
              <td>Repository</td>
              <td><En>Read and write rows</En><Zh>读写数据库行</Zh></td>
              <td><En>Business rules, HTTP</En><Zh>业务规则、HTTP</Zh></td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <En>Each layer only talks to the one directly below it: controller → service → repository.</En>
          <Zh>每一层只与紧邻下层交互：controller → service → repository。</Zh>
        </p>

        <h4 className="topic"><En>Repository — the data-access layer</En><Zh>Repository — 数据访问层</Zh></h4>
        <p>
          <En>A repository's whole job is reading and writing rows for one table. Nothing about "is this
          allowed" lives here — just the queries:</En>
          <Zh>repository 只负责一件事：读写某张表的行数据。"是否允许这个操作"不属于它的职责——这里只有查询：</Zh>
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
          <En>Notice what's missing: no "does this SKU already exist" check, no "throw if not found." A
          repository returns what the database has — <code>null</code> if nothing matched — and
          leaves what that <em>means</em> to the service.</En>
          <Zh>注意缺少什么：没有"该 SKU 是否已存在"的检查，也没有"找不到就抛出"的逻辑。repository 只返回数据库有的内容——如果没有匹配则返回 <code>null</code>——如何解读这个结果，交给 service 来决定。</Zh>
        </p>

        <h4 className="topic"><En>An ORM does this for you</En><Zh>ORM 帮你完成这些</Zh></h4>
        <p>
          <En>Hand-written SQL for every table is repetitive and easy to typo, and it gives you no type
          checking on column names. An <strong>ORM</strong> (Object-Relational Mapper) maps rows to
          objects and generates the SQL underneath a method call instead:</En>
          <Zh>为每张表手写 SQL 既重复又容易出错，而且对列名没有类型检查。<strong>ORM</strong>（对象关系映射器）将行映射为对象，在方法调用背后自动生成 SQL：</Zh>
        </p>
        <div className="code-compare">
          <div>
            <p className="compare-label compare-bad"><En>Raw SQL</En><Zh>手写 SQL</Zh></p>
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
            <p className="compare-label compare-good"><En>Through an ORM</En><Zh>通过 ORM</Zh></p>
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
              <th><En>Style</En><Zh>风格</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Prisma</td>
              <td><En>Its own schema file, generates a fully-typed client (<code>prisma.product.findUnique(...)</code>)</En><Zh>有自己的 schema 文件，生成完整类型的客户端（<code>prisma.product.findUnique(...)</code>）</Zh></td>
            </tr>
            <tr>
              <td>TypeORM</td>
              <td><En>Decorators on classes (<code>@Entity</code>, <code>@Column</code>), ActiveRecord or repository style</En><Zh>在类上使用装饰器（<code>@Entity</code>、<code>@Column</code>），支持 ActiveRecord 或 repository 风格</Zh></td>
            </tr>
            <tr>
              <td>Sequelize</td>
              <td><En>ActiveRecord style — the model instance has its own <code>.save()</code>, <code>.update()</code></En><Zh>ActiveRecord 风格——模型实例自带 <code>.save()</code>、<code>.update()</code></Zh></td>
            </tr>
            <tr>
              <td>Drizzle</td>
              <td><En>A query builder that still reads like SQL — what this project uses from here on</En><Zh>读起来像 SQL 的查询构建器——本项目后续使用此库</Zh></td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <En>None of these is "the right one" — pick based on how much you want the tool deciding things
          for you vs. writing it yourself. The repository/service/controller split above works the
          same regardless of which one sits behind the repository.</En>
          <Zh>没有绝对"正确"的选择——根据你希望工具替你决定多少来挑选。上面的 repository/service/controller 分层结构，无论背后用哪个 ORM 都一样适用。</Zh>
        </p>

        <h4 className="topic"><En>Service — where business rules live</En><Zh>Service — 业务规则的所在</Zh></h4>
        <p>
          <En>A service is the one place workflow rules, validation and multi-repository orchestration
          live — not scattered across controllers:</En>
          <Zh>service 是工作流规则、数据校验和跨 repository 协调的唯一归宿——而不是分散在各个 controller 里：</Zh>
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
          <En>No <code>req</code>/<code>res</code>, no SQL — just the rules a repository can't know on
          its own.</En>
          <Zh>没有 <code>req</code>/<code>res</code>，没有 SQL——只有 repository 无法自行判断的业务规则。</Zh>
        </p>

        <h4 className="topic"><En>Controller — handling request and response</En><Zh>Controller — 处理请求与响应</Zh></h4>
        <p>
          <En>The controller's whole job: read what's on the request — params, query, body, headers —
          call one service method, and send back a response with a status code and body:</En>
          <Zh>controller 的全部职责：读取请求上的信息——params、query、body、headers——调用一个 service 方法，然后返回带状态码和响应体的结果：</Zh>
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
          <En>Same four sources Day 11 covered — params/query/body/headers — just destructured once at
          the top of each method. A header (like Day 11's <code>Idempotency-Key</code>) is read the
          same way: <code>req.headers["idempotency-key"]</code>.</En>
          <Zh>同样是四个来源——params/query/body/headers——只在每个方法顶部解构一次。header（如 <code>Idempotency-Key</code>）的读取方式相同：<code>req.headers["idempotency-key"]</code>。</Zh>
        </p>

        <h4 className="topic"><En>Validating the body with Zod</En><Zh>用 Zod 校验请求体</Zh></h4>
        <p>
          <En>The <code>create</code> handler above just trusts that <code>req.body</code> is the right
          shape. Checking that by hand, one <code>if</code> per field, is what Day 11 did:</En>
          <Zh>上面的 <code>create</code> 处理器直接信任 <code>req.body</code> 的格式是对的。手动逐字段用 <code>if</code> 校验的方式如下：</Zh>
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
          <En>That's three fields. A real resource has ten, and every one of them needs its own{" "}
          <code>if</code>, its own message, and its own edge cases — an email format, a min length, a
          number that can't be negative. It scales linearly with every field and every rule, and it's
          easy to miss one.</En>
          <Zh>这里只有三个字段。真实的资源有十个，每一个都需要自己的 <code>if</code>、自己的错误信息和边界情况——邮箱格式、最小长度、不能为负数的数字。随着字段和规则增加，代码线性膨胀，而且很容易遗漏。</Zh>
        </p>
        <p>
          <En>A schema-validation library like <strong>Zod</strong> describes all of those rules once, as
          data, and either hands back a parsed, typed object or throws on your behalf:</En>
          <Zh>像 <strong>Zod</strong> 这样的 schema 校验库，只需声明一次所有规则，然后要么返回解析后的类型化对象，要么代你抛出错误：</Zh>
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
          <En>If you find yourself writing an <code>if</code> that checks a business condition inside a
          controller, that check belongs one layer down, in the service. Zod checks the request's{" "}
          <em>shape</em> ("is this even a valid product?") — not business rules like "does this SKU
          already exist," which is what the service is for.</En>
          <Zh>如果你在 controller 里写了检查业务条件的 <code>if</code>，那这个检查应该下移到 service 层。Zod 只检查请求的<em>格式</em>（"这是不是一个合法的 product？"）——"该 SKU 是否已存在"这样的业务规则是 service 的职责。</Zh>
        </p>

        <h4 className="topic"><En>Routes — wiring a URL + method to a controller method</En><Zh>Routes — 将 URL + 方法与 controller 方法绑定</Zh></h4>
        <p>
          <En>None of this runs until something tells Express which URL and HTTP method calls which
          controller method — that's a <strong>router</strong>. One per resource, mounted onto the
          app under that resource's path:</En>
          <Zh>在告诉 Express 哪个 URL + HTTP 方法对应哪个 controller 方法之前，上面的代码都不会运行——这就是 <strong>router</strong> 的作用。每个资源一个 router，挂载在对应的路径下：</Zh>
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
          <En>This is the piece outside the three layers, and the app can't run without it — the router
          is what turns a plain function into an actual endpoint a client can call.</En>
          <Zh>这是三层之外的部分，缺少它应用无法运行——router 把普通函数变成客户端可以调用的真实接口。</Zh>
        </p>

        <h4 className="topic"><En>Putting it together — the order status state machine</En><Zh>综合示例 — 订单状态机</Zh></h4>
        <p>
          <En>An order can't jump from <code>placed</code> straight to <code>delivered</code> — the
          allowed transitions are a business rule, so they're encoded once, in the service, and every
          layer sticks to its own job:</En>
          <Zh>订单不能从 <code>placed</code> 直接跳到 <code>delivered</code>——允许的状态转换是业务规则，因此只在 service 里定义一次，每一层各司其职：</Zh>
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
          <p className="concept-label"><En>Concept — one request, top to bottom</En><Zh>概念 — 一个请求，从上到下</Zh></p>
          <ul>
            <li>
              <En>A client sends <code>PATCH /orders/4/status</code>. The router is what matches that
              path and method to <code>orderController.updateStatus</code> — nothing else in the app
              knows this route exists.</En>
              <Zh>客户端发送 <code>PATCH /orders/4/status</code>。router 将该路径和方法匹配到 <code>orderController.updateStatus</code>——应用中其他地方不知道这个路由的存在。</Zh>
            </li>
            <li>
              <En>The controller reads <code>req.params</code>/<code>req.body</code> and calls the
              service — it has no idea what a valid status transition even is.</En>
              <Zh>controller 读取 <code>req.params</code>/<code>req.body</code> 并调用 service——它完全不知道什么是合法的状态转换。</Zh>
            </li>
            <li>
              <En>The service checks the transition table and decides: no-op, invalid, or allowed — then
              calls the repository. It never touches <code>req</code>/<code>res</code> or SQL.</En>
              <Zh>service 检查转换表并决策：无操作、非法还是允许——然后调用 repository。它从不碰 <code>req</code>/<code>res</code> 或 SQL。</Zh>
            </li>
            <li>
              <En>The repository runs the query and returns a row. It never decides whether the
              transition was <em>allowed</em> — that decision was already made one layer up.</En>
              <Zh>repository 执行查询并返回行数据。它从不判断转换是否<em>允许</em>——那个决策已经在上一层做出了。</Zh>
            </li>
          </ul>
        </div>

        {/* ================================================================= */}
        {/* 2. Middleware                                                      */}
        {/* ================================================================= */}
        <h3><En>2. Middleware</En><Zh>2. Middleware</Zh></h3>
        <p>
          <En>A middleware is a function that runs <em>between</em> the request arriving and your route
          handler responding — <code>(req, res, next)</code>. It looks at the request, then either
          calls <code>next()</code> to let the next thing run, or sends a response itself and stops
          the chain right there.</En>
          <Zh>middleware 是在请求到达和路由处理器响应<em>之间</em>运行的函数——签名为 <code>(req, res, next)</code>。它检查请求，然后要么调用 <code>next()</code> 让下一个处理器继续，要么直接发送响应并终止链路。</Zh>
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
          <En>Skip <code>next()</code> and forget to send a response, and the request just hangs forever
          — nothing after it ever runs.</En>
          <Zh>如果既不调用 <code>next()</code> 又不发送响应，请求就会永远挂起——之后的任何处理都不会执行。</Zh>
        </p>
        <p>
          <En>This is how a real app handles things every route needs, without repeating the same code
          in every route handler:</En>
          <Zh>这就是真实应用处理所有路由共同需求的方式，无需在每个路由处理器里重复相同的代码：</Zh>
        </p>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Use case</En><Zh>使用场景</Zh></th>
              <th><En>What it does</En><Zh>作用</Zh></th>
              <th><En>Looks like</En><Zh>示例</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Logging</En><Zh>日志记录</Zh></td>
              <td><En>Records every request that comes in</En><Zh>记录每一个传入请求</Zh></td>
              <td><code>console.log(req.method, req.url); next();</code></td>
            </tr>
            <tr>
              <td><En>Authentication</En><Zh>身份认证</Zh></td>
              <td><En>Confirms <em>who</em> is making the request (e.g. checks a login token)</En><Zh>确认请求<em>是谁</em>发的（如校验登录 token）</Zh></td>
              <td><code>if (!isLoggedIn(req)) return res.sendStatus(401); next();</code></td>
            </tr>
            <tr>
              <td><En>Authorization</En><Zh>权限校验</Zh></td>
              <td><En>Confirms <em>what</em> that already-known user is allowed to do</En><Zh>确认已知用户<em>被允许</em>做什么</Zh></td>
              <td><code>if (req.user.role !== "admin") return res.sendStatus(403); next();</code></td>
            </tr>
            <tr>
              <td><En>Rate limiting</En><Zh>限流</Zh></td>
              <td><En>Rejects a client sending requests too fast</En><Zh>拒绝发送请求过快的客户端</Zh></td>
              <td><code>if (tooManyRequests(req.ip)) return res.sendStatus(429); next();</code></td>
            </tr>
            <tr>
              <td><En>Error handling</En><Zh>错误处理</Zh></td>
              <td><En>Catches an error thrown anywhere below it — covered next</En><Zh>捕获下方任何地方抛出的错误——见下一节</Zh></td>
              <td>↓ Section 3</td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <En><code>express.json()</code>, <code>cors()</code>, and rate limiters like{" "}
          <code>express-rate-limit</code> are middleware too — usually installed as a package
          instead of hand-written, but the pattern is exactly the same one above.</En>
          <Zh><code>express.json()</code>、<code>cors()</code> 以及 <code>express-rate-limit</code> 这样的限流库也是 middleware——通常作为包安装而非手写，但模式与上面完全相同。</Zh>
        </p>

        {/* ================================================================= */}
        {/* 3. Error handling                                                  */}
        {/* ================================================================= */}
        <h3><En>3. Centralized error handling</En><Zh>3. 集中错误处理</Zh></h3>
        <p>
          <En>Every layer above throws plain JavaScript errors — a small hierarchy of typed error
          classes, each carrying its own HTTP status code:</En>
          <Zh>上面每一层都抛出普通的 JavaScript 错误——一组小型的类型化错误类，每个都携带自己的 HTTP 状态码：</Zh>
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
        <p><En>One error-handling middleware, mounted once, turns any of those into a consistent JSON response:</En><Zh>一个错误处理 middleware，注册一次，将任何错误转为统一的 JSON 响应：</Zh></p>
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
          <En>A controller that throws inside an <code>async</code> function needs a small wrapper (or a
          <code>try</code>/<code>catch</code>) to forward that error to <code>next(err)</code> —
          Express doesn't catch it on its own, and without that forwarding it never reaches the
          error handler at all.</En>
          <Zh>在 <code>async</code> 函数内部抛出错误的 controller，需要一个小包装器（或 <code>try</code>/<code>catch</code>）来把错误转发给 <code>next(err)</code>——Express 不会自动捕获，如果不转发，错误永远到不了错误处理 middleware。</Zh>
        </p>

        <div className="concept">
          <p className="concept-label"><En>Summary — say this in an interview</En><Zh>总结 — 面试时这样说</Zh></p>
          <ul>
            <li>
              <En>Every kind of failure gets its own small error class, and each one already knows its
              own HTTP status code — a missing order is a <code>NotFoundError</code>, which is always{" "}
              <code>404</code>.</En>
              <Zh>每种失败都有自己的错误类，每个类自带对应的 HTTP 状态码——找不到订单就是 <code>NotFoundError</code>，永远是 <code>404</code>。</Zh>
            </li>
            <li>
              <En>Anywhere in the app — almost always the service layer — a failure is signaled by{" "}
              <em>throwing</em> one of those errors, not by returning <code>null</code> or{" "}
              <code>false</code> and checking for it everywhere.</En>
              <Zh>应用中任何地方——几乎总是在 service 层——失败通过<em>抛出</em>对应错误来表示，而不是返回 <code>null</code> 或 <code>false</code> 后到处检查。</Zh>
            </li>
            <li>
              <En>One special middleware is registered last, after every route. Express recognizes it as
              an error handler specifically because it takes <strong>four</strong> parameters (
              <code>err, req, res, next</code>) instead of three.</En>
              <Zh>一个特殊的 middleware 注册在最后，位于所有路由之后。Express 能识别它是错误处理器，因为它接收<strong>四个</strong>参数（<code>err, req, res, next</code>）而不是三个。</Zh>
            </li>
            <li>
              <En>When something throws, Express skips every remaining route and jumps straight to that
              one error handler — no matter which route or service caused it.</En>
              <Zh>当某处抛出错误时，Express 跳过所有剩余路由，直接跳转到那个错误处理器——无论是哪个路由或 service 引起的。</Zh>
            </li>
            <li>
              <En>That handler looks at what kind of error it got, and turns it into one consistent JSON
              response: the right status code, a clear message, and nothing internal (like a raw
              stack trace) leaking out.</En>
              <Zh>该处理器检查错误类型，将其转为统一的 JSON 响应：正确的状态码、清晰的消息，不泄露任何内部细节（如原始堆栈跟踪）。</Zh>
            </li>
          </ul>
        </div>

        {/* ================================================================= */}
        {/* 4. Redis caching                                                   */}
        {/* ================================================================= */}
        <h3><En>4. Cache-aside with Redis</En><Zh>4. 用 Redis 实现 cache-aside</Zh></h3>
        <p>
          <En>Product data is read constantly and changes rarely — a good caching candidate. The{" "}
          <strong>cache-aside</strong> pattern: check the cache first, fall back to the repository on
          a miss, populate the cache on the way out, with an expiry so a stale value can't live
          forever:</En>
          <Zh>商品数据频繁读取、极少变更——是理想的缓存对象。<strong>cache-aside</strong> 模式：先查缓存，缓存未命中则回退到 repository，查询结果写入缓存并设置过期时间，防止旧数据永久存在：</Zh>
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
              <th><En>Piece</En><Zh>代码片段</Zh></th>
              <th><En>What it demonstrates</En><Zh>说明</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>redis.get(cacheKey(id))</code></td>
              <td><En>Check the cache before touching the database at all</En><Zh>在访问数据库之前先查缓存</Zh></td>
            </tr>
            <tr>
              <td><code>productRepository.findById(id)</code></td>
              <td><En>The service still calls the repository on a miss — the repository never knows caching exists</En><Zh>缓存未命中时 service 仍调用 repository——repository 完全不知道缓存的存在</Zh></td>
            </tr>
            <tr>
              <td><code>"EX", TTL_SECONDS</code></td>
              <td><En>An expiry as a safety net, independent of explicit invalidation</En><Zh>过期时间作为安全兜底，与主动失效相互独立</Zh></td>
            </tr>
            <tr>
              <td><code>redis.del(cacheKey(id))</code> in <code>updateProduct</code></td>
              <td><En>Invalidate on write so a price change is never served stale from cache</En><Zh>写入时主动失效，确保价格变更不会从缓存中返回旧值</Zh></td>
            </tr>
          </tbody>
        </table>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li><En>Cache what's read far more than it's written — inventory counts change too fast to be a good fit; product catalog data is.</En><Zh>缓存读多写少的数据——库存数量变化太快不适合缓存；商品目录数据则很合适。</Zh></li>
            <li><En>Every cache read is a potential miss — the repository call underneath it must still exist and still work.</En><Zh>每次缓存读取都可能未命中——底层的 repository 调用必须始终存在且可用。</Zh></li>
            <li><En>An expiry (TTL) matters even with explicit invalidation — it's what limits the damage of an invalidation bug you haven't found yet.</En><Zh>即使有主动失效，过期时间（TTL）依然重要——它限制了你尚未发现的失效 bug 所造成的损害。</Zh></li>
          </ul>
        </div>
      </section>
    </div>
  );
}
