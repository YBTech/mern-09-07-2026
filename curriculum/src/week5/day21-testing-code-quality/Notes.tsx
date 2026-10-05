import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { Link } from "react-router-dom";
import { En, Zh } from "../../components/Lang";
import { Arrow, ArrowDefs, Box, T } from "../../components/Diagram";

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 21 Notes</title>
      <DayNav day="day21-testing-code-quality" current="notes" />
      <header className="lecture-header">
        <p className="eyebrow">Week 5 · Day 21 · Notes</p>
        <h1>Testing &amp; Code Quality</h1>
        <p className="subtitle">Executive summary → full walkthrough</p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2>Section 1 — Executive Summary</h2>
        <p>
          <En>
            The essentials — what you must be able to explain by the end of
            today. You will not be asked to write test code from memory; you
            will be asked to show you understand it.
          </En>
          <Zh>
            核心要点——今天结束时你必须能讲清楚的内容。面试不会要求你默写测试代码，而是考察你是否真正理解。
          </Zh>
        </p>
        <ul>
          <li>
            <En>
              Explain unit, integration, and E2E testing, and say what
              &quot;integration&quot; actually means (and what it does not)
            </En>
            <Zh>
              讲清楚 unit、integration、E2E 三种测试，并说明
              &quot;integration&quot; 真正指什么（以及不指什么）
            </Zh>
          </li>
          <li>
            <En>
              Explain what a test runner provides versus what a testing library
              provides
            </En>
            <Zh>讲清楚 test runner 和 testing library 各自提供什么</Zh>
          </li>
          <li>
            <En>
              Explain mocking and stubbing: why a test replaces a dependency,
              like an API call, with a controlled fake
            </En>
            <Zh>
              讲清楚 mocking 和
              stubbing：为什么测试要用受控的假对象替换依赖（比如 API 调用）
            </Zh>
          </li>
          <li>
            <En>
              Describe how E2E tests are organized, and when to stub the network
              versus hit the real backend
            </En>
            <Zh>
              描述 E2E 测试的组织方式，以及什么时候 stub
              网络、什么时候走真实后端
            </Zh>
          </li>
          <li>
            <En>Name the common causes of flaky tests and how to fix each</En>
            <Zh>说出 flaky test 的常见原因以及对应的解决办法</Zh>
          </li>
          <li>
            <En>
              Explain TDD (red → green → refactor) and BDD, and why they are not
              mutually exclusive
            </En>
            <Zh>
              讲清楚 TDD（red → green → refactor）和 BDD，以及为什么它们并不互斥
            </Zh>
          </li>
          <li>
            <En>
              Explain what coverage measures, what too low or too high means,
              and what you would do about uncovered code
            </En>
            <Zh>
              讲清楚 coverage
              衡量什么、过低或过高意味着什么，以及遇到未覆盖的代码你会怎么做
            </Zh>
          </li>
          <li>
            <En>
              Explain ESLint, Prettier, and SonarQube, and how AI changes
              testing work
            </En>
            <Zh>
              讲清楚 ESLint、Prettier、SonarQube 的分工，以及 AI
              如何改变测试工作
            </Zh>
          </li>
        </ul>
        <p>
          Want more?{" "}
          <Link to="/week5/day21-testing-code-quality/concepts">
            View all concepts?
          </Link>
        </p>
      </section>

      <section id="full-walkthrough">
        <h2>Section 2 — Full Walkthrough</h2>

        <h3>
          <En>1. What a test is, and why we write them</En>
          <Zh>1. 什么是测试，为什么要写</Zh>
        </h3>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <En>
                A test is a script that does what a human tester would do by
                hand — give the code an input or an action, then check the
                result matches what you expect.
              </En>
              <Zh>
                测试就是一段脚本，代替人工测试员手动做的事：给代码一个输入或操作，然后检查结果是否符合预期。
              </Zh>
            </li>
            <li>
              <En>
                Test <strong>behavior</strong>, not implementation.
                &quot;Clicking Add shows 2 items&quot; is behavior; &quot;the
                component called setState once&quot; is implementation and
                breaks on every refactor.
              </En>
              <Zh>
                测试的是 <strong>行为</strong>，而不是实现细节。&quot;点击 Add
                后显示 2 个商品&quot; 是行为；&quot;组件调用了一次
                setState&quot; 是实现细节，一重构就会挂。
              </Zh>
            </li>
            <li>
              <En>
                The payoff is not catching today&apos;s bug — it is that anyone
                can change the code next month and know within seconds whether
                they broke something (a safety net).
              </En>
              <Zh>
                价值不在于抓住今天的
                bug，而在于下个月任何人改代码，几秒钟内就知道有没有改坏东西（安全网）。
              </Zh>
            </li>
          </ul>
        </div>

        <h3>
          <En>2. The three core levels</En>
          <Zh>2. 三个核心层级</Zh>
        </h3>
        <table className="ref-table">
          <thead>
            <tr>
              <th>
                <En>Level</En>
                <Zh>层级</Zh>
              </th>
              <th>
                <En>What is under test</En>
                <Zh>测试对象</Zh>
              </th>
              <th>
                <En>Speed / cost</En>
                <Zh>速度 / 成本</Zh>
              </th>
              <th>
                <En>Example</En>
                <Zh>例子</Zh>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Unit</strong>
              </td>
              <td>
                <En>One function or one component, in isolation</En>
                <Zh>单个函数或单个组件，相互隔离</Zh>
              </td>
              <td>
                <En>Milliseconds, cheap, many</En>
                <Zh>毫秒级，成本低，数量多</Zh>
              </td>
              <td>
                <En>
                  <code>calculateOrderTotal()</code> returns the right sum
                </En>
                <Zh>
                  <code>calculateOrderTotal()</code> 返回正确的总价
                </Zh>
              </td>
            </tr>
            <tr>
              <td>
                <strong>Integration</strong>
              </td>
              <td>
                <En>
                  Your code working together with another part of the system
                </En>
                <Zh>你的代码与系统中另一个部分协同工作</Zh>
              </td>
              <td>
                <En>Seconds, moderate, some</En>
                <Zh>秒级，成本中等，数量适中</Zh>
              </td>
              <td>
                <En>
                  <code>POST /api/orders</code> really writes a row to the
                  database
                </En>
                <Zh>
                  <code>POST /api/orders</code> 真的往数据库写了一行
                </Zh>
              </td>
            </tr>
            <tr>
              <td>
                <strong>E2E</strong>
              </td>
              <td>
                <En>The whole running app, driven the way a user drives it</En>
                <Zh>完整运行的应用，按用户的方式去操作</Zh>
              </td>
              <td>
                <En>Tens of seconds, expensive, few</En>
                <Zh>几十秒，成本高，数量少</Zh>
              </td>
              <td>
                <En>
                  Open the browser, log in, place an order, see the confirmation
                  page
                </En>
                <Zh>打开浏览器，登录，下单，看到确认页面</Zh>
              </td>
            </tr>
          </tbody>
        </table>
        <CodeBlock
          language="plaintext"
          code={`ㅤ      ╱ E2E  ╲          few · slow · brittle · closest to production
      ╱─────────╲
    ╱ integration ╲       some · real DB, real HTTP, real broker
  ╱─────────────────╲
╱       unit         ╲    many · milliseconds · one piece in isolation`}
        />
        <p className="callout">
          <En>
            The pyramid is about feedback speed: a suite that takes 40 minutes
            stops being run, and a test nobody runs protects nothing.
          </En>
          <Zh>
            金字塔讲的是反馈速度：一套要跑 40
            分钟的测试没人愿意跑，没人跑的测试等于没有保护作用。
          </Zh>
        </p>

        <h3>
          <En>3. Integration — what it is, and what it is not</En>
          <Zh>3. Integration 到底是什么，不是什么</Zh>
        </h3>
        <p>
          <En>
            Integration means crossing a <strong>boundary</strong>: your code
            working with a real second system that you don&apos;t fully control.
          </En>
          <Zh>
            Integration 的关键是跨越 <strong>边界</strong>：你的代码和一个你无法完全控制的真实外部系统一起工作。
          </Zh>
        </p>
        <svg
          viewBox="0 0 640 200"
          role="img"
          aria-label="Left of a dashed boundary line: your own code in one process, Component A, Component B and a helper function. Testing those together crosses no boundary, so it is a unit or component test. Right of the line: a database, another service, and a third-party API. Calling any of those crosses the boundary, so it is an integration test."
        >
          <rect x={10} y={28} width={270} height={150} rx={8} fill="#f7f9fc" stroke="#9fb3d1" strokeWidth={1.5} strokeDasharray="5,4" />
          <T x={145} y={46} size={11} bold color="#3b4a63">Your code · one process</T>
          <Box x={28} y={60} w={100} h={34} label="Component A" />
          <Box x={152} y={60} w={100} h={34} label="Component B" />
          <Arrow d="M128,77 L150,77" />
          <Box x={90} y={112} w={100} h={34} label="helper()" />
          <T x={145} y={168}>no boundary crossed → unit / component test</T>

          <path d="M320,22 L320,192" stroke="#888" strokeWidth={2} strokeDasharray="6,4" />
          <T x={320} y={14} bold color="#666">boundary</T>

          <T x={445} y={46} size={11} bold color="#3b4a63">A real second system</T>
          <Box x={380} y={60} w={130} h={34} kind="warn" label="Database" />
          <Box x={380} y={104} w={130} h={34} kind="warn" label="Another service" />
          <Box x={380} y={148} w={130} h={34} kind="warn" label="Third-party API" />
          <Arrow d="M252,77 L378,77" ink="orange" />
          <Arrow d="M252,86 L378,121" ink="orange" />
          <Arrow d="M252,94 L378,165" ink="orange" />
          <T x={445} y={196}>crossing the line → integration test</T>
        </svg>
        <ul>
          <li>
            <En>
              <strong>Not integration:</strong> several React components
              rendered together in one test. Same code, same process, no
              boundary. That&apos;s a <strong>component test</strong>.
            </En>
            <Zh>
              <strong>不算 integration：</strong>在一个测试里把几个 React
              组件一起渲染。同一份代码、同一个进程，没有边界。这叫{" "}
              <strong>component test（组件测试）</strong>。
            </Zh>
          </li>
          <li>
            <En>
              The question to ask:{" "}
              <strong>&quot;is a real second system involved?&quot;</strong>
            </En>
            <Zh>
              判断的问题：<strong>&quot;有没有真实的外部系统参与？&quot;</strong>
            </Zh>
          </li>
        </ul>
        <p className="callout">
          <En>
            Teams label these differently. In an interview, state your
            definition and say what&apos;s real and what&apos;s replaced.
          </En>
          <Zh>
            各团队的叫法不一样。面试时先说出你的定义，再说清楚哪些是真实的、哪些被替换了。
          </Zh>
        </p>

        <h3>
          <En>4. Unit testing: test runner + testing library</En>
          <Zh>4. Unit testing：test runner + testing library</Zh>
        </h3>
        <p>
          <En>
            A unit test needs two tools: a <strong>runner</strong> that runs
            tests and checks results, and — for anything beyond plain values,
            like a React component — a <strong>library</strong> that knows how
            to handle it.
          </En>
          <Zh>
            unit test 需要两样工具：负责运行测试、检查结果的{" "}
            <strong>runner</strong>；以及在测试普通值之外的东西（比如 React
            组件）时，知道如何处理它的 <strong>library</strong>。
          </Zh>
        </p>

        <h4 className="topic">
          <En>4.1 The test runner</En>
          <Zh>4.1 Test runner</Zh>
        </h4>
        <p>
          <En>
            The runner finds your test files, runs them, and reports pass/fail.
            It gives you the building blocks: <code>describe</code> (a group),{" "}
            <code>it</code> (one case), and <code>expect</code> (an assertion).
          </En>
          <Zh>
            runner 负责找到测试文件、运行它们、报告通过或失败。它提供基本构件：
            <code>describe</code>（分组）、<code>it</code>（一个用例）、
            <code>expect</code>（断言）。
          </Zh>
        </p>
        <CodeBlock
          language="typescript"
          code={`import { describe, it, expect } from "vitest";
import { sum } from "./sum";

describe("sum", () => {
  it("adds numbers", () => {
    expect(sum(2, 3)).toBe(5);
    expect(sum(2, 3)).not.toBe(6);
  });

  it("returns 0 when given nothing", () => {
    expect(sum()).toBe(0);
  });
});`}
        />
        <ul>
          <li>
            <En>
              <strong>Jest</strong> — the runner in many existing React
              projects; it was the default for years.
            </En>
            <Zh>
              <strong>Jest</strong>——许多现有 React 项目在用的
              runner，多年来一直是默认选择。
            </Zh>
          </li>
          <li>
            <En>
              <strong>Vitest</strong> — the usual pick for new projects: it
              reuses the project&apos;s Vite config and runs faster. Its API
              mirrors Jest&apos;s, so the test above reads the same in either.
            </En>
            <Zh>
              <strong>Vitest</strong>——新项目的常见选择：直接复用项目的 Vite
              配置，速度更快。API 与 Jest 一致，上面的测试在两者里写法一样。
            </Zh>
          </li>
          <li>
            <En>
              <strong>Mocha + Chai</strong> — legacy; you&apos;ll only meet it
              in older codebases.
            </En>
            <Zh>
              <strong>Mocha + Chai</strong>——过时的组合，只会在老代码库里见到。
            </Zh>
          </li>
        </ul>

        <h4 className="topic">
          <En>4.2 The testing library</En>
          <Zh>4.2 Testing library</Zh>
        </h4>
        <p>
          <En>
            The runner only compares values. A React component isn&apos;t
            something you can compare — it has to be rendered into a DOM first,
            and the runner alone can&apos;t do that:
          </En>
          <Zh>
            runner 只会比较值。React
            组件不是一个可以直接比较的值——它得先被渲染到 DOM 里，而光靠 runner
            做不到：
          </Zh>
        </p>
        <CodeBlock
          bad={[6]}
          code={`import { it, expect } from "vitest";
import { Greeting } from "./Greeting";

it("greets the user", () => {
  // calling a component returns a React element object, not what's on screen
  expect(Greeting({ name: "Ana" })).toBe("Hello, Ana");
});`}
        />
        <p>
          <En>
            <strong>React Testing Library</strong> is a utility layer on top of
            the runner: <code>render</code> puts the component into a DOM,{" "}
            <code>screen</code> finds things in it the way a user would, and
            matchers like <code>toBeInTheDocument</code> check the result.
            (Enzyme did this job in older projects — legacy now.)
          </En>
          <Zh>
            <strong>React Testing Library</strong> 是 runner 之上的一层工具：
            <code>render</code> 把组件放进 DOM，<code>screen</code>{" "}
            像用户一样在里面找东西，<code>toBeInTheDocument</code> 这类 matcher
            检查结果。（老项目里这个角色由 Enzyme 担任——现在已经过时。）
          </Zh>
        </p>
        <CodeBlock
          code={`import { render, screen } from "@testing-library/react";
import { it, expect } from "vitest";
import { Greeting } from "./Greeting";

it("greets the user", () => {
  render(<Greeting name="Ana" />);

  expect(screen.getByText("Hello, Ana")).toBeInTheDocument();
});`}
        />
        <p>
          <En>
            It can also act like a user — clicking, typing — so you can check
            the component reacts the way it should:
          </En>
          <Zh>
            它还能模拟用户操作——点击、输入——这样就能检查组件的反应是否符合预期：
          </Zh>
        </p>
        <CodeBlock
          code={`import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { it, expect } from "vitest";
import { Counter } from "./Counter";

it("counts up when the button is clicked", async () => {
  render(<Counter />);

  await userEvent.click(screen.getByRole("button", { name: "Add one" }));

  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});`}
        />
        <p className="callout">
          <En>
            Queries follow what a user perceives — role, label, visible text —
            not CSS classes. If a refactor changes the markup but not the
            behavior, the test should still pass.
          </En>
          <Zh>
            查询方式遵循用户的感知——role、label、可见文本——而不是 CSS
            类名。重构改了标签结构但行为没变时，测试应该仍然通过。
          </Zh>
        </p>

        <h4 className="topic">
          <En>4.3 Configuration</En>
          <Zh>4.3 配置</Zh>
        </h4>
        <CodeBlock
          language="typescript"
          code={`// vite.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // a fake browser DOM inside Node, so render() has somewhere to draw
    // (not React's virtual DOM)
    environment: "jsdom",
    // loads extra matchers like toBeInTheDocument
    setupFiles: "./src/setupTests.ts",
  },
});`}
        />
        <p className="callout">
          <En>
            Pure functions are the easiest code to test: same input, same
            output, no network, clock, or hidden state. That&apos;s why teams
            pull logic out of components into plain functions.
          </En>
          <Zh>
            纯函数是最容易测试的代码：相同输入、相同输出，没有网络、时钟或隐藏状态。这也是团队把逻辑从组件里抽成普通函数的原因。
          </Zh>
        </p>

        <h3>
          <En>5. Mocking and stubbing</En>
          <Zh>5. Mocking 与 Stubbing</Zh>
        </h3>
        <p>
          <En>
            Say a component loads orders from an API when it mounts. Test it
            as-is, and every run fires a real request:
          </En>
          <Zh>
            假设一个组件在挂载时从 API
            加载订单。直接这样测试，每次运行都会发出一个真实请求：
          </Zh>
        </p>
        <CodeBlock
          bad={[6]}
          code={`import { render, screen } from "@testing-library/react";
import { it, expect } from "vitest";
import { OrderList } from "./OrderList"; // calls fetchOrders() from ./api on mount

it("shows the orders", async () => {
  render(<OrderList />); // sends a real request to the real API
  expect(await screen.findByText("Order #1")).toBeInTheDocument();
});`}
        />
        <p>
          <En>
            That makes the test depend on something outside your code. It&apos;s
            slow (a network round trip per test), and it fails whenever the API
            is down or its data changes — even though your component is fine.
            With a third-party service it&apos;s worse: real calls can cost
            money, hit rate limits, or actually <em>do</em> things, like
            charging a card or sending an email. And you can&apos;t make the
            real API return an error on demand just to test your error message.
          </En>
          <Zh>
            这样测试就依赖了你代码之外的东西。它很慢（每个测试都要走一次网络），而且只要
            API
            宕机或数据变了就会失败——哪怕你的组件完全没问题。如果是第三方服务就更糟：真实调用可能要花钱、触发限流，甚至真的{" "}
            <em>执行</em> 操作，比如扣款或发邮件。而且你没法让真实 API
            按需返回错误，来测试你的错误提示。
          </Zh>
        </p>
        <p>
          <En>
            The fix is to{" "}
            <strong>replace the dependency with a controlled fake</strong>. A{" "}
            <strong>stub</strong> returns canned data; a <strong>mock</strong>{" "}
            is a fake you also check (&quot;was it called?&quot;). In everyday
            speech, both are called &quot;mocking&quot;.
          </En>
          <Zh>
            解决办法是 <strong>用受控的假对象替换依赖</strong>。
            <strong>stub</strong> 返回预设的数据；<strong>mock</strong>{" "}
            是还会被检查的假对象（&quot;它被调用了吗？&quot;）。日常交流里两者都叫
            &quot;mocking&quot;。
          </Zh>
        </p>
        <CodeBlock
          good={[6, 9]}
          code={`import { vi, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrderList } from "./OrderList";
import { fetchOrders } from "./api";

vi.mock("./api"); // every function in ./api becomes a fake; no request is sent

it("shows the orders", async () => {
  vi.mocked(fetchOrders).mockResolvedValue([{ id: 1 }]); // the fake's canned answer
  render(<OrderList />);
  expect(await screen.findByText("Order #1")).toBeInTheDocument();
});`}
        />
        <p className="callout">
          <En>
            You won&apos;t hand-write mock syntax often — AI writes it well.
            Just know why it exists, and recognize it when you see it.
          </En>
          <Zh>
            你不太需要手写 mock 语法——AI
            写得很好。只要知道它为什么存在，看到时能认出来就行。
          </Zh>
        </p>

        <h3>
          <En>6. Snapshot testing</En>
          <Zh>6. Snapshot testing（快照测试）</Zh>
        </h3>
        <p>
          <En>
            A snapshot test saves the rendered output to a file on its first
            run, then fails on any later run where the output is different:
          </En>
          <Zh>
            快照测试在第一次运行时把渲染结果存进一个文件，之后每次运行只要输出不同就会失败：
          </Zh>
        </p>
        <CodeBlock
          code={`it("renders the order summary", () => {
  const { container } = render(<OrderSummary id={7} total={150} />);
  expect(container).toMatchSnapshot(); // 1st run saves the HTML; later runs compare
});`}
        />
        <p className="callout">
          <En>
            It checks &quot;did this change?&quot;, not &quot;is this
            correct?&quot;. When it fails on a change you meant to make, you
            accept the new output with <code>vitest -u</code> — and people often
            do that without reading it.
          </En>
          <Zh>
            它检查的是 &quot;变了吗？&quot;，而不是
            &quot;对吗？&quot;。如果失败是因为你有意的改动，就用{" "}
            <code>vitest -u</code> 接受新输出——而很多人接受之前根本不看。
          </Zh>
        </p>
        <p>
          <En>
            <strong>Visual regression testing</strong> is the same idea with
            screenshots instead of HTML (Playwright&apos;s{" "}
            <code>toHaveScreenshot</code>), so it also catches CSS breakage that
            HTML can&apos;t show. Small snapshot tests are more common in
            practice, because they&apos;re built into Jest and Vitest and cost
            nothing to add. Visual regression needs stable screenshots and often
            a paid service (Chromatic, Percy), so you mostly find it in teams
            protecting a design system or a polished UI.
          </En>
          <Zh>
            <strong>Visual regression testing（视觉回归测试）</strong>{" "}
            是同样的思路，只不过对比的是截图而不是 HTML（Playwright 的{" "}
            <code>toHaveScreenshot</code>），因此还能发现 HTML 看不出的 CSS
            问题。实际中小型快照测试更常见，因为 Jest 和 Vitest
            自带、加起来没有成本。视觉回归需要稳定的截图，往往还要付费服务（Chromatic、Percy），所以主要出现在需要守护
            design system 或精致 UI 的团队里。
          </Zh>
        </p>

        <h3>
          <En>7. Testing the Node.js backend</En>
          <Zh>7. 测试 Node.js 后端</Zh>
        </h3>
        <ul>
          <li>
            <En>
              <strong>Runner:</strong> the same Vitest or Jest. Business logic
              (services, validators, pure helpers) is unit-tested exactly like
              the frontend examples above.
            </En>
            <Zh>
              <strong>Runner：</strong>同样是 Vitest 或
              Jest。业务逻辑（service、校验器、纯函数）的 unit test
              和上面的前端例子完全一样。
            </Zh>
          </li>
          <li>
            <En>
              <strong>Library:</strong> <code>Supertest</code> sends HTTP
              requests straight to your Express app in memory — no port, no
              running server needed.
            </En>
            <Zh>
              <strong>Library：</strong>
              <code>Supertest</code> 直接在内存里向你的 Express 应用发送 HTTP
              请求——不需要端口，也不需要先启动服务器。
            </Zh>
          </li>
        </ul>
        <CodeBlock
          language="typescript"
          code={`import request from "supertest";
import { it, expect } from "vitest";
import { app } from "../src/app";

it("POST /api/orders creates an order", async () => {
  const res = await request(app)
    .post("/api/orders")
    .send({ customerId: 3, items: [{ sku: "SKU-99", quantity: 1 }] })
    .expect(201);

  expect(res.body.status).toBe("placed");
});`}
        />
        <p className="callout">
          <En>
            Whether this is unit or integration depends on what sits behind the
            route: a faked repository makes it a unit test of the handler; a
            real test database makes it an integration test. Prefer a real one
            (a test schema or a throwaway container) for integration tests.
          </En>
          <Zh>
            这到底是 unit 还是 integration，取决于路由背后是什么：repository
            是假的，就是 handler 的 unit test；接的是真实测试数据库，就是
            integration test。integration test 优先使用真实数据库（测试 schema
            或一次性容器）。
          </Zh>
        </p>

        <h3>
          <En>8. E2E testing</En>
          <Zh>8. E2E 测试</Zh>
        </h3>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <En>
                The intuition is simple: how would a human check this manually?
                Open the page, click, type, look at the screen. An E2E test is
                that same routine, scripted and driving a real browser.
              </En>
              <Zh>
                直觉很简单：人工会怎么手动检查？打开页面、点击、输入、看屏幕。E2E
                测试就是把这套流程写成脚本，驱动真实浏览器去执行。
              </Zh>
            </li>
            <li>
              <En>
                It is the closest imitation of production: real browser, real
                frontend, real backend, real database. That is also why it is
                slow and the most fragile level.
              </En>
              <Zh>
                它最接近生产环境：真实浏览器、真实前端、真实后端、真实数据库。这也是它最慢、最脆弱的原因。
              </Zh>
            </li>
            <li>
              <En>
                It tests expected behavior, never implementation details: the
                script knows nothing about React state or function names.
              </En>
              <Zh>
                它测的是预期行为，而不是实现细节：脚本完全不知道 React 的 state
                或函数名。
              </Zh>
            </li>
            <li>
              <En>
                Two popular tools: <strong>Playwright</strong> and{" "}
                <strong>Cypress</strong>. Same idea, different APIs.
              </En>
              <Zh>
                目前最流行的两个工具：<strong>Playwright</strong> 和{" "}
                <strong>Cypress</strong>。思路相同，API 不同。
              </Zh>
            </li>
          </ul>
        </div>
        <CodeBlock
          language="plaintext"
          code={`Cypress                              Playwright
cypress/                             tests/
  e2e/            <- spec files        checkout.spec.ts   <- spec files
    login.cy.ts                        login.spec.ts
    checkout.cy.ts                   playwright.config.ts
  fixtures/       <- canned JSON
  support/        <- custom commands
cypress.config.ts`}
        />
        <p>
          <En>
            A spec file is a list of scenarios. Each one selects elements
            (locators), interacts with them, and asserts on what the page shows:
          </En>
          <Zh>
            spec
            文件就是一组场景。每个场景选取元素（locator）、与元素交互、再断言页面显示的内容：
          </Zh>
        </p>
        <CodeBlock
          language="typescript"
          code={`import { test, expect } from "@playwright/test";

test("a user can place an order", async ({ page }) => {
  await page.goto("/products/99");
  await page.getByRole("button", { name: "Add to cart" }).click();
  await page.getByLabel("Email").fill("ana@example.com");
  await page.getByRole("button", { name: "Place order" }).click();

  await expect(page.getByTestId("confirmation")).toHaveText("Order placed");
});`}
        />
        <table className="ref-table">
          <thead>
            <tr>
              <th>Locator</th>
              <th>
                <En>Finds</En>
                <Zh>查找</Zh>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>getByRole</code>
              </td>
              <td>
                <En>
                  Element by accessible role and name — the preferred default
                </En>
                <Zh>按可访问性 role 和名称查找——首选</Zh>
              </td>
            </tr>
            <tr>
              <td>
                <code>getByLabel</code>
              </td>
              <td>
                <En>Form field by its label text</En>
                <Zh>按 label 文字查找表单字段</Zh>
              </td>
            </tr>
            <tr>
              <td>
                <code>getByText</code>
              </td>
              <td>
                <En>Element by visible text</En>
                <Zh>按可见文字查找元素</Zh>
              </td>
            </tr>
            <tr>
              <td>
                <code>getByTestId</code>
              </td>
              <td>
                <En>
                  A <code>data-testid</code> attribute added purely for tests —
                  the fallback when nothing user-facing is stable
                </En>
                <Zh>
                  专门为测试加的 <code>data-testid</code>{" "}
                  属性——当没有稳定的面向用户的特征时的兜底方案
                </Zh>
              </td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <En>
            Locators are syntax you can look up (or have AI write). The skill to
            keep is the habit: select the way a user would, never by a fragile
            CSS path.
          </En>
          <Zh>
            locator 属于可以随时查（或让 AI
            写）的语法。要保留的是习惯：像用户一样去选元素，而不是依赖脆弱的 CSS
            路径。
          </Zh>
        </p>

        <h3>
          <En>
            9. Test types by purpose: smoke, regression, happy path, critical
            path
          </En>
          <Zh>
            9. 按目的分类的测试：smoke、regression、happy path、critical path
          </Zh>
        </h3>
        <p>
          <En>
            Besides unit / integration / E2E, tests are also named by{" "}
            <em>what they&apos;re for</em>. You&apos;ll hear these mostly about
            E2E suites — though regression tests exist at every level. Only the
            common ones:
          </En>
          <Zh>
            除了 unit / integration / E2E，测试也会按 <em>用途</em>{" "}
            来命名。这些名字最常出现在 E2E 测试里——不过 regression test
            在每个层级都有。只列最常见的：
          </Zh>
        </p>
        <h4 className="topic topic-bar">
          <En>Smoke</En>
          <Zh>Smoke</Zh>
        </h4>
        <p>
          <En>
            &quot;Is the build basically alive?&quot; A tiny set run right after
            deploy: the app starts and the most important parts respond. If it
            fails, the build is rejected and the slower tests don&apos;t run.
          </En>
          <Zh>
            &quot;这个版本基本能用吗？&quot;部署后立刻跑的一小组检查：应用能启动，最重要的部分有响应。失败就直接拒绝这个版本，不再浪费时间跑更慢的测试。
          </Zh>
        </p>
        <CodeBlock
          language="typescript"
          code={`// Smoke = shallow. Each check only asks "is it alive?", never "is it correct?".
// Run first after a deploy: if any of these fail, reject the build and skip the slower tests.
test.describe("smoke @smoke", () => {
  // 1. startup: the app boots and renders instead of crashing or showing a blank page
  test("the app starts", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Tiny Shop" })).toBeVisible();
  });

  // 2. core functionality: the main button is there and responds (no full checkout)
  test("the main journey is reachable", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Add Keyboard to cart" }).click();
    await expect(page.getByText("Total: $50")).toBeVisible();
  });

  // 3. system boundaries: the services behind the UI are reachable
  test("the APIs respond", async ({ request }) => {
    // gateway + catalog
    expect((await request.get("/api/products")).ok()).toBe(true);
    // orders: a 400 for an empty order still proves it answered
    expect((await request.post("/api/orders", { data: {} })).status()).toBe(400);
  });
});`}
        />

        <h4 className="topic topic-bar">
          <En>Regression</En>
          <Zh>Regression</Zh>
        </h4>
        <p>
          <En>
            &quot;Did my change break something that used to work?&quot; When a
            bug is fixed, its test stays in the suite forever, and the whole
            suite re-runs on every change.
          </En>
          <Zh>
            &quot;我的改动有没有弄坏以前正常的功能？&quot;修好一个 bug
            后，它的测试会永远留在测试集里，每次改动都会重新运行整套测试。
          </Zh>
        </p>
        <CodeBlock
          language="typescript"
          code={`// Bug #482: applying SAVE10 twice took 10% off twice.
// 1. write a test that reproduces it (fails)  2. fix the code (passes)  3. keep the test
it("ignores a coupon that is already applied (regression #482)", () => {
  let cart = addItem(emptyCart, { price: 200, qty: 1 });
  cart = applyCoupon(cart, "SAVE10");
  cart = applyCoupon(cart, "SAVE10"); // the bug: this used to take off another 10%

  expect(cartTotal(cart)).toBe(180);
});`}
        />
        <p>
          <En>A full suite gets slow, so pipelines often run only part of it:</En>
          <Zh>完整的测试集会越来越慢，所以 pipeline 常常只运行其中一部分：</Zh>
        </p>
        <CodeBlock
          language="bash"
          code={`npx vitest run --changed main            # only tests affected by files changed since main
npx playwright test --grep @regression   # only tests tagged as part of the regression suite`}
        />

        <h4 className="topic topic-bar">
          <En>Happy path</En>
          <Zh>Happy path</Zh>
        </h4>
        <p>
          <En>
            &quot;Does it work when everything goes right?&quot; One scenario:
            valid input, nothing fails. Every feature gets at least this one.
          </En>
          <Zh>
            &quot;一切顺利时能正常工作吗？&quot;只有一个场景：输入有效、什么都不出错。每个功能至少要有这一个测试。
          </Zh>
        </p>
        <CodeBlock
          language="typescript"
          code={`// happy path only: the user does everything right
test("a user can change their display name", async ({ page }) => {
  await page.goto("/profile");
  await page.getByLabel("Display name").fill("Ana");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Saved")).toBeVisible();
});`}
        />

        <h4 className="topic topic-bar">
          <En>Critical path</En>
          <Zh>Critical path</Zh>
        </h4>
        <p>
          <En>
            The flows the business can&apos;t afford to break: if one stops
            working, the company loses money or users right away (sign-up,
            checkout, payment). Because so much depends on them, they&apos;re
            tested the most thoroughly: the happy path <em>plus</em> the
            unhappy paths that matter, with E2E coverage first.
          </En>
          <Zh>
            业务绝对不能出问题的流程：一旦失效，公司会立刻损失收入或用户（注册、结账、支付）。正因为这么多东西依赖它们，所以测得最彻底：happy
            path <em>加上</em> 重要的 unhappy path，并且最先获得 E2E 覆盖。
          </Zh>
        </p>
        <CodeBlock
          language="typescript"
          code={`// critical path = checkout's happy path plus the unhappy paths that matter
test("a customer can buy a keyboard @critical", async ({ page }) => {   // happy path
  await checkout(page, { item: "Keyboard", qty: 1 });
  await expect(page.getByTestId("confirmation")).toHaveText("Order placed");
});

test("ordering more than is in stock is rejected @critical", async ({ page }) => {   // unhappy
  await checkout(page, { item: "Mouse", qty: 4 });
  await expect(page.getByRole("alert")).toHaveText("only 3 Mouse left in stock");
});

test("a declined card shows an error @critical", async ({ page }) => {   // unhappy
  await checkout(page, { item: "Keyboard", qty: 1, card: "declined" });
  await expect(page.getByRole("alert")).toHaveText("Payment declined");
});`}
        />
        <p className="callout">
          <En>
            Happy path is a single success scenario, for any feature. Critical
            path is a core flow covered as its happy path plus its key unhappy
            paths. Teams define these a little differently, so in an interview
            state your definition.
          </En>
          <Zh>
            happy path 是单个成功场景，任何功能都可以有。critical path
            是核心流程：既测它的 happy path，也测其中关键的 unhappy
            path。各团队的定义略有差异，面试时先说清楚你的定义。
          </Zh>
        </p>

        <h3>
          <En>10. Network interception: stubbed vs real backend</En>
          <Zh>10. 网络拦截：stub 还是走真实后端</Zh>
        </h3>
        <p>
          <En>
            Stubbing is not only for unit tests. Both Cypress and Playwright can
            intercept a network request in the browser and answer it with a fake
            response:
          </En>
          <Zh>
            Stubbing 不只用于 unit test。Cypress 和 Playwright
            都可以在浏览器里拦截网络请求，并用假响应来回答：
          </Zh>
        </p>
        <CodeBlock
          language="typescript"
          code={`// Cypress: the backend is never contacted for this request
it("shows an error banner when orders fail to load", () => {
  cy.intercept("GET", "/api/orders", { statusCode: 500 });

  cy.visit("/orders");

  cy.contains("Could not load orders").should("be.visible");
});`}
        />
        <table className="ref-table">
          <thead>
            <tr>
              <th />
              <th>
                <En>Stubbed (intercepted)</En>
                <Zh>Stubbed（拦截）</Zh>
              </th>
              <th>
                <En>Real backend</En>
                <Zh>真实后端</Zh>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <En>Purpose</En>
                <Zh>目的</Zh>
              </td>
              <td>
                <En>Test how the UI reacts to a given response</En>
                <Zh>测试 UI 对某个特定响应的反应</Zh>
              </td>
              <td>
                <En>Prove the whole system works together</En>
                <Zh>证明整个系统能协同工作</Zh>
              </td>
            </tr>
            <tr>
              <td>
                <En>Use for</En>
                <Zh>适用于</Zh>
              </td>
              <td>
                <En>
                  Errors, empty lists, slow responses, edge cases that are hard
                  to create for real
                </En>
                <Zh>错误、空列表、慢响应、真实环境很难制造的边界情况</Zh>
              </td>
              <td>
                <En>Critical paths: sign-up, checkout, payment</En>
                <Zh>关键流程：注册、结账、支付</Zh>
              </td>
            </tr>
            <tr>
              <td>
                <En>Speed / stability</En>
                <Zh>速度 / 稳定性</Zh>
              </td>
              <td>
                <En>Fast and deterministic</En>
                <Zh>快且确定</Zh>
              </td>
              <td>
                <En>Slower; depends on test data and environment</En>
                <Zh>较慢；依赖测试数据和环境</Zh>
              </td>
            </tr>
            <tr>
              <td>
                <En>Catches</En>
                <Zh>能发现</Zh>
              </td>
              <td>
                <En>
                  Frontend bugs only — a contract mismatch with the real API
                  slips through
                </En>
                <Zh>只能发现前端 bug——与真实 API 的契约不一致会漏过去</Zh>
              </td>
              <td>
                <En>Frontend, backend, and the wiring between them</En>
                <Zh>前端、后端以及两者之间的衔接问题</Zh>
              </td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <En>
            The usual strategy is a mix: a few real-backend E2E tests for the
            critical paths, and many stubbed tests for UI states. Strictly
            speaking a fully stubbed test is no longer &quot;end to end&quot;.
          </En>
          <Zh>
            常见策略是混合使用：少量走真实后端的 E2E 覆盖关键流程，大量 stub
            的测试覆盖 UI 各种状态。严格来说，完全 stub 的测试已经不算
            &quot;端到端&quot; 了。
          </Zh>
        </p>

        <h3>
          <En>11. Flaky tests</En>
          <Zh>11. Flaky test（不稳定测试）</Zh>
        </h3>
        <div className="code-compare">
          <div>
            <p className="compare-label compare-good">
              <En>Run 1</En>
              <Zh>第 1 次运行</Zh>
            </p>
            <CodeBlock
              language="plaintext"
              good={[3, 4, 5, 6]}
              code={`$ npx playwright test

login › user can log in
cart › add item to cart
checkout › place an order
orders › view order history

4 passed`}
            />
          </div>
          <div>
            <p className="compare-label compare-bad">
              <En>Run 2 — same code, nothing changed</En>
              <Zh>第 2 次运行——代码完全没变</Zh>
            </p>
            <CodeBlock
              language="plaintext"
              good={[3, 4, 6]}
              bad={[5]}
              code={`$ npx playwright test

login › user can log in
cart › add item to cart
checkout › place an order
orders › view order history

1 failed · 3 passed`}
            />
          </div>
        </div>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <En>
                That&apos;s a <strong>flaky test</strong>: it passes and fails
                on the same code, with no change. It&apos;s worse than no test —
                the team learns to re-run red builds instead of reading them,
                and real failures get ignored too.
              </En>
              <Zh>
                这就是 <strong>flaky test</strong>
                ：同一份代码、没有任何改动，却时过时挂。它比没有测试更糟——团队会习惯性地重跑红色构建而不是去看原因，真正的失败也就被忽略了。
              </Zh>
            </li>
            <li>
              <En>
                Occasionally it&apos;s a real race condition in the app, so
                don&apos;t assume the test is always the culprit.
              </En>
              <Zh>
                偶尔它反映的是应用里真实的竞态条件，所以不要默认问题总在测试。
              </Zh>
            </li>
          </ul>
        </div>
        <table className="ref-table">
          <thead>
            <tr>
              <th>
                <En>Cause</En>
                <Zh>原因</Zh>
              </th>
              <th>
                <En>How it shows up</En>
                <Zh>表现</Zh>
              </th>
              <th>
                <En>Fix</En>
                <Zh>解决办法</Zh>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <En>Timing / async</En>
                <Zh>时序 / 异步</Zh>
              </td>
              <td>
                <En>
                  Checks the page before the data has loaded; a fixed{" "}
                  <code>sleep(2000)</code> that is sometimes too short
                </En>
                <Zh>
                  数据还没加载就去检查页面；固定的 <code>sleep(2000)</code>{" "}
                  有时不够长
                </Zh>
              </td>
              <td>
                <En>
                  Wait for a condition (auto-waiting assertions,{" "}
                  <code>findBy</code>), never a fixed delay
                </En>
                <Zh>
                  等待条件成立（自动等待的断言、<code>findBy</code>
                  ），不要用固定延时
                </Zh>
              </td>
            </tr>
            <tr>
              <td>
                <En>Shared state / test order</En>
                <Zh>共享状态 / 测试顺序</Zh>
              </td>
              <td>
                <En>
                  Passes alone, fails in the full run; test B relies on data
                  test A created, or two parallel tests use the same user
                </En>
                <Zh>
                  单独跑能过，整体跑就挂；测试 B 依赖测试 A
                  创建的数据，或两个并行测试用了同一个用户
                </Zh>
              </td>
              <td>
                <En>
                  Each test creates and cleans up its own data; no test depends
                  on another
                </En>
                <Zh>每个测试自己创建并清理数据；测试之间互不依赖</Zh>
              </td>
            </tr>
            <tr>
              <td>
                <En>External services</En>
                <Zh>外部服务</Zh>
              </td>
              <td>
                <En>A third-party API is slow, rate-limited, or down</En>
                <Zh>第三方 API 慢、被限流或宕机</Zh>
              </td>
              <td>
                <En>Stub or mock them</En>
                <Zh>stub 或 mock 掉</Zh>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <En>
                <strong>Handling one in practice:</strong> reproduce it (run in
                a loop, in CI conditions), find the cause, fix it. If the fix is
                not immediate, quarantine it so it stops blocking everyone, and
                track it.
              </En>
              <Zh>
                <strong>实际处理流程：</strong>先复现（循环运行、模拟 CI
                条件），找到原因，修复。如果无法马上修好，就先隔离（quarantine），避免它阻塞所有人，并记录跟踪。
              </Zh>
            </li>
            <li>
              <En>
                Automatic retries hide the problem rather than fix it.
                Acceptable as a temporary measure, as long as
                retried-then-passed runs are reported and counted.
              </En>
              <Zh>
                自动重试只是掩盖问题，而不是修复。作为临时措施可以接受，前提是
                &quot;重试后才通过&quot; 的情况会被上报和统计。
              </Zh>
            </li>
          </ul>
        </div>

        <h3>
          <En>12. TDD and BDD</En>
          <Zh>12. TDD 与 BDD</Zh>
        </h3>

        <h4 className="topic">
          <En>12.1 TDD: red → green → refactor</En>
          <Zh>12.1 TDD：red → green → refactor</Zh>
        </h4>
        <p>
          <En>
            <strong>Test-driven development</strong>: write the test{" "}
            <em>first</em>, and let it drive the code. One loop, repeated for
            every feature:
          </En>
          <Zh>
            <strong>测试驱动开发（TDD）</strong>：<em>先</em>{" "}
            写测试，让测试来驱动代码。每个功能都重复同一个循环：
          </Zh>
        </p>
        <ArrowDefs />
        <svg
          viewBox="0 0 640 132"
          role="img"
          aria-label="The TDD loop: RED, write a failing test; then GREEN, make it pass; then REFACTOR, clean up while the tests stay green; then back to RED for the next feature."
        >
          <Box
            x={30}
            y={14}
            w={150}
            h={52}
            kind="fail"
            label="RED"
            sub="write a failing test"
            size={13}
          />
          <Box
            x={245}
            y={14}
            w={150}
            h={52}
            kind="ok"
            label="GREEN"
            sub="make it pass"
            size={13}
          />
          <Box
            x={460}
            y={14}
            w={150}
            h={52}
            kind="service"
            label="REFACTOR"
            sub="clean up, stay green"
            size={13}
          />
          <Arrow d="M180,40 L243,40" ink="dark" />
          <Arrow d="M395,40 L458,40" ink="dark" />
          <Arrow d="M535,66 L535,100 L105,100 L105,68" ink="red" dashed />
          <T x={320} y={120} size={11} color="#c0392b">
            next feature → a new failing test
          </T>
        </svg>
        <p>
          <En>
            Here&apos;s that loop, twice, building a discount-code function:
          </En>
          <Zh>下面把这个循环走两遍，实现一个折扣码函数：</Zh>
        </p>
        <ol className="step-list">
          <li className="step-red">
            <p className="step-title">
              <span className="step-tag">RED</span>
              <En>
                Write a test for code that doesn&apos;t exist yet. It fails.
              </En>
              <Zh>为还不存在的代码写测试。它失败了。</Zh>
            </p>
            <CodeBlock
              language="typescript"
              bad={[5]}
              code={`// discount.test.ts
it("SAVE10 takes 10% off", () => {
  expect(applyDiscount(200, "SAVE10")).toBe(180);
});
// FAIL  applyDiscount is not defined`}
            />
          </li>
          <li className="step-green">
            <p className="step-title">
              <span className="step-tag">GREEN</span>
              <En>Write just enough code to pass.</En>
              <Zh>写刚好能通过的代码。</Zh>
            </p>
            <CodeBlock
              language="typescript"
              good={[6]}
              code={`// discount.ts
export function applyDiscount(total: number, code: string) {
  if (code === "SAVE10") return total * 0.9;
  return total;
}
// PASS  SAVE10 takes 10% off`}
            />
          </li>
          <li className="step-red">
            <p className="step-title">
              <span className="step-tag">RED</span>
              <En>Next feature: add a new test. It fails.</En>
              <Zh>下一个功能：加一个新测试。它失败了。</Zh>
            </p>
            <CodeBlock
              language="typescript"
              bad={[5]}
              code={`// discount.test.ts
it("SAVE20 takes 20% off", () => {
  expect(applyDiscount(200, "SAVE20")).toBe(160);
});
// FAIL  expected 200 to be 160`}
            />
          </li>
          <li className="step-green">
            <p className="step-title">
              <span className="step-tag">GREEN</span>
              <En>Make it pass — even if the code is ugly.</En>
              <Zh>让它通过——哪怕代码很丑。</Zh>
            </p>
            <CodeBlock
              language="typescript"
              good={[6]}
              code={`export function applyDiscount(total: number, code: string) {
  if (code === "SAVE10") return total * 0.9;
  if (code === "SAVE20") return total * 0.8; // copy-paste, but it passes
  return total;
}
// PASS  2 tests`}
            />
          </li>
          <li className="step-blue">
            <p className="step-title">
              <span className="step-tag">REFACTOR</span>
              <En>Clean it up. The tests stay green, so nothing broke.</En>
              <Zh>整理代码。测试保持绿色，说明什么都没坏。</Zh>
            </p>
            <CodeBlock
              language="typescript"
              good={[6]}
              code={`const DISCOUNTS: Record<string, number> = { SAVE10: 0.1, SAVE20: 0.2 };

export function applyDiscount(total: number, code: string) {
  return total * (1 - (DISCOUNTS[code] ?? 0));
}
// PASS  2 tests — same behavior, cleaner code`}
            />
          </li>
        </ol>
        <p className="callout">
          <En>
            Why fail first? Watching the test fail proves it can actually catch
            the missing behavior. How strictly to follow TDD is debated even
            among senior developers — treat it as a technique, best for
            well-defined logic.
          </En>
          <Zh>
            为什么要先失败？看到测试失败，证明它确实能抓到缺失的行为。TDD
            应该严格到什么程度，连资深开发者之间都有争议——把它当作一种技巧，最适合规则明确的逻辑。
          </Zh>
        </p>

        <h4 className="topic">
          <En>12.2 BDD: behavior in plain language</En>
          <Zh>12.2 BDD：用自然语言描述行为</Zh>
        </h4>
        <p>
          <En>
            <strong>Behavior-driven development</strong>: describe a feature in
            plain language that product, QA, and developers can all read and
            agree on — then make it run as a test. The common tool is{" "}
            <strong>Cucumber</strong>, and scenarios are written in{" "}
            <strong>Gherkin</strong>:
          </En>
          <Zh>
            <strong>行为驱动开发（BDD）</strong>
            ：用产品、QA、开发都能读懂并认可的自然语言描述功能——再让它作为测试运行。常用工具是{" "}
            <strong>Cucumber</strong>，场景用 <strong>Gherkin</strong> 书写：
          </Zh>
        </p>
        <p className="compare-label">
          <En>
            checkout.feature — anyone on the team can write or review this
          </En>
          <Zh>checkout.feature——团队里任何人都能写、都能审</Zh>
        </p>
        <CodeBlock
          language="gherkin"
          code={`Feature: Checkout

  Scenario: Customer places an order
    Given I have a product in my cart
    When I place the order
    Then I see "Order placed"`}
        />
        <p className="compare-label">
          <En>
            checkout.steps.ts — developers wire each line to real test code
            (here, Cypress)
          </En>
          <Zh>
            checkout.steps.ts——开发者把每一行接到真正的测试代码上（这里用
            Cypress）
          </Zh>
        </p>
        <CodeBlock
          language="typescript"
          code={`import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("I have a product in my cart", () => {
  cy.visit("/products/1");
  cy.contains("button", "Add to cart").click();
});

When("I place the order", () => {
  cy.contains("button", "Place order").click();
});

Then("I see {string}", (message: string) => {
  cy.contains(message).should("be.visible");
});`}
        />
        <p className="callout">
          <En>
            TDD and BDD aren&apos;t rivals. BDD defines <em>what</em> a feature
            should do (a Gherkin scenario run as an E2E test); TDD is{" "}
            <em>how</em> developers build the pieces underneath (red → green →
            refactor on unit tests). Teams often use both.
          </En>
          <Zh>
            TDD 和 BDD 并不对立。BDD 定义功能 <em>应该做什么</em>（Gherkin
            场景作为 E2E 测试运行）；TDD 是开发者 <em>如何</em>{" "}
            构建底层的各个部分（在 unit test 上 red → green →
            refactor）。很多团队两者并用。
          </Zh>
        </p>

        <h3>
          <En>13. Coverage</En>
          <Zh>13. Coverage（测试覆盖率）</Zh>
        </h3>
        <p>
          <En>
            A coverage tool runs your tests and records which lines of code
            actually executed.
          </En>
          <Zh>coverage 工具会运行测试，并记录哪些代码行真正被执行过。</Zh>
        </p>

        <p>
          <En>
            Run <code>vitest run --coverage</code> and you get a table per file
            — the last column lists the lines no test ever ran:
          </En>
          <Zh>
            运行 <code>vitest run --coverage</code>
            ，每个文件得到一行统计——最后一列列出了没有任何测试执行过的行：
          </Zh>
        </p>

        <CodeBlock
          language="plaintext"
          code={`----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
 cart.ts  |   66.66 |       50 |      75 |      50 | 6,11
----------|---------|----------|---------|---------|-------------------`}
        />
        <p>
          <En>
            The HTML version of the report opens the file itself — green lines
            ran, red lines never did:
          </En>
          <Zh>
            HTML
            版的报告会直接打开文件本身——绿色的行被执行过，红色的行从没执行过：
          </Zh>
        </p>
        <div className="code-compare tight">
          <div>
            <p className="compare-label">cart.ts</p>
            <CodeBlock
              language="typescript"
              good={[2, 10]}
              bad={[6, 11]}
              lineNumbers
              code={`export function total(prices: number[]) {
  return prices.reduce((a, b) => a + b, 0);
}

export function oldPrice(cents: number) {
  return "$" + (cents / 100).toFixed(2);
}

export function coupon(t: number, c: string) {
  if (c === "SAVE10") return t * 0.9;
  return t;
}`}
            />
          </div>
          <div>
            <p className="compare-label">cart.test.ts</p>
            <CodeBlock
              language="typescript"
              lineNumbers
              code={`it("adds up the cart", () => {
  expect(total([10, 20])).toBe(30);
});

it("SAVE10 takes 10% off", () => {
  expect(coupon(100, "SAVE10")).toBe(90);
});`}
            />
          </div>
        </div>
        <table className="ref-table">
          <thead>
            <tr>
              <th>
                <En>Red line</En>
                <Zh>红色的行</Zh>
              </th>
              <th>
                <En>What it means</En>
                <Zh>说明什么</Zh>
              </th>
              <th>
                <En>Fix</En>
                <Zh>怎么办</Zh>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <En>Line 11</En>
                <Zh>第 11 行</Zh>
              </td>
              <td>
                <En>
                  <strong>Missing test.</strong> Real behavior (any code other
                  than SAVE10) that nothing checks
                </En>
                <Zh>
                  <strong>缺测试。</strong>真实存在的行为（SAVE10
                  以外的折扣码）没有被任何测试检查
                </Zh>
              </td>
              <td>
                <En>
                  Add a test: <code>coupon(100, &quot;NOPE&quot;)</code> returns
                  100
                </En>
                <Zh>
                  补一个测试：<code>coupon(100, &quot;NOPE&quot;)</code> 返回
                  100
                </Zh>
              </td>
            </tr>
            <tr>
              <td>
                <En>Line 6</En>
                <Zh>第 6 行</Zh>
              </td>
              <td>
                <En>
                  <strong>Dead code.</strong> Nothing calls{" "}
                  <code>oldPrice</code> anymore
                </En>
                <Zh>
                  <strong>死代码。</strong>已经没有任何地方调用{" "}
                  <code>oldPrice</code> 了
                </Zh>
              </td>
              <td>
                <En>
                  Delete it — don&apos;t write a test just to keep it alive
                </En>
                <Zh>删掉它——不要为了让它&quot;活着&quot;去写测试</Zh>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <En>
                Coverage shows what <em>ran</em>, not what was <em>checked</em>{" "}
                — a test with no <code>expect</code> still turns lines green.
              </En>
              <Zh>
                coverage 显示的是什么 <em>被执行了</em>，而不是什么{" "}
                <em>被检查了</em>——没有 <code>expect</code>{" "}
                的测试照样能让代码行变绿。
              </Zh>
            </li>
            <li>
              <En>
                <strong>Too low:</strong> every change is a gamble.{" "}
                <strong>Chasing 100%:</strong> people write pointless tests just
                to move the number.
              </En>
              <Zh>
                <strong>太低：</strong>每次改动都是赌博。
                <strong>追求 100%：</strong>大家会为了凑数字写没有意义的测试。
              </Zh>
            </li>
            <li>
              <En>
                Most teams set a floor (often around 70–80%) and fail the build
                below it.
              </En>
              <Zh>
                大多数团队会设一个底线（常见在 70–80%
                左右），低于它就让构建失败。
              </Zh>
            </li>
          </ul>
        </div>
        <div className="concept">
          <p className="concept-label">
            Interview question: &quot;Some of your code isn&apos;t covered —
            what do you do?&quot;
          </p>
          <ul>
            <li>
              <En>
                Look at <em>what</em> is uncovered, not the percentage —
                important logic, or trivial / generated code?
              </En>
              <Zh>
                看 <em>哪些</em>{" "}
                没被覆盖，而不是看百分比——是重要逻辑，还是无关紧要的 /
                自动生成的代码？
              </Zh>
            </li>
            <li>
              <En>
                Missing behavior → add real tests, riskiest first. Dead code →
                delete it.
              </En>
              <Zh>
                缺测试的行为 → 补真正的测试，风险最高的先补。死代码 → 删掉。
              </Zh>
            </li>
            <li>
              <En>
                Never write assertion-free tests just to turn lines green.
              </En>
              <Zh>绝不为了让代码行变绿而写没有断言的测试。</Zh>
            </li>
          </ul>
        </div>

        <h3>
          <En>14. ESLint and Prettier</En>
          <Zh>14. ESLint 与 Prettier</Zh>
        </h3>
        <p>
          <En>
            Both are <strong>static analysis</strong> tools: they read your code
            without running it, so they&apos;re fast and cheap — a complement to
            tests, not a replacement.
          </En>
          <Zh>
            两者都是 <strong>静态分析</strong>{" "}
            工具：只读代码、不运行代码，所以又快又便宜——是测试的补充，而不是替代。
          </Zh>
        </p>

        <h4 className="topic">
          <En>14.1 ESLint — catches likely bugs</En>
          <Zh>14.1 ESLint——抓潜在的 bug</Zh>
        </h4>
        <p>
          <En>
            ESLint checks your code against a set of rules and flags patterns
            that are probably mistakes. This code runs, but has two problems:
          </En>
          <Zh>
            ESLint
            按一组规则检查代码，标出很可能是错误的写法。下面的代码能运行，但有两个问题：
          </Zh>
        </p>
        <CodeBlock
          language="typescript"
          bad={[2, 3]}
          code={`export function canCheckout(cart: { qty: number }[]) {
  const discount = 0.1;
  if (cart.length == 0) return false;
  return true;
}`}
        />
        <CodeBlock
          language="plaintext"
          bad={[2, 3]}
          code={`$ npx eslint src/checkout.ts
  2:9   error  'discount' is assigned a value but never used  @typescript-eslint/no-unused-vars
  3:19  error  Expected '===' and instead saw '=='            eqeqeq

✖ 2 problems (2 errors, 0 warnings)`}
        />
        <p className="callout">
          <En>
            Each line gives <code>line:column</code>, the problem, and the rule
            name. A failing lint step fails the build, so the mistake never gets
            merged.
          </En>
          <Zh>
            每一行给出 <code>行:列</code>、问题和规则名。lint
            失败会让构建失败，这样错误就不会被合并进去。
          </Zh>
        </p>

        <h4 className="topic">
          <En>14.2 Prettier — formats, nothing else</En>
          <Zh>14.2 Prettier——只管格式</Zh>
        </h4>
        <p>
          <En>
            Prettier rewrites your code into one consistent style. It never
            finds bugs — it just ends arguments about tabs, quotes, and line
            breaks.
          </En>
          <Zh>
            Prettier 把代码改写成统一的风格。它从不找
            bug——只是让关于缩进、引号、换行的争论到此为止。
          </Zh>
        </p>
        <div className="code-compare">
          <div>
            <p className="compare-label compare-bad">
              <En>Before</En>
              <Zh>格式化前</Zh>
            </p>
            <CodeBlock
              language="typescript"
              code={`const user={
name:"Ana",age:30,
    roles:['admin','editor']}
function greet(name:string){
return "Hi, "+name}`}
            />
          </div>
          <div>
            <p className="compare-label compare-good">
              <En>After Prettier</En>
              <Zh>Prettier 格式化后</Zh>
            </p>
            <CodeBlock
              language="typescript"
              code={`const user = {
  name: "Ana",
  age: 30,
  roles: ["admin", "editor"],
};
function greet(name: string) {
  return "Hi, " + name;
}`}
            />
          </div>
        </div>
        <p className="callout">
          <En>
            Most teams run both automatically — Prettier on save, ESLint in the
            editor and again in the pipeline.
          </En>
          <Zh>
            大多数团队会自动运行两者——保存时跑 Prettier，ESLint
            在编辑器里实时提示，pipeline 里再跑一遍。
          </Zh>
        </p>

        <h3>
          <En>15. SonarQube</En>
          <Zh>15. SonarQube</Zh>
        </h3>
        <p>
          <En>
            SonarQube scans the <em>whole</em> codebase on every pull request
            and tracks quality over time. Three examples of what it flags:
          </En>
          <Zh>
            SonarQube 在每个 pull request 上扫描 <em>整个</em>{" "}
            代码库，并持续跟踪代码质量。下面是它会标出的三类问题：
          </Zh>
        </p>
        <p className="compare-label compare-bad">
          <En>Security — a hard-coded secret</En>
          <Zh>安全——硬编码的密钥</Zh>
        </p>
        <CodeBlock
          language="typescript"
          bad={[1]}
          code={`const STRIPE_KEY = "sk_live_51HxQ2eK9";
// Sonar: Make sure this secret is not hard-coded; load it from the environment.`}
        />
        <p className="compare-label compare-bad">
          <En>Maintainability — too complex to follow</En>
          <Zh>可维护性——复杂到难以读懂</Zh>
        </p>
        <CodeBlock
          language="typescript"
          bad={[1]}
          code={`function shippingCost(order: Order) {
  // Sonar: Refactor this function to reduce its Cognitive Complexity from 18 to the 15 allowed.
  if (order.country === "US") {
    if (order.total > 100) {
      if (order.express) { /* … */ } else { /* … */ }
    } else {
      // … more nested branches
    }
  }
}`}
        />
        <p className="compare-label compare-bad">
          <En>Duplication — the same code pasted in several places</En>
          <Zh>重复——同一段代码被粘贴到好几个地方</Zh>
        </p>
        <CodeBlock
          language="plaintext"
          code={`Duplicated lines on new code: 8.4%
  src/orders/validate.ts    lines 12–30
  src/returns/validate.ts   lines 9–27   (same 19 lines)`}
        />
        <p>
          <En>
            On each pull request, these results go through a{" "}
            <strong>quality gate</strong> — a set of pass/fail conditions that
            can block the merge:
          </En>
          <Zh>
            每个 pull request 的结果都要经过一个{" "}
            <strong>quality gate（质量门禁）</strong>
            ——一组通过/失败条件，不达标就能阻止合并：
          </Zh>
        </p>
        <CodeBlock
          language="plaintext"
          good={[3]}
          bad={[2, 4]}
          code={`Quality Gate: FAILED
  Security hotspots reviewed        0%      required 100%
  Coverage on new code              84.2%   required ≥ 80%
  Duplicated lines on new code      8.4%    required ≤ 3%`}
        />

        <h3>
          <En>16. Tests in the CI/CD pipeline</En>
          <Zh>16. CI/CD pipeline 里的测试</Zh>
        </h3>
        <p>
          <En>
            Every push runs your checks automatically, one step after another.
            If any step fails, the change can&apos;t be merged or deployed.
          </En>
          <Zh>
            每次 push 都会自动按顺序运行这些检查。任何一步失败，改动就无法合并或部署。
          </Zh>
        </p>
        <svg
          viewBox="0 0 640 116"
          role="img"
          aria-label="A pipeline: git push, then Lint, then Unit tests, then E2E smoke tests, then Deploy. If any step fails, the pipeline stops and nothing ships."
        >
          <Box x={10} y={14} w={100} h={48} kind="muted" label="git push" />
          <Box x={140} y={14} w={100} h={48} label="Lint" sub="ESLint, Prettier" />
          <Box x={270} y={14} w={100} h={48} label="Unit tests" sub="Vitest / Jest" />
          <Box x={400} y={14} w={100} h={48} label="E2E" sub="smoke tests" />
          <Box x={530} y={14} w={100} h={48} kind="ok" label="Deploy" />
          <Arrow d="M110,38 L138,38" />
          <Arrow d="M240,38 L268,38" />
          <Arrow d="M370,38 L398,38" />
          <Arrow d="M500,38 L528,38" />
          <T x={320} y={96} size={11} color="#c0392b">
            ✗ any step fails → the pipeline stops, nothing ships
          </T>
        </svg>
        <p className="callout">
          <En>
            It runs on every push, so keep it fast: cheap checks first, and save
            the full E2E suite for a nightly run.
          </En>
          <Zh>
            它在每次 push 时都会运行，所以要保持快速：便宜的检查放前面，完整的 E2E
            留到每晚运行。
          </Zh>
        </p>

        <h3>
          <En>17. Testing in the AI era</En>
          <Zh>17. AI 时代的测试</Zh>
        </h3>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <En>
                <strong>Writing the syntax is now cheap.</strong> AI tools
                generate test files, mocks, and locators in seconds, which is
                why you are not expected to memorize them. What stays human is
                judgment: what is worth testing, what the correct behavior is,
                and whether a test is actually any good.
              </En>
              <Zh>
                <strong>写语法的成本已经很低了。</strong>AI
                工具几秒钟就能生成测试文件、mock 和
                locator，所以不要求你背下来。仍然需要人来判断：什么值得测、正确的行为是什么、一个测试到底好不好。
              </Zh>
            </li>
            <li>
              <En>
                <strong>The risk:</strong> AI often derives tests from the code
                itself, so they assert what the code <em>does</em> rather than
                what it <em>should</em> do. A bug gets locked in as the expected
                result, and the suite stays green.
              </En>
              <Zh>
                <strong>风险：</strong>AI
                常常根据代码本身来推导测试，于是断言的是代码{" "}
                <em>实际做了什么</em>，而不是 <em>应该做什么</em>。bug
                被固化成了预期结果，测试依然全绿。
              </Zh>
            </li>
            <li>
              <En>
                <strong>Coverage matters less as a signal.</strong> AI can
                inflate it to 90% with shallow tests, so a high number proves
                even less than before. Reviewing assertion quality, and
                techniques such as mutation testing, matter more.
              </En>
              <Zh>
                <strong>coverage 作为信号的价值下降了。</strong>AI
                可以用浅层测试轻松把数字刷到
                90%，高数字比以前更说明不了问题。审查断言质量，以及 mutation
                testing 这类手段变得更重要。
              </Zh>
            </li>
            <li>
              <En>
                <strong>Expectations rise, not fall.</strong> With tests cheap
                to produce and AI producing more code per PR, &quot;no time to
                write tests&quot; is a weaker excuse, and many teams expect
                tests in every change. The engineer&apos;s job shifts from
                typing tests to specifying behavior and reviewing what the AI
                wrote.
              </En>
              <Zh>
                <strong>要求只会更高，不会更低。</strong>测试越来越容易生成，而
                AI 让每个 PR 的代码量更大，&quot;没时间写测试&quot;
                越来越站不住脚，许多团队要求每次改动都带测试。工程师的工作重心从敲测试代码，转向定义预期行为和审查
                AI 写出的内容。
              </Zh>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
