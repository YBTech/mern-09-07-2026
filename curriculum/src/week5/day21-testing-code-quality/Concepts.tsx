import DayNav from "../../components/DayNav";

export default function Concepts() {
  return (
    <div className="page concepts-page">
      <title>Day 21 — Concepts Reference</title>
      <DayNav day="day21-testing-code-quality" current="concepts" />
      <h1>Day 21 — Concepts Reference</h1>
      <p className="intro">
        A reference list of concept questions — try answering each one before
        revealing it.
      </p>

      <section id="tier-1">
        <h2>1. Basic concepts</h2>
        <p className="tier-note">
          Foundational stuff — straight from the lecture and/or comes up
          constantly in interviews. If you&apos;re shaky on any of these,
          that&apos;s the priority to fix.
        </p>

        <details>
          <summary>
            What is the difference between unit, integration, and E2E tests?
          </summary>
          <div className="answer">
            <ul>
              <li>
                <strong>Unit:</strong> one function or one component, in
                isolation. Milliseconds each, so you write many.
              </li>
              <li>
                <strong>Integration:</strong> your code working with a real
                second system — a database, a message broker, another service.
                Slower, so fewer.
              </li>
              <li>
                <strong>E2E:</strong> the whole running app driven through a
                real browser, the way a user would. The closest imitation of
                production, and the slowest and most fragile, so only a handful.
              </li>
            </ul>
            <p>
              Higher up the pyramid means more confidence per test but slower
              feedback.
            </p>
          </div>
        </details>

        <details>
          <summary>
            What does &quot;integration&quot; actually mean — is rendering
            several React components together an integration test?
          </summary>
          <div className="answer">
            <p>
              No — that is a <strong>component test</strong>: it&apos;s all your
              own code in one process, crossing no boundary. Integration means
              your code working with something separate, like an Express route
              against a real database, or one service calling another over HTTP.
              Ask: is a real second system involved?
            </p>
          </div>
        </details>

        <details>
          <summary>
            What does a test runner provide, and what does a testing library
            add?
          </summary>
          <div className="answer">
            <ul>
              <li>
                <strong>Test runner</strong> (Vitest, Jest): finds and runs test
                files, reports pass/fail, and provides <code>describe</code>,{" "}
                <code>it</code>, <code>expect</code>, mock functions, and
                coverage.
              </li>
              <li>
                <strong>Testing library</strong> (React Testing Library,
                Supertest): adds utilities for one specific kind of target that
                the runner can&apos;t handle alone — rendering and querying a
                component, or sending HTTP requests to an Express app.
              </li>
            </ul>
          </div>
        </details>

        <details>
          <summary>
            What are jsdom and happy-dom, and is that the virtual DOM?
          </summary>
          <div className="answer">
            <p>
              They&apos;re plain-JavaScript imitations of the browser DOM, so
              component tests can run in Node, which has no browser. Not the
              virtual DOM — that&apos;s React&apos;s internal diffing structure.
              The runner is configured to use jsdom, and <code>render</code>{" "}
              mounts the component into it.
            </p>
          </div>
        </details>

        <details>
          <summary>What is mocking and stubbing, and why do we do it?</summary>
          <div className="answer">
            <p>
              You replace a dependency (an API call, a library, the clock) with
              a controlled fake, so the test checks only your code, runs fast,
              and gives the same result every time. It also lets you force
              hard-to-trigger cases like a 500 response.
            </p>
            <ul>
              <li>
                <strong>Stub:</strong> returns canned values.
              </li>
              <li>
                <strong>Mock:</strong> a stub you also assert against (&quot;was
                it called with these arguments?&quot;).
              </li>
              <li>
                <strong>Spy:</strong> records how it was called but keeps the
                real behavior.
              </li>
            </ul>
          </div>
        </details>

        <details>
          <summary>
            In E2E tests, when do you stub the network and when do you hit the
            real backend?
          </summary>
          <div className="answer">
            <ul>
              <li>
                <strong>Stub</strong> (Cypress <code>cy.intercept</code>,
                Playwright <code>page.route</code>): to test how the UI reacts
                to a specific response — an error, an empty list, a slow reply.
                Fast and deterministic, but it can&apos;t catch a mismatch with
                the real API.
              </li>
              <li>
                <strong>Real backend:</strong> for a few critical paths like
                checkout, to prove the whole system works together.
              </li>
              <li>
                <strong>Usual strategy:</strong> a few real-backend tests, many
                stubbed ones.
              </li>
            </ul>
          </div>
        </details>

        <details>
          <summary>
            What is a flaky test, what causes it, and how do you fix it?
          </summary>
          <div className="answer">
            <p>
              A test that passes and fails on the same code, with no change.
              Common causes → fixes:
            </p>
            <ul>
              <li>
                <strong>Timing:</strong> fixed <code>sleep</code>s, asserting
                before data renders → wait for a condition (auto-waiting
                assertions, <code>findBy</code>).
              </li>
              <li>
                <strong>Shared state / test order:</strong> test B relies on
                data test A created → each test sets up and cleans its own data.
              </li>
              <li>
                <strong>Parallel collisions:</strong> two workers use the same
                row or user → unique data per test or worker.
              </li>
              <li>
                <strong>External services:</strong> slow or down third-party
                APIs → stub them.
              </li>
              <li>
                <strong>Time and randomness:</strong> fails at midnight or on
                random IDs → fake the clock, seed the random generator.
              </li>
              <li>
                <strong>Brittle selectors / animations:</strong> → role, label,
                or test-id locators; wait for the element to be stable.
              </li>
            </ul>
            <p>
              Until it&apos;s fixed, quarantine it rather than letting retries
              hide it.
            </p>
          </div>
        </details>

        <details>
          <summary>Why is a flaky test worse than no test?</summary>
          <div className="answer">
            <p>
              It teaches the team to re-run red builds instead of reading them,
              so real failures get ignored too. A suite nobody trusts stops
              protecting anything.
            </p>
          </div>
        </details>

        <details>
          <summary>
            What are TDD and BDD, and are they mutually exclusive?
          </summary>
          <div className="answer">
            <ul>
              <li>
                <strong>TDD (test-driven development):</strong> write the test
                first so it drives the code — red (a failing test), green (the
                simplest code that passes), refactor. Works at the code level.
              </li>
              <li>
                <strong>BDD (behavior-driven development):</strong> describe
                behavior in plain language (Gherkin&apos;s Given / When / Then,
                run with Cucumber) so product, QA, and developers agree on it.
                Works at the feature level.
              </li>
              <li>
                <strong>Not mutually exclusive:</strong> a Gherkin scenario run
                through Cypress as the feature test, with red-green-refactor on
                the unit tests underneath, is a common combination.
              </li>
            </ul>
          </div>
        </details>

        <details>
          <summary>
            What does coverage tell you, and what happens if it&apos;s too low
            or too high?
          </summary>
          <div className="answer">
            <ul>
              <li>
                <strong>What it measures:</strong> which lines and branches{" "}
                <em>ran</em> during the suite — never whether anything was{" "}
                <em>verified</em>. A test with no assertions can hit 100%.
              </li>
              <li>
                <strong>Too low:</strong> large areas with no safety net, so
                every change is risky.
              </li>
              <li>
                <strong>Too high (chasing 100%):</strong> shallow tests written
                to move the number, tied to implementation, slow to maintain,
                and a false sense of safety.
              </li>
            </ul>
          </div>
        </details>

        <details>
          <summary>
            Interview question: some of your code is not covered by tests — what
            do you do?
          </summary>
          <div className="answer">
            <ul>
              <li>
                <strong>Look at what&apos;s uncovered, not the percentage</strong>{" "}
                — important logic, or trivial / generated code?
              </li>
              <li>
                <strong>Missing behavior:</strong> add real tests, riskiest first.{" "}
                <strong>Dead code:</strong> delete it.
              </li>
              <li>
                <strong>Don&apos;t game it:</strong> never write assertion-free tests
                just to turn lines green.
              </li>
            </ul>
          </div>
        </details>

        <details>
          <summary>Why are pure functions easy to test?</summary>
          <div className="answer">
            <p>
              Same input always gives the same output, with no network, clock,
              or hidden state, so there&apos;s nothing to mock. That&apos;s why
              logic gets pulled out of components into plain functions — and why
              code that&apos;s hard to test is often hard to use too.
            </p>
          </div>
        </details>

        <details>
          <summary>
            What&apos;s the difference between ESLint and Prettier?
          </summary>
          <div className="answer">
            <ul>
              <li>
                <strong>Prettier:</strong> formatting only — indentation,
                quotes, line length. It catches no bugs; it just ends arguments
                about style.
              </li>
              <li>
                <strong>ESLint:</strong> flags patterns and likely bugs — unused
                variables, a floating promise, <code>==</code> where you meant{" "}
                <code>===</code>.
              </li>
            </ul>
            <p>
              Neither runs your code; they read it, which makes them fast and
              cheap.
            </p>
          </div>
        </details>

        <details>
          <summary>What does SonarQube add on top of ESLint?</summary>
          <div className="answer">
            <p>
              Whole-codebase trends over time — duplication, complexity,
              security hotspots, coverage history — so you can see quality
              drifting downward over months, not just problems in the file in
              front of you.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a smoke test?</summary>
          <div className="answer">
            <p>
              A smoke test is a tiny set of shallow checks that runs right after a
              deploy, asking &quot;is the build basically alive?&quot; It runs
              before the slower, more expensive tests, so we don&apos;t waste
              time if the system isn&apos;t even working. If it fails, the build
              is rejected.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a regression test?</summary>
          <div className="answer">
            <p>
              A regression test checks that a change didn&apos;t break something
              that used to work. When a bug is fixed, we write a test that
              reproduces it and keep it forever, so the bug can&apos;t quietly
              come back. The whole suite re-runs on every change.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a happy path test?</summary>
          <div className="answer">
            <p>
              A happy path test covers the scenario where everything goes right:
              valid input, nothing fails. Every feature should have at least
              one. Bad input, failures, and empty states are unhappy paths and
              need their own tests.
            </p>
          </div>
        </details>

        <details>
          <summary>
            What is critical path testing, and how does it differ from happy
            path testing?
          </summary>
          <div className="answer">
            <p>
              Critical paths are the flows the business can&apos;t afford to
              break, like sign-up, checkout, and payment: if one fails, the
              company loses money or users right away. They get the most
              thorough testing, the happy path plus the unhappy paths that
              matter, with E2E coverage first. Every feature has a happy path,
              but only the core flows are critical.
            </p>
          </div>
        </details>

        <details>
          <summary>
            What is snapshot testing, and what are its pitfalls?
          </summary>
          <div className="answer">
            <ul>
              <li>
                <strong>How it works:</strong> the first run saves the rendered
                output to a <code>.snap</code> file; later runs fail if the
                output differs. An intended change means updating the snapshot (
                <code>vitest -u</code>).
              </li>
              <li>
                <strong>What it checks:</strong> &quot;did this change?&quot;,
                not &quot;is it correct?&quot; — whatever rendered the first
                time becomes the expectation, bugs included.
              </li>
              <li>
                <strong>Good for:</strong> small, stable output you want to lock
                down, like a formatted message or an API response shape.
              </li>
              <li>
                <strong>Pitfalls:</strong> large snapshots nobody reviews,
                failures on every harmless markup change, and developers running{" "}
                <code>-u</code> on reflex. It tests markup, not behavior, so it
                can&apos;t replace a test that clicks and checks.
              </li>
            </ul>
          </div>
        </details>
      </section>

      <section id="tier-2">
        <h2>2. Advanced concepts</h2>
        <p className="tier-note">
          Less commonly asked, and some go beyond what today&apos;s lecture
          covered — mostly &quot;gotcha&quot; interview trivia and things that
          sharpen how you code without being asked often.
        </p>

        <details>
          <summary>What should you not mock?</summary>
          <div className="answer">
            <ul>
              <li>
                <strong>The code under test</strong>, or anything it owns — then
                you&apos;re testing the fake.
              </li>
              <li>
                <strong>Pure functions</strong> — just call them.
              </li>
              <li>
                <strong>The database in an integration test</strong> — a fake
                can&apos;t express a constraint violation, a rollback, or a
                race, which is what the test exists to catch.
              </li>
            </ul>
            <p>
              Over-mocking leaves a test that only proves your code calls the
              fakes as written — it stays green while production is broken.
            </p>
          </div>
        </details>

        <details>
          <summary>
            Why should tests check behavior rather than implementation details?
          </summary>
          <div className="answer">
            <p>
              A test tied to internals (which helper ran, how often{" "}
              <code>setState</code> was called) fails when you refactor correct
              code, so the suite punishes improvement and people delete tests.
              Assert on what a user or caller can observe: rendered text, return
              values, thrown errors, responses.
            </p>
          </div>
        </details>

        <details>
          <summary>
            Why do Testing Library queries prefer role, label, and text over CSS
            selectors?
          </summary>
          <div className="answer">
            <p>
              They mirror how a user finds things, so the test survives markup
              changes that don&apos;t change behavior. <code>data-testid</code>{" "}
              is the fallback when nothing user-facing is stable.
            </p>
          </div>
        </details>

        <details>
          <summary>
            How is visual regression testing different from snapshot testing?
          </summary>
          <div className="answer">
            <p>
              A snapshot compares serialized HTML; visual regression compares
              screenshots (e.g. Playwright&apos;s <code>toHaveScreenshot</code>
              ). Only the screenshot catches CSS breakage — overlapping
              elements, a wrong color — where the HTML hasn&apos;t changed.
            </p>
          </div>
        </details>

        <details>
          <summary>
            Why is &quot;coverage on changed lines&quot; a better gate than
            total coverage?
          </summary>
          <div className="answer">
            <p>
              It stops new untested code from landing without demanding a
              rewrite of everything old. A global threshold on a legacy codebase
              either blocks every PR or is set so low it means nothing.
            </p>
          </div>
        </details>

        <details>
          <summary>
            What is mutation testing, and what does it measure that coverage
            can&apos;t?
          </summary>
          <div className="answer">
            <p>
              It deliberately mutates your source — flipping <code>&gt;</code>{" "}
              to <code>&gt;=</code>, say — and checks whether any test fails. It
              measures whether your assertions are meaningful, which is the
              question coverage never asks.
            </p>
          </div>
        </details>

        <details>
          <summary>
            How do you keep tests from slowing down the CI pipeline?
          </summary>
          <div className="answer">
            <ul>
              <li>
                <strong>Every push:</strong> only the fast set — lint, unit
                tests, a few smoke E2E tests.
              </li>
              <li>
                <strong>Nightly or pre-release:</strong> the heavy suites — full
                E2E, cross-browser.
              </li>
              <li>
                <strong>Always:</strong> run tests in parallel, and push logic
                down the pyramid into cheap unit tests so the expensive ones
                stay few.
              </li>
            </ul>
          </div>
        </details>

        <details>
          <summary>
            Are automatic test retries a good fix for flakiness?
          </summary>
          <div className="answer">
            <p>
              Only as a temporary measure. Retries hide the cause and slow the
              suite down; if you use them, report and count tests that passed
              only after a retry, so the flakiness stays visible and gets fixed.
            </p>
          </div>
        </details>

        <details>
          <summary>
            How does AI change testing work, and what is the risk?
          </summary>
          <div className="answer">
            <ul>
              <li>
                <strong>What changes:</strong> generating tests, mocks, and
                locators is cheap, so the human job shifts to deciding what the
                correct behavior is and reviewing test quality.
              </li>
              <li>
                <strong>The risk:</strong> AI often derives tests from the code
                itself, so they assert what the code <em>does</em> rather than
                what it <em>should</em> do — a bug gets locked in as the
                expected result.
              </li>
              <li>
                <strong>Coverage means less:</strong> shallow AI tests can
                inflate the number, so a high percentage proves even less than
                before.
              </li>
            </ul>
          </div>
        </details>

        <details>
          <summary>
            Why do some teams prefer more component and integration tests than
            the classic pyramid suggests?
          </summary>
          <div className="answer">
            <p>
              For UI-heavy apps, tests that render real components with their
              real children give more confidence per test than isolated unit
              tests, while staying far faster than E2E. The shape is a judgment
              call; the principle is fast feedback while testing real behavior.
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
