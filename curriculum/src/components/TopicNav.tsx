import { Link } from "react-router-dom";
import { findWeekByDaySlug, topicPartHref } from "../curriculum";

// DayNav lists a day's five fixed pages; a multi-page topic (see "Full SQL") has its own
// named parts instead, so this is the same .home-nav bar built from that topic's `parts`
// array. Same contract as DayNav: the part list comes from curriculum.ts, never from the
// calling page, so a part that hasn't been declared can't be linked to by accident.
export default function TopicNav({
  day,
  topic,
  current,
}: {
  day: string;
  topic: string;
  current: string;
}) {
  const week = findWeekByDaySlug(day);
  const parts = week?.days.find((d) => d.slug === day)?.topics?.find((t) => t.slug === topic)?.parts ?? [];

  return (
    <p className="home-nav">
      <Link to="/">← Curriculum Home</Link>
      {parts.map((part) => (
        <span key={part.slug}>
          {" · "}
          {part.slug === current ? (
            <strong>{part.title}</strong>
          ) : (
            <Link to={topicPartHref(week!.slug, day, topic, part.slug)}>{part.title}</Link>
          )}
        </span>
      ))}
    </p>
  );
}
