import DayNav from "../../../components/DayNav";
import CodeBlock from "../../../components/CodeBlock";
import LabNav from "./LabNav";

export default function LabLegacy() {
  return (
    <div className="page lab-page">
      <title>Day 10 Lab — Problem Set</title>
      <DayNav day="day10-routing-global-state" current="lab" />
      <LabNav current="problems" />
      <h1>Day 10 — Lab</h1>

      <div className="task">
        <span className="task-num">1</span>
        <div className="task-body">
          <p>Reading list.</p>
          <span className="tag-starter">Starter</span>
          <CodeBlock
            language="typescript"
            code={`
type Book = { id: string; title: string; author: string; pages: number };

const books: Book[] = [
  { id: "b1", title: "Piranesi", author: "Clarke", pages: 245 },
  { id: "b2", title: "Kindred", author: "Butler", pages: 287 },
  { id: "b3", title: "Solaris", author: "Lem", pages: 204 },
];
`}
          />
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>
              Routes for <code>/</code>, <code>/books</code> and <code>/books/:id</code>.
            </li>
            <li>
              <code>/books</code> lists every title as a <code>&lt;Link&gt;</code> to its own detail
              URL.
            </li>
            <li>
              <code>/books/:id</code> reads the id with <code>useParams</code> and shows that book's
              author and page count.
            </li>
            <li>
              A <code>ReadingListProvider</code> owning the ids marked "want to read", with{" "}
              <code>toggle</code> and <code>isOnList</code>.
            </li>
            <li>
              A header rendered on every route showing how many books are on the list, updated by a
              button on the detail page.
            </li>
            <li>
              A <code>useReadingList</code> hook that throws outside the Provider — no component
              calls <code>useContext</code> directly.
            </li>
            <li>An unknown URL renders a Not Found page instead of a blank screen.</li>
          </ul>
          <span className="tag-expected">Expected</span>
          <CodeBlock
            language="plaintext"
            code={`
/books/b3          -> "Solaris — Lem, 204 pages", header reads 0
click "Want to read" -> header reads 1, on every route
navigate to /books and back -> still 1, button still shows as marked
/books/b9          -> Not Found
`}
          />
        </div>
      </div>

      <div className="task">
        <span className="task-num">2</span>
        <div className="task-body">
          <p>Storefront cart.</p>
          <span className="tag-starter">Starter</span>
          <CodeBlock
            language="typescript"
            code={`
type Product = { id: string; name: string; cents: number };

const products: Product[] = [
  { id: "p1", name: "Notebook", cents: 450 },
  { id: "p2", name: "Pen", cents: 199 },
  { id: "p3", name: "Desk lamp", cents: 2899 },
];
`}
          />
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>
              Routes for <code>/products</code>, <code>/products/:id</code> and <code>/cart</code>.
            </li>
            <li>
              A <code>CartProvider</code> owning the lines, with <code>addItem</code>,{" "}
              <code>removeItem</code> and <code>clear</code>.
            </li>
            <li>Adding the same product twice raises its quantity instead of adding a second row.</li>
            <li>
              A header badge on every route showing the total item count, plus a{" "}
              <code>&lt;Link&gt;</code> to <code>/cart</code>.
            </li>
            <li>
              The total is computed from the lines you already hold — no <code>total</code> state
              kept in sync by hand.
            </li>
            <li>
              <code>/cart</code> can remove a line, and the badge must move on the same click.
            </li>
            <li>
              Adding from the detail page then landing on <code>/cart</code>, via{" "}
              <code>useNavigate</code>.
            </li>
          </ul>
          <span className="tag-expected">Expected</span>
          <CodeBlock
            language="plaintext"
            code={`
add Pen, add Pen, add Desk lamp
  badge: 3 items      /cart total: 3297 cents  ($32.97)
  /cart shows 2 rows: Pen x2, Desk lamp x1

remove Desk lamp
  badge: 2 items      /cart total: 398 cents   ($3.98)
`}
          />
        </div>
      </div>

      <div className="task">
        <span className="task-num">3</span>
        <div className="task-body">
          <p>Language switcher.</p>
          <span className="tag-starter">Starter</span>
          <CodeBlock
            language="typescript"
            code={`
type Locale = "en" | "es" | "zh";

const strings: Record<Locale, Record<string, string>> = {
  en: { greeting: "Hello", cart: "Cart", checkout: "Checkout" },
  es: { greeting: "Hola", cart: "Carrito", checkout: "Pagar" },
  zh: { greeting: "Nihao", cart: "Gouwuche", checkout: "Jiezhang" },
};
`}
          />
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>
              A <code>LocaleProvider</code> owning the current locale and exposing a{" "}
              <code>t(key)</code> lookup alongside the setter.
            </li>
            <li>
              Three routes, each rendering at least one translated string through{" "}
              <code>t</code> — none of them receives a locale prop.
            </li>
            <li>A switcher in the header, reachable from every route.</li>
            <li>Changing the locale updates every visible string at once, on every route.</li>
            <li>
              An unknown key returns the key itself rather than <code>undefined</code>, and you can
              say why that's the better failure.
            </li>
          </ul>
          <span className="tag-expected">Expected</span>
          <CodeBlock
            language="plaintext"
            code={`
locale "en" on /checkout   -> "Checkout"
switch to "es" from the header -> "Pagar" here and "Carrito" in the header, no reload
t("shipping") with no entry  -> "shipping"
`}
          />
        </div>
      </div>

      <div className="task challenge">
        <span className="task-num">4</span>
        <div className="task-body">
          <p>Two contexts, and proving the re-render.</p>
          <span className="tag-starter">Starter</span>
          <CodeBlock
            language="typescript"
            code={`
type User = { id: string; name: string; role: "admin" | "viewer" };
type Display = { theme: "light" | "dark"; density: "compact" | "comfortable" };

const initialUser: User = { id: "u1", name: "Ari", role: "viewer" };
const initialDisplay: Display = { theme: "light", density: "comfortable" };
`}
          />
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>
              Start with <em>one</em> context holding both objects and both setters, consumed by a
              header that reads only the user and a report view that reads only the density.
            </li>
            <li>
              Log a line on every render of both components, change only the density, and record
              what logs.
            </li>
            <li>
              Split it into <code>UserProvider</code> and <code>DisplayProvider</code>, nested at
              the root, each with its own throwing hook.
            </li>
            <li>Re-run the same click and show which log disappeared.</li>
            <li>
              Memoize each Provider's value object and explain what that fixes that the split
              doesn't.
            </li>
            <li>
              Routes for <code>/dashboard</code>, <code>/reports/:reportId</code> and a catch-all;
              both contexts must survive navigating between all of them.
            </li>
          </ul>
          <span className="tag-expected">Expected</span>
          <CodeBlock
            language="plaintext"
            code={`
one context, toggle density:
  render: Header
  render: ReportView

two contexts, toggle density:
  render: ReportView
`}
          />
        </div>
      </div>

      <div className="task challenge">
        <span className="task-num">5</span>
        <div className="task-body">
          <p>Checkout wizard across three routes.</p>
          <span className="tag-starter">Starter</span>
          <CodeBlock
            language="typescript"
            code={`
type Draft = {
  email: string;
  address: { line1: string; city: string; zip: string };
  payment: { last4: string };
};

const emptyDraft: Draft = {
  email: "",
  address: { line1: "", city: "", zip: "" },
  payment: { last4: "" },
};
`}
          />
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>
              Routes <code>/checkout/contact</code>, <code>/checkout/address</code>,{" "}
              <code>/checkout/payment</code> and <code>/checkout/review</code>.
            </li>
            <li>
              A <code>CheckoutProvider</code> owning the draft, with one updater per step that
              merges immutably into the nested object.
            </li>
            <li>
              Each step's inputs are controlled and repopulate from the draft when you navigate back.
            </li>
            <li>
              Continue validates that step and moves on with <code>useNavigate</code>; an invalid
              step stays put and shows an inline error.
            </li>
            <li>
              Typing a URL for a later step while an earlier one is incomplete redirects back to the
              first incomplete step.
            </li>
            <li>
              <code>/checkout/review</code> shows the whole draft and a Place order button that
              clears it and navigates home.
            </li>
            <li>
              Say which part of this state had to be in the context and which could have stayed in
              the step component.
            </li>
          </ul>
          <span className="tag-expected">Expected</span>
          <CodeBlock
            language="plaintext"
            code={`
fill contact, Continue        -> /checkout/address
Back, then forward again      -> the email is still there
type /checkout/review by hand with an empty address
                              -> lands on /checkout/address, error not shown yet
Place order                   -> draft is empty, back at "/"
`}
          />
        </div>
      </div>
    </div>
  );
}
