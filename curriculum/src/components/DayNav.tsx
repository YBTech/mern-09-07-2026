import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  PAGE_LABELS,
  findWeekByDaySlug,
  pageHref,
  topicPageHref,
  topicPartHref,
  type PageKind,
} from "../curriculum";
import { En, Zh } from "./Lang";

// The one nav bar for every page in the app: sticky at the top, with the language toggle
// on the right. Every link list is built from curriculum.ts, never from the calling page,
// so a page that isn't declared there can't be linked to (and a day with no lab never
// renders a dead "Lab" link).
//
// Five call shapes, one per kind of page:
//
//   <DayNav day="day3-javascript-core" current="notes" />            a day's five pages
//   <DayNav day="additional-…" topic="…" current="notes" />          a nested topic's pages
//   <DayNav day="additional-…" topic="full-sql" part="…" />          a multi-part topic's parts
//   <DayNav title="IDE Shortcuts" />                                 a standalone note
//   <DayNav />                                                       the home page (toggle only)
type Props =
  | { day: string; current: PageKind; topic?: string; part?: never; title?: never }
  | { day: string; topic: string; part: string; current?: never; title?: never }
  | { title: string; day?: never; topic?: never; current?: never; part?: never }
  | { day?: never; topic?: never; current?: never; part?: never; title?: never };

type Item = { key: string; label: string; href?: string };

function navItems(props: Props): Item[] | null {
  const { day, topic, current, part, title } = props;

  if (day !== undefined) {
    const week = findWeekByDaySlug(day);
    const dayObj = week?.days.find((d) => d.slug === day);
    const topicObj = topic ? dayObj?.topics?.find((t) => t.slug === topic) : undefined;

    if (topic !== undefined && part !== undefined) {
      return (topicObj?.parts ?? []).map((p) => ({
        key: p.slug,
        label: p.title,
        href: p.slug === part ? undefined : topicPartHref(week!.slug, day, topic, p.slug),
      }));
    }
    const pages = topic ? (topicObj?.pages ?? []) : (dayObj?.pages ?? []);
    return pages.map((page) => ({
      key: page,
      label: PAGE_LABELS[page],
      href:
        page === current
          ? undefined
          : topic
            ? topicPageHref(week!.slug, day, topic, page)
            : pageHref(week!.slug, day, page),
    }));
  }
  if (title !== undefined) return [{ key: "title", label: title }];
  return null; // home page: nothing to go back to
}

function toggleLang() {
  const next = document.documentElement.lang === "zh" ? "en" : "zh";
  document.documentElement.lang = next;
  try {
    localStorage.setItem("lang", next);
  } catch {
    /* private mode — fine */
  }
}

// Hide the bar after scrolling down a little, bring it back on any real scroll up — the
// usual app behavior. Near the top of the page it's always shown.
const SHOW_NEAR_TOP = 80; // px from the top where the bar never hides
const MIN_DELTA = 8; // ignore tiny jitters (trackpad momentum, sub-pixel scrolls)

function useHideOnScrollDown() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      if (y < SHOW_NEAR_TOP) setHidden(false);
      else if (y - lastY > MIN_DELTA) setHidden(true);
      else if (lastY - y > MIN_DELTA) setHidden(false);
      else {
        ticking = false;
        return; // too small to count; keep comparing against the same lastY
      }
      lastY = y;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return hidden;
}

export default function DayNav(props: Props) {
  const items = navItems(props);
  const hidden = useHideOnScrollDown();

  return (
    <nav className={hidden ? "home-nav home-nav-hidden" : "home-nav"}>
      {items && (
        <span className="home-nav-links">
          <Link to="/">← Curriculum Home</Link>
          {items.map((item) => (
            <span key={item.key}>
              {" · "}
              {item.href ? <Link to={item.href}>{item.label}</Link> : <strong>{item.label}</strong>}
            </span>
          ))}
        </span>
      )}
      <button className="lang-toggle" onClick={toggleLang} title="Switch language / 切换语言">
        <En>中文</En>
        <Zh>English</Zh>
      </button>
    </nav>
  );
}
