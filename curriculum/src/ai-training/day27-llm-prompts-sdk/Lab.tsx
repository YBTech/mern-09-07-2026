import DayNav from "../../components/DayNav";

export default function Lab() {
  return (
    <div className="page lab-page">
      <title>Day 27 Lab</title>
      <DayNav day="day27-llm-prompts-sdk" current="lab" />
      <h1>Day 27 — Lab</h1>

      <h2>The app</h2>

      <div className="task">
        <span className="task-num">1</span>
        <div className="task-body">
          <p>A full-stack chat app for a shop's shopping assistant.</p>
          <ul className="task-list">
            <li>Frontend: React + TypeScript. Backend: Express + TypeScript.</li>
            <li>Call either Claude or OpenAI. Your choice.</li>
            <li>
              Keep the data in a database. SQLite or Postgres in a Docker container both work.
            </li>
            <li>One repo, one command to start everything.</li>
          </ul>
        </div>
      </div>

      <div className="task">
        <span className="task-num">2</span>
        <div className="task-body">
          <p>Accounts.</p>
          <ul className="task-list">
            <li>A visitor can sign up, log in, and log out.</li>
            <li>Only a logged-in user can chat.</li>
            <li>Staying logged in after a page refresh is part of the job.</li>
          </ul>
        </div>
      </div>

      <div className="task">
        <span className="task-num">3</span>
        <div className="task-body">
          <p>Chat.</p>
          <ul className="task-list">
            <li>The user talks to the assistant and the reply streams in.</li>
            <li>The assistant remembers what was said earlier in the conversation.</li>
            <li>Refresh the page and the conversation is still there.</li>
            <li>Model errors show up as a readable message, not a blank screen.</li>
          </ul>
        </div>
      </div>

      <div className="task">
        <span className="task-num">4</span>
        <div className="task-body">
          <p>Token limit.</p>
          <ul className="task-list">
            <li>Every user gets 10,000 tokens in total, for good.</li>
            <li>Once they are used up, the user cannot send another message.</li>
            <li>The UI says why. To keep chatting, they need a new account.</li>
            <li>The user can see how many tokens they have left.</li>
          </ul>
        </div>
      </div>

      <h2>The assistant and its evals</h2>

      <div className="task">
        <span className="task-num">5</span>
        <div className="task-body">
          <p>The shopping assistant.</p>
          <ul className="task-list">
            <li>Pick a shop: bikes, plants, board games, anything.</li>
            <li>
              Invent about a dozen products with a price and whether they are in stock. They live
              in the system prompt, nowhere else.
            </li>
            <li>
              Write the rules before the prompt, at least five. They must cover what the assistant
              sells, what it never promises, and what it does when asked about something else.
            </li>
            <li>Choose a personality for it and make it show.</li>
          </ul>
        </div>
      </div>

      <div className="task">
        <span className="task-num">6</span>
        <div className="task-body">
          <p>Evals.</p>
          <ul className="task-list">
            <li>
              At least 12 test cases. Each one is a customer message plus what a good reply must
              do.
            </li>
            <li>
              Spread them out: ordinary questions, things out of stock, things you do not sell,
              pushy customers, and messages trying to break your rules.
            </li>
            <li>
              Run every case through the assistant, and have a grader model score each reply
              against that case's criteria.
            </li>
            <li>
              Where a fact can be checked in code, check it in code instead of asking a model.
            </li>
            <li>Get one overall score and a reason for every low-scoring case.</li>
            <li>An eval run must work without logging in and without using anyone's tokens.</li>
          </ul>
        </div>
      </div>

      <div className="task">
        <span className="task-num">7</span>
        <div className="task-body">
          <p>Improve it.</p>
          <ul className="task-list">
            <li>Run the evals on your first prompt and write the score down.</li>
            <li>Read the failures, change the prompt, run again.</li>
            <li>Repeat until the score stops going up.</li>
            <li>
              A short README holds your rules, your criteria, and the score of each prompt version.
            </li>
          </ul>
        </div>
      </div>

      <div className="task challenge">
        <span className="task-num">8</span>
        <div className="task-body">
          <p>Break each other's bot.</p>
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>Swap bots with another pair and try to get it to break its rules.</li>
            <li>Every attack that works becomes a new test case in its owner's evals.</li>
            <li>The owner fixes the prompt and shows the score recovering.</li>
          </ul>
        </div>
      </div>

      <div className="task challenge">
        <span className="task-num">9</span>
        <div className="task-body">
          <p>Compare prompts.</p>
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>Keep several prompt versions and run the same test cases on each.</li>
            <li>
              Show them side by side: overall score, which cases each one fails, and how many
              tokens each one used.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
