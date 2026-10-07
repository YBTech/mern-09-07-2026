# Generates the three Grafana dashboards in grafana/dashboards/. Edit here, then run:
#
#     npm run dashboards          (Grafana reloads the files on its own within ~10s)
#
# Why a script and not hand-drawn dashboards? A dashboard is JSON, and a diff of generated JSON is
# unreadable. Here every panel is a few lines you can review, and every PromQL query sits next to
# the sentence that explains it.
#
# All latency queries use Prometheus *native histograms*, which is what OpenTelemetry's
# exponential histograms become (see services/shared/otel.ts). That's why you see
# histogram_quantile(0.95, rate(x[1m])) with no "_bucket" and no "le".
import json
import pathlib

PROM = {"type": "prometheus", "uid": "prometheus"}
LOKI = {"type": "loki", "uid": "loki"}
TEMPO = {"type": "tempo", "uid": "tempo"}

H = "http_server_request_duration_seconds"  # every service's server-side request duration
SERVICES = "gateway|catalog|orders|inventory|payments|notifications"
OUT = pathlib.Path(__file__).parent / "dashboards"

GREEN, ORANGE, RED = "green", "orange", "red"


class Dashboard:
    def __init__(self, uid, title, description):
        self.uid, self.title, self.description = uid, title, description
        self.panels, self.y = [], 0

    # ── layout ───────────────────────────────────────────────────────────────
    def _add(self, panel, x, w, h):
        panel.update(id=len(self.panels) + 1, gridPos={"x": x, "y": self.y, "w": w, "h": h})
        self.panels.append(panel)

    def row(self, title):
        self._add({"type": "row", "title": title, "collapsed": False, "panels": []}, 0, 24, 1)
        self.y += 1

    def line(self, *panels):
        """Place panels side by side. Each is (x, w, panel); the line is as tall as the tallest."""
        height = max(p[2]["_h"] for p in panels)
        for x, w, panel in panels:
            self._add({k: v for k, v in panel.items() if k != "_h"}, x, w, height)
        self.y += height

    def save(self):
        dashboard = {
            "uid": self.uid, "title": self.title, "description": self.description, "tags": ["day23"],
            "timezone": "browser", "schemaVersion": 39, "version": 1, "refresh": "5s",
            "time": {"from": "now-15m", "to": "now"}, "panels": self.panels,
            "templating": {"list": []}, "annotations": {"list": []},
            "links": [{"type": "dashboards", "tags": ["day23"], "asDropdown": False, "includeVars": False,
                       "keepTime": True, "title": "Day 23 dashboards", "icon": "dashboard"}],
        }
        path = OUT / f"{self.uid}.json"
        path.write_text(json.dumps(dashboard, indent=2) + "\n")
        print(f"wrote {path.name} ({len(self.panels)} panels)")


# ── query helpers ───────────────────────────────────────────────────────────────
def targets(queries, ds=PROM, instant=False):
    out = []
    for i, q in enumerate(queries):
        t = dict(q, datasource=ds, refId=chr(65 + i))
        if instant:
            t["instant"] = True
        out.append(t)
    return out


def q(expr, legend=None, **extra):
    return dict({"expr": expr, **({"legendFormat": legend} if legend else {})}, **extra)


def steps(*pairs):
    """steps((None, 'green'), (0.5, 'orange'), (1, 'red')) → Grafana threshold steps."""
    return [{"color": color, "value": value} for value, color in pairs]


def quantile(p, metric, by="service_name", sel="", window="1m"):
    sel = f"{{{sel}}}" if sel else ""
    return f"histogram_quantile({p}, sum by ({by}) (rate({metric}{sel}[{window}])))"


def rate_count(metric, by="service_name", sel="", window="30s"):
    sel = f"{{{sel}}}" if sel else ""
    return f"sum by ({by}) (histogram_count(rate({metric}{sel}[{window}])))"


