import { Link } from "react-router-dom";
import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { En, Zh } from "../../components/Lang";

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 12 Notes</title>
      <DayNav day="day12-relational-databases" current="notes" />

      <header className="lecture-header">
        <p className="eyebrow">Week 3 · Day 12 · Notes</p>
        <h1><En>Relational Databases</En><Zh>关系型数据库</Zh></h1>
        <p className="subtitle"><En>Executive summary → full walkthrough</En><Zh>核心摘要 → 完整讲解</Zh></p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2><En>Section 1 — Executive Summary</En><Zh>第一节 — 核心摘要</Zh></h2>
        <p><En>The essentials — what you must be able to do by the end of today:</En><Zh>核心要点——今天结束时你必须能做到的：</Zh></p>

        <p className="compare-label"><En>Write — hands on the keyboard</En><Zh>动手写——实际操作</Zh></p>
        <ul>
          <li>
            <En>Write a query with <code>SELECT</code> / <code>FROM</code> /{" "}
            <code>WHERE</code> / <code>ORDER BY</code> / <code>LIMIT</code></En>
            <Zh>使用 <code>SELECT</code> / <code>FROM</code> / <code>WHERE</code> / <code>ORDER BY</code> / <code>LIMIT</code> 编写查询</Zh>
          </li>
          <li>
            <En>Write the simplest <code>LEFT JOIN</code> — two tables, one{" "}
            <code>ON</code> condition</En>
            <Zh>编写最简单的 <code>LEFT JOIN</code>——两张表，一个 <code>ON</code> 条件</Zh>
          </li>
          <li>
            <En>Write basic CRUD SQL (<code>SELECT</code>/<code>INSERT</code>/
            <code>UPDATE</code>/<code>DELETE</code>) against a real table</En>
            <Zh>对真实表执行基础 CRUD SQL（<code>SELECT</code>/<code>INSERT</code>/<code>UPDATE</code>/<code>DELETE</code>）</Zh>
          </li>
          <li>
            <En>Aggregate with <code>COUNT</code>/<code>SUM</code>/<code>AVG</code>{" "}
            plus <code>GROUP BY</code></En>
            <Zh>使用 <code>COUNT</code>/<code>SUM</code>/<code>AVG</code> 和 <code>GROUP BY</code> 做聚合</Zh>
          </li>
        </ul>

        <p className="compare-label"><En>Explain — out loud, no editor needed</En><Zh>口头解释——不需要编辑器</Zh></p>
        <ul>
          <li>
            <En>Read a table schema and say what each column and each constraint is
            there for</En>
            <Zh>读懂表结构，说出每一列和每个约束的用途</Zh>
          </li>
          <li>
            <En>Point at a foreign key and say which two tables it links, and which
            side holds it</En>
            <Zh>指出外键，说明它连接的两张表以及哪一侧持有它</Zh>
          </li>
          <li>
            <En>Explain why a query built by string concatenation is open to SQL
            injection, and how a parameterized query closes it</En>
            <Zh>解释为什么字符串拼接构造的查询存在 SQL 注入风险，以及参数化查询如何解决这个问题</Zh>
          </li>
          <li>
            <En>Say what each of the four <strong>ACID</strong> guarantees means,
            and give a simple example of each</En>
            <Zh>说出 <strong>ACID</strong> 四个保证各自的含义，并各举一个简单例子</Zh>
          </li>
          <li><En>Explain what normalization is and what problem it solves</En><Zh>解释什么是范式化（normalization）及它解决了什么问题</Zh></li>
          <li><En>Say what a stored procedure is</En><Zh>说出存储过程（stored procedure）是什么</Zh></li>
        </ul>
        <p>
          <En>Want more?{" "}
          <Link to="/week3/day12-relational-databases/concepts">
            View all concepts?
          </Link></En>
          <Zh>想了解更多？{" "}
          <Link to="/week3/day12-relational-databases/concepts">
            查看所有概念
          </Link></Zh>
        </p>
      </section>

      <hr className="section-divider" />

      <section id="full-walkthrough">
        <h2><En>Section 2 — Full Walkthrough</En><Zh>第二节 — 完整讲解</Zh></h2>
        <p className="callout">
          <En>Today is the high-level pass: enough SQL to build this project. The
          full reference — every join, every data type, window functions,
          isolation levels — is{" "}
          <Link to="/additional/backend/full-sql/foundation">
            Full SQL · Foundation
          </Link>
          .</En>
          <Zh>今天只讲高层次概述：足够完成本项目的 SQL。完整参考——每种 join、每种数据类型、窗口函数、隔离级别——见{" "}
          <Link to="/additional/backend/full-sql/foundation">
            Full SQL · Foundation
          </Link>。</Zh>
        </p>

        <h3><En>2.1 Where the data actually lives</En><Zh>2.1 数据实际存放在哪里</Zh></h3>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Term</En><Zh>术语</Zh></th>
              <th><En>What it is</En><Zh>含义</Zh></th>
              <th><En>In this project</En><Zh>本项目中</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Database</En><Zh>数据库（Database）</Zh></td>
              <td>
                <En>The top-level container; one connection targets one database</En>
                <Zh>顶层容器；一个连接对应一个数据库</Zh>
              </td>
              <td>
                <code>oms</code>
              </td>
            </tr>
            <tr>
              <td><En>Schema</En><Zh>模式（Schema）</Zh></td>
              <td>
                <En>A namespace for tables inside it (Postgres defaults to{" "}
                <code>public</code>)</En>
                <Zh>表的命名空间（Postgres 默认为 <code>public</code>）</Zh>
              </td>
              <td>
                <code>public</code>
              </td>
            </tr>
            <tr>
              <td><En>Table</En><Zh>表（Table）</Zh></td>
              <td><En>One entity type — columns are its shape</En><Zh>一种实体类型，列定义其结构</Zh></td>
              <td>
                <code>orders</code>, <code>products</code>
              </td>
            </tr>
            <tr>
              <td><En>Row / column</En><Zh>行 / 列</Zh></td>
              <td><En>One record / one typed field of every record</En><Zh>一条记录 / 每条记录的一个类型字段</Zh></td>
              <td>
                Order #4012 / <code>orders.status</code>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <En>The database is a <strong>separate server process</strong> — your
              Express app talks to it over TCP, so every query is a network
              round trip. That single fact drives most of Day 14.</En>
              <Zh>数据库是一个<strong>独立的服务器进程</strong>——你的 Express 应用通过 TCP 与它通信，因此每次查询都是一次网络往返。这一点是性能优化的核心依据。</Zh>
            </li>
            <li>
              <En>SQL is <strong>declarative</strong>: you describe the result, and
              the query planner decides how to get it. You never write the loop.</En>
              <Zh>SQL 是<strong>声明式</strong>的：你描述想要的结果，查询规划器决定如何获取。你不需要写循环。</Zh>
            </li>
            <li>
              <En>Everything here is PostgreSQL. MySQL and SQL Server share most of
              the syntax and differ on the edges.</En>
              <Zh>本课程使用 PostgreSQL。MySQL 和 SQL Server 与其共享大部分语法，细节上有所差异。</Zh>
            </li>
          </ul>
        </div>

        <h3><En>2.2 The schema we're building</En><Zh>2.2 我们要构建的数据库结构</Zh></h3>
        <p>
          <En>Starting today, this is the real relational schema for the Order
          Management &amp; Fulfillment platform this whole course builds toward
          — every day from here on adds to it.</En>
          <Zh>从今天起，这是整个课程所构建的订单管理与履约平台的真实关系型数据库结构——之后每天都会在此基础上继续扩展。</Zh>
        </p>
        <CodeBlock
          language="sql"
          code={`CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  region VARCHAR(80) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('retail', 'fulfillment_center'))
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  price_cents INTEGER NOT NULL
);

CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  store_id INTEGER NOT NULL REFERENCES stores(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity_on_hand INTEGER NOT NULL DEFAULT 0,
  quantity_reserved INTEGER NOT NULL DEFAULT 0,
  UNIQUE (store_id, product_id),
  CHECK (quantity_reserved <= quantity_on_hand)  -- can never reserve more than physically exists
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  store_id INTEGER REFERENCES stores(id),
  status VARCHAR(20) NOT NULL DEFAULT 'placed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL
);

CREATE TABLE order_status_history (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  from_status VARCHAR(20),
  to_status VARCHAR(20) NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);`}
        />

        <h3><En>2.3 Data types — picking the column</En><Zh>2.3 数据类型——如何选择列类型</Zh></h3>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Category</En><Zh>类别</Zh></th>
              <th><En>Types</En><Zh>类型</Zh></th>
              <th><En>Use</En><Zh>使用场景</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Numeric</En><Zh>数值</Zh></td>
              <td>
                <code>INTEGER</code>, <code>BIGINT</code>,{" "}
                <code>DECIMAL(p,s)</code>, <code>REAL</code>
              </td>
              <td>
                <En><code>INTEGER</code> for ids and counts, <code>DECIMAL</code>{" "}
                for exact money, never a float for money</En>
                <Zh><code>INTEGER</code> 用于 id 和计数，<code>DECIMAL</code> 用于精确金额，金额永远不用浮点数</Zh>
              </td>
            </tr>
            <tr>
              <td><En>String</En><Zh>字符串</Zh></td>
              <td>
                <code>VARCHAR(n)</code>, <code>TEXT</code>, <code>CHAR(n)</code>
              </td>
              <td>
                <En><code>VARCHAR(n)</code> when the limit is a real rule,{" "}
                <code>TEXT</code> for free-form; <code>CHAR</code> pads with
                spaces — avoid</En>
                <Zh><code>VARCHAR(n)</code> 用于有实际长度限制的字段，<code>TEXT</code> 用于自由格式；<code>CHAR</code> 会补空格——避免使用</Zh>
              </td>
            </tr>
            <tr>
              <td><En>Date / time</En><Zh>日期 / 时间</Zh></td>
              <td>
                <code>DATE</code>, <code>TIME</code>, <code>TIMESTAMPTZ</code>,{" "}
                <code>INTERVAL</code>
              </td>
              <td>
                <En><code>TIMESTAMPTZ</code> by default — plain{" "}
                <code>TIMESTAMP</code> is an ambiguous wall clock</En>
                <Zh>默认使用 <code>TIMESTAMPTZ</code>——普通 <code>TIMESTAMP</code> 不含时区信息，容易产生歧义</Zh>
              </td>
            </tr>
            <tr>
              <td><En>Boolean</En><Zh>布尔值</Zh></td>
              <td>
                <code>BOOLEAN</code>
              </td>
              <td>
                <En>Three states, not two: <code>TRUE</code>, <code>FALSE</code>,{" "}
                <code>NULL</code></En>
                <Zh>三种状态，不是两种：<code>TRUE</code>、<code>FALSE</code>、<code>NULL</code></Zh>
              </td>
            </tr>
            <tr>
              <td>JSON</td>
              <td>
                <code>JSONB</code>
              </td>
              <td>
                <En>Genuinely variable data only — it's an escape hatch, not a
                schema substitute</En>
                <Zh>仅用于真正灵活的数据——它是最后的手段，不是结构化设计的替代品</Zh>
              </td>
            </tr>
            <tr>
              <td>Id</td>
              <td>
                <code>SERIAL</code> / <code>UUID</code>
              </td>
              <td>
                <En><code>SERIAL</code> unless ids must be generated outside the
                database or must not leak volume</En>
                <Zh>优先用 <code>SERIAL</code>，除非 id 必须在数据库外生成或不能暴露数据量</Zh>
              </td>
            </tr>
          </tbody>
        </table>
        <CodeBlock
          language="sql"
          bad={[2]}
          good={[3]}
          code={`-- why money is never a float
SELECT 0.1::REAL + 0.2::REAL = 0.3::REAL;   -- false — binary float can't represent 0.1
SELECT 1299 + 250;                          -- integer cents: exact, and what this course uses`}
        />

        <h3><En>2.4 Constraints — rules the database enforces, not your app</En><Zh>2.4 约束——数据库强制执行的规则，而非应用层</Zh></h3>
        <p>
          <En>App-level validation can be bypassed by another service, a script, or
          someone in <code>psql</code>. A constraint cannot.</En>
          <Zh>应用层校验可以被其他服务、脚本或直接操作 <code>psql</code> 的人绕过。约束则不行。</Zh>
        </p>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Constraint</En><Zh>约束</Zh></th>
              <th><En>Guarantees</En><Zh>保证</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>PRIMARY KEY</code>
              </td>
              <td>
                <En>Identifies the row uniquely; implies <code>NOT NULL</code> +{" "}
                <code>UNIQUE</code></En>
                <Zh>唯一标识一行；隐含 <code>NOT NULL</code> + <code>UNIQUE</code></Zh>
              </td>
            </tr>
            <tr>
              <td>
                <code>REFERENCES</code> (foreign key)
              </td>
              <td><En>The row it points at exists — no orphan order items</En><Zh>它指向的行必须存在——不会有孤立的订单条目</Zh></td>
            </tr>
            <tr>
              <td>
                <code>NOT NULL</code>
              </td>
              <td><En>The column always has a value</En><Zh>该列始终有值</Zh></td>
            </tr>
            <tr>
              <td>
                <code>UNIQUE</code>
              </td>
              <td>
                <En>No two rows share the value — one inventory row per (store,
                product)</En>
                <Zh>没有两行共享同一值——每个（门店, 商品）组合只有一条库存记录</Zh>
              </td>
            </tr>
            <tr>
              <td>
                <code>CHECK</code>
              </td>
              <td>
                <En>An arbitrary per-row rule, e.g. <code>quantity &gt; 0</code></En>
                <Zh>针对每行的任意规则，例如 <code>quantity &gt; 0</code></Zh>
              </td>
            </tr>
            <tr>
              <td>
                <code>DEFAULT</code>
              </td>
              <td>
                <En>Not a constraint — the value used when the column is omitted</En>
                <Zh>不是约束——是列被省略时使用的默认值</Zh>
              </td>
            </tr>
          </tbody>
        </table>
        <CodeBlock
          language="plaintext"
          code={`ON DELETE CASCADE    -- deleting the order deletes its items (order_items)
ON DELETE RESTRICT   -- refuse to delete a product any order still references (products)`}
        />
        <p className="callout">
          <En><code>CASCADE</code> on order items is right — a line item is
          meaningless without its order. <code>RESTRICT</code> on products is
          right too: deleting a product that appears in past orders would
          destroy financial history.</En>
          <Zh>订单条目用 <code>CASCADE</code> 是合理的——没有订单的条目毫无意义。商品用 <code>RESTRICT</code> 也是合理的：删除出现在历史订单中的商品会破坏财务记录。</Zh>
        </p>

        <h3><En>2.5 The shape of a query</En><Zh>2.5 查询的结构</Zh></h3>
        <CodeBlock
          language="sql"
          code={`SELECT   store_id, COUNT(*) AS order_count      -- 5. which columns come out
FROM     orders                                 -- 1. which table
WHERE    created_at > now() - INTERVAL '30 days' -- 2. which rows survive
GROUP BY store_id                               -- 3. how rows collapse into groups
HAVING   COUNT(*) > 10                          -- 4. which groups survive
ORDER BY order_count DESC                       -- 6. how the output is sorted
LIMIT    5;                                     -- 7. how many rows come back`}
        />
        <div className="concept">
          <p className="concept-label">
            <En>Concept — written order is not execution order</En>
            <Zh>概念——书写顺序不等于执行顺序</Zh>
          </p>
          <ul>
            <li>
              <En><code>WHERE</code> runs before grouping, so it filters{" "}
              <em>rows</em>. <code>HAVING</code> runs after, so it filters{" "}
              <em>groups</em>. That's the whole difference.</En>
              <Zh><code>WHERE</code> 在分组前执行，过滤<em>行</em>。<code>HAVING</code> 在分组后执行，过滤<em>组</em>。这就是两者的全部区别。</Zh>
            </li>
            <li>
              <En><code>SELECT</code> runs after <code>GROUP BY</code> — which is
              why every selected column must be grouped or aggregated.</En>
              <Zh><code>SELECT</code> 在 <code>GROUP BY</code> 之后执行——因此每个被选中的列必须参与分组或聚合。</Zh>
            </li>
            <li>
              <En><code>SELECT</code> runs before <code>ORDER BY</code> — which is
              why <code>ORDER BY order_count</code> can use the alias and{" "}
              <code>WHERE</code> cannot.</En>
              <Zh><code>SELECT</code> 在 <code>ORDER BY</code> 之前执行——因此 <code>ORDER BY order_count</code> 可以使用别名，而 <code>WHERE</code> 不能。</Zh>
            </li>
            <li>
              <En><code>LIMIT</code> runs last. It never makes the underlying work
              smaller by itself.</En>
              <Zh><code>LIMIT</code> 最后执行。它本身不会减少底层的工作量。</Zh>
            </li>
          </ul>
        </div>

        <h3><En>2.6 CRUD SQL</En><Zh>2.6 CRUD SQL</Zh></h3>
        <CodeBlock
          language="sql"
          code={`INSERT INTO products (sku, name, price_cents)
VALUES ('MUG-001', 'Ceramic Mug', 1299)
RETURNING id;                      -- get the generated id back without a second query

SELECT id, name, price_cents FROM products WHERE price_cents < 1500;

UPDATE products SET price_cents = 1499 WHERE sku = 'MUG-001';

DELETE FROM products WHERE id = 4;`}
        />
        <CodeBlock
          language="sql"
          bad={[2]}
          good={[3]}
          code={`-- the most expensive typo in SQL
UPDATE orders SET status = 'shipped';                  -- no WHERE: every order in the table
UPDATE orders SET status = 'shipped' WHERE id = 4012;  -- one row`}
        />
        <p className="callout">
          <En>Habit worth building today: write it as a <code>SELECT</code> with the
          same <code>WHERE</code> first, check the row count, then swap in{" "}
          <code>UPDATE</code>/<code>DELETE</code>.</En>
          <Zh>今天就要养成的习惯：先用相同的 <code>WHERE</code> 写一个 <code>SELECT</code>，确认行数，再换成 <code>UPDATE</code>/<code>DELETE</code>。</Zh>
        </p>

        <h3><En>2.7 Filtering, sorting, limiting</En><Zh>2.7 筛选、排序、限制</Zh></h3>
        <CodeBlock
          language="sql"
          code={`SELECT id, status, created_at
FROM orders
WHERE status IN ('placed', 'routed')          -- one of a set
  AND created_at BETWEEN '2026-01-01' AND '2026-01-31'
  AND store_id IS NOT NULL                    -- NULL needs IS, never =
ORDER BY created_at DESC, id DESC             -- second key breaks ties deterministically
LIMIT 20 OFFSET 40;                           -- rows 41-60`}
        />
        <div className="concept">
          <p className="concept-label">
            <En>Concept — NULL means "unknown", and it poisons comparisons</En>
            <Zh>概念——NULL 表示"未知"，会污染比较运算</Zh>
          </p>
          <ul>
            <li>
              <En>Any comparison with <code>NULL</code> returns <code>NULL</code>,
              not true or false — so <code>WHERE store_id = NULL</code> matches
              nothing, ever.</En>
              <Zh>任何与 <code>NULL</code> 的比较都返回 <code>NULL</code>，而不是 true 或 false——因此 <code>WHERE store_id = NULL</code> 永远匹配不到任何行。</Zh>
            </li>
            <li>
              <En><code>IS NULL</code> / <code>IS NOT NULL</code> are the only
              operators that test for it.</En>
              <Zh><code>IS NULL</code> / <code>IS NOT NULL</code> 是唯一能检测 NULL 的运算符。</Zh>
            </li>
            <li>
              <En><code>WHERE status &lt;&gt; 'cancelled'</code> silently drops rows
              where <code>status</code> is NULL — "unknown is not cancelled" is
              itself unknown, and unknown doesn't survive a <code>WHERE</code>.</En>
              <Zh><code>WHERE status &lt;&gt; 'cancelled'</code> 会悄悄过滤掉 <code>status</code> 为 NULL 的行——"未知是否等于 cancelled"本身也是未知，而未知值无法通过 <code>WHERE</code>。</Zh>
            </li>
            <li>
              <En><code>AND</code> binds tighter than <code>OR</code>. Parenthesize
              whenever you mix them.</En>
              <Zh><code>AND</code> 的优先级高于 <code>OR</code>。混用时请加括号。</Zh>
            </li>
          </ul>
        </div>
        <p className="callout">
          <En>Without <code>ORDER BY</code>, row order is undefined and changes when
          the plan changes — so paginating an unordered query silently skips and
          repeats rows.</En>
          <Zh>没有 <code>ORDER BY</code> 时，行的顺序是不确定的，执行计划变化时顺序也会变——对无序查询分页会悄悄跳过或重复行。</Zh>
        </p>

        <h3><En>2.8 Aggregates and GROUP BY</En><Zh>2.8 聚合与 GROUP BY</Zh></h3>
        <CodeBlock
          language="sql"
          code={`-- revenue per store, busiest first, stores with fewer than 10 orders excluded
SELECT s.name,
       COUNT(*) AS order_count,
       SUM(oi.quantity * oi.unit_price_cents) AS revenue_cents
FROM orders o
JOIN stores s ON s.id = o.store_id
JOIN order_items oi ON oi.order_id = o.id
WHERE o.status <> 'cancelled'      -- filters ROWS, before grouping
GROUP BY s.id, s.name
HAVING COUNT(*) >= 10              -- filters GROUPS, after aggregating
ORDER BY revenue_cents DESC;`}
        />
        <p>
          <En><code>COUNT(*)</code> counts rows; <code>COUNT(col)</code> counts
          non-NULL values of that column; <code>SUM</code> and <code>AVG</code>{" "}
          skip NULLs rather than treating them as zero.</En>
          <Zh><code>COUNT(*)</code> 统计行数；<code>COUNT(col)</code> 统计该列非 NULL 的值；<code>SUM</code> 和 <code>AVG</code> 会跳过 NULL，而不是把它当零处理。</Zh>
        </p>

        <h3><En>2.9 Relationships</En><Zh>2.9 表关系</Zh></h3>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Shape</En><Zh>类型</Zh></th>
              <th><En>Where the key goes</En><Zh>外键位置</Zh></th>
              <th><En>In this project</En><Zh>本项目中</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>One-to-one</En><Zh>一对一</Zh></td>
              <td>
                <En>Foreign key on either side, made <code>PRIMARY KEY</code> or{" "}
                <code>UNIQUE</code></En>
                <Zh>外键在任意一侧，设为 <code>PRIMARY KEY</code> 或 <code>UNIQUE</code></Zh>
              </td>
              <td><En>A customer and their billing details</En><Zh>客户与其账单信息</Zh></td>
            </tr>
            <tr>
              <td><En>One-to-many</En><Zh>一对多</Zh></td>
              <td>
                <En>Foreign key on the <em>many</em> side</En>
                <Zh>外键在<em>多</em>的一侧</Zh>
              </td>
              <td>
                <code>orders.customer_id</code>,{" "}
                <code>order_items.order_id</code>
              </td>
            </tr>
            <tr>
              <td><En>Many-to-many</En><Zh>多对多</Zh></td>
              <td><En>A third join table holding both keys</En><Zh>第三张关联表同时持有两个外键</Zh></td>
              <td>
                <code>inventory</code> (stores ↔ products)
              </td>
            </tr>
          </tbody>
        </table>
        <CodeBlock
          language="plaintext"
          code={`-- one-to-many: the "many" side holds the key
orders.customer_id  -> customers.id

-- many-to-many: neither side can hold it, so a join table does
inventory (store_id, product_id, quantity_on_hand)`}
        />
        <p className="callout">
          <En>A join table that carries extra columns (<code>quantity_on_hand</code>
          ) is an entity in its own right — which is why it's called{" "}
          <code>inventory</code>, not <code>store_products</code>.</En>
          <Zh>携带额外列（如 <code>quantity_on_hand</code>）的关联表本身就是一个实体——这就是为什么它叫 <code>inventory</code>，而不是 <code>store_products</code>。</Zh>
        </p>

        <h3><En>2.10 Joins</En><Zh>2.10 连接（Joins）</Zh></h3>
        <p>
          <En>A join matches rows from two tables on a condition. What happens when
          there's <em>no</em> match is the only real difference between the
          types.</En>
          <Zh>JOIN 按条件匹配两张表的行。当<em>没有</em>匹配时的处理方式，是各种 join 类型之间唯一真正的区别。</Zh>
        </p>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Join</th>
              <th><En>Keeps</En><Zh>保留</Zh></th>
              <th><En>Question it answers</En><Zh>回答的问题</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>INNER JOIN</code>
              </td>
              <td><En>Only rows matched on both sides</En><Zh>仅保留两侧都匹配的行</Zh></td>
              <td><En>"Orders and the customer who placed them"</En><Zh>"订单及下单客户"</Zh></td>
            </tr>
            <tr>
              <td>
                <code>LEFT JOIN</code>
              </td>
              <td><En>All left rows; right columns NULL where unmatched</En><Zh>保留左侧所有行；右侧未匹配时列为 NULL</Zh></td>
              <td><En>"Every customer, with their order count — zero included"</En><Zh>"所有客户及其订单数——包括零单"</Zh></td>
            </tr>
            <tr>
              <td>
                <code>RIGHT JOIN</code>
              </td>
              <td><En>Mirror of LEFT</En><Zh>LEFT JOIN 的镜像</Zh></td>
              <td><En>Rare — swap the tables and use LEFT</En><Zh>少用——交换表顺序改用 LEFT 即可</Zh></td>
            </tr>
            <tr>
              <td>
                <code>FULL OUTER JOIN</code>
              </td>
              <td><En>All rows from both sides</En><Zh>保留两侧所有行</Zh></td>
              <td><En>"Reconcile two systems"</En><Zh>"核对两个系统的数据"</Zh></td>
            </tr>
          </tbody>
        </table>
        <CodeBlock
          language="sql"
          code={`-- 2 tables: every order alongside its customer's name
SELECT orders.id, customers.name, orders.status
FROM orders
INNER JOIN customers ON orders.customer_id = customers.id
WHERE orders.status = 'routed';`}
        />
        <CodeBlock
          language="sql"
          code={`-- 3 tables: what's actually in one order
SELECT orders.id AS order_id, products.name, order_items.quantity, order_items.unit_price_cents
FROM orders
INNER JOIN order_items ON order_items.order_id = orders.id
INNER JOIN products ON products.id = order_items.product_id
WHERE orders.id = 1;`}
        />
        <CodeBlock
          language="sql"
          code={`-- LEFT JOIN + IS NULL = "the rows with no match": customers who have never ordered
SELECT c.id, c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;`}
        />
        <p className="callout">
          <En>On a <code>LEFT JOIN</code>, a condition on the right table belongs in{" "}
          <code>ON</code>, not <code>WHERE</code> — in <code>WHERE</code> it
          deletes the unmatched NULL rows and silently turns the query back into
          an inner join.</En>
          <Zh><code>LEFT JOIN</code> 中，针对右表的过滤条件应放在 <code>ON</code> 里，而不是 <code>WHERE</code> 里——放在 <code>WHERE</code> 会删掉未匹配的 NULL 行，悄悄把查询变成 inner join。</Zh>
        </p>

        <h3><En>2.11 Parameterized queries &amp; SQL injection</En><Zh>2.11 参数化查询与 SQL 注入</Zh></h3>
        <p>
          <En><strong>Problem:</strong> building a query by pasting user input straight into the SQL
          string lets that input change what the query does, not just what it searches for.</En>
          <Zh><strong>问题：</strong>把用户输入直接拼接到 SQL 字符串中，会让输入改变查询的行为，而不只是改变搜索内容。</Zh>
        </p>
        <CodeBlock
          language="typescript"
          bad={[3]}
          code={`// user types this into the email field:  ' OR '1'='1
const email = req.body.email;
const { rows } = await pool.query(\`SELECT * FROM customers WHERE email = '\${email}'\`);
// runs: SELECT * FROM customers WHERE email = '' OR '1'='1'
// -- matches EVERY row in the table, not the one customer that was asked for`}
        />
        <p className="callout">
          <En>A more destructive input — <code>'; DROP TABLE customers; --</code> — works the same
          way. The database can't tell SQL you wrote from SQL a user typed once they're pasted
          into the same string.</En>
          <Zh>更具破坏性的输入——<code>'; DROP TABLE customers; --</code>——同样有效。一旦拼接进同一个字符串，数据库无法区分你写的 SQL 和用户输入的 SQL。</Zh>
        </p>
        <p>
          <En><strong>Solution:</strong> a parameterized query. The value travels to the database
          separately from the SQL text, so it can never be interpreted as SQL:</En>
          <Zh><strong>解决方案：</strong>使用参数化查询。值与 SQL 文本分开传送到数据库，因此永远不会被解析为 SQL：</Zh>
        </p>
        <CodeBlock
          language="typescript"
          good={[2]}
          code={`const email = req.body.email;
const { rows } = await pool.query('SELECT * FROM customers WHERE email = $1', [email]);
// Postgres parses "WHERE email = $1" first — $1 can only ever be a value, never more SQL`}
        />
        <p className="callout">
          <En>An ORM (Day 13) builds parameterized queries under the hood for every normal call, so
          writing ordinary ORM code already gets this for free. The one place it still bites: an
          ORM's raw/unsafe escape hatch for building a query string by hand — use it only for
          values you wrote yourself, never for user input.</En>
          <Zh>ORM（见第 13 天）在每次普通调用时都会在底层构建参数化查询，因此写普通 ORM 代码已经自动获得这个保护。唯一的风险在于：ORM 的 raw/unsafe 原始查询逃生口——仅对你自己写的值使用，绝不用于用户输入。</Zh>
        </p>

        <h3><En>2.12 Normalization</En><Zh>2.12 范式化（Normalization）</Zh></h3>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <En><strong>Normalization</strong> just means organizing tables so every
          fact lives in exactly one place — never repeating the same value
          across rows just because two things happened to occur together. 1NF,
          2NF, and 3NF are three increasingly strict versions of that one idea:</En>
          <Zh><strong>范式化</strong>就是组织表结构，让每个事实只存在于一个地方——不因两件事碰巧同时发生就在多行中重复同一个值。1NF、2NF、3NF 是同一理念的三个递进版本：</Zh>
        </div>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <En>1NF — every column holds one atomic value, no repeating groups in
              a single cell.</En>
              <Zh>1NF——每列只存一个原子值，单元格中不能有重复组。</Zh>
            </li>
            <li>
              <En>2NF — every non-key column depends on the whole primary key, not
              just part of it.</En>
              <Zh>2NF——每个非键列依赖于整个主键，而不仅仅是主键的一部分。</Zh>
            </li>
            <li>
              <En>3NF — every non-key column depends only on the key, not on another
              non-key column (no transitive dependencies).</En>
              <Zh>3NF——每个非键列只依赖于键，而不依赖于其他非键列（无传递依赖）。</Zh>
            </li>
            <li>
              <En>The schema above is already normalized this way: a product's name
              and price live once, in <code>products</code> — not copied onto
              every <code>order_items</code> row.</En>
              <Zh>上面的数据库结构已经按此方式范式化：商品名称和价格只存在于 <code>products</code> 表中一次，而不是复制到每一行 <code>order_items</code>。</Zh>
            </li>
          </ul>
        </div>

        <p>
          <En>One example, carried through all three steps — starting from a single
          wide table and fixing one dependency at a time:</En>
          <Zh>一个贯穿三个步骤的例子——从一张宽表开始，逐步修复每一个依赖问题：</Zh>
        </p>

        <p>
          <En><strong>Before</strong> — everything crammed into one table. Order 1
          has two items; order 2 reorders the same product from the same store:</En>
          <Zh><strong>初始状态</strong>——所有内容塞进一张表。订单 1 有两个条目；订单 2 从同一门店再次购买同一商品：</Zh>
        </p>
        <table className="example-table">
          <caption><En>Not normalized</En><Zh>未范式化</Zh></caption>
          <thead>
            <tr>
              <th>order_id</th>
              <th>store_id</th>
              <th>region</th>
              <th>products</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>7</td>
              <td>East</td>
              <td>Mug x2, Tumbler x1</td>
            </tr>
            <tr>
              <td>2</td>
              <td>7</td>
              <td>East</td>
              <td>Mug x1</td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <En><strong>The problem:</strong> <code>products</code> holds a list, not
          a value — you can&apos;t <code>SUM</code> the quantity of Mugs sold,
          and a third item on one order has nowhere to go.</En>
          <Zh><strong>问题：</strong><code>products</code> 列存的是列表，而不是值——你无法对已售 Mug 数量求 <code>SUM</code>，而且一个订单里的第三个条目也没有地方存放。</Zh>
        </p>

        <hr className="step-divider" />

        <p>
          <En><strong>1NF</strong> — one row per item instead. The key is now the
          pair <code>(order_id, product_id)</code>:</En>
          <Zh><strong>1NF</strong>——改为每行一个条目。主键现在是 <code>(order_id, product_id)</code> 的组合：</Zh>
        </p>
        <table className="example-table">
          <caption>1NF — order_items</caption>
          <thead>
            <tr>
              <th>order_id</th>
              <th>product_id</th>
              <th>product_name</th>
              <th>quantity</th>
              <th>store_id</th>
              <th>region</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>2</td>
              <td>Mug</td>
              <td>2</td>
              <td>7</td>
              <td>East</td>
            </tr>
            <tr>
              <td>1</td>
              <td>3</td>
              <td>Tumbler</td>
              <td>1</td>
              <td>7</td>
              <td>East</td>
            </tr>
            <tr>
              <td>2</td>
              <td>2</td>
              <td>Mug</td>
              <td>1</td>
              <td>7</td>
              <td>East</td>
            </tr>
          </tbody>
        </table>
        <div className="callout">
          <p>
            <En><strong>Why it&apos;s 1NF:</strong> every cell now holds exactly one
            value, and each row is uniquely identified by{" "}
            <code>(order_id, product_id)</code>.</En>
            <Zh><strong>为什么是 1NF：</strong>每个单元格现在只有一个值，每行都由 <code>(order_id, product_id)</code> 唯一标识。</Zh>
          </p>
          <p>
            <En><strong>The new problem:</strong> <code>product_name</code> repeats
            &quot;Mug&quot; on rows 1 and 3, because it depends on{" "}
            <code>product_id</code> alone, not on the whole key. That&apos;s a{" "}
            <strong>partial dependency</strong>, and it violates 2NF.</En>
            <Zh><strong>新问题：</strong><code>product_name</code> 在第 1 行和第 3 行都重复了"Mug"，因为它只依赖于 <code>product_id</code>，而不是完整的主键。这是<strong>部分依赖</strong>，违反了 2NF。</Zh>
          </p>
        </div>

        <hr className="step-divider" />

        <p>
          <En><strong>2NF</strong> — move the product&apos;s own attributes to their
          own table, keyed by <code>product_id</code>:</En>
          <Zh><strong>2NF</strong>——将商品自身的属性移到以 <code>product_id</code> 为键的独立表中：</Zh>
        </p>
        <div className="example-tables">
          <table className="example-table">
            <caption>2NF — products</caption>
            <thead>
              <tr>
                <th>product_id</th>
                <th>name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2</td>
                <td>Mug</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Tumbler</td>
              </tr>
            </tbody>
          </table>
          <table className="example-table">
            <caption>2NF — order_items</caption>
            <thead>
              <tr>
                <th>order_id</th>
                <th>product_id</th>
                <th>quantity</th>
                <th>store_id</th>
                <th>region</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>2</td>
                <td>2</td>
                <td>7</td>
                <td>East</td>
              </tr>
              <tr>
                <td>1</td>
                <td>3</td>
                <td>1</td>
                <td>7</td>
                <td>East</td>
              </tr>
              <tr>
                <td>2</td>
                <td>2</td>
                <td>1</td>
                <td>7</td>
                <td>East</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="callout">
          <p>
            <En><strong>Why it&apos;s 2NF:</strong> <code>product_name</code> is
            gone from <code>order_items</code>, so no column depends on only
            part of the key anymore.</En>
            <Zh><strong>为什么是 2NF：</strong><code>product_name</code> 已从 <code>order_items</code> 中移除，不再有列只依赖于主键的一部分。</Zh>
          </p>
          <p>
            <En><strong>The new problem:</strong> <code>region</code> still repeats
            on every row, because it depends on <code>store_id</code> — another
            non-key column — not on the key itself. Key → <code>store_id</code>{" "}
            → <code>region</code> is a <strong>transitive dependency</strong>,
            and it violates 3NF.</En>
            <Zh><strong>新问题：</strong><code>region</code> 仍在每行重复，因为它依赖于 <code>store_id</code>——另一个非键列——而不是键本身。键 → <code>store_id</code> → <code>region</code> 是<strong>传递依赖</strong>，违反了 3NF。</Zh>
          </p>
        </div>

        <hr className="step-divider" />

        <p>
          <En><strong>3NF</strong> — move the store&apos;s own attributes to their
          own table, keyed by <code>store_id</code>:</En>
          <Zh><strong>3NF</strong>——将门店自身的属性移到以 <code>store_id</code> 为键的独立表中：</Zh>
        </p>
        <div className="example-tables">
          <table className="example-table">
            <caption>3NF — stores</caption>
            <thead>
              <tr>
                <th>store_id</th>
                <th>region</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>7</td>
                <td>East</td>
              </tr>
            </tbody>
          </table>
          <table className="example-table">
            <caption>3NF — order_items</caption>
            <thead>
              <tr>
                <th>order_id</th>
                <th>product_id</th>
                <th>quantity</th>
                <th>store_id</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>2</td>
                <td>2</td>
                <td>7</td>
              </tr>
              <tr>
                <td>1</td>
                <td>3</td>
                <td>1</td>
                <td>7</td>
              </tr>
              <tr>
                <td>2</td>
                <td>2</td>
                <td>1</td>
                <td>7</td>
              </tr>
            </tbody>
          </table>
          <table className="example-table">
            <caption>3NF — products (unchanged)</caption>
            <thead>
              <tr>
                <th>product_id</th>
                <th>name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2</td>
                <td>Mug</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Tumbler</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="callout">
          <En><strong>Why it&apos;s 3NF:</strong> every column now depends on the
          key, the whole key, and nothing but the key — three tables, each with
          one job. This is exactly the <code>orders</code> /{" "}
          <code>order_items</code> / <code>products</code> / <code>stores</code>{" "}
          shape at the top of this page.</En>
          <Zh><strong>为什么是 3NF：</strong>现在每一列都只依赖于键，整个键，以及仅仅是键——三张表，各司其职。这正是本页顶部 <code>orders</code> / <code>order_items</code> / <code>products</code> / <code>stores</code> 的结构。</Zh>
        </p>

        <hr className="step-divider" />

        <h3><En>2.13 ACID and transactions</En><Zh>2.13 ACID 与事务</Zh></h3>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <En><strong>Atomicity</strong> — either all of a transaction's writes succeed,
              or none does.</En>
              <Zh><strong>原子性（Atomicity）</strong>——事务中的所有写操作要么全部成功，要么全部不发生。</Zh>
            </li>
            <li>
              <En><strong>Consistency</strong> — the database enforces its own
              invariants (a <code>CHECK</code>, a foreign key, a{" "}
              <code>UNIQUE</code>) on every write, no matter what wrote it. An
              app-level <code>if</code> can be skipped, forgotten, or buggy; a
              constraint can&apos;t.</En>
              <Zh><strong>一致性（Consistency）</strong>——数据库在每次写入时强制执行自身的约束（<code>CHECK</code>、外键、<code>UNIQUE</code>），无论是谁写入的。应用层的 <code>if</code> 可能被跳过、遗漏或出错；约束则不会。</Zh>
            </li>
            <li>
              <En><strong>Isolation</strong> — concurrent transactions can't see
              each other's uncommitted changes, so two orders can't both read
              the same stale stock count.</En>
              <Zh><strong>隔离性（Isolation）</strong>——并发事务看不到彼此未提交的变更，因此两个订单不会同时读到同一个过时的库存数量。</Zh>
            </li>
            <li>
              <En><strong>Durability</strong> — once <code>COMMIT</code> returns
              successfully, that write survives a crash the instant after,
              guaranteed by the database engine itself.</En>
              <Zh><strong>持久性（Durability）</strong>——一旦 <code>COMMIT</code> 成功返回，该写入在随后发生的崩溃中也能存活，由数据库引擎本身保证。</Zh>
            </li>
          </ul>
        </div>
        <p>
          <En>Placing an order has to touch four tables at once — it's the clearest
          real example of why that needs to be one transaction, not four
          independent statements:</En>
          <Zh>下订单需要同时操作四张表——这是最清楚的现实例子，说明为什么需要一个事务，而不是四条独立语句：</Zh>
        </p>
        <CodeBlock
          language="sql"
          code={`BEGIN;

-- lock the inventory row so a concurrent order can't reserve the same stock
-- before this transaction commits
SELECT product_id, quantity_on_hand, quantity_reserved
FROM inventory
WHERE store_id = 1 AND product_id = 2
FOR UPDATE;

INSERT INTO orders (customer_id, store_id, status)
VALUES (1, 1, 'routed')
RETURNING id;

INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents)
VALUES (1, 2, 3, 899);

UPDATE inventory
SET quantity_reserved = quantity_reserved + 3
WHERE store_id = 1 AND product_id = 2;

INSERT INTO order_status_history (order_id, from_status, to_status, note)
VALUES (1, NULL, 'routed', 'Order placed and auto-routed at creation');

COMMIT;`}
        />
        <p>
          <En>Four letters, four separate guarantees — each one shown on its own,
          with the smallest example that actually demonstrates it:</En>
          <Zh>四个字母，四项独立保证——每项分别展示，配以能真正说明问题的最小示例：</Zh>
        </p>

        <hr className="step-divider" />

        <p>
          <En><strong>Atomicity</strong> — an order needs at least one item; if
          either write fails, neither should exist.</En>
          <Zh><strong>原子性</strong>——订单至少需要一个条目；如果任意一个写入失败，两者都不应存在。</Zh>
        </p>
        <CodeBlock
          language="sql"
          bad={[9]}
          code={`-- Suppose the item insert has a mistake: quantity must be greater than 0.
BEGIN;

INSERT INTO orders (customer_id, store_id, status)
VALUES (1, 1, 'placed');

INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents)
VALUES (1, 2, -1, 899);  -- quantity must be > 0 — this fails

ROLLBACK;`}
        />
        <CodeBlock
          language="plaintext"
          code={`ERROR:  new row for relation "order_items" violates check constraint
        "order_items_quantity_check"
-- the transaction is now aborted; ROLLBACK above ends it cleanly

SELECT * FROM orders WHERE status = 'placed';
-- (0 rows) — the order insert succeeded a moment ago, but rolling back
-- the transaction undid it too`}
        />
        <p><En>Same two statements, this time both valid:</En><Zh>同样两条语句，这次都合法：</Zh></p>
        <CodeBlock
          language="sql"
          code={`BEGIN;

INSERT INTO orders (customer_id, store_id, status)
VALUES (1, 1, 'placed');

INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents)
VALUES (1, 2, 3, 899);

COMMIT;
-- both rows exist now, together`}
        />
        <p className="callout">
          <En>Same two statements, two outcomes. There is no state where the order
          exists without its item, or the item without its order — that&apos;s
          Atomicity: all of a transaction&apos;s writes land, or none do.</En>
          <Zh>同样两条语句，两种结果。不存在订单有而条目没有、或条目有而订单没有的中间状态——这就是原子性：事务中的所有写入要么全部生效，要么全部不生效。</Zh>
        </p>

        <hr className="step-divider" />

        <p>
          <En><strong>Consistency</strong> — the constraint that makes stock
          consistent, declared once, right on the table:</En>
          <Zh><strong>一致性</strong>——保持库存一致的约束，只需在表上声明一次：</Zh>
        </p>
        <CodeBlock
          language="sql"
          code={`CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  store_id INTEGER NOT NULL REFERENCES stores(id),      -- foreign key: must be a real store
  product_id INTEGER NOT NULL REFERENCES products(id),  -- foreign key: must be a real product
  quantity_on_hand INTEGER NOT NULL DEFAULT 0,
  quantity_reserved INTEGER NOT NULL DEFAULT 0,
  UNIQUE (store_id, product_id),                         -- one row per store + product
  CHECK (quantity_reserved <= quantity_on_hand)           -- can never reserve more than exists
);`}
        />
        <p>
          <En>Now the payoff — try to break that last rule directly, bypassing any
          app-level check entirely:</En>
          <Zh>现在来看效果——直接尝试破坏这条规则，完全绕过应用层校验：</Zh>
        </p>
        <CodeBlock
          language="sql"
          bad={[4]}
          code={`-- A buggy app that forgot to check availability, or a script run directly
-- against the database, bypassing the app entirely:
BEGIN;
UPDATE inventory SET quantity_reserved = quantity_reserved + 999
WHERE store_id = 1 AND product_id = 2;
COMMIT;`}
        />
        <CodeBlock
          language="plaintext"
          code={`ERROR:  new row for relation "inventory" violates check constraint
        "inventory_quantity_reserved_check"
DETAIL: Failing row contains (id=4, store_id=1, product_id=2,
        quantity_on_hand=5, quantity_reserved=999).

-- rejected before it's written — the CHECK constraint declared above catches
-- it even though nothing in the application layer validated this UPDATE`}
        />
        <p className="callout">
          <En>This is the actual point of Consistency: it holds{" "}
          <strong>independent of the application</strong>. No app code had to
          catch anything — the database refused the write on its own.</En>
          <Zh>这正是一致性的真正意义：它<strong>独立于应用</strong>而生效。没有任何应用代码需要捕获这个问题——数据库自己拒绝了这次写入。</Zh>
        </p>

        <hr className="step-divider" />

        <p>
          <En><strong>Isolation</strong> — two customers order the same product at
          the same time, with no locking at all:</En>
          <Zh><strong>隔离性</strong>——两个客户同时订购同一商品，完全没有加锁：</Zh>
        </p>
        <CodeBlock
          language="plaintext"
          code={`5 in stock. Two customers each try to order 3, at the same time.

Session A (order 3)                    Session B (order 3)
────────────────────────────────────────────────────────────────
Read stock → 5
Check: enough for 3? Yes
                                        Read stock → 5  (A hasn't saved yet)
                                        Check: enough for 3? Yes
Save stock as 5 − 3 = 2
                                        Save stock as 5 − 3 = 2

Both orders are confirmed. Final stock in the database: 2. But 6 units were
just promised across the two orders, and only 5 ever existed — B read the
same "5" that A did, a moment before A's change was saved.`}
        />
        <p className="callout">
          <En>Notice what <em>wouldn&apos;t</em> catch this: even a{" "}
          <code>CHECK (quantity_on_hand &gt;= 0)</code> constraint. 2 is a
          perfectly valid, non-negative number — it&apos;s the{" "}
          <em>sequence</em> of two reads-then-writes that&apos;s wrong, not
          any single write. That&apos;s specifically what Isolation is for.</En>
          <Zh>注意什么<em>无法</em>捕获这个问题：即使是 <code>CHECK (quantity_on_hand &gt;= 0)</code> 约束也不行。2 是一个完全合法的非负数——错的是两次"读后写"的<em>顺序</em>，而不是任何单次写入。这正是隔离性专门解决的问题。</Zh>
        </p>
        <p>
          <En>The fix: a row lock makes the second session wait until the first
          one finishes, so it reads the real, up-to-date number instead:</En>
          <Zh>解决方案：行锁让第二个会话等待第一个完成，从而读到真实的最新数量：</Zh>
        </p>
        <CodeBlock
          language="sql"
          code={`-- Session A
BEGIN;
SELECT quantity_on_hand
FROM inventory
WHERE store_id = 1 AND product_id = 2
FOR UPDATE;                    -- takes a row lock, held until COMMIT/ROLLBACK
-- → 5 in stock`}
        />
        <CodeBlock
          language="sql"
          code={`-- Session B, a moment later, same row
BEGIN;
SELECT quantity_on_hand
FROM inventory
WHERE store_id = 1 AND product_id = 2
FOR UPDATE;                    -- blocks here until Session A ends its transaction`}
        />
        <CodeBlock
          language="plaintext"
          code={`Session A (order 3)                    Session B (order 3)
────────────────────────────────────────────────────────────────
Lock the row, read stock → 5
                                        Try to lock the row → blocked,
                                        waiting on A
Save stock as 5 − 3 = 2
Done — lock released
                                        Unblocked — read stock → 2, the real,
                                        up-to-date number
                                        Check: enough for 3? No — reject the
                                        order

Only one order goes through. B saw the real number instead of a stale one,
because it had to wait for A to finish first. That's what Isolation buys you.`}
        />
        <p className="callout">
          <En><code>FOR UPDATE</code> is one tool, not the property itself —
          Postgres&apos;s default isolation level (Read Committed) does not
          block this automatically; the lock is something you add on purpose.
          The full table of what each isolation level prevents is in{" "}
          <Link to="/additional/backend/full-sql/foundation">
            Full SQL · Foundation
          </Link>
          .</En>
          <Zh><code>FOR UPDATE</code> 是一种工具，而不是隔离性本身——Postgres 的默认隔离级别（Read Committed）不会自动阻止这种情况；锁是你主动加上去的。每种隔离级别能防止什么，完整列表见{" "}
          <Link to="/additional/backend/full-sql/foundation">
            Full SQL · Foundation
          </Link>。</Zh>
        </p>

        <hr className="step-divider" />

        <p>
          <En><strong>Durability</strong> — the one guarantee you can&apos;t see in
          the SQL at all. Postgres writes every commit to disk before it
          reports success, so a crash right after can&apos;t undo it:</En>
          <Zh><strong>持久性</strong>——唯一一个在 SQL 中完全看不出来的保证。Postgres 在报告成功之前就将每次提交写入磁盘，因此随后发生的崩溃无法撤销它：</Zh>
        </p>
        <CodeBlock
          language="sql"
          code={`UPDATE inventory SET quantity_reserved = quantity_reserved + 3
WHERE store_id = 1 AND product_id = 2;
COMMIT;

-- Once COMMIT returns "success", that write is on disk. Even if the network
-- drops, the server crashes, or the power goes out one second later, this
-- update is still there when the database comes back up.`}
        />
        <p className="callout">
          <En>Unlike the other three, this isn&apos;t something your transaction
          does right — it&apos;s a guarantee the database provides
          automatically, every time, once <code>COMMIT</code> succeeds.</En>
          <Zh>与其他三项不同，这不是你的事务需要做对的事情——它是数据库在每次 <code>COMMIT</code> 成功后自动提供的保证。</Zh>
        </p>

        <h3><En>2.14 Stored procedures</En><Zh>2.14 存储过程（Stored procedures）</Zh></h3>
        <p>
          <En>A stored procedure is a named block of SQL logic saved inside the
          database itself, callable by name instead of re-sent from the app
          every time. It's reached for when logic has to stay consistent no
          matter which application calls it, or for scheduled/triggered work the
          database runs on its own.</En>
          <Zh>存储过程是保存在数据库内部的具名 SQL 逻辑块，可以按名称调用，而不是每次都从应用层重新发送。当逻辑必须保持一致（无论哪个应用调用），或需要数据库自行执行定时/触发任务时，才考虑使用它。</Zh>
        </p>
        <CodeBlock
          language="sql"
          code={`CREATE OR REPLACE PROCEDURE mark_order_shipped(order_id_in INTEGER)
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE orders SET status = 'shipped' WHERE id = order_id_in;
  INSERT INTO order_status_history (order_id, from_status, to_status, note)
  VALUES (order_id_in, 'packed', 'shipped', 'Marked shipped via stored procedure');
END;
$$;

CALL mark_order_shipped(1);`}
        />
        <p className="callout">
          <En>This course puts most business logic in the app's service layer
          instead (Day 13) — stored procedures are still worth recognizing,
          since plenty of real systems do lean on them.</En>
          <Zh>本课程将大多数业务逻辑放在应用的服务层（见第 13 天）——但存储过程仍值得认识，因为很多真实系统确实依赖它们。</Zh>
        </p>

        <h3><En>2.15 Going deeper</En><Zh>2.15 深入学习</Zh></h3>
        <p>
          <En>Today skipped a lot on purpose. When you need it:{" "}
          <Link to="/additional/backend/full-sql/foundation">
            Full SQL · Foundation
          </Link>{" "}
          covers upserts, <code>CROSS</code>/self joins, subqueries, CTEs,
          window functions, isolation levels, deadlocks and views;{" "}
          <Link to="/additional/backend/full-sql/schema-design">
            Schema Design &amp; Evolution
          </Link>{" "}
          covers the normal forms with worked examples, deliberate
          denormalization, and migrations.</En>
          <Zh>今天有意跳过了很多内容。需要时可参考：{" "}
          <Link to="/additional/backend/full-sql/foundation">
            Full SQL · Foundation
          </Link>{" "}
          涵盖 upsert、<code>CROSS</code>/自连接、子查询、CTE、窗口函数、隔离级别、死锁和视图；{" "}
          <Link to="/additional/backend/full-sql/schema-design">
            Schema Design &amp; Evolution
          </Link>{" "}
          涵盖带实例的范式化、有意的反范式化以及数据库迁移。</Zh>
        </p>
      </section>
    </div>
  );
}
