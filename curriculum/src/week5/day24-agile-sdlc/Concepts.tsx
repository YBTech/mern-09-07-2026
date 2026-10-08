import DayNav from "../../components/DayNav";

export default function Concepts() {
  return (
    <div className="page concepts-page">
      <title>Day 24 — Concepts Reference</title>
      <DayNav day="day24-agile-sdlc" current="concepts" />
      <h1>Day 24 — Concepts Reference</h1>
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
          <summary>What is the SDLC, and what are its phases?</summary>
          <div className="answer">
            <p>
              The Software Development Life Cycle — the phases every project passes through, in order:
            </p>
            <ol>
              <li><strong>Requirements</strong> — what to build</li>
              <li><strong>Design</strong> — how to build it (UI, architecture, APIs)</li>
              <li><strong>Development</strong> — write and review the code</li>
              <li><strong>Testing</strong> — automated tests plus QA</li>
              <li><strong>Release</strong> — deploy to production</li>
              <li><strong>Monitoring / maintenance</strong> — watch, fix, collect feedback for the next version</li>
            </ol>
            <p>
              Every process model runs these same phases; what differs is how much work goes through them at once.
            </p>
          </div>
        </details>

        <details>
          <summary>How does waterfall work, and what are its downsides?</summary>
          <div className="answer">
            <p>
              Each phase is finished for the whole project before the next starts, with no going back. Downsides:
            </p>
            <ul>
              <li>Requirement changes are expensive — the earlier phases are already &quot;done&quot;</li>
              <li>Users only see the product at the very end, so feedback comes last</li>
              <li>Testing gets squeezed when development runs late</li>
              <li>Everything ships in one risky big-bang release</li>
              <li>Nothing is usable until the end</li>
            </ul>
          </div>
        </details>

        <details>
          <summary>What is Agile, and what problem does it solve?</summary>
          <div className="answer">
            <p>
              A philosophy of building software in short iterations, delivering something usable
              each time and letting feedback steer the next one. It solves waterfall&apos;s core
              problem — you can&apos;t know all the requirements up front — by finding wrong
              assumptions in weeks instead of months.
            </p>
          </div>
        </details>

        <details>
          <summary>What&apos;s the relationship between Agile and Scrum?</summary>
          <div className="answer">
            <p>
              Agile is the philosophy; Scrum is one concrete framework for practicing it, with fixed
              sprints, a fixed set of meetings, and fixed roles. It&apos;s by far the most common
              one, so &quot;we&apos;re Agile&quot; usually means &quot;we run Scrum.&quot;
            </p>
          </div>
        </details>

        <details>
          <summary>What is a sprint, and how long is it?</summary>
          <div className="answer">
            <p>
              A fixed time box in which the team finishes an agreed set of tickets — usually two
              weeks, sometimes one or three. The end date never moves; unfinished work carries over
              instead.
            </p>
          </div>
        </details>

        <details>
          <summary>What&apos;s the difference between the product backlog and the sprint backlog?</summary>
          <div className="answer">
            <p>
              The product backlog is the whole prioritized to-do pile for the product, owned by the
              PO. The sprint backlog is the slice the team committed to in this sprint&apos;s
              planning.
            </p>
          </div>
        </details>

        <details>
          <summary>What&apos;s the difference between an epic, a story, a task, and a sub-task?</summary>
          <div className="answer">
            <p>
              An epic is a big feature spanning several sprints. A story is a user-facing piece of it
              that fits in one sprint; a task is technical work with no direct user value (an
              upgrade, a pipeline). A sub-task is a piece of a story so it can be split or shared.
            </p>
          </div>
        </details>

        <details>
          <summary>What goes into a ticket?</summary>
          <div className="answer">
            <ul>
              <li>Key and title (e.g. <code>ORD-101</code>)</li>
              <li>Description — the user story plus details</li>
              <li>Acceptance criteria</li>
              <li>Story points</li>
              <li>Assignee and reporter, status, priority</li>
              <li>Sprint, epic, labels, fix version</li>
              <li>Links — Figma designs, Confluence docs, the PR, related tickets</li>
            </ul>
          </div>
        </details>

        <details>
          <summary>What is a user story? Give the format.</summary>
          <div className="answer">
            <p>
              A requirement written from the user&apos;s point of view: &quot;As a <em>type of
              user</em>, I want <em>to do something</em>, so that <em>I get some benefit</em>.&quot;
              The &quot;so that&quot; records the reason, which tells you what you can cut when time
              runs short.
            </p>
          </div>
        </details>

        <details>
          <summary>What&apos;s the difference between acceptance criteria and the Definition of Done?</summary>
          <div className="answer">
            <p>
              Acceptance criteria are per ticket — testable statements of what <em>this</em> feature
              must do. The Definition of Done is one team-wide checklist for <em>every</em> ticket:
              reviewed, tests and CI green, merged, deployed to staging, QA passed, docs updated, PO
              accepted.
            </p>
          </div>
        </details>

        <details>
          <summary>What are story points, and why not estimate in hours?</summary>
          <div className="answer">
            <p>
              A relative measure combining amount of work, complexity, and unknowns. Hours ignore
              uncertainty and differ from person to person; points let the team agree that a ticket
              is &quot;bigger than that one,&quot; and velocity turns points into a forecast.
            </p>
          </div>
        </details>

        <details>
          <summary>How does a team estimate story points?</summary>
          <div className="answer">
            <p>
              Planning poker:
            </p>
            <ol>
              <li>Discuss the ticket and ask questions</li>
              <li>Everyone reveals a number at the same time (Fibonacci-like: 1, 2, 3, 5, 8, 13)</li>
              <li>The highest and lowest voters explain their reasoning</li>
              <li>Re-vote until the team agrees</li>
            </ol>
            <p>
              Anything 13 or above gets split, or investigated with a spike first.
            </p>
          </div>
        </details>

        <details>
          <summary>What happens in sprint planning?</summary>
          <div className="answer">
            <ol>
              <li>The PO presents the top of the groomed backlog and a one-sentence sprint goal</li>
              <li>The team walks through each ticket and asks questions</li>
              <li>Story points are confirmed</li>
              <li>Capacity is checked — velocity minus time off and on-call</li>
              <li>Tickets are pulled in from the top until the sprint is full</li>
              <li>Tickets are assigned — developers volunteer, or the tech lead assigns</li>
            </ol>
          </div>
        </details>

        <details>
          <summary>Is a sprint the same as a release? How often do teams release?</summary>
          <div className="answer">
            <p>
              No — a sprint is how the team plans work; a release is when users get it. Cadence
              varies by team: every few months (regulated, installed, or hardware products), every
              sprint or monthly (many B2B and mobile apps), weekly, or daily/continuous (consumer web
              and SaaS with strong automation).
            </p>
          </div>
        </details>

        <details>
          <summary>What is a daily standup for?</summary>
          <div className="answer">
            <p>
              A 15-minute daily sync where each person answers three questions:
            </p>
            <ol>
              <li>What I did yesterday</li>
              <li>What I will do today</li>
              <li>What is blocking me</li>
            </ol>
            <p>
              Its real job is surfacing blockers early — long discussions get taken offline.
            </p>
          </div>
        </details>

        <details>
          <summary>What happens in backlog grooming (refinement)?</summary>
          <div className="answer">
            <p>
              Held mid-sprint. It looks in two directions:
            </p>
            <ul>
              <li><strong>Forward:</strong> clarify, split, and estimate the tickets for next sprint</li>
              <li><strong>Now:</strong> check the current sprint — move at-risk tickets back to the backlog, or pull in urgent ones</li>
            </ul>
          </div>
        </details>

        <details>
          <summary>What&apos;s the difference between the sprint review and the retrospective?</summary>
          <div className="answer">
            <p>
              The review (demo) looks at the <em>product</em>: show working software to the PO and
              stakeholders. The retro looks at the <em>process</em>, team only: what went well, what
              didn&apos;t, and one or two action items with owners.
            </p>
          </div>
        </details>

        <details>
          <summary>What do the Product Owner, the Project Manager, and the tech lead each own?</summary>
          <div className="answer">
            <ul>
              <li><strong>Product Owner</strong> — <em>what</em> gets built, and its priority</li>
              <li><strong>Project Manager</strong> — the <em>timeline and process</em>: meetings, reports, chasing blockers</li>
              <li><strong>Tech lead</strong> — the <em>technical how</em>; still an engineer who writes code</li>
            </ul>
          </div>
        </details>

        <details>
          <summary>What is a Scrum Master, and do teams still have one?</summary>
          <div className="answer">
            <p>
              In classic Scrum, the person who runs the process, removes blockers, and shields the
              team from mid-sprint changes. Dedicated Scrum Masters are rare now — the role is
              usually folded into the project manager, tech lead, or engineering manager.
            </p>
          </div>
        </details>

        <details>
          <summary>What is Jira, and what is Confluence?</summary>
          <div className="answer">
            <p>
              Both are Atlassian tools. Jira tracks the work — backlog, tickets, sprints, the board.
              Confluence is the wiki for anything that outlives a sprint: design docs, specs, API
              docs, onboarding, runbooks, meeting notes, postmortems, company policies.
            </p>
          </div>
        </details>

        <details>
          <summary>What is velocity, and what is a typical number?</summary>
          <div className="answer">
            <p>
              The story points a team completes per sprint, averaged over the last few sprints — it
              tells the team how much to commit to in the next planning. Roughly:
            </p>
            <ul>
              <li>One engineer: about 8–12 points per two-week sprint</li>
              <li>Tech lead or new hire: lower</li>
              <li>A team of five developers: about 35–50 points</li>
            </ul>
          </div>
        </details>

        <details>
          <summary>Story points aren&apos;t hours — so roughly how long does a ticket take?</summary>
          <div className="answer">
            <p>
              A common rule of thumb is 1 point ≈ one working day for one engineer, all-in (coding,
              tests, review, QA rework). So a 3 is a couple of days, a 5 most of a week, and an 8
              about a week or more.
            </p>
            <p>
              It&apos;s a sanity check, not a promise — never convert points back to hours for a
              stakeholder; forecast with velocity instead.
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
          <summary>Tell me about your team structure.</summary>
          <div className="answer">
            <p>
              &quot;About ten people:
            </p>
            <ul>
              <li>A product owner and a project manager</li>
              <li>A BA who turns requirements into tickets</li>
              <li>A tech lead plus five developers — all full stack, I lean front end</li>
              <li>Two QA engineers</li>
              <li>Our designer and DevOps engineers sit in shared teams — a weekly design review, and a Slack channel with DevOps</li>
              <li>Our team owns the checkout micro frontends and the cart and order services&quot;</li>
            </ul>
          </div>
        </details>

        <details>
          <summary>What methodology did your team use? Walk me through a sprint.</summary>
          <div className="answer">
            <p>
              &quot;Scrum with two-week sprints:
            </p>
            <ul>
              <li>Sprint planning on the first morning</li>
              <li>A 15-minute standup every day</li>
              <li>Backlog grooming in the middle of the sprint</li>
              <li>Demo and retro on the last day</li>
              <li>Most of the time in between is development</li>
            </ul>
          </div>
        </details>

        <details>
          <summary>How do you get your tickets?</summary>
          <div className="answer">
            <p>
              &quot;In sprint planning:
            </p>
            <ol>
              <li>The PO brings the prioritized tickets to sprint planning</li>
              <li>We have already estimated them in grooming</li>
              <li>We pull in as many as our velocity allows</li>
              <li>Then we volunteer for the ones we want, or the tech lead assigns them based on who knows that area&quot;</li>
            </ol>
          </div>
        </details>

        <details>
          <summary>How do you estimate a ticket?</summary>
          <div className="answer">
            <p>
              &quot;Story points with planning poker:
            </p>
            <ol>
              <li>We read the requirements and acceptance criteria and ask questions</li>
              <li>Everyone votes at once</li>
              <li>If someone is far off, they explain — maybe they know a shortcut or spotted a risk — and we re-vote</li>
              <li>Anything 13 or above, we split or do a spike first&quot;</li>
            </ol>
          </div>
        </details>

        <details>
          <summary>What do you do if you realize you&apos;re going to miss a deadline?</summary>
          <div className="answer">
            <p>
              &quot;Speak up early — never stay silent until the last day. Then:
            </p>
            <ol>
              <li>Raise it at standup as soon as I see the risk</li>
              <li>Raise it in grooming mid-sprint and explain why</li>
              <li>Ask for help from the team or the tech lead</li>
              <li>Cut scope using the user story&apos;s &quot;so that&quot;</li>
              <li>Or move the ticket to the next sprint while there is still time to plan around it&quot;</li>
            </ol>
          </div>
        </details>

        <details>
          <summary>What do you do when you&apos;re stuck on a problem?</summary>
          <div className="answer">
            <p>
              &quot;I do three things:
            </p>
            <ol>
              <li>Time-box it — try alone for a few hours, checking docs, logs, and past tickets</li>
              <li>If still stuck, say so at standup or message a teammate or the tech lead with what I tried</li>
              <li>Staying stuck for two days quietly costs the team more than asking&quot;</li>
            </ol>
          </div>
        </details>

        <details>
          <summary>What do you do when requirements are unclear?</summary>
          <div className="answer">
            <p>
              &quot;Ask before coding. I comment on the ticket or message the BA or PO, and if it
              affects others I bring it up in grooming. Whatever we decide goes into the ticket&apos;s
              acceptance criteria, so QA tests against the same thing.&quot;
            </p>
          </div>
        </details>

        <details>
          <summary>Walk me through a ticket from assignment to done.</summary>
          <div className="answer">
            <p>
              &quot;Start to finish:
            </p>
            <ol>
              <li>Read the acceptance criteria and ask questions</li>
              <li>Create a branch named after the ticket</li>
              <li>Build it with unit tests and open a PR</li>
              <li>CI runs, two teammates review, I merge</li>
              <li>It deploys to the test environment and QA tests it against the acceptance criteria</li>
              <li>I demo it at the sprint review</li>
              <li>It is done when it meets our Definition of Done&quot;</li>
            </ol>
          </div>
        </details>

        <details>
          <summary>What&apos;s your team&apos;s Definition of Done?</summary>
          <div className="answer">
            <p>
              &quot;A ticket is done when:
            </p>
            <ul>
              <li>Acceptance criteria met</li>
              <li>Code reviewed with two approvals</li>
              <li>Unit tests written and CI green</li>
              <li>Merged and deployed to staging</li>
              <li>Passed QA</li>
              <li>Docs updated if anything changed</li>
              <li>Accepted by the PO&quot;</li>
            </ul>
          </div>
        </details>

        <details>
          <summary>How do you work with designers?</summary>
          <div className="answer">
            <p>
              &quot;Our designer is from the shared design team and joins our weekly design review.
              Mockups are linked in Figma on each ticket. If something isn&apos;t feasible or is
              missing a state — an error, empty, or loading screen — I raise it with them before I
              build it, and we agree on an alternative.&quot;
            </p>
          </div>
        </details>

        <details>
          <summary>How do you work with QA? What if QA reopens your ticket?</summary>
          <div className="answer">
            <p>
              &quot;QA tests every ticket against its acceptance criteria. If they find a bug, the
              ticket goes back to In Progress — I reproduce it, fix it, add a test so it can&apos;t
              come back, and send it back to QA. It&apos;s not personal; it&apos;s the process
              working.&quot;
            </p>
          </div>
        </details>

        <details>
          <summary>How do you work with other teams, like DevOps or another service&apos;s team?</summary>
          <div className="answer">
            <p>
              &quot;Through their Slack channel for quick questions, and a ticket on their board for
              real work. If my ticket depends on another team&apos;s API, I raise it in planning so
              the PM can coordinate — and we agree on the API contract first so both sides can work
              in parallel.&quot;
            </p>
          </div>
        </details>

        <details>
          <summary>What if a stakeholder asks for new work in the middle of a sprint?</summary>
          <div className="answer">
            <p>
              &quot;I redirect it to the PO rather than just starting it. If it&apos;s truly urgent,
              the PO pulls it in and we move something of the same size out to the backlog — the
              sprint&apos;s total doesn&apos;t grow.&quot;
            </p>
          </div>
        </details>

        <details>
          <summary>What happens to a ticket you didn&apos;t finish by the end of the sprint?</summary>
          <div className="answer">
            <p>
              &quot;It carries over to the next sprint — the sprint isn&apos;t extended. In the retro
              we talk about why: was it underestimated, blocked, or did scope grow? That helps us
              estimate better next time.&quot;
            </p>
          </div>
        </details>

        <details>
          <summary>Tell me about an improvement that came out of a retrospective.</summary>
          <div className="answer">
            <p>
              &quot;PRs kept sitting in Code Review for two days, so tickets piled up before QA. In
              the retro we agreed everyone reviews open PRs right after standup, with one person
              owning the reminder. Review time dropped to under a day.&quot;
            </p>
          </div>
        </details>

        <details>
          <summary>How often does your team release, and what is the process?</summary>
          <div className="answer">
            <ul>
              <li>&quot;We release every two weeks, at the end of the sprint — but a finished ticket isn&apos;t live until the release goes out</li>
              <li>The release is tagged, deployed during a quiet window, and a developer is on call to watch monitoring</li>
              <li>If something breaks we roll back to the previous version; urgent bugs go out as a hotfix outside the schedule</li>
              <li>The cadence depends on the product — a regulated client system might release quarterly, while a consumer web app can release daily&quot;</li>
            </ul>
          </div>
        </details>

        <details>
          <summary>How do you handle a production bug in the middle of a sprint?</summary>
          <div className="answer">
            <p>
              &quot;Four steps:
            </p>
            <ol>
              <li>Create a bug ticket — a critical bug skips the queue</li>
              <li>The on-call developer, or whoever owns that area, fixes it as a hotfix</li>
              <li>The PO moves something else out of the sprint to make room</li>
              <li>Afterwards we write a short postmortem in Confluence&quot;</li>
            </ol>
          </div>
        </details>

        <details>
          <summary>How do AI tools fit into your workflow, and how does that affect estimates?</summary>
          <div className="answer">
            <ul>
              <li>&quot;I use them for boilerplate, tests, and understanding unfamiliar code — then I read and review every line myself</li>
              <li>Small, well-defined tickets go faster; ambiguous ones don&apos;t, because the slow part is clarifying requirements</li>
              <li>In estimation we still point on size and uncertainty, and we recalibrate against recent sprints rather than old velocity&quot;</li>
            </ul>
          </div>
        </details>

        <details>
          <summary>What tools did your team use day to day?</summary>
          <div className="answer">
            <p>
              &quot;Day to day we used:
            </p>
            <ul>
              <li><strong>Jira</strong> for tickets and the sprint board</li>
              <li><strong>Confluence</strong> for design docs and runbooks</li>
              <li><strong>GitHub</strong> for code and PRs, with CI on every PR</li>
              <li><strong>Figma</strong> for designs</li>
              <li><strong>Slack</strong> for communication&quot;</li>
            </ul>
          </div>
        </details>
      </section>

      <section id="tier-3">
        <h2>3. Advanced concepts</h2>
        <p className="tier-note">
          Less commonly asked, and some go beyond what today&apos;s lecture covered — mostly
          &quot;gotcha&quot; interview trivia and things that sharpen how you code without being
          asked often.
        </p>

        <details>
          <summary>Why put the ticket ID in the branch name and PR title?</summary>
          <div className="answer">
            <p>
              Jira links the branch, commits, and PR to the ticket automatically. Months later,{" "}
              <code>git blame</code> gives you a commit, and the ticket ID gives you the reason, the
              acceptance criteria, and who asked for it.
            </p>
          </div>
        </details>

        <details>
          <summary>Why is a sprint never extended when work isn&apos;t finished?</summary>
          <div className="answer">
            <p>
              The fixed length is what makes velocity and planning meaningful. The date stays fixed
              and the scope moves — unfinished tickets carry over and the team learns to commit to
              less.
            </p>
          </div>
        </details>

        <details>
          <summary>What&apos;s the difference between Scrum and Kanban?</summary>
          <div className="answer">
            <p>
              Scrum has fixed sprints, a per-sprint commitment, and velocity. Kanban has no sprints —
              work flows continuously with WIP limits per column. Kanban suits support and DevOps
              teams whose work arrives unpredictably.
            </p>
          </div>
        </details>

        <details>
          <summary>What decides how often a team can release?</summary>
          <div className="answer">
            <ul>
              <li>The cost and risk of a single release (manual testing, downtime)</li>
              <li>Compliance, approvals, and client acceptance testing (UAT)</li>
              <li>How mature the automated tests and CI/CD are</li>
              <li>Platform and calendar — app-store review, code freezes before peak periods</li>
            </ul>
          </div>
        </details>

        <details>
          <summary>What is a feature flag, and how does it relate to releasing?</summary>
          <div className="answer">
            <p>
              An on/off switch in the code. You can deploy the code at any time and turn the feature
              on for users later, so deploying code and releasing a feature become separate
              decisions.
            </p>
          </div>
        </details>

        <details>
          <summary>What does a WIP limit do?</summary>
          <div className="answer">
            <p>
              It caps how many tickets can sit in a column, so finishing work beats starting new
              work. Without one, a board fills with half-done tickets that deliver nothing.
            </p>
          </div>
        </details>

        <details>
          <summary>What is Conway&apos;s law, and how does it relate to microservices?</summary>
          <div className="answer">
            <p>
              A system&apos;s architecture mirrors the communication structure of the organization
              that built it. So large companies draw team boundaries and service boundaries in the
              same places — each team owns one business area and its micro frontends and services.
            </p>
          </div>
        </details>

        <details>
          <summary>When is waterfall still the right choice?</summary>
          <div className="answer">
            <p>
              When requirements genuinely are fixed and late changes are enormously expensive —
              fixed-price contracts, hardware, safety-critical or heavily regulated systems.
              It&apos;s a trade-off, not a mistake.
            </p>
          </div>
        </details>

        <details>
          <summary>How have AI coding tools changed estimation and velocity?</summary>
          <div className="answer">
            <ul>
              <li>They speed up the coding part — boilerplate, CRUD, tests, small clear tickets</li>
              <li>They barely change requirements, review waits, QA, deploys, or cross-team dependencies</li>
              <li>Review load grows because more code is written</li>
              <li>Points drift: the same ticket gets pointed lower, or velocity rises — so recalibrate on recent sprints and don&apos;t compare velocity before and after AI</li>
            </ul>
          </div>
        </details>

        <details>
          <summary>Why does velocity stop working when it becomes a target?</summary>
          <div className="answer">
            <p>
              Points are self-estimated, so a team pushed to raise velocity just estimates higher.
              It&apos;s a forecasting tool, never a performance metric, and never comparable across
              teams.
            </p>
          </div>
        </details>

        <details>
          <summary>Why does the story point scale skip numbers?</summary>
          <div className="answer">
            <p>
              Precision drops as size grows, so the scale removes distinctions nobody can really
              make. Arguing 5 vs. 8 is a real conversation about scope; arguing 12 vs. 13 is wasted
              time.
            </p>
          </div>
        </details>

        <details>
          <summary>What are the four values of the Agile Manifesto?</summary>
          <div className="answer">
            <ul>
              <li>Individuals and interactions <em>over</em> processes and tools</li>
              <li>Working software <em>over</em> comprehensive documentation</li>
              <li>Customer collaboration <em>over</em> contract negotiation</li>
              <li>Responding to change <em>over</em> following a plan</li>
            </ul>
          </div>
        </details>
      </section>

    </div>
  );
}
