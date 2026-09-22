import { Link } from "react-router-dom";
import {
  GENERAL_NOTES,
  PAGE_LABELS,
  WEEKS,
  dayNumber,
  pageHref,
  topicPageHref,
  topicPartHref,
  type Day,
  type Topic,
  type Week,
} from "./curriculum";

// A topic split across several named pages rather than the usual notes/practice/concepts
// trio: each part is listed under its group heading ("Foundation" / "Advanced") with its
// own one-line blurb, since the titles alone don't say what's on them.
function TopicParts({ week, day, topic }: { week: Week; day: Day; topic: Topic }) {
  const groups = [...new Set(topic.parts!.map((p) => p.group))];

  return (
    <ul>
      {groups.map((group) => (
        <li key={group}>
          <em>{group}</em>
          <ul>
            {topic.parts!
              .filter((p) => p.group === group)
              .map((part) => (
                <li key={part.slug}>
                  <Link to={topicPartHref(week.slug, day.slug, topic.slug, part.slug)}>
                    {part.title}
                  </Link>
                  <br />
                  <span className="not-built">{part.blurb}</span>
                </li>
              ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

function DayRow({ week, day }: { week: Week; day: Day }) {
  if (day.topics) {
    return (
      <li>
        <strong>{day.title}</strong>
        <ul>
          {day.topics.map((topic) => (
            <li key={topic.slug}>
              {topic.title}
              <br />
              {topic.parts ? (
                <TopicParts week={week} day={day} topic={topic} />
              ) : topic.pages.length > 0 ? (
                topic.pages.map((page, i) => (
                  <span key={page}>
                    {i > 0 && " · "}
                    <Link to={topicPageHref(week.slug, day.slug, topic.slug, page)}>
                      {PAGE_LABELS[page]}
                    </Link>
                  </span>
                ))
              ) : (
                <span className="not-built">Not yet built</span>
              )}
            </li>
          ))}
        </ul>
      </li>
    );
  }

  return (
    <li>
      <strong>
        Day {dayNumber(day)} — {day.title}
      </strong>
      <br />
      {day.pages.length > 0 ? (
        day.pages.map((page, i) => (
          <span key={page}>
            {i > 0 && " · "}
            <Link to={pageHref(week.slug, day.slug, page)}>
              {PAGE_LABELS[page]}
            </Link>
          </span>
        ))
      ) : (
        <span className="not-built">Not yet built</span>
      )}
    </li>
  );
}

export default function Home() {
  return (
    <div className="page home-page">
      <title>MERN + AI Curriculum</title>
      <h1>MERN + AI Curriculum</h1>
      {WEEKS.map((week) => (
        <section key={week.slug}>
          <h2>
            Week {week.number}: {week.title}
          </h2>
          <ul>
            {week.days.map((day) => (
              <DayRow key={day.slug} week={week} day={day} />
            ))}
          </ul>
        </section>
      ))}

      <section>
        <h2>General Notes</h2>
        <ul>
          {GENERAL_NOTES.map((note) => (
            <li key={note.slug}>
              <strong>
                <Link to={`/general/${note.slug}`}>{note.title}</Link>
              </strong>
              <br />
              <span className="not-built">{note.blurb}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
