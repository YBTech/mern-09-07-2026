import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";

export default function Lab() {
  return (
    <div className="page lab-page">
      <title>Day 12 Lab</title>
      <DayNav day="day12-relational-databases" current="lab" />
      <h1>Day 12 — Lab</h1>

      <h2>Query &amp; join drills</h2>

      <div className="task">
        <span className="task-num">1</span>
        <div className="task-body">
          <p>Movie rental catalog.</p>
          <span className="tag-starter">Starter</span>
          <CodeBlock
            language="sql"
            code={`CREATE TABLE customers (id SERIAL PRIMARY KEY, name VARCHAR(120));
CREATE TABLE movies (id SERIAL PRIMARY KEY, title VARCHAR(160));
CREATE TABLE rentals (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  movie_id INTEGER REFERENCES movies(id),
  rented_on DATE
);
INSERT INTO customers (name) VALUES ('Owen'), ('Zoe');
INSERT INTO movies (title) VALUES ('Arrival'), ('Interstellar');
INSERT INTO rentals (customer_id, movie_id, rented_on) VALUES
  (1, 1, '2026-01-05'),
  (1, 2, '2026-01-09'),
  (2, 2, '2026-01-10');`}
          />
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>
              Join all three tables to list customer name, movie title, and rental date for every
              rental.
            </li>
            <li>Sort the result by rental date.</li>
          </ul>
          <span className="tag-expected">Expected</span>
          <CodeBlock
            language="plaintext"
            code={`Owen | Arrival       | 2026-01-05
Owen | Interstellar  | 2026-01-09
Zoe  | Interstellar  | 2026-01-10`}
          />
        </div>
      </div>

      <div className="task">
        <span className="task-num">2</span>
        <div className="task-body">
          <p>Actors in an 1895 film.</p>
          <span className="tag-starter">Starter</span>
          <CodeBlock
            language="sql"
            code={`-- ids are TEXT here, not integers — a primary key does not have to be a number
CREATE TABLE actors (
  id   TEXT PRIMARY KEY,
  fname TEXT,
  lname TEXT
);

CREATE TABLE movies (
  id   TEXT PRIMARY KEY,
  name TEXT,
  year TEXT
);

-- the join table: it relates actors to movies, and holds nothing else
CREATE TABLE movie_cast (
  actor_id TEXT REFERENCES actors(id),
  movie_id TEXT REFERENCES movies(id),
  PRIMARY KEY (actor_id, movie_id)
);

INSERT INTO actors (id, fname, lname) VALUES
  ('nm0166380', 'Leon',    'Clerc'),
  ('nm3692071', 'Ida',     'Delaware'),
  ('nm0244989', 'Marcel',  'Duval'),
  ('nm3692297', 'Ana',     'Grunato'),
  ('nm3691272', 'Otto',    'Ploetz'),
  ('nm0000599', 'Georges', 'Melies');

INSERT INTO movies (id, name, year) VALUES
  ('tt0000012', 'The Arrival of a Train',  '1895'),
  ('tt0000014', 'The Sprinkler Sprinkled', '1895'),
  ('tt0000417', 'A Trip to the Moon',      '1902');

INSERT INTO movie_cast (actor_id, movie_id) VALUES
  ('nm0166380', 'tt0000012'),
  ('nm0166380', 'tt0000014'),
  ('nm3692071', 'tt0000012'),
  ('nm3692297', 'tt0000012'),
  ('nm0244989', 'tt0000014'),
  ('nm3691272', 'tt0000014'),
  ('nm0000599', 'tt0000417');`}
          />
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>Find the actors who appeared in a movie released in 1895.</li>
            <li>
              Return exactly two columns, named <code>ACTOR ID</code> and{" "}
              <code>LAST NAME(LNAME)</code> in the output.
            </li>
            <li>Sort them alphabetically by last name.</li>
            <li>
              One actor is in <em>both</em> 1895 films — make sure they appear once, not twice.
            </li>
          </ul>
          <span className="tag-expected">Expected</span>
          <CodeBlock
            language="plaintext"
            code={`ACTOR ID  | LAST NAME(LNAME)
----------+-----------------
nm0166380 | Clerc
nm3692071 | Delaware
nm0244989 | Duval
nm3692297 | Grunato
nm3691272 | Ploetz`}
          />
        </div>
      </div>

      <h2>Transactions</h2>

      <div className="task">
        <span className="task-num">3</span>
        <div className="task-body">
          <p>Library checkout.</p>
          <span className="tag-starter">Starter</span>
          <CodeBlock
            language="sql"
            code={`CREATE TABLE books (id SERIAL PRIMARY KEY, title VARCHAR(160), available_copies INTEGER);
CREATE TABLE checkouts (id SERIAL PRIMARY KEY, book_id INTEGER REFERENCES books(id), member_name VARCHAR(120));

INSERT INTO books (title, available_copies) VALUES ('Clean Code', 2);`}
          />
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>
              Write one transaction that checks a copy out: insert a <code>checkouts</code> row and
              decrement <code>available_copies</code> by 1, both together.
            </li>
            <li>Run it twice, for two different members checking out the same book.</li>
            <li>
              Run it a third time — this attempt must <code>ROLLBACK</code> instead of taking{" "}
              <code>available_copies</code> below 0.
            </li>
          </ul>
          <span className="tag-expected">Expected</span>
          <CodeBlock
            language="plaintext"
            code={`books.available_copies   // 0
checkouts row count       // 2 (the third attempt rolled back, no row inserted)`}
          />
        </div>
      </div>

      <div className="task challenge">
        <span className="task-num">4</span>
        <div className="task-body">
          <p>Diagnose and fix a lost-update bug.</p>
          <span className="tag-starter">Starter</span>
          <CodeBlock
            language="sql"
            code={`-- a transfer of 10000 cents, shipped as two loose statements
UPDATE accounts SET balance_cents = balance_cents - 10000 WHERE id = 1;
UPDATE accounts SET balance_cents = balance_cents + 10000 WHERE id = 2;`}
          />
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>
              Say which ACID property is at risk if the app crashes between these two statements,
              and what the two balances would be afterwards.
            </li>
            <li>
              Say which ACID property is at risk if two transfers touching account 1 run at the same
              time with no locking.
            </li>
            <li>Rewrite it so both statements succeed together or neither does.</li>
            <li>
              Add a step that refuses the transfer — leaving both balances untouched — when account
              1 doesn't have enough to cover it.
            </li>
          </ul>
          <span className="tag-expected">Expected</span>
          <CodeBlock
            language="plaintext"
            code={`start: account 1 = 50000, account 2 = 20000

after a transfer of 10000    // 40000 and 30000
after a transfer of 999999   // 40000 and 30000 — unchanged, the whole thing was refused`}
          />
        </div>
      </div>
    </div>
  );
}
