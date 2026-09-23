import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";

export default function Practice() {
  return (
    <div className="page practice-page">
      <title>Day 13 — Practice</title>
      <DayNav day="day13-layered-architecture" current="practice" />
      <h1>Day 13 — Practice</h1>
      <p className="intro">Everything on this page is required — get it solid.</p>

      <div className="task">
        <span className="task-num">1</span>
        <div className="task-body">
          <p>
            Be able to look at a repository method and say what the service does with what it
            returns, and what the controller does with what the service returns.
          </p>
          <span className="tag-examples">Examples</span>
          <CodeBlock
            language="typescript"
            code={`// given, already written — a repository only answers factual questions
bookRepository.findById(id)                              // "does this row exist, and what's in it?"
bookRepository.countActiveCheckoutsForMember(memberId)    // "how many does this member currently have?"

// yours — the service decides what those facts MEAN
bookService.checkout(bookId, memberId)   // "is this allowed?" — existence, conflict, and limit checks

// yours — the controller only translates HTTP <-> the service call
bookController.checkout(req, res)   // parse req.body with Zod, call the service, send the response`}
          />
          <ul className="task-list">
            <li>
              Given a repository you didn't write, you should be able to say, without looking
              anything up: this fact belongs in the service, this one belongs in the controller,
              this one belongs in neither.
            </li>
          </ul>
        </div>
      </div>

      <div className="task">
        <span className="task-num">2</span>
        <div className="task-body">
          <p>Be able to write a controller: parse with Zod, call one service method, respond.</p>
          <span className="tag-examples">Examples</span>
          <CodeBlock
            language="typescript"
            code={`async create(req: Request, res: Response) {
  try {
    const body = createCheckoutBodySchema.parse(req.body);   // 1. validate the shape
    const checkout = await checkoutService.create(body);     // 2. call ONE service method
    res.status(201).json(checkout);                          // 3. send it
  } catch (err) {
    sendErrorResponse(err, res);   // 4. NotFoundError/ConflictError/ZodError -> the right status code
  }
}`}
          />
          <ul className="task-list">
            <li>
              No business rules here — if you find yourself writing an <code>if</code> that checks
              whether something's <em>allowed</em> (not just whether it's <em>shaped right</em>),
              that line belongs in the service, not here.
            </li>
            <li>
              Every handler follows this same four-step shape. If yours looks different, that's
              worth noticing.
            </li>
          </ul>
        </div>
      </div>

      <div className="task">
        <span className="task-num">3</span>
        <div className="task-body">
          <p>
            Be able to write a service method: call the repository, decide what the result means,
            throw a typed error when it doesn't.
          </p>
          <span className="tag-examples">Examples</span>
          <CodeBlock
            language="typescript"
            code={`async cancel(id: number) {
  const checkout = await checkoutRepository.findById(id);
  if (!checkout) throw new NotFoundError(\`checkout \${id} not found\`);

  if (checkout.status === "returned") {
    throw new ConflictError(\`checkout \${id} was already returned\`);   // one guard, not a full state machine
  }

  return checkoutRepository.updateStatus(id, "returned");
}`}
          />
          <ul className="task-list">
            <li>
              A service method is a straight line: look something up, check it, look up the next
              thing, check that, then write. If you're tempted to build a whole transition table
              for a resource that only ever has two states, you're overbuilding it — a single{" "}
              <code>if</code> guard like the one above is the right size for a resource that
              only ever has two states.
            </li>
            <li>
              Throw <code>NotFoundError</code> / <code>ConflictError</code> — never write a status
              code or call <code>res.json(...)</code> from inside a service.
            </li>
          </ul>
        </div>
      </div>

      <p className="section-label">Understand, but you won't build these</p>
      <p className="section-note">
        You won't be writing an ORM query, a middleware, or a cache for these. But "I'd
        recognize it" isn't good enough: you should be able to read one of these cold and
        explain exactly what it's doing and why it's built that way, the same way you'd be
        expected to in an interview.
      </p>

      <div className="task">
        <span className="task-num">4</span>
        <div className="task-body">
          <p>Be able to explain — not implement — why the repository uses Drizzle, not raw SQL.</p>
          <span className="tag-examples">Examples</span>
          <CodeBlock
            language="typescript"
            code={`const [row] = await db
  .select()
  .from(books)
  .where(eq(books.id, id));`}
          />
          <ul className="task-list">
            <li>
              Say out loud what raw SQL query this is equivalent to, column by column.
            </li>
            <li>
              Explain what specifically goes wrong with the raw-SQL version that this version
              can't: what happens if someone typos a column name in each one? What does each one
              tell you about that mistake, and when — while you're typing, or only once the query
              runs?
            </li>
            <li>
              Explain why "the ORM is more convenient" is not a complete answer here — what does
              it actually buy you that convenience doesn't capture?
            </li>
          </ul>
        </div>
      </div>

      <div className="task">
        <span className="task-num">5</span>
        <div className="task-body">
          <p>
            Be able to explain — not implement — how a thrown error becomes an HTTP response.
          </p>
          <span className="tag-examples">Examples</span>
          <CodeBlock
            language="typescript"
            code={`class NotFoundError extends AppError {
  constructor(message: string) { super(message, 404, "NOT_FOUND"); }
}

throw new NotFoundError(\`Book \${id} not found\`);   // thrown from a service

// mounted once, last, after every route:
app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: { code: err.code, message: err.message } });
  }
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
});`}
          />
          <ul className="task-list">
            <li>
              Trace it end to end: what makes Express treat that last function as an error handler
              specifically, instead of just another route? (It's not where it's mounted.)
            </li>
            <li>
              An <code>async</code> controller that throws doesn't reach that middleware on its
              own in Express 4 — explain why not, and what has to happen for it to get there.
            </li>
            <li>
              Some codebases skip the middleware and instead have every controller wrap itself in
              its own <code>try/catch</code>, calling a shared formatter function directly.
              Explain what that simpler version gives up compared to the middleware version
              above, and why it might still be a reasonable choice for a smaller app.
            </li>
          </ul>
        </div>
      </div>

      <div className="task">
        <span className="task-num">6</span>
        <div className="task-body">
          <p>Be able to explain — not implement — the cache-aside pattern with Redis.</p>
          <span className="tag-examples">Examples</span>
          <CodeBlock
            language="typescript"
            code={`async getBook(id: number) {
  const cached = await redis.get(cacheKey(id));
  if (cached) return JSON.parse(cached);                          // cache hit — repository never runs

  const book = await bookRepository.findById(id);                 // cache miss
  if (!book) throw new NotFoundError(\`Book \${id} not found\`);

  await redis.set(cacheKey(id), JSON.stringify(book), "EX", 300); // populate, with an expiry
  return book;
}

async updateBook(id: number, input: Partial<Book>) {
  const updated = await bookRepository.update(id, input);
  await redis.del(cacheKey(id));   // invalidate on write
  return updated;
}`}
          />
          <ul className="task-list">
            <li>
              Walk through both a cache hit and a cache miss for <code>getBook</code>, saying
              exactly which lines run each time.
            </li>
            <li>
              Explain why <code>updateBook</code> deletes the cache entry instead of just writing
              the new value into it directly.
            </li>
            <li>
              Explain why the <code>EX</code> (expiry) still matters even though{" "}
              <code>updateBook</code> already invalidates on every write — what failure does the
              TTL protect against that explicit invalidation doesn't?
            </li>
            <li>
              Given two resources — a product catalog and a live inventory count — say which one
              is the good caching candidate and which one isn't, and defend it in terms of how
              often each is read vs. written, not just "one feels more important."
            </li>
          </ul>
        </div>
      </div>

      <p className="section-label">Put it all together</p>
      <p className="section-note">
        One hands-on challenge, and one that makes you trace a request through everything above —
        this is the real test of whether it clicked.
      </p>

      <div className="task challenge">
        <span className="task-num">7</span>
        <div className="task-body">
          <p>Hands-on: library checkouts, controller + service only</p>
          <span className="tag-starter">Starter — given, don't rewrite it</span>
          <CodeBlock
            language="typescript"
            code={`type Book = { id: number; title: string; copiesAvailable: number };
type Member = { id: number; name: string };
type Checkout = { id: number; bookId: number; memberId: number; status: "active" | "returned" };

// repository — given
bookRepository.findById(id): Promise<Book | undefined>
memberRepository.findById(id): Promise<Member | undefined>
checkoutRepository.countActiveForBook(bookId): Promise<number>
checkoutRepository.findActiveByBookAndMember(bookId, memberId): Promise<Checkout | undefined>
checkoutRepository.create(data: { bookId; memberId }): Promise<Checkout>

// validation — given
createCheckoutBodySchema = z.object({ bookId: z.number().int(), memberId: z.number().int() })`}
          />
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>
              Write <code>checkoutService.create(data)</code>: book exists (else{" "}
              <code>NotFoundError</code>), member exists (else <code>NotFoundError</code>), this
              member doesn't already have an active checkout on this book (else{" "}
              <code>ConflictError</code>), and there's at least one copy not already checked out —
              compare <code>countActiveForBook</code> against <code>copiesAvailable</code> (else{" "}
              <code>ConflictError</code>).
            </li>
            <li>
              Write <code>checkoutController.create(req, res)</code> to match — parse, call the
              one service method, respond.
            </li>
          </ul>
          <span className="tag-expected">Expected</span>
          <CodeBlock
            language="plaintext"
            code={`POST /checkouts { bookId: 1, memberId: 1 }   -> 201, book has 3/3 copies available before this
POST /checkouts { bookId: 999, memberId: 1 } -> 404 — book doesn't exist
POST /checkouts { bookId: 1, memberId: 1 }   -> 409 — this member already has an active checkout on book 1
POST /checkouts { bookId: 1, memberId: 2 }   -> 409 once copiesAvailable active checkouts already exist on book 1`}
          />
        </div>
      </div>

      <div className="task challenge">
        <span className="task-num">8</span>
        <div className="task-body">
          <p>Trace it: one request, through the ORM, the cache, and the error handler</p>
          <span className="tag-examples">Scenario</span>
          <p>
            <code>PATCH /books/1</code> with body <code>{`{ "copiesAvailable": 0 }`}</code> comes
            in. Book 1 is currently cached from an earlier <code>GET /books/1</code>. Walk through
            what happens, in order, and be ready to explain each step — not just list them:
          </p>
          <ul className="task-list">
            <li>What does the controller do before the service ever runs?</li>
            <li>
              What does the service check before it calls the repository's update, and what does
              it do if <code>id</code> 1 doesn't actually exist?
            </li>
            <li>
              What SQL does the Drizzle update call actually run underneath — name the table and
              the columns being touched?
            </li>
            <li>
              What happens to the cached copy of book 1, and specifically, why is deleting it
              enough — nothing re-populates the cache as part of this request?
            </li>
            <li>
              Now suppose the update throws instead of succeeding (say, the id turns out to be
              wrong). Which of the steps above still happen, which don't, and what does the client
              actually receive?
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
