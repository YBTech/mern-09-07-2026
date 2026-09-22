import { Link } from "react-router-dom";
import { PAGE_LABELS, findWeekByDaySlug, pageHref, topicPageHref, type PageKind } from "../curriculum";

// The nav bar at the top of every day page: back to the index, then that day's sibling
// pages. Which pages a day actually has, and which week it belongs to, both come from
// curriculum.ts — so a day that has no lab yet never renders a dead "Lab" link, and a
// caller only has to say which day and which page it is.
//
// A page that belongs to a topic nested under a topic-group day (see day 10) also passes
// `topic`, so the siblings shown are that topic's own pages, not the (empty) day-level ones.
export default function DayNav({
  day,
  topic,
  current,
}: {
  day: string;
  topic?: string;
  current: PageKind;
}) {
  const week = findWeekByDaySlug(day);
  const dayObj = week?.days.find((d) => d.slug === day);
  const pages = topic ? dayObj?.topics?.find((t) => t.slug === topic)?.pages ?? [] : dayObj?.pages ?? [];

  return (
    <p className="home-nav">
      <Link to="/">← Curriculum Home</Link>
      {pages.map((page) => (
        <span key={page}>
          {" · "}
          {page === current ? (
            <strong>{PAGE_LABELS[page]}</strong>
          ) : (
            <Link to={topic ? topicPageHref(week!.slug, day, topic, page) : pageHref(week!.slug, day, page)}>
              {PAGE_LABELS[page]}
            </Link>
          )}
        </span>
      ))}
    </p>
  );
}
