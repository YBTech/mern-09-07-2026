import DayNav from "../../components/DayNav";

export default function Concepts() {
  return (
    <div className="page concepts-page">
      <title>Day 26 — Concepts Reference</title>
      <DayNav day="day26-ai-overview-coding-tools" current="concepts" />
      <h1>Day 26 — Concepts Reference</h1>
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
          <summary>What is a prompt?</summary>
          <div className="answer">
            <p>
              A prompt is everything you send to the model in one call. It has two parts: the system prompt sets the role and the rules, and the user prompt is the task you ask for.
            </p>
            <p>
              The model has no memory between calls. A chat feels continuous only because every call re-sends the whole conversation.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a token?</summary>
          <div className="answer">
            <p>
              A token is a small piece of text, about four characters or three quarters of a word. Models read and write in tokens, not words.
            </p>
            <p>
              Input tokens (what you send) and output tokens (the reply) are counted separately, and output tokens cost more. Price, speed, and limits are all counted in tokens.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a context window?</summary>
          <div className="answer">
            <p>
              The context window is the maximum number of tokens the model can see in one call. Your system prompt, the conversation, any files you add, your question, and room for the reply all share it.
            </p>
            <p>
              When it overflows, old text is dropped and answers get worse. A bigger window lets the model read more, but you pay for every token in it.
            </p>
          </div>
        </details>

        <details>
          <summary>How do you manage your context window?</summary>
          <div className="answer">
            <p>
              In a coding agent the context is filled by the agent itself, as it reads files and runs commands, not only by what you type. Good habits:
            </p>
            <ul>
              <li>One task per session: clear the chat (/clear in Claude Code, /new in Codex) when the goal changes.</li>
              <li>Point to files by name instead of pasting them.</li>
              <li>Use /compact to summarize a long session that is getting heavy.</li>
              <li>Hand noisy research to a subagent, which works in its own window and returns a summary.</li>
              <li>Keep CLAUDE.md or AGENTS.md short, because it is read at the start of every session.</li>
            </ul>
          </div>
        </details>

        <details>
          <summary>What is AI hallucination?</summary>
          <div className="answer">
            <p>
              A hallucination is when an LLM sounds completely sure and is still wrong. It invents APIs, facts, and file names that look real.
            </p>
            <p>
              That is why you treat AI output as a draft to check, never as a finished answer.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a skill?</summary>
          <div className="answer">
            <p>
              A skill is a prompt you saved once instead of retyping it. It is a folder with a SKILL.md file holding a name, a description, and short steps, such as a checklist for reviewing a pull request.
            </p>
            <p>
              A skill loads only when it is relevant, so unlike CLAUDE.md, which is read every session, it costs almost nothing until used. Agents also ship built-in ones, such as /init and /review.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a hook, and what is its purpose?</summary>
          <div className="answer">
            <p>
              A hook runs your own command at a set moment, such as after every file edit, before a commit, or before a shell command.
            </p>
            <p>
              Its purpose is enforcement. A rule written in CLAUDE.md is only a request the model can forget; a hook is enforced by the tool, so it holds every time.
            </p>
          </div>
        </details>
      </section>

      <section id="tier-2">
        <h2>2. On-the-job interview questions</h2>
        <p className="tier-note">
          The &quot;tell me about how you work&quot; questions — answer from your own experience,
          in first person. The answers below are sample answers to adapt, not scripts.
        </p>

        <details>
          <summary>How do you use AI in your day-to-day work and to help with your code?</summary>
          <div className="answer">
            <p>
              &quot;I use two modes. Tab completion while I type, which I accept or ignore, and an agent in the terminal for bigger tasks. For the agent I follow one loop:
            </p>
            <ul>
              <li>Plan: I ask for a plan first and fix it before any code is written.</li>
              <li>Context: a rules file with our stack and patterns, and small, focused tasks.</li>
              <li>Build: the agent works in small steps while hooks and tests run automatically.</li>
              <li>Verify: tests and lint, and I debug by giving the agent the exact error.</li>
              <li>Review: I read every line, watch for security problems, and own what I merge.&quot;</li>
            </ul>
          </div>
        </details>

        <details>
          <summary>What model do you use, and how do you decide which one for which task?</summary>
          <div className="answer">
            <p>
              &quot;I pick by tier. Small models are fast and cheap, so I use them for simple, repetitive work. A mid-size model is my default for most day-to-day coding. I switch to a frontier model for hard planning and tricky bugs, because it is smarter but slower and pricier.
            </p>
            <p>
              In practice I use the approved tool and models at my company, and I move up a tier only when the cheaper one is stuck.&quot;
            </p>
          </div>
        </details>

        <details>
          <summary>How much budget per month do you get for AI usage?</summary>
          <div className="answer">
            <p>
              This depends on the company, so answer with your own numbers. A sample shape:
            </p>
            <p>
              &quot;We get a seat plus a monthly token budget per developer. Entry seats run about $19 to $40 and premium seats about $100 to $200. Typical token spend is around $150 to $250 a month, and heavy users go far higher. If I hit the cap I slow down or ask for more, so I keep my sessions focused and clear them between tasks.&quot;
            </p>
            <p>
              These are ballpark figures that change often. Check your vendor&apos;s pricing page and your company&apos;s policy.
            </p>
          </div>
        </details>

        <details>
          <summary>What skills have you used?</summary>
          <div className="answer">
            <p>
              &quot;Built-in ones like /init to draft the rules file, /review to review changes, and /compact to shrink a long session. Custom ones my team wrote:
            </p>
            <ul>
              <li>review-pr: review a diff against our checklist</li>
              <li>write-tests: add tests in our style</li>
              <li>commit-message: summarize the staged diff</li>
              <li>new-endpoint: scaffold a route, service, and test</li>
              <li>debug-ci: read a failing CI log</li>
              <li>release-notes: turn merged PRs into notes&quot;</li>
            </ul>
          </div>
        </details>

        <details>
          <summary>How do you write a skill?</summary>
          <div className="answer">
            <p>
              &quot;I make a folder with a SKILL.md file and keep it short:
            </p>
            <ul>
              <li>A name and a description at the top. The description tells the agent when the skill is relevant.</li>
              <li>A few numbered steps, such as read the diff, check auth, input validation, and tests, then reply with problems worst first.</li>
              <li>I save it in the project&apos;s skills folder and commit it, so the whole team gets it.&quot;</li>
            </ul>
          </div>
        </details>

        <details>
          <summary>What do you include in your knowledge base?</summary>
          <div className="answer">
            <p>
              &quot;A short rules file, CLAUDE.md or AGENTS.md, that points to a few small markdown files, so the agent reads only what the task needs:
            </p>
            <ul>
              <li>The stack and the commands to run and test</li>
              <li>Architecture: layers, folders, and data flow</li>
              <li>Conventions: naming, error handling, and patterns</li>
              <li>Testing: how to run and write tests</li>
              <li>Hard rules, such as never log tokens or user emails&quot;</li>
            </ul>
          </div>
        </details>

        <details>
          <summary>What hooks have you used?</summary>
          <div className="answer">
            <p>
              &quot;The ones that enforce things I would otherwise have to remember:
            </p>
            <ul>
              <li>Format and lint the changed file after every edit</li>
              <li>Run the tests before a commit, and stop if they fail</li>
              <li>Block dangerous shell commands like rm -rf and force-push</li>
              <li>Block reading .env and other secret files</li>
              <li>Send a desktop or Slack ping when the agent needs me&quot;</li>
            </ul>
          </div>
        </details>

        <details>
          <summary>How do you write tests with AI?</summary>
          <div className="answer">
            <p>
              &quot;It depends on the work. For bug fixes and well-defined logic I do TDD: the agent writes a failing test, I review it because it is my spec, I run it to see it fail, then the agent implements until it is green.
            </p>
            <p>
              For UI and exploratory work I write the code first, then ask the agent for tests covering the happy path and edge cases. I run them, delete tests that assert nothing, and break the code on purpose to prove the tests can fail. Either way I read the tests myself.&quot;
            </p>
          </div>
        </details>

        <details>
          <summary>How do you write good prompts?</summary>
          <div className="answer">
            <p>
              &quot;I name the goal, the place, the limits, and how to check the result. Compare:
            </p>
            <ul>
              <li>Vague: &quot;Fix the login bug.&quot;</li>
              <li>Good: &quot;In src/auth/login.ts, a valid email returns 401. Reproduce it with npm test auth, find the cause, and fix it. Show me the passing test. Do not change the API.&quot;</li>
            </ul>
            <p>
              For anything bigger I ask for a plan first.&quot;
            </p>
          </div>
        </details>

        <details>
          <summary>How do you keep the code secure when you use AI?</summary>
          <div className="answer">
            <ul>
              <li>&quot;I never paste keys or customer data into prompts, and I deny the agent access to .env files.</li>
              <li>I review what it writes for missing authorization, weak input validation, and unsafe SQL.</li>
              <li>I check every new dependency, because models sometimes invent package names that attackers can register.</li>
              <li>The agent never gets production credentials, and bypass or full-access modes stay inside a throwaway sandbox.</li>
              <li>I use only company-approved tools and follow our data rules.&quot;</li>
            </ul>
          </div>
        </details>

        <details>
          <summary>How do you debug with AI?</summary>
          <div className="answer">
            <p>
              &quot;I give the agent the exact error and the steps to reproduce it, because guesses make it guess too. I ask for the root cause, not just silencing the error.
            </p>
            <p>
              It reads the code, finds the cause, and makes the smallest fix. Then I re-run the failing case, and if it still fails we go back to the root cause.&quot;
            </p>
          </div>
        </details>

        <details>
          <summary>How do you verify the AI&apos;s output?</summary>
          <div className="answer">
            <p>
              &quot;I never trust it because it looks tidy. I run the tests and lint, which hooks do automatically, then I review the diff for what AI tends to get wrong:
            </p>
            <ul>
              <li>Invented APIs</li>
              <li>Missing edge cases</li>
              <li>Skipped authorization</li>
              <li>Tests that look like they pass but prove nothing</li>
            </ul>
            <p>
              I keep pull requests small, since a huge AI diff is one nobody really reads, and I own every line I merge.&quot;
            </p>
          </div>
        </details>

        <details>
          <summary>How do you check an AI run you did not watch?</summary>
          <div className="answer">
            <p>
              &quot;The less I watched, the more I verify. I keep unattended runs in auto mode, not bypass, because it blocks dangerous actions, though it never judges whether the code is correct. Then:
            </p>
            <ul>
              <li>I read the diff before the summary, because a tidy write-up can hide a file I did not expect it to touch.</li>
              <li>I make the tests a hook, such as a stop hook that exits with code 2 on failure, so Claude gets the failure back and fixes it on every run.</li>
              <li>For a headless run I check the JSON result and the exit code.</li>
              <li>I get a cold second opinion: a fresh session reviews the diff with no memory of how it was built.&quot;</li>
            </ul>
          </div>
        </details>

        <details>
          <summary>How can AI help with code review on a team?</summary>
          <div className="answer">
            <p>
              &quot;A GitHub workflow can run Claude on every pull request, so it comments on the diff within minutes. It reads the same CLAUDE.md as our local agents, so it checks our team rules, like never logging emails.
            </p>
            <p>
              It costs API tokens on each run, and it is only a first pass: it catches the cheap problems so the human reviewer can focus on intent, design, and authorization. A person still approves the merge.&quot;
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
