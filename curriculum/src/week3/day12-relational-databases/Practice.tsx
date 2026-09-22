import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";

export default function Practice() {
  return (
    <div className="page practice-page">
      <title>Day 12 Practice</title>
      <DayNav day="day12-relational-databases" current="practice" />

      <h1>Day 12 — Practice</h1>
      <p className="intro">
        Everything on this page is required — get all of it solid and bring it to the 6pm lab.
      </p>
      <p className="callout">
        Tasks 1-4 you write; task 5 you only have to be able to say out loud.
      </p>

      <div className="task">
        <span className="task-num">1</span>
        <div className="task-body">
          <p>Be able to write a SELECT with WHERE, ORDER BY and LIMIT.</p>
          <span className="tag-starter">Starter</span>
          <CodeBlock
            language="sql"
            code={`CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  author VARCHAR(120) NOT NULL,
  price_cents INTEGER NOT NULL,
  available_copies INTEGER NOT NULL
);

INSERT INTO books (title, author, price_cents, available_copies) VALUES
  ('Clean Code', 'Martin', 3400, 2),
  ('The Pragmatic Programmer', 'Hunt', 4200, 0),
  ('Refactoring', 'Fowler', 5100, 4),
  ('Design Patterns', 'Gamma', 4800, 0),
  ('Working Effectively with Legacy Code', 'Feathers', 3900, 1);`}
          />
          <span className="tag-examples">Examples</span>
          <CodeBlock
            language="sql"
            code={`SELECT ... -- 1. list every column of every book
SELECT ... -- 2. list only title and price_cents, for books with no copies left
SELECT ... -- 3. list all books cheapest first
SELECT ... -- 4. list only the 3 most expensive books`}
          />
        </div>
      </div>

      <div className="task">
        <span className="task-num">2</span>
        <div className="task-body">
          <p>Be able to write basic CRUD SQL against a real table.</p>
          <span className="tag-examples">Examples</span>
          <CodeBlock
            language="sql"
            code={`INSERT INTO books (...) VALUES (...) -- add "Domain-Driven Design" by Evans, 5500 cents, 3 copies
UPDATE books SET ... -- mark every Fowler book as having 10 available copies
DELETE FROM books WHERE ... -- remove the book whose title is "Design Patterns"
SELECT ... -- read the table back after each one to confirm what changed`}
          />
          <p className="callout">
            Run the <code>SELECT</code> with your <code>WHERE</code> first, check the row count,{" "}
            <em>then</em> swap in <code>UPDATE</code>/<code>DELETE</code>.
          </p>
        </div>
      </div>

      <div className="task">
        <span className="task-num">3</span>
        <div className="task-body">
          <p>Be able to write a LEFT JOIN across two tables.</p>
          <span className="tag-starter">Starter</span>
          <CodeBlock
            language="sql"
            code={`CREATE TABLE members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL
);

CREATE TABLE checkouts (
  id SERIAL PRIMARY KEY,
  member_id INTEGER NOT NULL REFERENCES members(id),
  book_id INTEGER NOT NULL REFERENCES books(id)
);

INSERT INTO members (name) VALUES ('Mia'), ('Noah'), ('Ivy');
INSERT INTO checkouts (member_id, book_id) VALUES (1, 1), (1, 3), (2, 1);`}
          />
          <span className="tag-examples">Examples</span>
          <CodeBlock
            language="sql"
            code={`SELECT ... -- 1. list each member's name next to the book_id they checked out
SELECT ... -- 2. change it so members who checked out nothing still appear, with NULL beside them
SELECT ... -- 3. now keep ONLY those members — the ones with no checkout at all`}
          />
          <p className="callout">
            Ivy is the whole point of this task — she borrowed nothing, so she only survives a{" "}
            <code>LEFT JOIN</code>.
          </p>
        </div>
      </div>

      <div className="task">
        <span className="task-num">4</span>
        <div className="task-body">
          <p>Be able to aggregate with COUNT, SUM and AVG plus GROUP BY.</p>
          <span className="tag-examples">Examples</span>
          <CodeBlock
            language="sql"
            code={`SELECT ... -- 1. count how many books there are in total
SELECT ... -- 2. count the books, and sum the available copies, per author
SELECT ... -- 3. show the average price per author, most expensive author first`}
          />
        </div>
      </div>

      <div className="task">
        <span className="task-num">5</span>
        <div className="task-body">
          <p>Be able to explain each ACID guarantee with a simple example.</p>
          <span className="tag-examples">Examples</span>
          <CodeBlock
            language="plaintext"
            code={`Atomicity   -- say what it means in one sentence, then give an example of what breaks without it
Consistency -- same: one sentence, then an example
Isolation   -- same
Durability  -- same`}
          />
          <p className="callout">
            Say these out loud without looking. "All or nothing" is not an example — an example
            names the two writes and what you'd be left holding if only one landed.
          </p>
        </div>
      </div>

      <p className="section-label">Put it all together</p>
      <p className="section-note">
        Two scenarios, each combining several of today's tools into one realistic problem — this is
        the real test of whether it clicked.
      </p>

      <div className="task challenge">
        <span className="task-num">6</span>
        <div className="task-body">
          <p>Gym class attendance</p>
          <span className="tag-starter">Starter</span>
          <CodeBlock
            language="sql"
            code={`CREATE TABLE classes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  instructor VARCHAR(120) NOT NULL
);

CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  class_id INTEGER NOT NULL REFERENCES classes(id),
  member_name VARCHAR(120) NOT NULL
);

INSERT INTO classes (name, instructor) VALUES
  ('Spin', 'Dana'),
  ('Yoga', 'Dana'),
  ('Boxing', 'Rui'),
  ('Pilates', 'Rui');

INSERT INTO attendance (class_id, member_name) VALUES
  (1, 'Mia'), (1, 'Noah'), (1, 'Ivy'),
  (2, 'Mia'),
  (3, 'Noah'), (3, 'Ivy');`}
          />
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>List every class with how many people attended it — including the class nobody attended.</li>
            <li>Sort the result by attendance, highest first.</li>
            <li>Then write a second query: total attendance per instructor.</li>
          </ul>
          <span className="tag-expected">Expected</span>
          <CodeBlock
            language="plaintext"
            code={`Spin    | 3
Boxing  | 2
Yoga    | 1
Pilates | 0

Dana | 4
Rui  | 2`}
          />
        </div>
      </div>

      <div className="task challenge">
        <span className="task-num">7</span>
        <div className="task-body">
          <p>Bank transfer</p>
          <span className="tag-starter">Starter</span>
          <CodeBlock
            language="sql"
            code={`CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  owner VARCHAR(120) NOT NULL,
  balance_cents INTEGER NOT NULL CHECK (balance_cents >= 0)
);

INSERT INTO accounts (owner, balance_cents) VALUES
  ('Priya', 50000),
  ('Sam', 20000);

-- moving 10000 cents from Priya to Sam is two writes:
--   subtract 10000 from Priya
--   add 10000 to Sam`}
          />
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>The server crashes after the first write and before the second — name the ACID property that stops Priya's money from vanishing, and say what the balances are afterwards.</li>
            <li>Two transfers out of Priya's account run at the same instant, and both read her balance before either writes — name the property that is supposed to prevent this.</li>
            <li>A transfer would take Priya to <code>-2000</code> — name the property the <code>CHECK</code> above is enforcing.</li>
            <li><code>COMMIT</code> returns, and the power cuts one second later — name the property that says the transfer is still there on reboot.</li>
          </ul>
          <span className="tag-expected">Expected</span>
          <CodeBlock
            language="plaintext"
            code={`four sentences, one per property — each naming the property AND what
specifically goes wrong in that scenario without it`}
          />
        </div>
      </div>
    </div>
  );
}