# ── panel builders (each returns a panel dict; Dashboard.line() places it) ───────
def timeseries(title, desc, queries, unit, h=9, threshold=None, stack=False, decimals=None, overrides=None, max_=None, min_=0):
    defaults = {"unit": unit, "min": min_, "custom": {"lineWidth": 2, "fillOpacity": 25 if stack else 8, "showPoints": "never", "spanNulls": True,
                                                       **({"stacking": {"mode": "normal", "group": "A"}} if stack else {})}}
    if max_ is not None:
        defaults["max"] = max_
    if decimals is not None:
        defaults["decimals"] = decimals
    if threshold is not None:
        defaults["thresholds"] = {"mode": "absolute", "steps": steps((None, GREEN), (threshold, RED))}
        defaults["custom"]["thresholdsStyle"] = {"mode": "dashed"}
    return {"_h": h, "type": "timeseries", "title": title, "description": desc, "datasource": PROM, "targets": targets(queries),
            "interval": "10s",  # the bundled Prometheus datasource defaults to one point per 60s; 10s keeps lines live
            "fieldConfig": {"defaults": defaults, "overrides": overrides or []},
            "options": {"legend": {"displayMode": "list", "placement": "bottom"}, "tooltip": {"mode": "multi", "sort": "desc"}}}


def stat(title, desc, expr, unit, thresholds, h=4, decimals=None, graph=True):
    defaults = {"unit": unit, "thresholds": {"mode": "absolute", "steps": thresholds}, "color": {"mode": "thresholds"}}
    if decimals is not None:
        defaults["decimals"] = decimals
    return {"_h": h, "type": "stat", "title": title, "description": desc, "datasource": PROM, "interval": "10s",
            "targets": targets([q(expr)]),
            "fieldConfig": {"defaults": defaults, "overrides": []},
            "options": {"colorMode": "background", "graphMode": "area" if graph else "none", "textMode": "value",
                        "reduceOptions": {"calcs": ["lastNotNull"], "values": False}}}


def bars(title, desc, queries, unit, thresholds, h=9, decimals=None):
    defaults = {"unit": unit, "thresholds": {"mode": "absolute", "steps": thresholds}}
    if decimals is not None:
        defaults["decimals"] = decimals
    return {"_h": h, "type": "bargauge", "title": title, "description": desc, "datasource": PROM, "targets": targets(queries, instant=True),
            "fieldConfig": {"defaults": defaults, "overrides": []},
            "options": {"orientation": "horizontal", "displayMode": "gradient", "showUnfilled": True, "valueMode": "color",
                        "namePlacement": "left", "text": {"titleSize": 13, "valueSize": 18}, "reduceOptions": {"calcs": ["lastNotNull"], "values": False}}}


def text(markdown, h=5):
    return {"_h": h, "type": "text", "title": "", "options": {"mode": "markdown", "content": markdown}}


# ═════════════════════════════════════════════════════════════════════════════════
# Dashboard 1: Overview. "Is the shop healthy? Which service is slow? What failed?"
# ═════════════════════════════════════════════════════════════════════════════════
d = Dashboard("day23-overview", "Day 23 · 1 Overview", "Health, response time of every service, and where errors come from. Start here.")

d.row("The four golden signals, for the whole shop (measured at the gateway: what a customer feels)")
GW = 'service_name="gateway"'
d.line(
    (0, 6, stat("Traffic: requests / second", "Requests the gateway is serving right now.", rate_count(H, by="", sel=GW), "reqps",
                steps((None, "blue")), decimals=1)),
    (6, 6, stat("Errors: % of requests failing (5xx)", "Share of gateway requests that ended in a 5xx. Green below 1%.",
                f'100 * sum(histogram_count(rate({H}{{{GW},http_response_status_code=~"5.."}}[1m]))) / sum(histogram_count(rate({H}{{{GW}}}[1m])))',
                "percent", steps((None, GREEN), (1, ORANGE), (5, RED)), decimals=1)),
    (12, 6, stat("Latency: p95 at the gateway", "95% of requests finished faster than this.", quantile(0.95, H, by="", sel=GW), "s",
                 steps((None, GREEN), (0.5, ORANGE), (1.5, RED)), decimals=2)),
    (18, 6, stat("Orders placed / minute", "Successful checkouts. The number the business actually cares about.",
                 "sum(rate(shop_orders_placed_total[1m])) * 60", "none", steps((None, "blue")), decimals=0)),
)

