import DayNav from "../../components/DayNav";

export default function Concepts() {
  return (
    <div className="page concepts-page">
      <title>Day 19 — Concepts Reference</title>
      <DayNav day="day19-realtime-graphql" current="concepts" />
      <h1>Day 19 — Concepts Reference</h1>
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
          <summary>Why is it slow for a browser to call several microservices to build one page?</summary>
          <div className="answer">
            <p>
              Every call crosses the internet, and some can&apos;t start until an earlier one answers — you need the order ids
              before you can ask for their shipments. On a laptop on Wi-Fi (~20 ms a trip) nobody notices; on a phone on
              cellular (100–300 ms a trip) the waves stack into a visible delay. And every client re-implements the same
              calls and stitching.
            </p>
          </div>
        </details>

        <details>
          <summary>What does an aggregation layer do, and why is it faster?</summary>
          <div className="answer">
            <p>
              The browser makes one request to it, and it makes the many requests to the services. It runs next to them
              in the datacenter, so each of its calls takes about a millisecond instead of a trip across the internet,
              and it runs them in parallel. The services themselves don&apos;t change.
            </p>
          </div>
        </details>

        <details>
          <summary>Explain over-fetching and under-fetching with a concrete example.</summary>
          <div className="answer">
            <p>
              Over-fetching: <code>GET /products/sku-101</code> returns ~25 fields, and a product card shows 3.
              Under-fetching: no one endpoint has enough, so a product page calls products, then reviews, then stock.
              GraphQL fixes both: one request, exactly the fields asked for.
            </p>
          </div>
        </details>

        <details>
          <summary>Why use GraphQL for an aggregation layer instead of a REST endpoint?</summary>
          <div className="answer">
            <p>
              A REST aggregation endpoint has one fixed response shape. When the mobile app wants fewer fields or a new
              screen wants a different mix, you either over-fetch or add another endpoint and redeploy. With GraphQL each
              screen and client sends its own query to the same endpoint.
            </p>
          </div>
        </details>

        <details>
          <summary>Why was GraphQL created, and why did so many teams later move away from it?</summary>
          <div className="answer">
            <p>
              Facebook built it (2012, open-sourced 2015) so its mobile app could fetch exactly what each screen needed in
              one request over slow cellular networks. It then became fashionable and was adopted everywhere — often by teams
              without that problem — and they paid for the complexity: N+1 resolvers, query-cost limits, per-field
              authorization, no HTTP caching. Many went back to REST and kept GraphQL only where many clients need different
              views of the same data.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a resolver?</summary>
          <div className="answer">
            <p>
              A function that returns the value of one field. It receives the parent object, so{" "}
              <code>Order.shipment</code> gets the order and knows which id to look up. Fields without a resolver just read
              the property of the same name, and only the resolvers for requested fields ever run.
            </p>
          </div>
        </details>

        <details>
          <summary>What&apos;s the difference between a query and a mutation?</summary>
          <div className="answer">
            <p>
              A query reads; a mutation writes. Both return fields the client chooses. One difference in execution: the
              top-level fields of a query can run in parallel, while a mutation&apos;s top-level fields run one after
              another, in order.
            </p>
          </div>
        </details>

        <details>
          <summary>Why does GraphQL return <code>200</code> for an error?</summary>
          <div className="answer">
            <p>
              The HTTP request itself succeeded; the failure is inside the response, in an <code>errors</code> array next
              to <code>data</code>. One field can fail while others succeed (a partial success), which a single status
              code can&apos;t describe. Clients must check <code>errors</code>, and monitoring has to as well.
            </p>
          </div>
        </details>

        <details>
          <summary>When would you choose REST over GraphQL?</summary>
          <div className="answer">
            <p>
              Calls between backend services, simple CRUD apps with one client, cache-heavy public reads behind a CDN, and
              file uploads or downloads. REST is simpler, gets HTTP caching for free, and every tool understands it.
              GraphQL earns its cost when many screens or clients need different shapes of connected data.
            </p>
          </div>
        </details>

        <details>
          <summary>Besides a BFF, what kind of service is a good fit for GraphQL?</summary>
          <div className="answer">
            <p>
              One whose data is complicated and heavily connected, and that many clients query in different ways: a headless
              CMS (pages built from blocks), a product catalog management system (attributes that differ by category), a
              media library, or a product-compatibility graph. Each client asks for its own slice, instead of the backend
              building a new endpoint for every screen.
            </p>
          </div>
        </details>

        <details>
          <summary>What&apos;s wrong with short polling?</summary>
          <div className="answer">
            <p>
              Most requests come back with &quot;nothing changed&quot;, which is wasted work. Updates arrive up to one
              interval late. And cost grows with users × frequency: 10,000 pages polling every 2 s is 5,000 requests a
              second.
            </p>
          </div>
        </details>

        <details>
          <summary>How is long polling different from short polling?</summary>
          <div className="answer">
            <p>
              The server holds the request open until something changes (or a timeout passes), then answers, and the
              client immediately asks again. Updates arrive almost instantly with far fewer wasted requests — at the cost
              of the server holding one open request per waiting client.
            </p>
          </div>
        </details>

        <details>
          <summary>When would you choose SSE over a WebSocket?</summary>
          <div className="answer">
            <p>
              When only the server needs to send: streaming an AI answer, live scores, price tickers, notifications. SSE
              is plain HTTP, very little code, and the browser reconnects by itself. Choose WebSocket when the browser
              also sends often, like chat or a multiplayer game.
            </p>
          </div>
        </details>

        <details>
          <summary>What is Socket.IO, and how does it relate to WebSocket?</summary>
          <div className="answer">
            <p>
              A library built on top of WebSocket that adds automatic reconnects, rooms, broadcasting, acknowledgements,
              and a long-polling fallback. It has its own protocol, so a Socket.IO client can&apos;t talk to a plain
              WebSocket server, or the other way round.
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
          <summary>Why does GraphQL create an N+1 problem, and how does DataLoader fix it?</summary>
          <div className="answer">
            <p>
              Resolvers run per object: <code>OrderItem.product</code> runs once per line item, so ten items make ten
              calls. DataLoader collects every key requested in the same tick and fetches them in one batch, like{" "}
              <code>GET /products?ids=…</code> or <code>WHERE id IN (…)</code>.
            </p>
          </div>
        </details>

        <details>
          <summary>Why must a DataLoader be created per request rather than once per process?</summary>
          <div className="answer">
            <p>
              It caches what it loads. Shared across requests, one user&apos;s data could be served to another user
              (and stale data would never refresh). One loader per request keeps the cache to a single request.
            </p>
          </div>
        </details>

        <details>
          <summary>How do you stop a client from sending a deliberately expensive query?</summary>
          <div className="answer">
            <p>
              A depth limit (reject deep nesting before anything runs), a cost limit (give fields a cost and cap the
              total, which also catches the same field repeated under many aliases), capped pagination, timeouts, rate
              limiting — or persisted queries, so the server only accepts queries registered ahead of time.
            </p>
          </div>
        </details>

        <details>
          <summary>What does GraphQL cost you in caching, compared to REST?</summary>
          <div className="answer">
            <p>
              REST GETs are cached for free by browsers, proxies, and CDNs. GraphQL sends every request as a POST to one
              URL, so none of that applies. Caching moves to the client (e.g. Apollo Client&apos;s cache) or to persisted
              queries sent as GETs.
            </p>
          </div>
        </details>

        <details>
          <summary>How is authorization different in GraphQL?</summary>
          <div className="answer">
            <p>
              It&apos;s checked per field, not per endpoint. A single query can reach a public product name and a private
              order total, so each resolver (or a schema-level rule) has to check whether this user may see this field.
            </p>
          </div>
        </details>

        <details>
          <summary>How do you version a GraphQL API?</summary>
          <div className="answer">
            <p>
              Usually you don&apos;t add <code>/v2</code>. You add new fields beside the old ones, mark the old ones{" "}
              <code>@deprecated</code>, and remove them once no client asks for them — easy to check, because clients
              name every field they use.
            </p>
          </div>
        </details>

        <details>
          <summary>What is the WebSocket handshake, technically?</summary>
          <div className="answer">
            <p>
              An HTTP GET with <code>Upgrade: websocket</code> and a <code>Sec-WebSocket-Key</code> header. The server
              answers <code>101 Switching Protocols</code> with a matching <code>Sec-WebSocket-Accept</code>, and from then
              on the same TCP connection speaks the WebSocket protocol instead of HTTP.
            </p>
          </div>
        </details>

        <details>
          <summary>Why is a WebSocket server harder to scale than a REST server?</summary>
          <div className="answer">
            <p>
              Each client holds a long-lived connection to one specific server. An update that happens on server A must
              reach clients connected to server B, so you need a pub/sub layer (such as Redis) between servers, and
              often sticky sessions at the load balancer.
            </p>
          </div>
        </details>

        <details>
          <summary>How does SSE handle a dropped connection?</summary>
          <div className="answer">
            <p>
              The browser&apos;s <code>EventSource</code> reconnects automatically and sends a{" "}
              <code>Last-Event-ID</code> header with the id of the last event it received, so the server can send what it
              missed.
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
