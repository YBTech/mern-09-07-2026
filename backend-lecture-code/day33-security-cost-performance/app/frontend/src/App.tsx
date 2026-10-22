import { useEffect, useState } from "react";
import Feed from "./Feed";
import Assistant from "./Assistant";
import Invoices from "./Invoices";
import { ExplainProvider, useExplain } from "./Explain";
import type { DemoInfo, Mode } from "./types";

// ═══ The page is chosen by the address after the #:  #/  or  #/translate/vulnerable  or  #/translate/safe ═══
function useRoute() {
  const [hash, setHash] = useState(window.location.hash || "#/");
  useEffect(() => {
    const onChange = () => setHash(window.location.hash || "#/");
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  const [, demoId, mode] = hash.split("/");
  return { demoId, mode: mode as Mode | undefined };
}

export default function App() {
  return (
    <ExplainProvider>
      <Shell />
    </ExplainProvider>
  );
}

function Shell() {
  const { explain, toggle } = useExplain();
  const [demos, setDemos] = useState<DemoInfo[]>([]);
  const [model, setModel] = useState("");
  const { demoId, mode } = useRoute();

  useEffect(() => {
    fetch("/api/demos")
      .then((response) => response.json())
      .then((data) => {
        setDemos(data.demos);
        setModel(data.model);
      });
  }, []);

  const demo = demos.find((d) => d.id === demoId);

  return (
    <div className="app">
      <header className={explain ? "" : "quiet"}>
        {explain && <a href="#/" className="home-link">Prompt injection demos</a>}
        <span className="header-right">
          {explain && <span className="badge">model: {model}</span>}
          <button className="ghost toggle" onClick={toggle}>{explain ? "🙈 Hide explanations" : "👁 Show explanations"}</button>
        </span>
      </header>
      {demo && (mode === "vulnerable" || mode === "safe") ? (
        <DemoApp key={`${demo.id}-${mode}`} demo={demo} mode={mode} />
      ) : (
        <Home demos={demos} />
      )}
    </div>
  );
}

function Home({ demos }: { demos: DemoInfo[] }) {
  return (
    <div>
      <p className="intro">
        Each demo is a small AI feature. The <b className="bad-text">vulnerable</b> page has the bug, the <b className="good-text">safe</b> page has the fix. Both call the real model, with the same
        input.
      </p>
      {demos.map((demo, index) => (
        <div className="card" key={demo.id}>
          <h2>{index + 1}. {demo.title}</h2>
          <p>{demo.story}</p>
          <div className="row">
            <a className="btn bad" href={`#/${demo.id}/vulnerable`}>Open the vulnerable page</a>
            <a className="btn good" href={`#/${demo.id}/safe`}>Open the safe page</a>
          </div>
        </div>
      ))}
    </div>
  );
}

// Each demo is its own little app. The page for a demo is chosen by its id.
function DemoApp({ demo, mode }: { demo: DemoInfo; mode: Mode }) {
  if (demo.id === "translate") return <Feed demo={demo} mode={mode} />;
  if (demo.id === "invoice") return <Invoices demo={demo} mode={mode} />;
  return <Assistant demo={demo} mode={mode} />;
}