d.row("Response time of every microservice (server side: how long each service takes to answer)")
SVC = f'service_name=~"{SERVICES}"'
d.line(
    (0, 8, timeseries("p50 latency: the typical request", "Half of each service's requests are faster than this.", [q(quantile(0.5, H, sel=SVC), "{{service_name}}")], "s")),
    (8, 8, timeseries("p95 latency: 1 request in 20 is slower", "The line to alert on. Averages hide this tail.", [q(quantile(0.95, H, sel=SVC), "{{service_name}}")], "s")),
    (16, 8, timeseries("p99 latency: the worst 1 in 100", "The tail. It is where queues, locks and timeouts show up first.", [q(quantile(0.99, H, sel=SVC), "{{service_name}}")], "s")),
)

# One table, one row per endpoint. Every query builds the same "endpoint" label so Grafana can join them.
def per_route(expr):
    return f'label_join({expr}, "endpoint", "  ", "service_name", "http_route")'

BY = "service_name, http_route"
R = f"{H}{{{SVC},http_route!=\"\"}}"
route_queries = [
    q(per_route(f"sum by ({BY}) (histogram_count(rate({R}[2m])))"), format="table", instant=True),
    q(per_route(f"histogram_quantile(0.5, sum by ({BY}) (rate({R}[2m])))"), format="table", instant=True),
    q(per_route(f"histogram_quantile(0.95, sum by ({BY}) (rate({R}[2m])))"), format="table", instant=True),
    q(per_route(f"histogram_quantile(0.99, sum by ({BY}) (rate({R}[2m])))"), format="table", instant=True),
    q(per_route(f'100 * sum by ({BY}) (histogram_count(rate({H}{{{SVC},http_route!="",http_response_status_code=~"5.."}}[2m]))) '
                f'/ sum by ({BY}) (histogram_count(rate({R}[2m])))'), format="table", instant=True),
]
cell = lambda unit, mode_steps=None: [{"id": "unit", "value": unit}] + (
    [{"id": "thresholds", "value": {"mode": "absolute", "steps": mode_steps}}, {"id": "custom.cellOptions", "value": {"type": "color-background"}}] if mode_steps else [])
route_table = {
    "_h": 11, "type": "table", "title": "Every endpoint of every service (last 2 min). Click a column header to sort",
    "description": "Which endpoint is the slowest? Sort by p95. Which fails? Sort by error %.",
    "datasource": PROM, "targets": targets(route_queries, instant=True),
    "transformations": [
        {"id": "joinByField", "options": {"byField": "endpoint", "mode": "outer"}},
        {"id": "organize", "options": {
            "excludeByName": {"Time": True, "service_name": True, "http_route": True},
            "indexByName": {"endpoint": 0, "Value #A": 1, "Value #B": 2, "Value #C": 3, "Value #D": 4, "Value #E": 5},
            "renameByName": {"endpoint": "service  endpoint", "Value #A": "req/s", "Value #B": "p50", "Value #C": "p95", "Value #D": "p99", "Value #E": "errors %"}}},
    ],
    "fieldConfig": {"defaults": {}, "overrides": [
        {"matcher": {"id": "byName", "options": "req/s"}, "properties": cell("reqps")},
        {"matcher": {"id": "byName", "options": "p50"}, "properties": cell("s")},
        {"matcher": {"id": "byName", "options": "p95"}, "properties": cell("s", steps((None, GREEN), (0.3, ORANGE), (1, RED)))},
        {"matcher": {"id": "byName", "options": "p99"}, "properties": cell("s", steps((None, GREEN), (0.5, ORANGE), (2, RED)))},
        {"matcher": {"id": "byName", "options": "errors %"}, "properties": cell("percent", steps((None, GREEN), (1, ORANGE), (5, RED)))},
    ]},
    "options": {"showHeader": True, "sortBy": [{"displayName": "p95", "desc": True}]},
}
d.line((0, 24, route_table))

