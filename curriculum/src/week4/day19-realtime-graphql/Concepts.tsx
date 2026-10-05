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
          <summary>What is a BFF, and what problem does it solve?</summary>
          <div className="answer">
            <p>
              A BFF (Backend for Frontend) is a backend layer that sits between the clients and the microservices. The
              client makes one request to it; it makes the many requests to the services and returns exactly the shape
              that screen needs.
            </p>
            <p>
              The problem: different clients need different views of the same data. A web dashboard wants everything, a
              phone list wants three fields, an admin tool wants audit fields — but the microservices expose generic,
              resource-shaped endpoints, so each client over-fetches (fields it never shows) and under-fetches (several
              calls to stitch one page together). Doing that stitching in the browser means many round trips across the
              internet, and every client re-implements it. A BFF moves it into the datacenter next to the services, where
              each call takes about a millisecond and they can run in parallel. The services themselves don&apos;t change.
            </p>
          </div>
        </details>

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
          <summary>What is a GraphQL schema?</summary>
          <div className="answer">
            <p>
              The contract of the API: it defines the types, their fields, how they connect (an <code>Order</code> has a{" "}
              <code>shipment</code>), and the entry points, <code>Query</code> and <code>Mutation</code>. It&apos;s strongly
              typed, so every request is validated against it before anything runs, and clients can read it to get
              documentation and autocomplete. Resolvers are the code that fills in each field.
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
          <summary>What is a WebSocket?</summary>
          <div className="answer">
            <p>
              A persistent, two-way connection between the browser and the server. It starts as an HTTP request that
              upgrades the connection; after that, either side can send a message at any moment without a new request.
              It&apos;s what chat, multiplayer games, and collaborative editing are built on.
            </p>
          </div>
        </details>

        <details>
          <summary>What are Server-Sent Events (SSE)?</summary>
          <div className="answer">
            <p>
              A one-way stream from the server to the browser. The browser opens a normal HTTP request with{" "}
              <code>EventSource</code>, the server keeps the response open and writes text events to it whenever it has
              something to send, and the browser never sends anything back over that connection.
            </p>
          </div>
        </details>

        <details>
          <summary>When would you choose SSE over a WebSocket?</summary>
          <div className="answer">
            <p>
              When only the server needs to send: streaming an AI answer, live scores, price tickers, notifications.
              SSE is plain HTTP, so it works with existing proxies, load balancers, and cookies; the browser reconnects
              by itself and sends <code>Last-Event-ID</code> so the server can resend what it missed; and it needs very
              little code. The limits are that it&apos;s text-only and one-way.
            </p>
            <p>
              Choose WebSocket when the browser also sends often, like chat or a multiplayer game, or when you need
              binary data. In return you handle reconnects and heartbeats yourself, and scaling is harder — each client
              holds a connection to one specific server, so you need a pub/sub layer between servers.
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
          <summary>How do REST and GraphQL compare?</summary>
          <div className="answer">
            <table className="ref-table">
              <thead>
                <tr>
                  <th></th>
                  <th>REST</th>
                  <th>GraphQL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Endpoints</td>
                  <td>Many — one URL per resource, with the HTTP method as the action</td>
                  <td>One URL; the query says what you want</td>
                </tr>
                <tr>
                  <td>Response shape</td>
                  <td>Fixed by the server</td>
                  <td>Chosen by the client, field by field</td>
                </tr>
                <tr>
                  <td>Over- / under-fetching</td>
                  <td>Common — extra fields, or several calls per screen</td>
                  <td>Avoided — one request, exactly the fields asked for</td>
                </tr>
                <tr>
                  <td>Contract and docs</td>
                  <td>Optional (OpenAPI), kept separately</td>
                  <td>Built in — a typed schema every request is checked against</td>
                </tr>
                <tr>
                  <td>Versioning</td>
                  <td>Usually <code>/v1</code>, <code>/v2</code></td>
                  <td>Add fields, deprecate old ones, no new version</td>
                </tr>
                <tr>
                  <td>Caching</td>
                  <td>Free — GETs are cached by browsers, proxies, and CDNs</td>
                  <td>Hard — every request is a POST to one URL, so caching moves to the client</td>
                </tr>
                <tr>
                  <td>Errors</td>
                  <td>HTTP status codes (404, 500)</td>
                  <td><code>200</code> with an <code>errors</code> array, so partial success is possible</td>
                </tr>
                <tr>
                  <td>Authorization</td>
                  <td>Per endpoint</td>
                  <td>Per field — one query can reach public and private data</td>
                </tr>
                <tr>
                  <td>Cost</td>
                  <td>Simple, and every tool understands it</td>
                  <td>N+1 resolvers, query-cost limits, a steeper learning curve</td>
                </tr>
              </tbody>
            </table>
            <p>
              Rule of thumb: REST for service-to-service calls, simple CRUD, and cache-heavy public reads; GraphQL when
              many screens or clients need different shapes of connected data.
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
