import DayNav from "../../components/DayNav";

export default function Concepts() {
  return (
    <div className="page concepts-page">
      <title>Day 20 — Concepts Reference</title>
      <DayNav day="day20-system-design" current="concepts" />
      <h1>Day 20 — Concepts Reference</h1>
      <p className="intro">
        A reference list of concept questions — try answering each one before revealing it.
      </p>

      <section id="tier-1">
        <h2>1. Basic concepts</h2>
        <p className="tier-note">
          Foundational stuff — straight from the lecture and/or comes up constantly in interviews. If
          you&apos;re shaky on any of these, that&apos;s the priority to fix.
        </p>

        <details>
          <summary>State the CAP theorem precisely — what&apos;s wrong with &quot;pick two&quot;?</summary>
          <div className="answer">
            <p>
              The choice only exists <em>during a network partition</em>: then you pick consistency
              or availability. With no partition you get both. And since partitions are unavoidable
              in a distributed system, the real choice is always CP or AP.
            </p>
          </div>
        </details>

        <details>
          <summary>Apply CAP to this system: the Inventory service is unreachable. What do you do?</summary>
          <div className="answer">
            <p>
              AP means accepting the order and reserving stock later, risking an oversell. CP means
              rejecting orders until Inventory answers, losing sales. Retail normally picks AP for
              intake — a rare oversell is cheaper than refusing every customer mid-flash-sale.
            </p>
          </div>
        </details>

        <details>
          <summary>Why is CAP a per-operation decision rather than a per-system one?</summary>
          <div className="answer">
            <p>
              Different operations have different tolerance for staleness. The same system can be CP
              for inventory reservation (correctness matters) and AP for order status display (a
              slightly stale status is harmless).
            </p>
          </div>
        </details>

        <details>
          <summary>What makes a service horizontally scalable in the first place?</summary>
          <div className="answer">
            <p>
              Statelessness — any instance can serve any request because nothing needed lives in one
              process&apos;s memory. That&apos;s exactly why Day 16 used stateless JWTs rather than
              server-side sessions.
            </p>
          </div>
        </details>

        <details>
          <summary>Compare vertical and horizontal scaling.</summary>
          <div className="answer">
            <p>
              Vertical means a bigger machine — simple, no code changes, but it has a hard ceiling
              and it&apos;s still a single point of failure. Horizontal means more machines —
              effectively unlimited and fault-tolerant, but it requires statelessness or shared
              state. Databases scale up first; app servers scale out.
            </p>
          </div>
        </details>

        <details>
          <summary>Walk through what happens when a browser resolves <code>orders.retailco.com</code>.</summary>
          <div className="answer">
            <p>
              Browser cache → OS cache → recursive resolver → root nameserver (&quot;ask .com&quot;)
              → TLD nameserver (&quot;ask this authoritative NS&quot;) → authoritative nameserver
              returns the IP and a TTL. Every layer caches the answer for that TTL.
            </p>
          </div>
        </details>

        <details>
          <summary>Why lower a DNS TTL before a migration rather than during it?</summary>
          <div className="answer">
            <p>
              Resolvers already hold the answer for the <em>old</em> TTL, so a change made at cutover
              time doesn&apos;t reach them for that long. Lowering it a day ahead means caches expire
              quickly by the time you actually switch.
            </p>
          </div>
        </details>

        <details>
          <summary>What belongs on a CDN, and what never does?</summary>
          <div className="answer">
            <p>
              Static, identical-for-everyone assets — JS/CSS bundles, fonts, product images. Never
              order status, inventory counts, or anything authenticated: those are per-user and must
              be correct rather than fast.
            </p>
          </div>
        </details>

        <details>
          <summary>Why does a content hash in a filename make cache invalidation a non-problem?</summary>
          <div className="answer">
            <p>
              A new build produces a new filename, so there&apos;s nothing stale to invalidate — you
              can safely set a one-year TTL on <code>app.9f2c1a.js</code> because that exact file
              will never change.
            </p>
          </div>
        </details>

        <details>
          <summary>When would you use least-connections instead of round-robin?</summary>
          <div className="answer">
            <p>
              When request durations vary a lot. Round-robin assumes requests cost roughly the same;
              if some take ten seconds, it will keep handing work to an instance that&apos;s already
              saturated.
            </p>
          </div>
        </details>
      </section>

      <section id="tier-2">
        <h2>2. Advanced concepts</h2>
        <p className="tier-note">
          Less commonly asked, and some go beyond what today&apos;s lecture covered — mostly
          &quot;gotcha&quot; interview trivia and things that sharpen how you code without being
          asked often.
        </p>

        <details>
          <summary>What makes a health check useless, and what does a good one test?</summary>
          <div className="answer">
            <p>
              One that returns <code>200</code> without touching anything the service depends on —
              it stays green while every real request fails. A good one verifies the database
              connection and any critical dependency, so a sick instance is actually pulled from
              rotation.
            </p>
          </div>
        </details>

        <details>
          <summary>What is connection draining, and what does it make possible?</summary>
          <div className="answer">
            <p>
              The load balancer stops sending new requests to an instance while letting in-flight
              ones finish before it&apos;s removed. That&apos;s the mechanism behind zero-downtime
              deploys — and the gap Day 15&apos;s single EC2 box couldn&apos;t close.
            </p>
          </div>
        </details>

        <details>
          <summary>Why is <code>CNAME</code> illegal at the apex domain, and what do you use instead?</summary>
          <div className="answer">
            <p>
              A <code>CNAME</code> must be the only record for its name, but the apex also needs{" "}
              <code>NS</code> and <code>SOA</code> records. Providers offer a synthetic{" "}
              <code>ALIAS</code>/<code>ANAME</code> record that resolves like a CNAME but returns an
              address.
            </p>
          </div>
        </details>

        <details>
          <summary>What does PACELC add to CAP?</summary>
          <div className="answer">
            <p>
              It covers the normal case CAP ignores: if there&apos;s a Partition, choose A or C;{" "}
              <em>Else</em>, choose Latency or Consistency. Most systems trade consistency for
              latency even when nothing is broken, which CAP alone never describes.
            </p>
          </div>
        </details>

        <details>
          <summary>Why does scaling the app tier often make the database problem worse?</summary>
          <div className="answer">
            <p>
              Each new instance opens its own connection pool, so the database sees N × pool_size
              connections and can exhaust its limit. More app capacity just delivers load to the
              bottleneck faster — which is why a shared pooler like PgBouncer exists.
            </p>
          </div>
        </details>

        <details>
          <summary>What&apos;s the difference between an L4 and an L7 load balancer?</summary>
          <div className="answer">
            <p>
              L4 balances TCP connections without reading them — fast, protocol-agnostic. L7 reads
              the HTTP request, so it can route by path or host, terminate TLS, and retry idempotent
              requests. AWS&apos;s NLB and ALB are the respective examples.
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