d.row("Traffic and errors, per service")
d.line(
    (0, 8, timeseries("Traffic: requests / second", "How busy each service is. One checkout makes calls to 4–5 services.", [q(rate_count(H, sel=SVC), "{{service_name}}")], "reqps")),
    (8, 8, timeseries("Errors: % of requests failing (5xx), per route", "Dashed red line: a 1% alert threshold. Only routes that actually have errors appear.",
                      [q(f'100 * sum by (service_name, http_route) (histogram_count(rate({H}{{{SVC},http_response_status_code=~"5.."}}[30s]))) '
                         f'/ sum by (service_name, http_route) (histogram_count(rate({H}{{{SVC}}}[30s])))', "{{service_name}} {{http_route}}")], "percent", threshold=1)),
    (16, 8, timeseries("Unhandled exceptions by type", "Our error handler counts every uncaught exception by its type. A TypeError is a code bug, not a bad request.",
                       [q("sum by (service_name, error_type) (rate(app_errors_unhandled_total[30s]))", "{{service_name}} · {{error_type}}")], "ops")),
)

d.row("How the services talk to each other (built by Tempo from the traces)")
d.line(
    (0, 12, {"_h": 11, "type": "nodeGraph", "title": "Service map", "description": "Boxes are services, arrows are calls. Node color shows the error share; edges show request rate and latency.",
             "datasource": TEMPO, "targets": targets([{"queryType": "serviceMap"}], ds=TEMPO)}),
    (12, 12, timeseries("Time spent calling each dependency (p95, as seen by the caller)", "Caller → callee. If this is much larger than the callee's own p95, the time is going to queueing or the network.",
                        [q('histogram_quantile(0.95, sum by (le, client, server) (rate(traces_service_graph_request_client_seconds_bucket[1m])))', "{{client}} → {{server}}")], "s", h=11)),
)

d.row("Debugging: the traces and logs that explain the errors above")
d.line(
    (0, 12, {"_h": 11, "type": "table", "title": "Traces with errors (click a trace ID to open it)", "description": "TraceQL search in Tempo: traces containing a span with status = error.",
             "datasource": TEMPO, "targets": targets([{"queryType": "traceql", "query": "{ status = error }", "limit": 20, "tableType": "traces"}], ds=TEMPO),
             "fieldConfig": {"defaults": {}, "overrides": []}, "options": {"showHeader": True}}),
    (12, 12, {"_h": 11, "type": "logs", "title": "Error logs, all services (Loki)", "description": "Expand a line to see its fields, including trace_id and the exception message.",
              "datasource": LOKI, "targets": targets([{"expr": f'{{service_name=~"{SERVICES}"}} | severity_text = "error"'}], ds=LOKI),
              "options": {"showTime": True, "wrapLogMessage": True, "enableLogDetails": True, "sortOrder": "Descending"}}),
)

d.row("Before vs. after: the same data, different implementation (run npm run load:compare)")
PAIRS = [
    ("before · N+1 queries", 'http_route="/orders/recent/n-plus-one"'),
    ("after · one batched query", 'http_route="/orders/recent/batched"'),
    ("before · no cache", 'http_route="/products/:id/recommendations/uncached"'),
    ("after · cache-aside", 'http_route="/products/:id/recommendations/cached"'),
    ("before · calls in sequence", 'http_route="/api/dashboard/sequential"'),
    ("after · Promise.all", 'http_route="/api/dashboard/parallel"'),
]
d.line(
    (0, 10, bars("p95 latency of each before / after pair", "Same data, same response, different implementation.",
                 [q(quantile(0.95, H, by="", sel=sel, window="2m"), name) for name, sel in PAIRS], "s",
                 steps((None, GREEN), (0.1, ORANGE), (0.25, RED)), h=10)),
    (10, 14, timeseries("p95 latency over time, each pair", "Edit a 'before' handler to use the 'after' approach and watch its line drop.",
                        [q(quantile(0.95, H, by="", sel=sel), name) for name, sel in PAIRS], "s", h=10)),
)
d.save()

