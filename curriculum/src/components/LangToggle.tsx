import { En, Zh } from "./Lang";

export default function LangToggle() {
  const toggle = () => {
    const next = document.documentElement.lang === "zh" ? "en" : "zh";
    document.documentElement.lang = next;
    try { localStorage.setItem("lang", next); } catch { /* private mode — fine */ }
  };
  return (
    <button className="lang-toggle" onClick={toggle} title="Switch language / 切换语言">
      <En>中文</En><Zh>English</Zh>
    </button>
  );
}
