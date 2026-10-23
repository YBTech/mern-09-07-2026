import { CaseBArchitecture, RouterLimit } from "./CaseDiagrams";

export default function CaseB() {
  return (
    <>
      <h2>1. The business</h2>
      <ul>
        <li>An online electronics store. About 60% of tickets are "where is my order?" or "can I return this?".</li>
        <li>Replies take hours. Support staff copy and paste policy. Refunds are handled inconsistently.</li>
      </ul>

      <h2>2. Requirements</h2>
      <ul>
        <li><b>Must do:</b> look up real order data, answer policy questions, start returns, issue refunds, hand off to a person.</li>
        <li><b>Must also cope with</b> messages that ask for more than one thing at once, or that don't fit a category.</li>
        <li><b>Must not:</b> refund outside policy, refund above the limit without approval, or reveal another customer's data.</li>
        <li><b>How well:</b> the first words appear fast (streaming), the cost per conversation is predictable, every action is auditable.</li>
      </ul>

      <h2>3. Architecture</h2>
      <CaseBArchitecture />
      <ul>
        <li><b>Input guard:</b> a cheap keyword filter, then an LLM that judges the intent.</li>
        <li><b>Router:</b> one model call that asks "is this one clear intent?". If yes, it picks a fixed path, which is cheap and predictable.</li>
        <li><b>Fixed paths:</b> order status (tools, authorized with the signed-in customer), policy question (RAG), refund (proposes, and waits for a human above the limit), decline, hand-off.</li>
        <li><b>Fallback agent:</b> anything multi-part or unclear goes to an agent loop that has every tool. It is the long tail.</li>
      </ul>

      <h2>4. Deep dive</h2>

      <h3>What if one message needs more than one thing?</h3>
      <RouterLimit />
      <ul>
        <li>"What's the cheapest laptop under $600, and can I return my last order?" has two parts. A router that sends it to the order path fails: that path only has the order tools, so it says it has no product information.</li>
        <li>A path can only use the tools it was given. A router is a classifier, and a classifier forces every message into one box.</li>
        <li><b>The fix:</b> keep a fallback path that is an agent loop with every tool (order lookup, policy search, product search, and a refund tool that can only <i>propose</i>). The router sends multi-part and unclear messages there.</li>
        <li>Other options: let the router return a list of intents and run each path, then merge the answers. Or make every path a small agent with a few extra read-only tools.</li>
        <li>The fixed paths still earn their keep: the common requests stay cheap, fast and easy to test.</li>
      </ul>

      <h3>Injection can come through three doors</h3>
      <ul>
        <li>The customer's message, a policy page, and a tool result. Put a guard on each, and an output guard in code on the reply.</li>
      </ul>

      <h3>What stops a hijacked agent from doing damage?</h3>
      <ul>
        <li>The model asks, your code decides. Authorize inside every tool with the signed-in customer, and apply least privilege: refund up to a limit, not "refund anything".</li>
        <li>The fallback agent has the same limits as every path. More tools means more reach, so the write tools stay propose-only.</li>
      </ul>

      <h3>How do you know it works, and what is it doing?</h3>
      <ul>
        <li><b>Observability:</b> one trace per conversation, showing which path it took. Alert on cost per conversation and on tool errors.</li>
        <li><b>Evals per route:</b> code checks for refund amounts and data leaks, an LLM judge for tone. Add test messages that mix two requests, so a routing gap shows up before customers find it.</li>
        <li><b>Rollout:</b> offline eval, then a canary on a few percent of chats, watch thumbs-down, then everyone.</li>
      </ul>

      <h3>How do you keep it cheap?</h3>
      <ul>
        <li>Cache the stable policy prefix, use a small model for the router, and batch the nightly summaries.</li>
        <li>Watch how many messages fall through to the fallback agent. It costs the most, so a growing share means a new fixed path is worth adding.</li>
      </ul>

      <h2>5. Why this shape</h2>
      <ul>
        <li>Most tickets follow known paths, so fixed workflows beat one free agent on cost, predictability and debugging.</li>
        <li>But no router covers everything, so the shape is a router <b>plus</b> an agent for the rest. Autonomy where the path can't be known in advance, and money moves only with approval.</li>
      </ul>
    </>
  );
}