# ═════════════════════════════════════════════════════════════════════════════════
# Dashboard 2: Bottlenecks. "What is running out?" Best watched during npm run load:stress.
# ═════════════════════════════════════════════════════════════════════════════════
b = Dashboard("day23-bottlenecks", "Day 23 · 2 Bottlenecks", "What is running out of capacity? Watch it during npm run load:stress.")
b.row("How to read this page")
b.line((0, 24, text(
    "**Latency rises when something runs out.** Work through the rows top to bottom, and ask each one: *is this the thing that is full?*\n\n"
    "1. **Load vs. latency**: throughput climbs with the load, then flattens while latency shoots up. The bend is the ceiling.\n"
    "2. **Where the time goes**: which kind of span (query, lock, queue, provider call, CPU) is taking the most seconds.\n"
    "3. **The queues**: DB connection pool, inventory row lock, payment provider slots. Each one sits at 100% *before* anything gets slow, and the queue length is the early warning.\n"
    "4. **The processes**: CPU and the Node event loop. One busy thread slows everything that service does, even requests that need none of the busy work.", h=7)))

b.row("1 · Load vs. latency: find the ceiling")
ORD = 'service_name="orders",http_route="/orders",http_request_method="POST"'
b.line(
    (0, 12, timeseries("Checkout: orders / second vs. p95 latency (the ceiling)", "Throughput (left axis) climbs, then flattens. Latency (right axis) keeps climbing. That bend is the ceiling.",
                       [q(rate_count(H, by="", sel=ORD), "orders / second (left)"), q(quantile(0.95, H, by="", sel=ORD), "p95 latency (right)")], "reqps", h=10,
                       overrides=[{"matcher": {"id": "byName", "options": "p95 latency (right)"},
                                   "properties": [{"id": "unit", "value": "s"}, {"id": "custom.axisPlacement", "value": "right"}, {"id": "color", "value": {"mode": "fixed", "fixedColor": "red"}}]}])),
    (12, 12, timeseries("Browse: requests / second vs. p95 latency", "Catalog reads. Does latency stay flat while load grows?",
                        [q(rate_count(H, by="", sel='service_name="catalog",http_route=~"/products.*"'), "catalog requests / second (left)"),
                         q(quantile(0.95, H, by="", sel='service_name="catalog",http_route=~"/products.*"'), "catalog p95 (right)")], "reqps", h=10,
                        overrides=[{"matcher": {"id": "byName", "options": "catalog p95 (right)"},
                                    "properties": [{"id": "unit", "value": "s"}, {"id": "custom.axisPlacement", "value": "right"}, {"id": "color", "value": {"mode": "fixed", "fixedColor": "red"}}]}])),
)

b.row("2 · Where does the time go? (seconds of work per second, by kind of span)")
WORK = 'span_name=~"SELECT.*|INSERT.*|UPDATE.*|db.pool.acquire.*|inventory.row-lock.*|payments.queue.*|payment-provider.*|ml-service.*|smtp.*|orders.buildRevenueReport.*"'
b.line(
    (0, 12, timeseries("Time spent per span (stacked)", "Each band: how many seconds of that work ran per second, across all requests. A band named 'waiting' is a queue, not work.",
                       [q(f"sum by (span_name) (rate(traces_spanmetrics_latency_sum{{{WORK}}}[1m]))", "{{span_name}}")], "s", h=10, stack=True)),
    (12, 12, bars("Share of time, last minute", "Same data as a ranking. The top bar is where to look first.",
                  [q(f"topk(8, sum by (service, span_name) (rate(traces_spanmetrics_latency_sum{{{WORK}}}[1m])))", "{{service}} · {{span_name}}")], "s",
                  steps((None, GREEN), (0.5, ORANGE), (2, RED)), h=10, decimals=2)),
)

