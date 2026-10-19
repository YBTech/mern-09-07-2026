import DayNav from "../../components/DayNav";

export default function Lab() {
  return (
    <div className="page lab-page">
      <title>Day 28 Lab</title>
      <DayNav day="day28-tools-mcp-agent-loop" current="lab" />
      <h1>Day 28 — Lab</h1>

      <h2>Upgrade your shopping assistant</h2>

      <div className="task">
        <span className="task-num">1</span>
        <div className="task-body">
          <p>Turn your Day 27 assistant into an agent that shops for the user.</p>
          <ul className="task-list">
            <li>Accounts, chat, streaming, and the token limit all keep working.</li>
            <li>Products now live in the database, not in the system prompt. Change a price or a stock count and the assistant's next answer reflects it.</li>
            <li>It can search the catalog, check stock, and show, add to, or remove from the user's cart.</li>
            <li>Multi-step requests work: “find the cheapest in-stock helmet under $50 and add it”, or “swap the helmet in my cart for a cheaper one”.</li>
            <li>The cart is also visible in the UI, and it updates when the assistant changes it.</li>
          </ul>
        </div>
      </div>

      <div className="task">
        <span className="task-num">2</span>
        <div className="task-body">
          <p>Checkout needs a human.</p>
          <ul className="task-list">
            <li>The assistant can start a checkout, but it can never complete a purchase itself.</li>
            <li>The user sees the order and confirms it with a button.</li>
          </ul>
        </div>
      </div>

      <div className="task">
        <span className="task-num">3</span>
        <div className="task-body">
          <p>Make the work visible.</p>
          <ul className="task-list">
            <li>While the assistant works, the user sees what it is doing, step by step.</li>
            <li>An agent that gets stuck stops on its own and says so. It never loops forever.</li>
            <li>The 10,000-token limit counts everything the agent does, not just the final reply.</li>
          </ul>
        </div>
      </div>

      <div className="task">
        <span className="task-num">4</span>
        <div className="task-body">
          <p>Build an MCP server for your shop.</p>
          <ul className="task-list">
            <li>Other AI apps can use your shop through it: browse products, check stock, and the rest of what the assistant can do.</li>
            <li>Connect to it from Claude Code or Codex, and shop from there.</li>
          </ul>
        </div>
      </div>

      <div className="task challenge">
        <span className="task-num">5</span>
        <div className="task-body">
          <p>Break each other’s agent.</p>
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>Swap apps with another pair and try to trick the agent into doing something it should not.</li>
            <li>Try hiding instructions inside the data, such as a product description.</li>
            <li>The owner fixes every attack that worked.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
