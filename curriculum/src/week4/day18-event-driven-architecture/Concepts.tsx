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
          <summary>What are synchronous and asynchronous communication between services?</summary>
          <div className="answer">
            <p>
              <strong>Synchronous:</strong> the caller sends a request and waits for the response before
              it continues, like an HTTP call. <strong>Asynchronous:</strong> the caller hands off a
              message and moves on without waiting — the receiver handles it later, on its own time.
            </p>
          </div>
        </details>

        <details>
          <summary>What are the trade-offs between synchronous and asynchronous communication?</summary>
          <div className="answer">
            <p>
              Synchronous gives you a consistent, immediate answer, but you pay for the network delay on
              every call, and a slow or down dependency slows or fails the caller too. Asynchronous
              returns fast and keeps services independent, but the system is only{" "}
              <em>eventually</em> consistent — the order is saved now, the email arrives a few seconds
              later. Use sync when the answer is part of your response, async when it isn&apos;t.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a message queue, and what problem does it solve?</summary>
          <div className="answer">
            <p>
              A named line of messages held by a broker: producers put messages in, consumers take them
              out. It decouples the two sides — the producer doesn&apos;t wait for the consumer, and if
              the consumer is slow or down, messages wait in the queue instead of being lost. The
              consumer acks when it&apos;s done, and only then is the message deleted.
            </p>
          </div>
        </details>

        <details>
          <summary>What is pub/sub, and how do a queue and an exchange give you that pattern?</summary>
          <div className="answer">
            <p>
              One published message is delivered to <em>every</em> interested service. A queue alone
              can&apos;t do that — competing consumers each get a different message. Put an exchange in
              front: the publisher sends to the exchange, each service has its own queue bound to it,
              and the exchange copies every message into every queue. Same pattern, different names:
              producer/consumer, publisher/subscriber.
            </p>
          </div>
        </details>

        <details>
          <summary>What are RabbitMQ and an exchange?</summary>
          <div className="answer">
            <p>
              RabbitMQ is a message broker. Publishers send messages to an <strong>exchange</strong>,
              which doesn&apos;t store anything — it routes each message into the queues bound to it, and
              consumers read from those queues. A <code>fanout</code> exchange copies a message into
              every bound queue.
            </p>
          </div>
        </details>

        <details>
          <summary>What are SQS and SNS?</summary>
          <div className="answer">
            <p>
              Both are AWS-managed services. <strong>SQS</strong> is a queue: messages wait until a
              consumer takes and deletes them. <strong>SNS</strong> is a pub/sub topic: one message
              published to it is pushed to every subscriber. They map onto RabbitMQ as SQS = queue, SNS =
              fanout exchange.
            </p>
          </div>
        </details>

        <details>
          <summary>Why put SNS in front of SQS, and what is the fan-out pattern?</summary>
          <div className="answer">
            <p>
              <strong>Fan-out</strong> means one message goes out to many receivers. An SQS queue alone
              gives each message to just one consumer, so you publish to an SNS topic and subscribe one
              SQS queue per service: every service gets its own copy, and its queue buffers and retries
              if the service is slow or down.
            </p>
          </div>
        </details>

        <details>
          <summary>What is Kafka?</summary>
          <div className="answer">
            <p>
              A distributed event log. Producers append messages to it, and unlike a queue, Kafka
              keeps them for a retention period whether or not anyone has read them, so consumers can
              read independently, read history, and replay. That makes it a good fit for high-throughput
              event streams.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a Kafka topic, and what is a partition?</summary>
          <div className="answer">
            <p>
              A <strong>topic</strong> is a named stream of messages, like <code>order.placed</code>. It
              is split into <strong>partitions</strong>, each an ordered log that can live on a
              different broker, so a topic scales across machines. Order is guaranteed within a
              partition, not across the whole topic; messages with the same key land in the same
              partition.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a Kafka offset?</summary>
          <div className="answer">
            <p>
              A message&apos;s position within a partition. A consumer tracks the offset it has read up
              to, so after a restart it resumes from there, and it can replay by moving the offset back.
            </p>
          </div>
        </details>

        <details>
          <summary>What are a consumer and a consumer group?</summary>
          <div className="answer">
            <p>
              A <strong>consumer</strong> reads messages from a topic. A <strong>consumer group</strong>{" "}
              is a set of consumers sharing the work: each partition is read by one consumer in the
              group, so adding consumers scales a slow service. Different groups each receive every
              message, which is how several services subscribe to the same topic.
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
          <summary>Why are duplicate messages normal in a message queue, and how do you deal with them?</summary>
          <div className="answer">
            <p>
              Delivery is at-least-once: a consumer processes the message, then acks. If it crashes in
              between, the message is redelivered on restart — a routine event, not a rare bug. Acking
              first would just trade duplicates for lost messages, so instead you make the consumer
              idempotent.
            </p>
          </div>
        </details>

        <details>
          <summary>What does it mean for a consumer to be idempotent?</summary>
          <div className="answer">
            <p>
              Processing the same message twice leaves the same end state as processing it once. The
              usual technique is a <code>processed_events</code> table keyed by event ID — insert first
              with <code>ON CONFLICT DO NOTHING</code>, and skip the message if the row already existed.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a dead-letter queue for?</summary>
          <div className="answer">
            <p>
              A poison message fails every time, and requeued forever it blocks everything behind it.
              After N failed retries it&apos;s moved to a dead-letter queue so the consumer can keep
              going and a human can inspect it later.
            </p>
          </div>
        </details>

        <details>
          <summary>What is the saga pattern, and why does event-driven architecture need one?</summary>
          <div className="answer">
            <p>
              A sequence of local transactions across services, each with a compensating action to undo
              it. With no transaction spanning services, a failed payment is rolled back by events —{" "}
              <code>PaymentFailed</code> makes Inventory release the stock and Orders mark the order
              failed.
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
