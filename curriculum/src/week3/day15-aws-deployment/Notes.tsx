import { Link } from "react-router-dom";
import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { En, Zh } from "../../components/Lang";

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 15 Notes</title>
      <DayNav day="day15-aws-deployment" current="notes" />
      <header className="lecture-header">
        <p className="eyebrow">Week 3 · Day 15 · Notes</p>
        <h1>AWS</h1>
        <p className="subtitle"><En>Executive summary → the services → comparisons</En><Zh>核心要点 → 各服务介绍 → 对比</Zh></p>
      </header>

      {/* ============================================================ */}
      {/* Section 1 — Executive Summary                                 */}
      {/* ============================================================ */}
      <section id="executive-summary" className="exec-summary">
        <h2><En>Section 1 — Executive Summary</En><Zh>第一节 — 核心要点</Zh></h2>
        <p><En>The essentials — what each service covered today is, in one line:</En><Zh>今天涉及的每项服务，一句话说清楚：</Zh></p>

        <p className="compare-label">
          <strong><En>Compute</En><Zh>计算</Zh></strong>
        </p>
        <ul>
          <li>
            <En><strong>EC2</strong> — a virtual server you rent; you control the OS and everything
            running on it.</En>
            <Zh><strong>EC2</strong> — 你租用的虚拟服务器；操作系统及其上运行的一切均由你控制。</Zh>
          </li>
          <li>
            <En><strong>Lambda</strong> — runs a single function when an event happens, with no server
            to manage; you pay only while it runs.</En>
            <Zh><strong>Lambda</strong> — 事件触发时执行单个函数，无需管理服务器；只在运行期间计费。</Zh>
          </li>
        </ul>

        <p className="compare-label">
          <strong><En>Storage &amp; databases</En><Zh>存储与数据库</Zh></strong>
        </p>
        <ul>
          <li>
            <En><strong>S3</strong> — storage for files (images, PDFs, backups), each one fetched by a
            key.</En>
            <Zh><strong>S3</strong> — 文件存储（图片、PDF、备份等），每个文件通过 key 访问。</Zh>
          </li>
          <li>
            <En><strong>RDS</strong> — a managed relational database (Postgres, MySQL, …); AWS runs the
            server, you run the SQL.</En>
            <Zh><strong>RDS</strong> — 托管关系型数据库（Postgres、MySQL 等）；AWS 管理服务器，你只写 SQL。</Zh>
          </li>
          <li>
            <En><strong>DynamoDB</strong> — a fully managed NoSQL key-value database built for fast
            lookups at huge scale.</En>
            <Zh><strong>DynamoDB</strong> — 全托管 NoSQL 键值数据库，专为大规模快速查询而设计。</Zh>
          </li>
        </ul>

        <p className="compare-label">
          <strong><En>Operations &amp; security</En><Zh>运维与安全</Zh></strong>
        </p>
        <ul>
          <li>
            <En><strong>CloudWatch</strong> — logs, metrics and alarms for everything running in AWS.</En>
            <Zh><strong>CloudWatch</strong> — AWS 上所有资源的日志、指标和告警。</Zh>
          </li>
          <li>
            <En><strong>IAM</strong> — decides who (a person or a service) is allowed to do what, on
            which AWS resource.</En>
            <Zh><strong>IAM</strong> — 决定谁（用户或服务）可以对哪个 AWS 资源执行哪些操作。</Zh>
          </li>
          <li>
            <En><strong>VPC</strong> — your own private network inside AWS; security groups act as the
            firewall around each resource.</En>
            <Zh><strong>VPC</strong> — AWS 内你私有的网络；security group 充当每个资源的防火墙。</Zh>
          </li>
          <li>
            <En><strong>Secrets Manager</strong> — stores passwords and API keys so they never sit in
            your code or <code>.env</code> file.</En>
            <Zh><strong>Secrets Manager</strong> — 加密存储密码和 API key，杜绝它们出现在代码或 <code>.env</code> 文件中。</Zh>
          </li>
          <li>
            <En><strong>Infrastructure as Code (Terraform)</strong> — describes your AWS setup in code
            files, so it can be rebuilt and reviewed instead of clicked together by hand.</En>
            <Zh><strong>基础设施即代码（Terraform）</strong> — 用代码文件描述 AWS 配置，可重建、可审查，无需手动点击控制台。</Zh>
          </li>
        </ul>

        <p>
          <En>Want more? <Link to="/week3/day15-aws-deployment/concepts">View all concepts?</Link></En>
          <Zh>想了解更多？<Link to="/week3/day15-aws-deployment/concepts">查看所有概念</Link></Zh>
        </p>
      </section>

      <hr className="section-divider" />

      {/* ============================================================ */}
      {/* Section 2 — The services, one by one                          */}
      {/* ============================================================ */}
      <section id="full-walkthrough">
        <h2><En>Section 2 — The Services, One by One</En><Zh>第二节 — 逐一介绍各服务</Zh></h2>

        <h3 className="part"><En>Compute</En><Zh>计算</Zh></h3>

        {/* ---------------- EC2 ---------------- */}
        <h4 className="topic"><En>EC2 — Elastic Compute Cloud</En><Zh>EC2 — 弹性计算云</Zh></h4>
        <p>
          <En>A virtual machine in an AWS data center. You pick its size (the <em>instance type</em>:
          CPU and RAM) and its OS image, and from the OS up everything is yours: installing Node,
          applying patches, keeping the process running.</En>
          <Zh>AWS 数据中心里的虚拟机。你选择规格（<em>实例类型</em>：CPU 和内存）和操作系统镜像，从操作系统往上的一切都由你负责：安装 Node、打补丁、保持进程运行。</Zh>
        </p>
        <p>
          <En><strong>Commonly used for:</strong> long-running web servers and APIs, background
          workers, anything that holds open connections (WebSockets), and anything needing full
          control of the machine.</En>
          <Zh><strong>常见用途：</strong>长期运行的 Web 服务器和 API、后台 worker、需要保持长连接（WebSocket）的场景，以及需要完全控制机器的任何工作。</Zh>
        </p>
        <p>
          <En>An instance's disk is actually a separate service called <strong>EBS (Elastic Block
          Store)</strong> — the OS and any extra storage live on an EBS volume attached to the
          instance. Unlike the instance's own temporary local storage, an EBS volume survives the
          instance being stopped and restarted, and it can be snapshotted for backup — the same
          idea as the RDS and S3 backups elsewhere on this page.</En>
          <Zh>实例的磁盘实际上是一个独立服务，叫做 <strong>EBS（弹性块存储）</strong>——操作系统和额外存储都存放在附加到实例的 EBS 卷上。与实例自带的临时本地存储不同，EBS 卷在实例停止重启后依然存在，还可以创建快照备份——与本页 RDS 和 S3 的备份思路相同。</Zh>
        </p>
        <div className="concept">
          <p className="concept-label"><En>Key ideas</En><Zh>核心概念</Zh></p>
          <ul>
            <li>
              <En><strong>Vertical scaling</strong> means moving to a bigger instance type. It's simple,
              but it needs a restart, and there's always a biggest machine.</En>
              <Zh><strong>垂直扩展（Vertical scaling）</strong>是指换用更大的实例类型。操作简单，但需要重启，且始终存在上限。</Zh>
            </li>
            <li>
              <En><strong>Horizontal scaling</strong> means running more instances. An{" "}
              <strong>Auto Scaling Group</strong> keeps a target number running, adds or removes
              instances based on a metric (CPU, request count), and replaces any that fail. A{" "}
              <strong>load balancer (ALB)</strong> in front spreads traffic across them and stops
              sending traffic to unhealthy ones.</En>
              <Zh><strong>水平扩展（Horizontal scaling）</strong>是指同时运行更多实例。<strong>Auto Scaling Group</strong> 维持目标数量的实例，根据指标（CPU、请求数）自动增减，并替换故障实例。前面的<strong>负载均衡器（ALB）</strong>将流量分发到各实例，并停止向不健康的实例发送请求。</Zh>
            </li>
            <li>
              <En>For horizontal scaling to work, <strong>servers must be stateless</strong>. Instances
              get added and killed at any time, so sessions, uploaded files and anything else that
              must survive can't live on the instance. They go to the database, S3, or a cache.</En>
              <Zh>水平扩展要求<strong>服务器必须是无状态的</strong>。实例随时会被增加或销毁，因此 session、上传文件以及任何需要持久化的数据都不能存在实例上，而应存入数据库、S3 或缓存。</Zh>
            </li>
            <li>
              <En><strong>Pricing models:</strong> On-Demand (pay by the second, no commitment);
              Reserved / Savings Plans (commit for 1–3 years, much cheaper); Spot (spare capacity
              at up to ~90% off, but AWS can take it back with 2 minutes' notice, so it's only for
              work that can be interrupted).</En>
              <Zh><strong>计费模式：</strong>按需（On-Demand，按秒计费，无承诺）；预留实例 / Savings Plans（承诺 1–3 年，价格大幅优惠）；Spot（空闲容量，最高可省约 90%，但 AWS 可在 2 分钟通知后回收，仅适合可中断的任务）。</Zh>
            </li>
          </ul>
        </div>

        {/* ---------------- Lambda ---------------- */}
        <h4 className="topic"><En>Lambda — serverless functions</En><Zh>Lambda — 无服务器函数</Zh></h4>
        <p>
          <En>You upload a function and AWS runs it whenever an event triggers it. There's no server to
          manage, it scales automatically, and you pay per request and per millisecond of run
          time. When nothing is happening, it costs nothing.</En>
          <Zh>你上传一个函数，AWS 在事件触发时自动运行它。无需管理服务器，自动扩缩容，按请求次数和运行毫秒数计费。没有请求时，分文不花。</Zh>
        </p>
        <p className="compare-label">
          <strong><En>Commonly used for</En><Zh>常见用途</Zh></strong>
        </p>
        <ul>
          <li>
            <En><strong>Scheduled jobs</strong> — Lambda can run automatically on a timer, like a cron
            job. A nightly function that emails a sales report or cleans up old records, without a
            server sitting around waiting for that one moment each day.</En>
            <Zh><strong>定时任务</strong> — Lambda 可按定时器自动运行，类似 cron job。每晚发送销售报告邮件或清理旧数据，无需让服务器整天等那一刻的到来。</Zh>
          </li>
          <li>
            <En><strong>Webhook handlers</strong> — when an outside service (like a payment provider)
            needs to notify your app that something happened, Lambda can be the endpoint that
            receives that one-off notification and reacts to it, instead of running a whole server
            just to catch occasional pings.</En>
            <Zh><strong>Webhook 处理</strong> — 当外部服务（如支付平台）需要通知你的应用某件事发生时，Lambda 可作为接收端处理这一次性通知，而无需为偶发的请求常驻一台服务器。</Zh>
          </li>
          <li>
            <En><strong>Event-driven processing</strong> — Lambda runs automatically whenever something
            happens elsewhere in AWS, like a new file landing in an S3 bucket. The moment a user
            uploads a photo, a Lambda function can resize it — nobody has to trigger anything by
            hand.</En>
            <Zh><strong>事件驱动处理</strong> — 当 AWS 其他地方发生事件（如文件上传到 S3 存储桶）时，Lambda 自动运行。用户刚上传图片，Lambda 函数立即处理缩略图——无需任何手动触发。</Zh>
          </li>
          <li>
            <En><strong>Serverless API backends</strong> — instead of an always-on server for your
            app's API, each incoming request can trigger its own Lambda function through API
            Gateway. There's no server to manage, and it costs nothing while no one's making
            requests.</En>
            <Zh><strong>无服务器 API 后端</strong> — 无需为应用 API 常驻服务器，每个请求通过 API Gateway 触发独立的 Lambda 函数。无需管理服务器，无请求时零费用。</Zh>
          </li>
          <li>
            <En><strong>Stream processing</strong> — as a continuous flow of data comes in (site clicks,
            sensor readings), Lambda can process each new piece the moment it arrives instead of
            waiting to handle it all later in a batch.</En>
            <Zh><strong>流处理</strong> — 面对持续涌入的数据流（页面点击、传感器读数），Lambda 可在数据到达的瞬间逐条处理，而无需等待批量处理。</Zh>
          </li>
          <li>
            <En><strong>Orchestrated workflows (Step Functions)</strong> — for a task with several
            steps that must happen in order (charge the customer → update inventory → send a
            confirmation), Step Functions can chain multiple Lambda functions together and
            automatically retry a step that fails.</En>
            <Zh><strong>编排工作流（Step Functions）</strong> — 对于需要按序执行多个步骤的任务（扣款 → 更新库存 → 发送确认），Step Functions 可以将多个 Lambda 函数串联起来，并自动重试失败的步骤。</Zh>
          </li>
        </ul>
        <CodeBlock
          language="typescript"
          code={`// Runs ONCE per cold start, then reused by every warm invocation —
// so create clients here, not inside the handler
const s3 = new S3Client({});

export async function handler(event: S3Event) {
  // runs on EVERY invocation
  const key = event.Records[0].s3.object.key;
  await createThumbnail(s3, key);
}`}
        />
        <div className="concept">
          <p className="concept-label"><En>Key ideas</En><Zh>核心概念</Zh></p>
          <ul>
            <li>
              <En><strong>Cold start.</strong> On the first call, after a period of no traffic, or when
              scaling out to a new copy, AWS has to create a fresh environment and load your code
              before the handler runs. That adds roughly 100ms to over a second. Later calls reuse
              the warm environment. To reduce cold starts: keep the bundle small, avoid heavy
              startup work, or pay for <strong>provisioned concurrency</strong> to keep copies
              warm.</En>
              <Zh><strong>冷启动（Cold start）。</strong>首次调用、流量空窗期之后，或扩展到新实例时，AWS 需要创建新环境并加载代码，再执行处理函数——大约额外耗时 100ms 到一秒以上。后续调用会复用已预热的环境。减少冷启动的方法：压缩包体积、减少启动时的重型操作，或付费开启 <strong>provisioned concurrency</strong> 保持实例预热。</Zh>
            </li>
            <li>
              <En><strong>Hard limits:</strong> a function can run for at most 15 minutes, and its CPU
              grows with the memory you give it. Long jobs don't belong here.</En>
              <Zh><strong>硬性限制：</strong>函数最多运行 15 分钟，CPU 随分配内存的增加而提升。长时间运行的任务不适合 Lambda。</Zh>
            </li>
            <li>
              <En><strong>Every concurrent request gets its own copy.</strong> 500 requests at once
              means 500 separate environments, each with its own memory and its own database
              connection. That can use up all of Postgres's connections, the Day 14 pooling problem
              at a bigger scale. <strong>RDS Proxy</strong> exists to pool those connections.</En>
              <Zh><strong>每个并发请求都有独立的副本。</strong>同时 500 个请求意味着 500 个独立环境，各自占用内存和数据库连接，很快会耗尽 Postgres 的连接数，这正是连接池问题在更大规模下的重演。<strong>RDS Proxy</strong> 就是为了汇聚这些连接而存在的。</Zh>
            </li>
            <li>
              <En><strong>Stateless by design:</strong> nothing is guaranteed to survive between calls,
              so any state lives in a database or S3.</En>
              <Zh><strong>设计上的无状态：</strong>两次调用之间不保证任何数据存留，因此所有状态都应存入数据库或 S3。</Zh>
            </li>
          </ul>
        </div>

        <h3 className="part"><En>Storage &amp; databases</En><Zh>存储与数据库</Zh></h3>

        {/* ---------------- S3 ---------------- */}
        <h4 className="topic"><En>S3 — Simple Storage Service</En><Zh>S3 — 简单存储服务</Zh></h4>
        <p>
          <En>Object storage. You put files (<em>objects</em>) into <em>buckets</em>, and each one is
          addressed by a key like <code>orders/42/label.pdf</code>. It isn't a real file system:
          the "folders" are just prefixes in the key. Storage is effectively unlimited and it's
          built for 99.999999999% (11 nines) durability.</En>
          <Zh>对象存储。你将文件（<em>对象</em>）放入<em>存储桶（bucket）</em>，每个文件通过类似 <code>orders/42/label.pdf</code> 的 key 寻址。它不是真正的文件系统：「文件夹」只是 key 的前缀。存储容量几乎无上限，持久性高达 99.999999999%（11 个 9）。</Zh>
        </p>
        <p className="compare-label">
          <strong><En>Commonly used for</En><Zh>常见用途</Zh></strong>
        </p>
        <ul>
          <li>
            <En><strong>User uploads</strong> — profile pictures, PDFs, videos, anything a user adds
            through the app. It gets dropped straight into a bucket instead of living on your
            server.</En>
            <Zh><strong>用户上传</strong> — 头像、PDF、视频，用户通过应用上传的一切文件，直接存入存储桶，无需占用服务器空间。</Zh>
          </li>
          <li>
            <En><strong>Hosting a static website</strong> — build your React app once, upload the
            output files to a bucket, and S3 serves them directly (usually with the CloudFront CDN
            in front so pages load fast everywhere).</En>
            <Zh><strong>托管静态网站</strong> — 构建好 React 应用后，将产物上传到存储桶，S3 直接提供服务（通常配合 CloudFront CDN，确保全球访问速度）。</Zh>
          </li>
          <li>
            <En><strong>Data lakes queried with Athena</strong> — dump raw logs or event data into S3
            as plain files, then run SQL-style queries against them with Athena instead of loading
            everything into a database first.</En>
            <Zh><strong>配合 Athena 的数据湖</strong> — 将原始日志或事件数据以普通文件形式存入 S3，再用 Athena 直接对其执行 SQL 风格查询，无需先导入数据库。</Zh>
          </li>
          <li>
            <En><strong>Backups and log archives</strong> — a cheap, practically bottomless place to
            keep database backups and old logs you rarely open but can't throw away.</En>
            <Zh><strong>备份与日志归档</strong> — 存放数据库备份和几乎不打开但又不能丢弃的旧日志，成本低廉、容量近乎无限。</Zh>
          </li>
          <li>
            <En><strong>Disaster recovery</strong> — a bucket can automatically keep a copy of itself
            in a second AWS region, so one region having a bad day doesn't mean losing the data.</En>
            <Zh><strong>灾难恢复</strong> — 存储桶可以自动在另一个 AWS 地区保留副本，一个地区出现故障不会导致数据丢失。</Zh>
          </li>
        </ul>
        <div className="concept">
          <p className="concept-label"><En>Key ideas</En><Zh>核心概念</Zh></p>
          <ul>
            <li>
              <En><strong>Buckets are private by default.</strong> Access is granted through IAM and
              bucket policies. The well-known S3 data leaks were almost always a bucket someone made
              public by mistake.</En>
              <Zh><strong>存储桶默认私有。</strong>访问权限通过 IAM 和存储桶策略授予。众所周知的 S3 数据泄露事件，几乎都是有人误将存储桶设为公开所致。</Zh>
            </li>
            <li>
              <En><strong>Presigned URLs:</strong> the server signs a short-lived URL, and the browser
              uploads or downloads the file directly to S3. The file's bytes never pass through
              your API, and the expiry time is a security control: a leaked link stops working.</En>
              <Zh><strong>预签名 URL（Presigned URL）：</strong>服务器签发一个短期有效的 URL，浏览器直接通过它向 S3 上传或下载文件，文件字节流不经过你的 API。过期时间本身就是安全控制：泄露的链接会自动失效。</Zh>
            </li>
            <li>
              <En><strong>S3 isn't a database.</strong> You can't query what's inside a file, and you
              replace an object as a whole rather than editing it. The usual pattern is that S3
              stores the file and your database stores its key plus the metadata. To actually run
              SQL over a pile of objects (Parquet, CSV, JSON), point <strong>Athena</strong> at the
              bucket instead of looping over files yourself.</En>
              <Zh><strong>S3 不是数据库。</strong>你无法查询文件内容，也只能整体替换对象而非局部编辑。常见做法是 S3 存文件，数据库存文件的 key 和元数据。若要对一堆对象（Parquet、CSV、JSON）运行 SQL，直接用 <strong>Athena</strong> 指向存储桶，而不是自己遍历文件。</Zh>
            </li>
            <li>
              <En><strong>Downloads cost money</strong> (~$0.09/GB out of S3). For anything fetched
              often or from around the world, put <strong>CloudFront</strong> in front — it caches
              at edge locations, which ends up both faster and cheaper than serving straight from
              S3.</En>
              <Zh><strong>下载流量收费</strong>（从 S3 流出约 $0.09/GB）。对于频繁访问或需要全球分发的内容，前置 <strong>CloudFront</strong>——它在边缘节点缓存内容，比直接从 S3 提供服务既快又便宜。</Zh>
            </li>
            <li>
              <En><strong>Lifecycle rules are the biggest cost lever.</strong> A rule can auto-move
              objects to a cheaper storage class after N days and delete them after N more — e.g. a
              100&nbsp;GB backup nobody's touched in two years drops from ~$2.30/mo on Standard to
              ~$0.10/mo in Deep Archive, with nobody having to remember to move it.</En>
              <Zh><strong>生命周期规则是最大的降本手段。</strong>规则可在 N 天后自动将对象迁移到更便宜的存储类别，再过 N 天后删除——例如两年未访问的 100 GB 备份，从 Standard 的约 $2.30/月自动降至 Deep Archive 的约 $0.10/月，无需任何人手动操作。</Zh>
            </li>
          </ul>
        </div>

        <p className="compare-label">
          <strong><En>Storage classes</En><Zh>存储类别</Zh></strong> — <En>same durability, priced by how fast you need it back:</En><Zh>持久性相同，按取回速度定价：</Zh>
        </p>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Class</En><Zh>类别</Zh></th>
              <th>~Cost / GB / mo</th>
              <th><En>Retrieval</En><Zh>取回速度</Zh></th>
              <th><En>Use it for</En><Zh>适用场景</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Standard</td>
              <td>$0.023</td>
              <td><En>Instant</En><Zh>即时</Zh></td>
              <td><En>Frequently accessed data</En><Zh>频繁访问的数据</Zh></td>
            </tr>
            <tr>
              <td>Standard-IA</td>
              <td>$0.0125</td>
              <td><En>Instant</En><Zh>即时</Zh></td>
              <td><En>Infrequent access (monthly backups)</En><Zh>低频访问（每月备份）</Zh></td>
            </tr>
            <tr>
              <td>Glacier Flexible</td>
              <td>$0.0036</td>
              <td><En>Hours</En><Zh>数小时</Zh></td>
              <td><En>Compliance archives, rarely opened</En><Zh>合规归档，极少打开</Zh></td>
            </tr>
            <tr>
              <td>Glacier Deep Archive</td>
              <td>$0.00099</td>
              <td><En>12+ hours</En><Zh>12 小时以上</Zh></td>
              <td><En>Long-term regulatory archives</En><Zh>长期法规归档</Zh></td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <En>Unsure how a given object will be accessed? <strong>Intelligent-Tiering</strong> watches
          actual access patterns and moves objects between tiers for you.</En>
          <Zh>不确定对象的访问频率？<strong>Intelligent-Tiering</strong> 会监测实际访问模式，自动在各层之间迁移对象。</Zh>
        </p>

        {/* ---------------- Availability Zones & Regions ---------------- */}
        <h4 className="topic"><En>Availability Zones &amp; Regions</En><Zh>可用区与地区</Zh></h4>
        <p>
          <En>A <strong>Region</strong> is a geographic area AWS operates in — <code>us-east-1</code>{" "}
          is Northern Virginia. An <strong>Availability Zone (AZ)</strong> is one physically
          separate data center inside that region; a region is made up of several AZs.</En>
          <Zh><strong>地区（Region）</strong>是 AWS 运营的地理区域——如 <code>us-east-1</code> 是北弗吉尼亚。<strong>可用区（AZ）</strong>是该地区内物理隔离的数据中心；一个地区由多个可用区组成。</Zh>
        </p>
        <div className="concept">
          <p className="concept-label"><En>Key ideas</En><Zh>核心概念</Zh></p>
          <ul>
            <li>
              <En>Spreading a resource across multiple AZs is how AWS avoids one data center's bad day
              (a power outage, a hardware failure) from taking the whole app down with it.</En>
              <Zh>将资源分布在多个可用区，可以避免单个数据中心的故障（断电、硬件失效）拖垮整个应用。</Zh>
            </li>
            <li>
              <En>It also comes up for compliance — some regulations require data to physically stay
              within a specific country or region.</En>
              <Zh>合规要求也会涉及这一点——某些法规要求数据物理存储在特定国家或地区内。</Zh>
            </li>
            <li>
              <En><strong>How S3 uses this:</strong> S3 automatically stores copies of your objects
              across multiple AZs in a region for you. That's part of why it's so durable, and it
              isn't something you have to configure.</En>
              <Zh><strong>S3 的做法：</strong>S3 自动在一个地区的多个可用区存储对象副本，这正是它持久性极高的原因之一，无需你手动配置。</Zh>
            </li>
            <li>
              <En><strong>How RDS uses this:</strong> a "Multi-AZ" database (see the RDS section below)
              keeps a live standby copy in a different AZ, ready to take over automatically if the
              primary's data center has a problem.</En>
              <Zh><strong>RDS 的做法：</strong>「Multi-AZ」数据库（见下方 RDS 部分）在另一个可用区保持一个实时备用副本，一旦主节点所在数据中心出现问题，自动接管。</Zh>
            </li>
          </ul>
        </div>

        {/* ---------------- RDS ---------------- */}
        <h4 className="topic"><En>RDS — Relational Database Service</En><Zh>RDS — 关系型数据库服务</Zh></h4>
        <p>
          <En>RDS is AWS's managed relational database service — Postgres, MySQL, and others. You
          could technically install Postgres yourself on an EC2 server, but RDS exists
          specifically to take a handful of painful, error-prone jobs off your plate.</En>
          <Zh>RDS 是 AWS 的托管关系型数据库服务，支持 Postgres、MySQL 等。你当然可以在 EC2 上自己安装 Postgres，但 RDS 的存在正是为了帮你省去一批繁琐易错的工作。</Zh>
        </p>
        <div className="concept">
          <p className="concept-label"><En>What RDS solves</En><Zh>RDS 解决的问题</Zh></p>
          <ul>
            <li>
              <En><strong>Backups.</strong> Without RDS, you'd have to write and schedule your own
              backup scripts and hope you remember before it's too late. RDS runs automated
              backups on a schedule and can restore your database to almost any point in time with
              a few clicks.</En>
              <Zh><strong>备份。</strong>没有 RDS，你得自己写备份脚本、设定计划，还得祈祷自己没忘。RDS 按计划自动备份，只需几次点击就能将数据库恢复到几乎任意时间点。</Zh>
            </li>
            <li>
              <En><strong>Patching.</strong> Without RDS, you're responsible for applying database
              security patches yourself, on your own schedule, without breaking anything. RDS
              applies patches for you during a maintenance window you choose.</En>
              <Zh><strong>补丁。</strong>没有 RDS，你得自行安排时间打数据库安全补丁，还不能出错。RDS 在你指定的维护窗口期自动完成补丁更新。</Zh>
            </li>
            <li>
              <En><strong>Replicas.</strong> Without RDS, standing up a second copy of your database and
              keeping it continuously in sync with the first is genuinely hard to get right. With
              RDS, adding a replica is a few clicks, and AWS keeps it in sync.</En>
              <Zh><strong>副本。</strong>没有 RDS，搭建第二个数据库副本并持续同步确实很难做对。有了 RDS，几次点击就能添加副本，AWS 负责保持同步。</Zh>
            </li>
            <li>
              <En><strong>Failover.</strong> Without RDS, if your database server crashes, someone has
              to notice and manually point the app at a backup. With Multi-AZ turned on, RDS
              detects the failure and switches over automatically, usually within a minute or two.</En>
              <Zh><strong>故障切换。</strong>没有 RDS，数据库服务器崩溃后需要有人发现并手动将应用切换到备份。开启 Multi-AZ 后，RDS 自动检测故障并切换，通常在一两分钟内完成。</Zh>
            </li>
          </ul>
        </div>
        <div className="concept">
          <p className="concept-label"><En>Key ideas</En><Zh>核心概念</Zh></p>
          <ul>
            <li>
              <En><strong>Multi-AZ</strong> is an always-on safety copy of your database in a different
              data center, there purely for backup and failover — you don't read from it day to
              day.</En>
              <Zh><strong>Multi-AZ</strong> 是数据库在另一个数据中心的常驻安全副本，仅用于备份和故障切换——日常读请求不走它。</Zh>
            </li>
            <li>
              <En><strong>A read replica</strong> is an extra copy you <em>can</em> send read traffic
              to, to take load off the main database. It's there for performance, not safety, and
              it can lag slightly behind the primary.</En>
              <Zh><strong>只读副本（read replica）</strong>是可以接收读请求的额外副本，用于分担主库压力。它的目的是提升性能而非保障安全，可能略微落后于主库。</Zh>
            </li>
            <li>
              <En><strong>Scaling:</strong> you can move up to a bigger instance and add read replicas,
              but all writes still go to one primary. Past that point, you're back to Day 14's
              sharding.</En>
              <Zh><strong>扩展：</strong>可以升级到更大的实例并增加只读副本，但所有写操作仍集中在一个主库上。到了这个瓶颈，就要回到分片（sharding）的思路了。</Zh>
            </li>
            <li>
              <En><strong>Why not install Postgres on an EC2 instance?</strong> You'd take on backups,
              patching and failover yourself. You'd only do that if you need something RDS doesn't
              allow, like full superuser access.</En>
              <Zh><strong>为什么不直接在 EC2 上装 Postgres？</strong>因为备份、补丁和故障切换都得自己搞。除非你需要 RDS 不支持的功能（如完整的超级用户权限），否则没必要。</Zh>
            </li>
          </ul>
        </div>

        {/* ---------------- DynamoDB ---------------- */}
        <h4 className="topic">DynamoDB</h4>
        <p>
          <En>AWS's fully managed, very high-performing NoSQL database. No servers to size or manage,
          and it handles enormous amounts of traffic with very fast lookups, scaling horizontally
          almost without limit.</En>
          <Zh>AWS 全托管的高性能 NoSQL 数据库。无需规划或管理服务器，能以极快的查询速度处理海量流量，水平扩展几乎没有上限。</Zh>
        </p>
        <ul>
          <li>
            <En>Every item is found by a simple key, which is what keeps reads and writes fast even at
            huge scale.</En>
            <Zh>每条数据都通过简单的 key 查找，这正是在超大规模下读写依然飞快的原因。</Zh>
          </li>
          <li>
            <En>It's fully managed — no server to size, patch, or scale by hand; AWS grows or shrinks
            capacity automatically as traffic changes.</En>
            <Zh>完全托管——无需手动规划规格、打补丁或扩容；AWS 根据流量变化自动调整容量。</Zh>
          </li>
          <li>
            <En>Commonly used for simple, high-volume data that doesn't need complex relationships —
            sessions, shopping carts, and similar.</En>
            <Zh>常用于不需要复杂关系的简单高量数据——session、购物车等类似场景。</Zh>
          </li>
        </ul>

        <h3 className="part"><En>Operations &amp; security</En><Zh>运维与安全</Zh></h3>

        {/* ---------------- CloudWatch ---------------- */}
        <h4 className="topic">CloudWatch</h4>
        <p>
          <En>AWS's own built-in monitoring for AWS resources and services — not a full third-party
          application-performance-monitoring product. It's scoped to watching AWS infrastructure
          (logs, metrics, alarms), not tracing what happens line-by-line inside your code.</En>
          <Zh>AWS 内置的监控服务，专注于 AWS 资源和服务——不是全功能的第三方 APM 产品。它的范围是监控 AWS 基础设施（日志、指标、告警），而非逐行追踪代码内部的执行过程。</Zh>
        </p>
        <p><En>It's made of four parts:</En><Zh>它由四个部分组成：</Zh></p>
        <ul>
          <li>
            <En><strong>Logs</strong> — collects what your app writes to stdout or a log file</En>
            <Zh><strong>日志（Logs）</strong> — 收集应用写入 stdout 或日志文件的内容</Zh>
          </li>
          <li>
            <En><strong>Metrics</strong> — numbers over time: CPU, request count, or a custom value</En>
            <Zh><strong>指标（Metrics）</strong> — 随时间变化的数值：CPU、请求数或自定义指标</Zh>
          </li>
          <li>
            <En><strong>Alarms</strong> — trigger when a metric crosses a line: notify someone, or scale
            out</En>
            <Zh><strong>告警（Alarms）</strong> — 指标超过阈值时触发：发送通知或自动扩容</Zh>
          </li>
          <li>
            <En><strong>Dashboards</strong> — graphs of all of the above</En>
            <Zh><strong>仪表盘（Dashboards）</strong> — 将以上所有内容可视化</Zh>
          </li>
        </ul>

        {/* ---------------- IAM ---------------- */}
        <h4 className="topic"><En>IAM — Identity and Access Management</En><Zh>IAM — 身份与访问管理</Zh></h4>
        <p>
          <En>Controls who or what can access AWS <em>resources and services</em> — who can read this
          S3 bucket, who can launch an EC2 instance. It is <strong>not</strong> related to your own
          application's user accounts or login system; that's a separate concern the app itself
          handles.</En>
          <Zh>控制谁或什么可以访问 AWS <em>资源和服务</em>——谁能读取这个 S3 存储桶，谁能启动 EC2 实例。它与你应用自身的用户账号或登录系统<strong>无关</strong>，那是应用层面自己处理的事。</Zh>
        </p>
        <p><En>It has four building blocks:</En><Zh>它由四个基本元素组成：</Zh></p>
        <ul>
          <li>
            <En><strong>User</strong> — a person or app with long-term credentials (password or access
            keys)</En>
            <Zh><strong>用户（User）</strong> — 拥有长期凭证（密码或 access key）的人员或应用程序</Zh>
          </li>
          <li>
            <En><strong>Group</strong> — a set of users who share the same permissions</En>
            <Zh><strong>用户组（Group）</strong> — 共享相同权限的一组用户</Zh>
          </li>
          <li>
            <En><strong>Role</strong> — an identity that is <em>assumed</em> temporarily by a service
            (EC2, Lambda) or a person, handing out short-lived credentials that rotate on their own</En>
            <Zh><strong>角色（Role）</strong> — 由服务（EC2、Lambda）或人员临时<em>扮演</em>的身份，颁发自动轮换的短期凭证</Zh>
          </li>
          <li>
            <En><strong>Policy</strong> — a JSON document listing which actions are allowed or denied on
            which resources</En>
            <Zh><strong>策略（Policy）</strong> — 列出哪些操作对哪些资源允许或拒绝的 JSON 文档</Zh>
          </li>
        </ul>
        <CodeBlock
          language="json"
          code={`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::oms-shipping-labels/*"
    }
  ]
}`}
        />
        <div className="concept">
          <p className="concept-label"><En>Key ideas</En><Zh>核心概念</Zh></p>
          <ul>
            <li>
              <En><strong>Least privilege:</strong> grant only the actions and resources a job actually
              needs, like the policy above (two actions, one bucket) rather than{" "}
              <code>s3:*</code> on everything.</En>
              <Zh><strong>最小权限（Least privilege）：</strong>只授予工作实际需要的操作和资源——如上面的策略（两个操作，一个存储桶），而不是对所有资源开放 <code>s3:*</code>。</Zh>
            </li>
            <li>
              <En><strong>Roles, not access keys, for your code.</strong> Attach a role to the EC2
              instance or the Lambda, and the AWS SDK picks up temporary credentials automatically.
              Access keys in code, <code>.env</code> or git are a top cause of breaches, and leaked
              keys get found and abused within minutes.</En>
              <Zh><strong>代码用角色，不用 access key。</strong>给 EC2 实例或 Lambda 附加一个角色，AWS SDK 会自动获取临时凭证。将 access key 放在代码、<code>.env</code> 或 git 里是泄露事故的头号原因，泄露的 key 在几分钟内就会被发现并滥用。</Zh>
            </li>
            <li>
              <En><strong>How AWS decides:</strong> everything is denied by default, an explicit Allow
              grants access, and an explicit Deny always wins.</En>
              <Zh><strong>AWS 的决策逻辑：</strong>默认拒绝一切，显式 Allow 授权访问，显式 Deny 永远优先。</Zh>
            </li>
          </ul>
        </div>

        {/* ---------------- VPC ---------------- */}
        <h4 className="topic"><En>VPC — Virtual Private Cloud</En><Zh>VPC — 虚拟私有云</Zh></h4>
        <p><En>Your own isolated network inside AWS. Every EC2 instance and RDS database lives in one.</En><Zh>你在 AWS 内专属的隔离网络。每个 EC2 实例和 RDS 数据库都归属于某个 VPC。</Zh></p>
        <ul>
          <li>
            <En><strong>Public subnet:</strong> reachable from the internet. This is where load
            balancers go.</En>
            <Zh><strong>公有子网（Public subnet）：</strong>可从互联网访问，负载均衡器部署在这里。</Zh>
          </li>
          <li>
            <En><strong>Private subnet:</strong> no inbound traffic from the internet. Databases belong
            here.</En>
            <Zh><strong>私有子网（Private subnet）：</strong>不接受来自互联网的入站流量，数据库应部署在这里。</Zh>
          </li>
          <li>
            <En><strong>Security group:</strong> a firewall around one resource, with allow rules only.
            A rule can point at another security group, e.g. RDS accepts port 5432{" "}
            <em>only</em> from the app servers' security group.</En>
            <Zh><strong>安全组（Security group）：</strong>围绕单个资源的防火墙，只有允许规则。规则可以指向另一个安全组，例如 RDS 仅接受来自应用服务器安全组的 5432 端口连接。</Zh>
          </li>
        </ul>

        {/* ---------------- Secrets Manager ---------------- */}
        <h4 className="topic">Secrets Manager</h4>
        <ul>
          <li>
            <En>Stores secrets (DB passwords, API keys) encrypted. The app fetches them at startup
            through the SDK, and its IAM role is what allows the read. No password in the code, on
            disk or in git.</En>
            <Zh>加密存储密钥（数据库密码、API key）。应用启动时通过 SDK 获取，IAM 角色授权读取。代码、磁盘和 git 里都不会出现明文密码。</Zh>
          </li>
          <li>
            <En>Can <strong>rotate</strong> secrets automatically, e.g. change the RDS password on a
            schedule without anyone redeploying.</En>
            <Zh>支持自动<strong>轮换</strong>密钥，例如按计划修改 RDS 密码，无需任何人重新部署。</Zh>
          </li>
          <li>
            <En><strong>SSM Parameter Store</strong> is the cheaper sibling: fine for config values and
            simple secrets, but without built-in rotation.</En>
            <Zh><strong>SSM Parameter Store</strong> 是它的低价版：适合配置项和简单密钥，但不支持内置轮换。</Zh>
          </li>
        </ul>

        {/* ---------------- IaC ---------------- */}
        <h4 className="topic"><En>Infrastructure as Code — Terraform</En><Zh>基础设施即代码 — Terraform</Zh></h4>
        <p>
          <En>Instead of clicking through the AWS console by hand, you write your infrastructure
          (instances, databases, buckets, IAM roles) down as configuration files. Running Terraform
          reads that configuration and automatically creates — or updates — the real resources to
          match it.</En>
          <Zh>无需手动点击 AWS 控制台，而是将基础设施（实例、数据库、存储桶、IAM 角色）写成配置文件。运行 Terraform 时，它读取配置并自动创建或更新实际资源以与之匹配。</Zh>
        </p>
        <ul>
          <li>
            <En><strong>Why bother:</strong> dev, staging and prod get built from the same code, every
            change is reviewed in a PR and kept in git history, and there's no more "someone
            clicked something in the console and nobody knows what."</En>
            <Zh><strong>为什么值得：</strong>开发、预发和生产环境从同一套代码构建，每次变更都经过 PR 审查并保留在 git 历史中，再也不会有「有人在控制台点了什么，谁都不知道」的情况。</Zh>
          </li>
          <li>
            <En><strong>Other options exist</strong> — CloudFormation (AWS's own version) and AWS CDK
            (write it in TypeScript) solve the same problem. Terraform is just the most widely used.</En>
            <Zh><strong>也有其他选择</strong> —— CloudFormation（AWS 自家方案）和 AWS CDK（用 TypeScript 编写）解决同样的问题。Terraform 只是使用最广泛的那个。</Zh>
          </li>
        </ul>
      </section>

      <hr className="section-divider" />

      {/* ============================================================ */}
      {/* Section 3 — Comparisons                                       */}
      {/* ============================================================ */}
      <section id="comparisons">
        <h2><En>Section 3 — Comparisons</En><Zh>第三节 — 对比</Zh></h2>

        <h3><En>EC2 vs. Lambda</En><Zh>EC2 vs. Lambda</Zh></h3>
        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th>EC2</th>
              <th>Lambda</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>You manage</En><Zh>你负责管理</Zh></td>
              <td><En>The OS, runtime, patching, process manager</En><Zh>操作系统、运行时、补丁、进程管理</Zh></td>
              <td><En>Just the function code</En><Zh>只需关心函数代码</Zh></td>
            </tr>
            <tr>
              <td><En>Runs</En><Zh>运行方式</Zh></td>
              <td><En>Continuously, until you stop it</En><Zh>持续运行，直到你停止</Zh></td>
              <td><En>Only while handling an event (max 15 min)</En><Zh>仅在处理事件时运行（最长 15 分钟）</Zh></td>
            </tr>
            <tr>
              <td><En>Scaling</En><Zh>扩缩容</Zh></td>
              <td><En>You set it up: Auto Scaling Group + load balancer, takes minutes</En><Zh>需自行配置：Auto Scaling Group + 负载均衡器，需要几分钟</Zh></td>
              <td><En>Automatic, one copy per concurrent request, takes seconds</En><Zh>自动，每个并发请求一个副本，几秒内完成</Zh></td>
            </tr>
            <tr>
              <td><En>Cost model</En><Zh>计费模式</Zh></td>
              <td><En>Pay per hour it's running, busy or idle</En><Zh>按运行小时数计费，无论繁忙还是空闲</Zh></td>
              <td><En>Pay per request and ms of run time; idle is free</En><Zh>按请求次数和运行毫秒数计费；空闲免费</Zh></td>
            </tr>
            <tr>
              <td><En>Latency</En><Zh>延迟</Zh></td>
              <td><En>Consistent, always warm</En><Zh>稳定，始终预热</Zh></td>
              <td><En>Occasional cold-start spikes</En><Zh>偶发冷启动延迟峰值</Zh></td>
            </tr>
            <tr>
              <td><En>State &amp; connections</En><Zh>状态与连接</Zh></td>
              <td><En>Can hold WebSockets and one long-lived DB pool</En><Zh>可维持 WebSocket 连接和长期数据库连接池</Zh></td>
              <td><En>Nothing persists; each copy opens its own DB connection</En><Zh>无持久状态；每个副本自行建立数据库连接</Zh></td>
            </tr>
          </tbody>
        </table>
        <div className="concept">
          <p className="concept-label"><En>How to choose</En><Zh>如何选择</Zh></p>
          <ul>
            <li>
              <En><strong>Lambda</strong> wins for event-driven, bursty or low-traffic work: the upload
              handler, the nightly report, the webhook that gets hit 50 times a day.</En>
              <Zh><strong>Lambda</strong> 适合事件驱动、流量突发或低流量场景：上传处理、每晚报告、每天被调用 50 次的 webhook。</Zh>
            </li>
            <li>
              <En><strong>EC2</strong> wins for steady, high traffic, long-running work, persistent
              connections, and anything sensitive to latency spikes.</En>
              <Zh><strong>EC2</strong> 适合流量稳定、高并发、长期运行的工作、持久连接，以及对延迟峰值敏感的场景。</Zh>
            </li>
            <li>
              <En><strong>The cost crossover:</strong> Lambda is far cheaper while traffic is low or
              spiky. Under constant heavy load, you're paying per request around the clock, and an
              always-on server becomes cheaper.</En>
              <Zh><strong>成本拐点：</strong>流量低或突发时 Lambda 远比 EC2 便宜。在持续高负载下，全天按请求计费的总成本会超过常驻服务器，此时 EC2 更划算。</Zh>
            </li>
            <li>
              <En>Real systems usually <strong>mix both</strong>: the main API on EC2 (or containers),
              and side jobs like thumbnails, emails and PDFs on Lambda. Containers on ECS/Fargate
              sit in between the two and come up on Day 17.</En>
              <Zh>实际系统通常<strong>两者并用</strong>：主 API 跑在 EC2（或容器）上，缩略图、邮件、PDF 等边缘任务交给 Lambda。ECS/Fargate 上的容器介于两者之间，将在 Day 17 介绍。</Zh>
            </li>
          </ul>
        </div>

        <h3><En>RDS vs. DynamoDB</En><Zh>RDS vs. DynamoDB</Zh></h3>
        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th>RDS</th>
              <th>DynamoDB</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Data model</En><Zh>数据模型</Zh></td>
              <td><En>Tables with a fixed schema, joined at query time</En><Zh>固定 schema 的表，查询时关联</Zh></td>
              <td><En>Items looked up by key, no joins</En><Zh>通过 key 查找条目，无 join</Zh></td>
            </tr>
            <tr>
              <td><En>Querying</En><Zh>查询</Zh></td>
              <td><En>Any question you can write in SQL, any time</En><Zh>任何 SQL 都能随时查询</Zh></td>
              <td><En>Fast only through the key; new questions may need a new index</En><Zh>只有通过 key 才快；新的查询需求可能要新建索引</Zh></td>
            </tr>
            <tr>
              <td><En>Transactions</En><Zh>事务</Zh></td>
              <td><En>Full ACID across tables</En><Zh>跨表完整 ACID 事务</Zh></td>
              <td><En>Limited transactions; reads eventually consistent by default</En><Zh>事务支持有限；读默认最终一致</Zh></td>
            </tr>
            <tr>
              <td><En>Scaling</En><Zh>扩展</Zh></td>
              <td><En>Bigger instance + read replicas; writes capped by one primary</En><Zh>升级实例 + 只读副本；写操作受限于单主节点</Zh></td>
              <td><En>Horizontal and automatic, reads and writes alike</En><Zh>读写均可自动水平扩展</Zh></td>
            </tr>
            <tr>
              <td><En>You manage</En><Zh>你负责管理</Zh></td>
              <td><En>Instance size, connections, some tuning</En><Zh>实例规格、连接数、部分调优</Zh></td>
              <td><En>Key design, and not much else</En><Zh>key 设计，其余基本不用管</Zh></td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <En>Default to relational; move one specific high-volume, simple-access dataset to DynamoDB
          when you can prove SQL is the bottleneck — it's rarely all-or-nothing.</En>
          <Zh>默认选关系型数据库；只有在能证明 SQL 是瓶颈时，才将某个特定的高量、简单访问的数据集迁移到 DynamoDB——这很少是非此即彼的选择。</Zh>
        </p>

        <h3><En>Where does a file go? S3 vs. the database vs. the server's disk</En><Zh>文件该存哪？S3 vs. 数据库 vs. 服务器磁盘</Zh></h3>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Store it in</En><Zh>存储位置</Zh></th>
              <th><En>When</En><Zh>适用场景</Zh></th>
              <th><En>Why</En><Zh>原因</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>S3</td>
              <td><En>The file itself: images, PDFs, uploads</En><Zh>文件本身：图片、PDF、上传内容</Zh></td>
              <td><En>Cheap, unlimited, and servable by URL</En><Zh>便宜、无限容量、可通过 URL 直接访问</Zh></td>
            </tr>
            <tr>
              <td><En>The database</En><Zh>数据库</Zh></td>
              <td><En>The file's S3 key and its metadata (owner, size, date)</En><Zh>文件的 S3 key 及元数据（所有者、大小、日期）</Zh></td>
              <td><En>Large binary data bloats the DB and slows backups</En><Zh>大型二进制数据会撑大数据库并拖慢备份</Zh></td>
            </tr>
            <tr>
              <td><En>The EC2 disk</En><Zh>EC2 磁盘</Zh></td>
              <td><En>Temporary scratch work only</En><Zh>仅用于临时中间文件</Zh></td>
              <td><En>Belongs to one instance; lost or invisible to others once you scale out</En><Zh>属于单个实例；扩容后对其他实例不可见或丢失</Zh></td>
            </tr>
          </tbody>
        </table>

        <h3><En>IAM vs. security groups vs. database login</En><Zh>IAM vs. 安全组 vs. 数据库用户</Zh></h3>
        <p>
          <En>Three separate locks, and a request to your database has to get past all of them:</En>
          <Zh>三道独立的锁，访问数据库的请求必须依次通过：</Zh>
        </p>
        <ul>
          <li>
            <En><strong>IAM</strong> controls calls to <em>AWS's API</em>: who can create, delete or
            resize the RDS instance, or read from an S3 bucket.</En>
            <Zh><strong>IAM</strong> 控制对 <em>AWS API</em> 的调用：谁能创建、删除或调整 RDS 实例规格，谁能读取 S3 存储桶。</Zh>
          </li>
          <li>
            <En><strong>Security groups</strong> control <em>network traffic</em>: which machines can
            even open a connection to port 5432.</En>
            <Zh><strong>安全组</strong> 控制<em>网络流量</em>：哪些机器能向 5432 端口发起连接。</Zh>
          </li>
          <li>
            <En><strong>The database's own users</strong> control <em>what happens once connected</em>:
            the Postgres username and password, and what that user can read and write.</En>
            <Zh><strong>数据库自身的用户</strong> 控制<em>连接成功后能做什么</em>：Postgres 用户名和密码，以及该用户的读写权限。</Zh>
          </li>
        </ul>

        <h3><En>How it fits together</En><Zh>整体架构</Zh></h3>
        <CodeBlock
          language="plaintext"
          code={`                     users
                       │
          ┌────────────▼─────────────┐   public subnet
          │   Load balancer (ALB)    │
          └────────────┬─────────────┘
                       │
          ┌────────────▼─────────────┐   private subnet
          │ Auto Scaling Group: EC2  │── IAM role ──► Secrets Manager (DB password)
          │  EC2   EC2   EC2  (API)  │── IAM role ──► S3 (presigned URLs)
          └────────────┬─────────────┘                  │ upload event
                       │ port 5432 (security group)     ▼
          ┌────────────▼─────────────┐           Lambda (thumbnail / PDF)
          │ RDS Postgres + Multi-AZ  │   private subnet
          └──────────────────────────┘

          CloudWatch collects logs + metrics from all of it
          Terraform defines all of it`}
        />
      </section>
    </div>
  );
}