b.row("3 · The queues: capacity limits that make requests wait")
b.line(
    (0, 8, timeseries("DB connections in use vs. pool size", "When 'in use' touches 'max', the next query has to wait for a free connection.",
                      [q("sum by (service_name) (db_pool_connections_in_use)", "{{service_name}} in use"),
                       q("max by (service_name) (db_pool_connections_max)", "{{service_name}} max")], "none", h=9, decimals=0,
                      overrides=[{"matcher": {"id": "byRegexp", "options": ".* max"}, "properties": [{"id": "custom.lineStyle", "value": {"fill": "dash", "dash": [8, 6]}}, {"id": "custom.fillOpacity", "value": 0}]}])),
    (8, 8, timeseries("Queries waiting for a DB connection", "Zero is healthy. A growing number is a queue.",
                      [q("sum by (service_name) (db_pool_queries_waiting)", "{{service_name}}")], "none", h=9, decimals=0)),
    (16, 8, timeseries("DB pool wait time (p95)", "How long a query waited just to get a connection. The queries themselves may still be fast.",
                       [q(quantile(0.95, "db_pool_wait_duration_seconds"), "{{service_name}}")], "s", h=9)),
)
b.line(
    (0, 8, timeseries("Inventory row-lock wait (p95), per product", "The check-and-update is atomic, so orders for one product run one at a time. The best-seller (p1) queues first.",
                      [q(quantile(0.95, "inventory_lock_wait_duration_seconds", by="product_id"), "{{product_id}}")], "s", h=9)),
    (8, 8, timeseries("Payment provider slots: in flight vs. limit, and the queue", "The provider allows a few calls at once. 'in flight' at the limit + a queue = saturated.",
                      [q("sum(payments_provider_in_flight)", "in flight"), q("sum(payments_provider_max_in_flight)", "limit"), q("sum(payments_provider_queued)", "queued")], "none", h=9, decimals=0,
                      overrides=[{"matcher": {"id": "byName", "options": "limit"}, "properties": [{"id": "custom.lineStyle", "value": {"fill": "dash", "dash": [8, 6]}}, {"id": "custom.fillOpacity", "value": 0}]}])),
    (16, 8, timeseries("Payments: waiting in line vs. the provider itself (p95)", "Provider time stays flat (~250ms). The line grows. The provider isn't slower: we are queueing for it.",
                       [q(quantile(0.95, "payments_queue_wait_duration_seconds", by=""), "waiting for a slot"),
                        q(quantile(0.95, "payments_provider_duration_seconds", by=""), "provider round trip")], "s", h=9)),
)

b.row("4 · The processes: CPU and the Node event loop")
b.line(
    (0, 8, timeseries("CPU: share of one core, per service", "A Node service can use at most 1.0 (one core): it is single-threaded. At 1.0 it's flat out.",
                      [q("max by (service_name) (process_cpu_utilization_ratio)", "{{service_name}}")], "percentunit", h=9, max_=1.1)),
    (8, 8, timeseries("Event loop utilization", "Share of time the single JS thread was busy. Near 100% = no spare capacity.",
                      [q("max by (service_name) (nodejs_eventloop_utilization_ratio)", "{{service_name}}")], "percentunit", h=9, max_=1.1)),
    (16, 8, timeseries("Event loop delay (p99)", "How late the loop runs a scheduled callback. Climbs when something hogs the thread, e.g. the revenue report in orders.",
                       [q("max by (service_name) (nodejs_eventloop_delay_p99_seconds)", "{{service_name}}")], "s", h=9)),
)
b.line(
    (0, 12, timeseries("Memory (resident) per service", "A leak would be a staircase that never comes back down.",
                       [q("max by (service_name) (process_memory_rss_bytes)", "{{service_name}}")], "bytes", h=8)),
    (12, 12, timeseries("Garbage-collection time per second", "Time the JS engine spent cleaning up memory. Spikes mean pauses.",
                        [q("sum by (service_name) (histogram_sum(rate(v8js_gc_duration_seconds[1m])))", "{{service_name}}")], "s", h=8)),
)
b.save()

