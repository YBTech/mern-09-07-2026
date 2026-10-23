import { CaseAArchitecture } from "./CaseDiagrams";

export default function CaseA() {
  return (
    <>
      <h2>1. The business</h2>
      <ul>
        <li>A 3,000-person company. HR, IT and Finance answer the same questions all day: "how much parental leave do I get?", "can I expense a monitor?".</li>
        <li>The policy wiki is long, partly out of date, and some pages are for managers only.</li>
        <li>Employees guess, and get it wrong.</li>
      </ul>

      <h2>2. Requirements</h2>
      <ul>
        <li><b>Must do:</b> answer from company documents only, cite the source page, say "I don't know" when the documents don't cover it.</li>
        <li><b>Must respect permissions:</b> a manager-only page never reaches an employee.</li>
        <li><b>How well:</b> under 5 seconds, documents change weekly, cheap per question.</li>
      </ul>

      <h2>3. Architecture</h2>
      <CaseAArchitecture />
      <ul>
        <li><b>Ingest lane:</b> parse, chunk, embed, store. Each chunk keeps the access groups of its page.</li>
        <li><b>Answer lane:</b> search only the chunks this user may see, combine keyword and vector search, rerank, answer with citations.</li>
        <li><b>Two guards:</b> one on the question going in, one on the answer coming out.</li>
      </ul>

      <h2>4. Deep dive</h2>
      <ul>
        <li><b>Permissions:</b> filter inside the search query, never after. Re-sync access when a group changes.</li>
        <li><b>Freshness:</b> re-index only changed pages (by content hash) and show "last updated" on each citation.</li>
        <li><b>A bad answer:</b> ask three questions in order. Is it in the documents? Was it retrieved? Was it used faithfully?</li>
        <li><b>Evals:</b> was the right page in the top results, plus a faithfulness judge, on a golden set of real employee questions.</li>
        <li><b>Safety:</b> a poisoned wiki page is an injection through retrieved content, so screen chunks before the model reads them.</li>
        <li><b>Cost and speed:</b> semantic cache for frequent questions, never shared across permission groups. Stream the answer.</li>
      </ul>

      <h2>5. Why this shape</h2>
      <ul>
        <li>Nothing here needs to act, so there are no tools and no agent loop.</li>
        <li>A fixed pipeline is the cheapest, fastest and most predictable answer.</li>
      </ul>
    </>
  );
}
