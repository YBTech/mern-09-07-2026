import { Compare } from "./Compare";
import { AllRows, BlockingCrunch, FastRerender, FastSearch, SlowRerender, SlowSearch, WindowedRows, WorkerCrunch } from "./InpDemos";

export function InpDemos() {
  return (
    <>
      <h2 className="fe-title">Improving INP: the page reacts slowly</h2>

      <Compare
        title="1 · Typing is blocked by rendering"
        hint="Type quickly in both boxes. Left: the letters lag behind your fingers. Right: they don't."
        before={{
          demo: <SlowSearch />,
          marks: [2, 6],
          code: `const [query, setQuery] = useState("");
const results = search(query);

// every keystroke re-renders all 2,000 rows before the input can update
<input value={query} onChange={(e) => setQuery(e.target.value)} />
<ResultList items={results} />`,
        }}
        after={{
          demo: <FastSearch />,
          marks: [2, 3, 7],
          code: `const [query, setQuery] = useState("");
const deferred = useDeferredValue(query);
const results = useMemo(() => search(deferred), [deferred]);

// the input updates now; the list catches up in the background
<input value={query} onChange={(e) => setQuery(e.target.value)} />
<MemoResultList items={results} />`,
        }}
      />

      <Compare
        title="2 · Re-rendering something that did not change"
        hint="Type a name. The counter shows how many times the gallery re-rendered. (React 19 does not switch on the React Compiler by itself, and this project doesn't, so memo matters here. With the compiler on, React adds it for you.)"
        before={{
          demo: <SlowRerender />,
          marks: [4],
          code: `const [name, setName] = useState("");

<input value={name} onChange={(e) => setName(e.target.value)} />
<Gallery />   // re-renders on every keystroke, though nothing changed`,
        }}
        after={{
          demo: <FastRerender />,
          marks: [1],
          code: `const Gallery = React.memo(GalleryImpl);   // skip when the props are unchanged

const [name, setName] = useState("");

<input value={name} onChange={(e) => setName(e.target.value)} />
<Gallery />   // untouched by typing`,
        }}
      />

      <Compare
        title="3 · Heavy computation on the main thread"
        hint="Click “Crunch numbers”, then watch the ticker and try the Clicks button while it runs."
        before={{
          demo: <BlockingCrunch />,
          marks: [2],
          code: `function run() {
  const result = crunch();   // the whole page waits for this line
  setOut(\`result \${result}\`);
}`,
        }}
        after={{
          demo: <WorkerCrunch />,
          marks: [3, 5],
          code: `function run() {
  const url = new URL("./crunch.worker.ts", import.meta.url);
  const worker = new Worker(url, { type: "module" });
  worker.onmessage = (e) => setOut(\`result \${e.data}\`);
  worker.postMessage(null);   // runs on another thread
}`,
        }}
      />

      <Compare
        title="4 · Thousands of rows in the DOM"
        hint="Mount the list, then scroll. Compare “DOM rows” and the mount time."
        before={{
          demo: <AllRows />,
          marks: [3],
          code: `<div className="scroll">
  {Array.from({ length: 10_000 }, (_, i) => (
    <div key={i}>Row {i + 1}</div>   // 10,000 DOM nodes
  ))}
</div>`,
        }}
        after={{
          demo: <WindowedRows />,
          marks: [5, 6],
          code: `import { FixedSizeList } from "react-window";

// react-window watches the scroll position and renders only the rows on screen
// (here about 8 of the 10,000), swapping rows in and out as you scroll
<FixedSizeList height={168} width="100%" itemCount={10_000} itemSize={24}>
  {({ index, style }) => <div style={style}>Row {index + 1}</div>}
</FixedSizeList>`,
        }}
      />
    </>
  );
}