# ═════════════════════════════════════════════════════════════════════════════════
# Dashboard 3: Business. The same system, as the shop owner sees it.
# ═════════════════════════════════════════════════════════════════════════════════
s = Dashboard("day23-business", "Day 23 · 3 Business", "Orders, revenue, payments and stock: the system as the business sees it.")
s.row("Money and orders")
s.line(
    (0, 6, stat("Orders placed / minute", "Successful checkouts.", "sum(rate(shop_orders_placed_total[1m])) * 60", "none", steps((None, "blue")), decimals=0)),
    (6, 6, stat("Revenue / minute", "Value of orders placed.", "sum(rate(shop_orders_revenue_cents_total[1m])) * 60 / 100", "currencyUSD", steps((None, "green")), decimals=0)),
    (12, 6, stat("Checkouts lost to crashes / minute", "POST /orders that ended in a 500: money left on the table. Today that's the pricing bug.",
                 f'sum(histogram_count(increase({H}{{service_name="orders",http_route="/orders",http_response_status_code=~"5.."}}[1m])))', "none",
                 steps((None, GREEN), (1, RED)), decimals=0)),
    (18, 6, stat("Revenue lost to crashes / minute (estimate)", "Crashed checkouts × average order value. Why a 'small' bug deserves a fix today.",
                 f'sum(histogram_count(increase({H}{{service_name="orders",http_route="/orders",http_response_status_code=~"5.."}}[1m]))) '
                 '* (sum(increase(shop_orders_revenue_cents_total[10m])) / sum(increase(shop_orders_placed_total[10m]))) / 100', "currencyUSD",
                 steps((None, GREEN), (1, RED)), decimals=0)),
)
s.line(
    (0, 12, timeseries("Orders per minute: placed vs. refused vs. crashed", "Refused = a business reason (card declined, out of stock). Crashed = a bug. Different problems, different owners.",
                       [q("sum(rate(shop_orders_placed_total[1m])) * 60", "placed"),
                        q("sum by (reason) (rate(shop_orders_rejected_total[1m])) * 60", "refused · {{reason}}"),
                        q(f'sum(histogram_count(rate({H}{{service_name="orders",http_route="/orders",http_response_status_code=~"5.."}}[1m]))) * 60', "crashed (5xx)")], "none", h=9)),
    (12, 12, timeseries("Revenue per minute", "Dollars of orders placed.", [q("sum(rate(shop_orders_revenue_cents_total[1m])) * 60 / 100", "revenue")], "currencyUSD", h=9)),
)
s.row("Payments")
s.line(
    (0, 8, timeseries("Charges per second by outcome", "Approved vs. declined. A jump in declines can be a provider problem, not a customer one.",
                      [q("sum by (outcome) (rate(shop_payments_charges_total[1m]))", "{{outcome}}")], "ops", h=9)),
    (8, 8, bars("Decline rate", "Share of charges the card network refused.",
                [q('100 * sum(increase(shop_payments_charges_total{outcome="declined"}[5m])) / sum(increase(shop_payments_charges_total[5m]))', "declined")], "percent",
                steps((None, GREEN), (5, ORANGE), (10, RED)), h=9, decimals=1)),
    (16, 8, timeseries("Confirmation emails sent / minute", "Sent asynchronously after the response. Should track orders placed.",
                       [q("sum(rate(shop_notifications_sent_total[1m])) * 60", "emails")], "none", h=9)),
)
s.row("Inventory")
s.line(
    (0, 12, timeseries("Stock on hand, per product", "Hot products drain first. A restock job tops them up.", [q("sum by (product_id) (shop_inventory_stock)", "{{product_id}}")], "none", h=9)),
    (12, 12, timeseries("Stock reservations by outcome", "Reserved, released (payment failed after reserving), or refused because we ran out.",
                        [q("sum by (outcome) (rate(shop_inventory_reservations_total[1m]))", "{{outcome}}")], "ops", h=9)),
)
s.save()
