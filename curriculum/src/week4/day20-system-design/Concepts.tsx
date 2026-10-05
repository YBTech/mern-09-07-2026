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
          <summary>What steps do you follow in a system design interview?</summary>
          <div className="answer">
            <p>
              Clarify requirements, estimate capacity, draw a high-level design, deep-dive into the
              bottleneck the interviewer picks, then state your trade-offs. Ask before you draw, and say
              your assumptions out loud.
            </p>
          </div>
        </details>

        <details>
          <summary>State the CAP theorem. What does it mean for a design?</summary>
          <div className="answer">
            <p>
              During a network partition you must choose consistency or availability; with no partition
              you get both. Partitions are unavoidable, so the real choice is CP or AP — per operation,
              and a business decision (retail usually picks AP for order intake).
            </p>
          </div>
        </details>

        <details>
          <summary>What is the difference between horizontal and vertical scaling?</summary>
          <div className="answer">
            <p>
              Vertical means a bigger machine — it has a hard ceiling and is still a single point of
              failure. Horizontal means more machines — almost no ceiling and one failure doesn&apos;t
              take you down, but the service must be stateless (or share its state) so any instance can
              serve any request.
            </p>
          </div>
        </details>

        <details>
          <summary>What are the four fault-tolerance patterns, and what does each solve?</summary>
          <div className="answer">
            <p>
              <strong>Timeout</strong>: a hung dependency can&apos;t tie up your threads.{" "}
              <strong>Retry with backoff</strong>: survive transient failures without stampeding a
              recovering service. <strong>Circuit breaker</strong>: stop calling a dependency that stays
              down and return a fallback. <strong>Bulkhead</strong>: one slow dependency can&apos;t use up
              the resources the others need.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a circuit breaker?</summary>
          <div className="answer">
            <p>
              After N failures in a row it opens and fails calls instantly with a fallback instead of
              waiting out timeouts, then lets one trial call through after a while — if that succeeds, it
              closes again.
            </p>
          </div>
        </details>

        <details>
          <summary>Where in the stack can you cache, and what are the main strategies?</summary>
          <div className="answer">
            <p>
              Browser, CDN edge, application (Redis), and the database&apos;s own memory — each closer to
              the data and fresher, but slower to reach. The common write strategies are cache-aside (read
              the DB on a miss and fill the cache), write-through (write both together), and write-behind
              (write the cache, flush to the DB later).
            </p>
          </div>
        </details>

        <details>
          <summary>How do you choose a database?</summary>
          <div className="answer">
            <p>
              Match the data: relational (PostgreSQL) for consistency, joins, and transactions; document
              (MongoDB) for flexible nested data; key-value (Redis) for cache and sessions; time-series for
              metrics; search (Elasticsearch) for full-text. The safe default is PostgreSQL plus Redis.
            </p>
          </div>
        </details>

        <details>
          <summary>What is DNS?</summary>
          <div className="answer">
            <p>
              The system that turns a domain name into an IP address. The browser asks a DNS server for
              the domain&apos;s IP, gets it back, then sends its request to that IP.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a CDN, and what belongs on one?</summary>
          <div className="answer">
            <p>
              A network of servers around the world that caches files close to users. Put static files on
              it: JS/CSS bundles, fonts, images. Never put personal or constantly changing data on it,
              such as order status, inventory counts, or authenticated responses.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a load balancer, and how does it choose an instance?</summary>
          <div className="answer">
            <p>
              It spreads incoming requests across several instances of a service. Round robin picks the
              next instance in turn, least connections picks the one with the fewest open connections, and
              sticky routing sends the same client to the same instance.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a health check?</summary>
          <div className="answer">
            <p>
              A request the load balancer sends to each instance to see if it can serve traffic; a failing
              instance is pulled out before users notice. It must test what the service really needs, such
              as the database — a check that always returns <code>200</code> is useless.
            </p>
          </div>
        </details>

        <details>
          <summary>What is the difference between an API Gateway and a load balancer?</summary>
          <div className="answer">
            <p>
              The API Gateway is the front door: it routes each request to the right service and handles
              auth and rate limiting. The load balancer spreads requests across the many instances of one
              service.
            </p>
          </div>
        </details>

        <details>
          <summary>When would you choose React, Angular, or Next.js?</summary>
          <div className="answer">
            <p>
              React is a flexible, unopinionated library — fast to start, but conventions drift as the
              team grows. Angular is an opinionated framework — slower to start, but consistent for large,
              long-lived teams. Next.js adds server-side rendering to React for SEO and a fast first load.
            </p>
          </div>
        </details>

        <details>
          <summary>What problem does server-side rendering solve?</summary>
          <div className="answer">
            <p>
              A plain React app sends an empty HTML shell and builds the page in the browser, so the first
              paint is slow and crawlers may see nothing. With server-side rendering the server sends
              finished HTML, then the JavaScript hydrates it to make it interactive.
            </p>
          </div>
        </details>

        <details>
          <summary>Where do the security boundaries go in an AWS architecture?</summary>
          <div className="answer">
            <p>
              Services and databases sit in a private subnet with no public address; only the load balancer
              is public. A WAF at the edge blocks bad traffic, HTTPS ends at the front door, and passwords
              come from a secrets manager instead of being hard-coded.
            </p>
          </div>
        </details>

        <details>
          <summary>What is observability?</summary>
          <div className="answer">
            <p>
              Being able to see what your system is doing through three signals: logs (what happened),
              metrics (how much, how fast), and traces (which service made a request slow).
            </p>
          </div>
        </details>

        <details>
          <summary>What are database sharding and PACELC?</summary>
          <div className="answer">
            <p>
              <strong>Sharding</strong> splits one large table across several databases by a key — only at
              extreme scale, because it adds heavy operational cost. <strong>PACELC</strong> extends CAP:
              even with no partition, you still trade latency against consistency.
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
