import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { En, Zh } from "../../components/Lang";
import "./day1-notes.css";

export default function Notes() {
  return (
    <div className="page notes-page day1-notes">
      <title>Day 1 Notes</title>
      <DayNav day="day1-html-css-dom" current="notes" />

      <header className="lecture-header">
        <p className="eyebrow">Week 1 · Day 1 · Notes</p>
        <h1>HTML &amp; CSS &amp; the DOM</h1>
        <p className="subtitle"><En>Executive summary → full walkthrough</En><Zh>核心要点 → 完整讲解</Zh></p>
      </header>

      {/* ============================================================ */}
      {/* Section 1 — Executive Summary                                 */}
      {/* ============================================================ */}
      <section id="executive-summary" className="exec-summary">
        <h2><En>Section 1 — Executive Summary</En><Zh>第一部分 — 核心要点</Zh></h2>
        <p>
          <En>The essentials — the bare minimum you need to know for today, not a
          highlights reel of the lecture. If you can't do one of these yet,
          that's what you go back and redo before calling today done:</En>
          <Zh>以下是今天必须掌握的最低要求，不是课程精彩回顾。如果有哪条还做不到，回去重新练，练会了才算今天完成：</Zh>
        </p>
        <ul>
          <li>
            <En>Write correct opening and closing tags, and know which elements are
            self-closing. Never write <code>&lt;input&gt;&lt;/input&gt;</code>.</En>
            <Zh>正确书写开标签和闭标签，清楚哪些元素是自闭合的。不要写 <code>&lt;input&gt;&lt;/input&gt;</code>。</Zh>
          </li>
          <li>
            <En>Pass attributes correctly: <code>id</code>, <code>class</code>,
            <code>data-*</code>.</En>
            <Zh>正确使用属性：<code>id</code>、<code>class</code>、<code>data-*</code>。</Zh>
          </li>
          <li>
            <En>Know and correctly use the most common elements:
            <code>div</code>, <code>span</code>, <code>input</code>,
            <code>button</code>, <code>form</code>,
            <code>ul</code>/<code>li</code>, <code>table</code>,
            <code>img</code>.</En>
            <Zh>熟悉并正确使用最常见的元素：<code>div</code>、<code>span</code>、<code>input</code>、<code>button</code>、<code>form</code>、<code>ul</code>/<code>li</code>、<code>table</code>、<code>img</code>。</Zh>
          </li>
          <li><En>Select elements in CSS using id, class, and element selectors.</En><Zh>使用 id、class 和元素选择器在 CSS 中选取元素。</Zh></li>
          <li><En>Explain and apply the box model: margin, border, padding, content.</En><Zh>理解并应用盒模型（box model）：margin、border、padding、content。</Zh></li>
          <li><En>Build a layout using flexbox.</En><Zh>使用 flexbox 构建布局。</Zh></li>
          <li><En>Explain the purpose of a media query for responsive design.</En><Zh>解释媒体查询（media query）在响应式设计中的作用。</Zh></li>
          <li>
            <En>Use <code>querySelector</code> and <code>getElementById</code> to
            select DOM elements from JavaScript.</En>
            <Zh>在 JavaScript 中使用 <code>querySelector</code> 和 <code>getElementById</code> 选取 DOM 元素。</Zh>
          </li>
        </ul>
        <p>
          <En>Want more? <a href="/src/day1-html-css-dom/concepts.html">View all concepts?</a></En>
          <Zh>想了解更多？<a href="/src/day1-html-css-dom/concepts.html">查看全部概念</a></Zh>
        </p>
      </section>

      <hr className="section-divider" />

      {/* ============================================================ */}
      {/* Section 2 — Full Walkthrough                                  */}
      {/* ============================================================ */}
      <h2 style={{ marginTop: "2.5rem" }}><En>Section 2 — Full Walkthrough</En><Zh>第二部分 — 完整讲解</Zh></h2>

      <section id="orientation">
        <h2><En>1. Orientation</En><Zh>1. 入门定向</Zh></h2>
        <ul>
          <li>
            <En><strong>HTML</strong> = structure/content, <strong>CSS</strong> =
            presentation, <strong>JavaScript</strong> = behavior (starts Day 2+).</En>
            <Zh><strong>HTML</strong> = 结构/内容，<strong>CSS</strong> = 样式，<strong>JavaScript</strong> = 交互行为（从第 2 天开始）。</Zh>
          </li>
          <li>
            <En>Open Chrome DevTools: right-click → <em>Inspect</em>, or
            <code>Cmd+Opt+I</code> (Mac) / <code>Ctrl+Shift+I</code> (Windows) —
            <code>F12</code> works on both.</En>
            <Zh>打开 Chrome DevTools：右键 → <em>检查</em>，或按 <code>Cmd+Opt+I</code>（Mac）/ <code>Ctrl+Shift+I</code>（Windows），<code>F12</code> 两者均可。</Zh>
          </li>
        </ul>
      </section>

      {/* ============================================================ */}
      <section id="html-elements">
        <h2><En>2. HTML Elements</En><Zh>2. HTML 元素</Zh></h2>

        <h3><En>2.1 Document skeleton</En><Zh>2.1 文档骨架</Zh></h3>
        <CodeBlock code={`<!doctype html>
<html>
  <head>...</head>   <!-- metadata, not rendered -->
  <body>...</body>   <!-- everything visible -->
</html>`} language="xml" />

        <h3><En>2.2 Tag syntax rules</En><Zh>2.2 标签语法规则</Zh></h3>
        <CodeBlock code={`<div>correct</div>
<div>wrong<div/>        <!-- that's self-closing syntax, not a closing tag -->

<input />               <!-- correct — self-closing, no children -->
<input></input>        <!-- wrong — input can't take a closing tag at all -->`} language="xml" good={[1, 4]} bad={[2, 5]} />
        <p className="callout">
          <En>Editor draws a red squiggly line under a tag? Stop and read it before
          typing on.</En>
          <Zh>编辑器在标签下划了红色波浪线？先读懂提示再继续写代码。</Zh>
        </p>

        <h3><En>2.3 Common elements &amp; semantic containers</En><Zh>2.3 常用元素与语义化容器</Zh></h3>
        <p><En>Prefer a semantic tag over a generic box when one fits the content's role:</En><Zh>当内容有明确语义时，优先使用语义标签，而非通用的 div：</Zh></p>

        <h4><En>Most common</En><Zh>最常用</Zh></h4>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Tag</th>
              <th><En>Type</En><Zh>类型</Zh></th>
              <th><En>Role</En><Zh>用途</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr className="generic-row">
              <td><code>&lt;div&gt;</code></td>
              <td><span className="badge badge-generic">Generic</span></td>
              <td><En>block box, no meaning — the default wrapper</En><Zh>块级盒子，无语义——默认包装器</Zh></td>
            </tr>
            <tr className="generic-row">
              <td><code>&lt;span&gt;</code></td>
              <td><span className="badge badge-generic">Generic</span></td>
              <td><En>inline box, no meaning — wraps part of a line</En><Zh>行内盒子，无语义——包裹一行中的部分文字</Zh></td>
            </tr>
            <tr>
              <td><code>&lt;p&gt;</code></td>
              <td><span className="badge badge-semantic">Semantic</span></td>
              <td><En>a paragraph of text</En><Zh>一段文本</Zh></td>
            </tr>
            <tr>
              <td><code>&lt;a href="…"&gt;</code></td>
              <td><span className="badge badge-semantic">Semantic</span></td>
              <td><En>a link to another page, file, or section</En><Zh>跳转到另一个页面、文件或锚点的链接</Zh></td>
            </tr>
            <tr>
              <td><code>&lt;img src="…" alt="…"&gt;</code></td>
              <td><span className="badge badge-semantic">Semantic</span></td>
              <td><En>an image — <code>alt</code> is required</En><Zh>图片——<code>alt</code> 是必填属性</Zh></td>
            </tr>
            <tr>
              <td><code>&lt;h1&gt;–&lt;h6&gt;</code></td>
              <td><span className="badge badge-semantic">Semantic</span></td>
              <td><En>headings, in order — one <code>&lt;h1&gt;</code> per page</En><Zh>按层级排列的标题——每页只能有一个 <code>&lt;h1&gt;</code></Zh></td>
            </tr>
            <tr>
              <td><code>&lt;ul&gt; &lt;ol&gt; &lt;li&gt;</code></td>
              <td><span className="badge badge-semantic">Semantic</span></td>
              <td><En>a bulleted or numbered list, and its items</En><Zh>无序或有序列表及其列表项</Zh></td>
            </tr>
            <tr>
              <td><code>&lt;table&gt;</code></td>
              <td><span className="badge badge-semantic">Semantic</span></td>
              <td><En>tabular data — with <code>&lt;thead&gt;</code>, <code>&lt;tbody&gt;</code>, <code>&lt;tr&gt;</code>, <code>&lt;th&gt;</code>, <code>&lt;td&gt;</code></En><Zh>表格数据——配合 <code>&lt;thead&gt;</code>、<code>&lt;tbody&gt;</code>、<code>&lt;tr&gt;</code>、<code>&lt;th&gt;</code>、<code>&lt;td&gt;</code> 使用</Zh></td>
            </tr>
            <tr>
              <td><code>&lt;form&gt;</code></td>
              <td><span className="badge badge-semantic">Semantic</span></td>
              <td><En>a group of fields submitted together</En><Zh>一组一起提交的表单字段</Zh></td>
            </tr>
            <tr>
              <td><code>&lt;label for="…"&gt;</code></td>
              <td><span className="badge badge-semantic">Semantic</span></td>
              <td><En>the caption for a field — clicking it focuses that field</En><Zh>字段的说明标签——点击它会聚焦对应的输入框</Zh></td>
            </tr>
            <tr>
              <td><code>&lt;input&gt;</code></td>
              <td><span className="badge badge-semantic">Semantic</span></td>
              <td><En>a form field — self-closing, never <code>&lt;input&gt;&lt;/input&gt;</code></En><Zh>表单输入框——自闭合，不要写 <code>&lt;input&gt;&lt;/input&gt;</code></Zh></td>
            </tr>
            <tr>
              <td><code>&lt;button&gt;</code></td>
              <td><span className="badge badge-semantic">Semantic</span></td>
              <td><En>a clickable action (not a styled <code>&lt;div&gt;</code>!)</En><Zh>可点击的操作按钮（不要用样式化的 <code>&lt;div&gt;</code> 代替！）</Zh></td>
            </tr>
          </tbody>
        </table>

        <h4><En>Other semantic elements</En><Zh>其他语义化元素</Zh></h4>
        <p><En>Page-structure landmarks — they render like a <code>&lt;div&gt;</code>, but they say what the box <em>is</em>:</En><Zh>页面结构地标——渲染效果和 <code>&lt;div&gt;</code> 一样，但能表达这个盒子<em>是什么</em>：</Zh></p>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Tag</th>
              <th><En>Role</En><Zh>用途</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>&lt;header&gt;</code></td>
              <td><En>intro / top-of-section content</En><Zh>页眉或章节开头内容</Zh></td>
            </tr>
            <tr>
              <td><code>&lt;nav&gt;</code></td>
              <td><En>navigation links</En><Zh>导航链接</Zh></td>
            </tr>
            <tr>
              <td><code>&lt;main&gt;</code></td>
              <td><En>the primary content of the page (one per page)</En><Zh>页面主要内容区域（每页只能有一个）</Zh></td>
            </tr>
            <tr>
              <td><code>&lt;section&gt;</code></td>
              <td><En>a thematic grouping with its own heading</En><Zh>有独立标题的主题分组</Zh></td>
            </tr>
            <tr>
              <td><code>&lt;article&gt;</code></td>
              <td><En>self-contained, independently distributable content</En><Zh>独立且可单独分发的内容</Zh></td>
            </tr>
            <tr>
              <td><code>&lt;aside&gt;</code></td>
              <td><En>tangential content (sidebar, pull-quote)</En><Zh>次要内容（侧边栏、引用块）</Zh></td>
            </tr>
            <tr>
              <td><code>&lt;footer&gt;</code></td>
              <td><En>closing content for a section/page</En><Zh>章节或页面的页脚内容</Zh></td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <En>Semantic tags are what screen readers and search engines use to
          understand your page — a div soup is invisible to both.</En>
          <Zh>语义标签让屏幕阅读器和搜索引擎能理解页面结构——满页 div 对它们来说是透明的。</Zh>
        </p>

        <h3><En>2.4 Text &amp; inline elements</En><Zh>2.4 文本与行内元素</Zh></h3>
        <p>
          <En>Inline emphasis: <code>&lt;strong&gt;</code> (importance),
          <code>&lt;em&gt;</code> (stress), <code>&lt;br&gt;</code> (a line break).</En>
          <Zh>行内强调：<code>&lt;strong&gt;</code>（重要性）、<code>&lt;em&gt;</code>（语气强调）、<code>&lt;br&gt;</code>（换行）。</Zh>
        </p>
        <p className="callout">
          <En><code>alt</code> is not optional — it's the text a screen reader speaks.</En>
          <Zh><code>alt</code> 不是可选的——它是屏幕阅读器朗读的文本。</Zh>
        </p>
        <div className="code-demo-pair">
          <CodeBlock code={`<ul>
  <li>First item</li>
  <li>Second item</li>
</ul>`} language="xml" />
          <ul>
            <li>First item</li>
            <li>Second item</li>
          </ul>
        </div>
        <div className="code-demo-pair">
          <CodeBlock code={`<table>
  <thead>
    <tr><th>Name</th><th>Role</th></tr>
  </thead>
  <tbody>
    <tr><td>Ada</td><td>Engineer</td></tr>
  </tbody>
</table>`} language="xml" />
          <table className="ref-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ada</td>
                <td>Engineer</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3><En>2.5 Attributes</En><Zh>2.5 属性</Zh></h3>
        <p>
          <En><code>tag attribute="value"</code> — <code>id</code> unique,
          <code>class</code> reusable, <code>data-*</code> your own custom data:</En>
          <Zh><code>tag attribute="value"</code> ——<code>id</code> 唯一，<code>class</code> 可复用，<code>data-*</code> 存放自定义数据：</Zh>
        </p>
        <CodeBlock code={`<div
  id="user-card"
  class="card highlighted"
  data-testid="user-card"
  data-user-id="42"
>
  ...
</div>`} language="xml" />
        <div id="demo-attrs" className="demo-box" data-note="I am a data attribute">
          <p>
            <En>Inspect me — I have an <code>id</code>, a <code>class</code>, and a
            <code>data-note</code>.</En>
            <Zh>用开发者工具检查我——我有 <code>id</code>、<code>class</code> 和 <code>data-note</code> 属性。</Zh>
          </p>
        </div>

        <h3><En>2.6 Forms</En><Zh>2.6 表单</Zh></h3>
        <p className="callout">
          <En><code>&lt;input&gt;</code> is self-closing — <code>&lt;input /&gt;</code>
          or plain <code>&lt;input&gt;</code>, <strong>never</strong>
          <code>&lt;input&gt;&lt;/input&gt;</code>.</En>
          <Zh><code>&lt;input&gt;</code> 是自闭合标签——写 <code>&lt;input /&gt;</code> 或 <code>&lt;input&gt;</code> 即可，<strong>绝不能</strong>写 <code>&lt;input&gt;&lt;/input&gt;</code>。</Zh>
        </p>
        <div className="code-demo-pair">
          <form className="demo-form">
            <label htmlFor="demo-name"><En>Name</En><Zh>姓名</Zh></label>
            <input id="demo-name"
              name="name"
              type="text"
              placeholder="Ada Lovelace" />

            <label htmlFor="demo-role"><En>Role</En><Zh>角色</Zh></label>
            <select id="demo-role" name="role">
              <option value="student"><En>Student</En><Zh>学生</Zh></option>
              <option value="instructor"><En>Instructor</En><Zh>讲师</Zh></option>
            </select>

            <label><input type="checkbox" name="agree" /> <En>I understand the box model</En><Zh>我理解了盒模型</Zh></label>

            <button type="submit"><En>Submit</En><Zh>提交</Zh></button>
            <small><En>click → refreshes the page</En><Zh>点击 → 刷新页面</Zh></small>
          </form>
          <CodeBlock code={`<form>
  <label for="name">Name</label>
  <input id="name" name="name" type="text" />

  <label for="role">Role</label>
  <select id="role" name="role">
    <option value="student">Student</option>
    <option value="instructor">Instructor</option>
  </select>

  <label>
    <input type="checkbox" name="agree" /> I agree
  </label>

  <button type="submit">Submit</button> <!-- click refreshes the page -->
</form>`} language="xml" />
        </div>
        <p className="callout">
          <En>A form's default behavior on submit is to reload the page (a GET to
          the current URL). In JS you'll almost always call
          <code>event.preventDefault()</code> inside a <code>submit</code>
          handler to stop that refresh.</En>
          <Zh>表单提交的默认行为是重新加载页面（向当前 URL 发 GET 请求）。在 JS 中，<code>submit</code> 处理函数几乎都会先调用 <code>event.preventDefault()</code> 来阻止这次刷新。</Zh>
        </p>
      </section>

      {/* ============================================================ */}
      <section id="css-core">
        <h2><En>3. CSS Core</En><Zh>3. CSS 核心</Zh></h2>

        <h3><En>3.1 Selectors &amp; specificity</En><Zh>3.1 选择器与优先级</Zh></h3>
        <p><En>Four selector families, in <strong>increasing</strong> specificity:</En><Zh>四种选择器类型，优先级<strong>从低到高</strong>：</Zh></p>
        <CodeBlock code={`element     { }   /* p, div, button          — specificity 0-0-1 */
.class      { }   /* .demo-box               — specificity 0-1-0 */
#id         { }   /* #demo-attrs             — specificity 1-0-0 */
el.class    { }   /* combos add together     — 0-1-1              */`} language="css" />
        <div className="concept">
          <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
          <ul>
            <li><En>More specific selector wins — regardless of order in the file.</En><Zh>优先级更高的选择器获胜——与在文件中的顺序无关。</Zh></li>
            <li><En>Tie? Last rule declared wins.</En><Zh>优先级相同？后声明的规则获胜。</Zh></li>
            <li><En><code>!important</code> beats everything — avoid it.</En><Zh><code>!important</code> 胜过一切——避免使用。</Zh></li>
          </ul>
        </div>
        <div className="specificity-demo">
          <p className="spec-target">
            <En>This paragraph has both a class and an id rule fighting over its color
            — inspect it and check the Styles panel to see which one won and why.</En>
            <Zh>这段文字同时被 class 和 id 规则争夺颜色控制权——用开发者工具检查，在 Styles 面板中看看谁赢了，以及原因。</Zh>
          </p>
        </div>

        <h3><En>3.2 The box model</En><Zh>3.2 盒模型</Zh></h3>
        <p>
          <En>Every element is a rectangle made of four layers, outside in:
          <strong>margin</strong> (space outside the border, transparent) →
          <strong>border</strong> → <strong>padding</strong> (space inside the
          border) → <strong>content</strong>.</En>
          <Zh>每个元素都是由四层组成的矩形，从外到内：<strong>margin</strong>（边框外的透明空白）→ <strong>border</strong>（边框）→ <strong>padding</strong>（边框内的空白）→ <strong>content</strong>（内容）。</Zh>
        </p>
        <div className="box-model-demo">
          <div className="bm-margin">
            margin
            <div className="bm-border">
              border
              <div className="bm-padding">
                padding
                <div className="bm-content">content</div>
              </div>
            </div>
          </div>
        </div>
        <div className="concept">
          <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
          <ul>
            <li>
              <En><code>content-box</code> (default) — <code>width</code> = content
              only; padding/border add on top.</En>
              <Zh><code>content-box</code>（默认）——<code>width</code> 只包含内容，padding 和 border 会额外增加尺寸。</Zh>
            </li>
            <li>
              <En><code>border-box</code> — <code>width</code> includes padding +
              border, so it never grows past what you set.</En>
              <Zh><code>border-box</code>——<code>width</code> 包含 padding 和 border，尺寸不会超出你设定的值。</Zh>
            </li>
            <li>
              <En>Most stylesheets set
              <code>* {"{"} box-sizing: border-box; {"}"}</code> globally.</En>
              <Zh>大多数样式表会全局设置 <code>* {"{"} box-sizing: border-box; {"}"}</code>。</Zh>
            </li>
          </ul>
        </div>

        <h3>3.3 display: block vs. inline vs. inline-block</h3>
        <div className="display-demo">
          <div className="display-row">
            <span className="tag-label">block</span>
            <div className="demo-block">
              <En>I take the full line and respect width/height.</En>
              <Zh>我独占一行，可以设置宽度和高度。</Zh>
            </div>
          </div>
          <div className="display-row">
            <span className="tag-label">inline</span>
            <span className="demo-inline"><En>I sit in the text flow</En><Zh>我随文本流排列</Zh></span><span className="demo-inline"><En>and ignore width/height.</En><Zh>并忽略宽度和高度设置。</Zh></span>
          </div>
          <div className="display-row">
            <span className="tag-label">inline-block</span>
            <span className="demo-inline-block"><En>flows like inline</En><Zh>像行内元素排列</Zh></span><span className="demo-inline-block"><En>but respects width/height.</En><Zh>但可以设置宽度和高度。</Zh></span>
          </div>
        </div>

        <h3><En>3.4 Flexbox (one axis)</En><Zh>3.4 Flexbox（单轴布局）</Zh></h3>
        <div className="concept">
          <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
          <ul>
            <li><En><code>display: flex</code> lays children out along ONE axis.</En><Zh><code>display: flex</code> 将子元素沿单条轴排列。</Zh></li>
            <li>
              <En><code>justify-content</code> = main axis,
              <code>align-items</code> = cross axis.</En>
              <Zh><code>justify-content</code> 控制主轴，<code>align-items</code> 控制交叉轴。</Zh>
            </li>
          </ul>
        </div>
        <div className="flex-demo">
          <div className="flex-item">1</div>
          <div className="flex-item">2</div>
          <div className="flex-item">3</div>
        </div>

        <h3><En>3.5 Grid (two axes at once)</En><Zh>3.5 Grid（双轴布局）</Zh></h3>
        <div className="concept">
          <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
          <ul>
            <li><En>Flex = one axis (a row OR a column).</En><Zh>Flex = 单轴（一行或一列）。</Zh></li>
            <li>
              <En>Grid = two axes at once (rows AND columns) — better for a
              full-page or card-grid layout.</En>
              <Zh>Grid = 同时控制两轴（行和列）——更适合整页布局或卡片网格。</Zh>
            </li>
            <li><En>Surface level for today: just know it exists. "Grid = 2D, flex = 1D."</En><Zh>今天只需了解它的存在："Grid = 二维，flex = 一维。"</Zh></li>
          </ul>
        </div>
        <div className="grid-demo">
          <div className="grid-item">1</div>
          <div className="grid-item">2</div>
          <div className="grid-item">3</div>
          <div className="grid-item">4</div>
          <div className="grid-item">5</div>
          <div className="grid-item">6</div>
        </div>

        <h3><En>3.6 Other everyday CSS properties</En><Zh>3.6 其他常用 CSS 属性</Zh></h3>
        <div className="concept">
          <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
          <ul>
            <li><En><code>font-size</code> — text size</En><Zh><code>font-size</code> — 字体大小</Zh></li>
            <li><En><code>color</code> — text color</En><Zh><code>color</code> — 文字颜色</Zh></li>
            <li><En><code>background-color</code> — fill</En><Zh><code>background-color</code> — 背景填充色</Zh></li>
            <li>
              <En><code>border</code> — shorthand: width + style + color, e.g.
              <code>1px solid black</code></En>
              <Zh><code>border</code> — 简写属性：宽度 + 样式 + 颜色，例如 <code>1px solid black</code></Zh>
            </li>
            <li><En><code>border-radius</code> — rounds the corners</En><Zh><code>border-radius</code> — 圆角</Zh></li>
          </ul>
        </div>
        <div className="quick-css-demo">
          <En>font-size, color, background-color, border, and border-radius — all
          five, on one box.</En>
          <Zh>font-size、color、background-color、border、border-radius——五个属性，全用在同一个盒子上。</Zh>
        </div>

        <h3><En>3.7 Responsive design</En><Zh>3.7 响应式设计</Zh></h3>
        <div className="concept">
          <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
          <ul>
            <li>
              <En>A <strong>media query</strong> applies different CSS rules based
              on the viewport (usually its width).</En>
              <Zh><strong>媒体查询（media query）</strong>根据视口条件（通常是宽度）应用不同的 CSS 规则。</Zh>
            </li>
            <li>
              <En>Resize this window, or open DevTools' device toolbar
              (<code>Cmd+Shift+M</code> Mac / <code>Ctrl+Shift+M</code>
              Windows), to flip the box below at the 600px breakpoint — no JS
              involved:</En>
              <Zh>调整窗口大小，或打开 DevTools 设备工具栏（Mac：<code>Cmd+Shift+M</code>，Windows：<code>Ctrl+Shift+M</code>），在 600px 断点处观察下方盒子的变化——无需 JS：</Zh>
            </li>
          </ul>
        </div>
        <CodeBlock code={`.narrow-only { display: none; }

@media (max-width: 600px) {
  .wide-only   { display: none; }
  .narrow-only { display: block; }
}`} language="css" />
        <div className="responsive-demo">
          <p className="wide-only"><En>Viewport ≥ 600px — showing the wide-layout text.</En><Zh>视口 ≥ 600px——显示宽屏布局文字。</Zh></p>
          <p className="narrow-only"><En>Viewport &lt; 600px — showing the narrow-layout text.</En><Zh>视口 &lt; 600px——显示窄屏布局文字。</Zh></p>
        </div>
      </section>

      {/* ============================================================ */}
      <section id="dom">
        <h2><En>4. The Document Object Model (DOM)</En><Zh>4. 文档对象模型（DOM）</Zh></h2>
        <p>
          <En>The DOM is the browser's live, in-memory tree built <em>from</em>
          your HTML — not the HTML file itself. It can differ from your source
          (browsers auto-correct malformed HTML; JS can change it after load).
          View it in DevTools' Elements panel.</En>
          <Zh>DOM 是浏览器根据 HTML 构建的实时内存树——并不等于 HTML 文件本身。它可能与源代码不同（浏览器会自动修正错误的 HTML；JS 也可以在加载后修改它）。在 DevTools 的 Elements 面板中可以查看。</Zh>
        </p>
        <ul>
          <li><En><strong>parent</strong> — the node directly containing this one</En><Zh><strong>parent（父节点）</strong>——直接包含该节点的节点</Zh></li>
          <li><En><strong>child</strong> — a node directly contained by this one</En><Zh><strong>child（子节点）</strong>——被该节点直接包含的节点</Zh></li>
          <li><En><strong>sibling</strong> — a node with the same parent</En><Zh><strong>sibling（兄弟节点）</strong>——与该节点共享同一父节点的节点</Zh></li>
          <li>
            <En><strong>ancestor</strong> / <strong>descendant</strong> — any level
            up/down the tree, not just direct</En>
            <Zh><strong>ancestor（祖先）</strong> / <strong>descendant（后代）</strong>——树中任意层级的上/下级节点，不限于直接关系</Zh>
          </li>
        </ul>
        <div className="callout">
          <p>
            <En><strong>Live exercise:</strong> in the Elements panel, find this
            section's <code>&lt;ul&gt;</code>. Its parent is this
            <code>&lt;section id="dom"&gt;</code>. Its children are the four
            <code>&lt;li&gt;</code> elements. Those four <code>&lt;li&gt;</code>s
            are siblings of each other.</En>
            <Zh><strong>实操练习：</strong>在 Elements 面板中，找到这个 section 的 <code>&lt;ul&gt;</code>。它的父节点是 <code>&lt;section id="dom"&gt;</code>，子节点是四个 <code>&lt;li&gt;</code> 元素，这四个 <code>&lt;li&gt;</code> 互为兄弟节点。</Zh>
          </p>
        </div>

        <h3><En>4.1 Sneak peek: touching the DOM in JavaScript (Day 2+)</En><Zh>4.1 预告：用 JavaScript 操作 DOM（第 2 天+）</Zh></h3>
        <p><En>Surface level only, nothing here runs today — just know these exist:</En><Zh>今天只需了解这些 API 的存在，代码暂不运行：</Zh></p>
        <CodeBlock code={`// SELECT an element
document.querySelector(".card");        // first match, any CSS selector
document.querySelectorAll("li");        // ALL matches, as a list
document.getElementById("demo-attrs");  // older API, id only, still common

// LISTEN for events
button.addEventListener("click", () => {
  // runs every time this button is clicked
});

// CRUD an element
const item = document.createElement("li"); // Create
item.textContent = "new item";              // Update (set its text)
list.appendChild(item);                     // insert it into the page
item.textContent;                           // Read
item.remove();                              // Delete`} language="typescript" />
        <div className="callout">
          <p>
            <En><strong>Avoid <code>innerHTML</code>.</strong> It parses whatever
            string you give it as raw HTML — if that string ever contains user
            input, you've just handed an attacker a way to inject their own
            <code>&lt;script&gt;</code> tags (an XSS attack). Prefer
            <code>textContent</code> for text, or build elements with
            <code>createElement</code>. No need for the details today — just
            remember "avoid <code>innerHTML</code>" going forward.</En>
            <Zh><strong>避免使用 <code>innerHTML</code>。</strong>它会将你传入的字符串解析为原始 HTML——如果字符串包含用户输入，攻击者就可以注入 <code>&lt;script&gt;</code> 标签（XSS 攻击）。文本内容请用 <code>textContent</code>，需要创建元素时用 <code>createElement</code>。今天不需要记细节——记住"避免 <code>innerHTML</code>"即可。</Zh>
          </p>
        </div>
      </section>
    </div>
  );
}
