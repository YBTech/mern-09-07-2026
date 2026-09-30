import DayNav from "../../components/DayNav";

export default function Concepts() {
  return (
    <div className="page concepts-page">
      <title>Day 18 — Concepts Reference</title>
      <DayNav day="day18-event-driven-architecture" current="concepts" />
      <h1>Day 18 — Concepts Reference</h1>
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
          <summary>What does a synchronous call between services cost you?</summary>
          <div className="answer">
            <p>
              The caller waits for every call, so latencies add up and the slowest service sets the
              response time. A down or slow dependency fails or hangs the caller too, uptime multiplies
              down across the chain (five services at 99.9% ≈ 99.5%), and the caller has to know every
              service it calls.
            </p>
          </div>
        </details>

        <details>
          <summary>When do you choose async messaging over a synchronous HTTP call?</summary>
          <div className="answer">
            <p>
              When you don&apos;t need the result to build your response — it should happen{" "}
              <em>because</em> this happened (an email, points, analytics). If the answer is part of
              what you return to the caller, like a price or a card authorization, stay synchronous.
            </p>
          </div>
        </details>

        <details>
          <summary>What is eventual consistency?</summary>
          <div className="answer">
            <p>
              Every part of the system becomes correct, just not at the same instant: the order is
              saved now, the email arrives two seconds later, the points five seconds later. It&apos;s
              the price of not waiting — and why UIs show states like &quot;processing&quot;.
            </p>
          </div>
        </details>

        <details>
          <summary>Why is an event named <code>OrderPlaced</code> rather than <code>SendEmail</code>?</summary>
          <div className="answer">
            <p>
              An event states a fact that already happened; a command names a receiver and tells it
              what to do. Past-tense naming keeps the publisher ignorant of its consumers — name it like
              a command and you&apos;ve re-coupled the two sides.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a message queue, and what does an ack do?</summary>
          <div className="answer">
            <p>
              A named line of messages held by a broker: producers put messages in, consumers take them
              out. The consumer acks when it&apos;s done, and only then is the message deleted — so if
              the consumer is down or crashes mid-way, the message waits instead of being lost.
            </p>
          </div>
        </details>

        <details>
          <summary>What happens when two consumers read the same queue?</summary>
          <div className="answer">
            <p>
              They compete: each message goes to exactly one of them. That&apos;s how you scale a slow
              consumer — and exactly why a single queue can&apos;t deliver the same message to several
              different services.
            </p>
          </div>
        </details>

        <details>
          <summary>How does a RabbitMQ exchange give you fan-out?</summary>
          <div className="answer">
            <p>
              The publisher sends to an exchange, not a queue. Each subscribing service declares its
              own queue and binds it to the exchange, and a <code>fanout</code> exchange copies every
              message into every bound queue. The exchange copies <em>between</em> services; each queue
              still splits messages <em>within</em> a service.
            </p>
          </div>
        </details>

        <details>
          <summary>What does fan-out buy you when a new subscriber is added?</summary>
          <div className="answer">
            <p>
              Nothing changes in the publisher. A Loyalty service binds a new queue to the existing
              exchange (or, in Kafka, reads the topic as a new consumer group) — Orders is never edited
              or redeployed, and never learns it exists.
            </p>
          </div>
        </details>

        <details>
          <summary>How do SQS and SNS map onto RabbitMQ?</summary>
          <div className="answer">
            <p>
              SQS is a queue; SNS is a fanout exchange. &quot;SNS fan-out to SQS&quot; — one topic,
              one SQS queue subscribed per service — is the same pattern as an exchange with one queue
              per subscriber, except AWS runs the broker.
            </p>
          </div>
        </details>

        <details>
          <summary>How is Kafka different from a message queue?</summary>
          <div className="answer">
            <p>
              A queue deletes a message once it&apos;s acked; Kafka is a log that keeps messages for a
              retention period whether or not anyone read them. Each consumer group just tracks its
              position (an offset), so groups read independently, new groups can read history, and you
              can replay by moving the offset back.
            </p>
          </div>
        </details>

        <details>
          <summary>What is an offset, and what happens when a consumer restarts?</summary>
          <div className="answer">
            <p>
              A message&apos;s position in a partition. A consumer group commits the next offset it
              will read, per partition; after a crash or restart it resumes from there, so nothing is
              lost or skipped.
            </p>
          </div>
        </details>

        <details>
          <summary>What does Kafka guarantee about ordering?</summary>
          <div className="answer">
            <p>
              Order is guaranteed <em>within a partition</em>, never across a topic. That&apos;s why
              the message key matters: keying by <code>orderId</code> puts all of one order&apos;s
              events in one partition, so they stay in sequence.
            </p>
          </div>
        </details>

        <details>
          <summary>What&apos;s the difference between two consumers in the same group and two different groups?</summary>
          <div className="answer">
            <p>
              Same group: they split the partitions and each message is handled once — that&apos;s how
              you scale one service. Different groups: each gets every message — that&apos;s fan-out
              to independent services.
            </p>
          </div>
        </details>

        <details>
          <summary>Why does adding a fourth consumer to a group reading a 3-partition topic not help?</summary>
          <div className="answer">
            <p>
              Each partition is owned by exactly one consumer in a group, so three partitions means at
              most three busy consumers — the fourth sits idle. The partition count caps a group&apos;s
              parallelism.
            </p>
          </div>
        </details>

        <details>
          <summary>When would you pick a queue, and when Kafka?</summary>
          <div className="answer">
            <p>
              A queue for jobs that are done once and forgotten — emails, image resizing, spreading work
              across workers. Kafka when you need history, replay, new consumers reading the past, or
              very high throughput — analytics, audit trails, event streams.
            </p>
          </div>
        </details>

        <details>
          <summary>Why does at-least-once delivery mean duplicates are normal rather than exceptional?</summary>
          <div className="answer">
            <p>
              A consumer processes the message, then acks (or commits its offset). Crash in between and
              the message is redelivered on restart — a routine event, not a rare bug. Acking first
              just trades duplicates for lost messages.
            </p>
          </div>
        </details>

        <details>
          <summary>What does it mean for a consumer to be idempotent, and how do you make one?</summary>
          <div className="answer">
            <p>
              Processing the same event twice leaves the same end state as processing it once. The usual
              technique is a <code>processed_events</code> table keyed by event ID — insert first with{" "}
              <code>ON CONFLICT DO NOTHING</code>, and bail out if the row already existed.
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
          <summary>What is the dual-write problem, and what is the outbox pattern?</summary>
          <div className="answer">
            <p>
              Saving to the database and publishing the event are two separate writes — a crash between
              them leaves an order nobody is told about. The outbox pattern writes the event into an{" "}
              <code>outbox</code> table in the <em>same</em> transaction as the order, and a separate
              relay publishes from it.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a dead-letter queue for?</summary>
          <div className="answer">
            <p>
              A poison message fails every time, and requeued forever it blocks everything behind it.
              After it fails (or after N retries) it&apos;s moved to a DLQ so the consumer can keep
              going, and a human can inspect it later. RabbitMQ and SQS support this natively; with
              Kafka you publish to your own DLQ topic.
            </p>
          </div>
        </details>

        <details>
          <summary>What is consumer lag, and why is it the metric to alert on?</summary>
          <div className="answer">
            <p>
              The gap between the newest offset in a partition and the group&apos;s committed offset —
              how far behind reality the service is. It climbs long before anything visibly breaks, and
              a stuck consumer can sit at 0% CPU while it does.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a saga, and why does event-driven architecture need one?</summary>
          <div className="answer">
            <p>
              A sequence of local transactions across services, each with a compensating action to undo
              it. With no transaction spanning services, a failed payment is rolled back by events —{" "}
              <code>PaymentFailed</code> makes Inventory release the stock and Orders mark the order
              failed.
            </p>
          </div>
        </details>

        <details>
          <summary>What&apos;s the difference between a <code>direct</code>, <code>topic</code>, and <code>fanout</code> exchange?</summary>
          <div className="answer">
            <p>
              <code>fanout</code> copies to every bound queue; <code>direct</code> only to queues bound
              with the exact routing key; <code>topic</code> to queues whose pattern matches, like{" "}
              <code>order.*</code>.
            </p>
          </div>
        </details>

        <details>
          <summary>What is an SQS visibility timeout?</summary>
          <div className="answer">
            <p>
              SQS&apos;s version of an unacked message: once a consumer receives it, the message is
              hidden from others for the timeout. If the consumer doesn&apos;t call{" "}
              <code>DeleteMessage</code> in time, it reappears and is delivered again — at-least-once,
              same as RabbitMQ.
            </p>
          </div>
        </details>

        <details>
          <summary>RabbitMQ pushes, Kafka consumers pull — why does that matter?</summary>
          <div className="answer">
            <p>
              A push broker tracks every message&apos;s state per consumer; a pull model only stores
              one offset per group, which is much of why Kafka scales to huge volumes and can replay. It
              also means a Kafka consumer sets its own pace — backlog shows up as lag, not as a broker
              trying to deliver faster than you can handle.
            </p>
          </div>
        </details>

        <details>
          <summary>Kafka advertises exactly-once semantics — why can&apos;t you rely on it here?</summary>
          <div className="answer">
            <p>
              It applies to Kafka-to-Kafka transactions only. The moment your handler writes to a
              database or sends an email, that side effect is outside the transaction, so you&apos;re
              back to at-least-once and must be idempotent anyway.
            </p>
          </div>
        </details>

        <details>
          <summary>Why can&apos;t you freely increase a topic&apos;s partition count later?</summary>
          <div className="answer">
            <p>
              The partition is a hash of the key modulo the partition count, so adding partitions
              re-maps keys — new events for an order can land in a different partition than its earlier
              ones, which breaks per-key ordering across the change.
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
