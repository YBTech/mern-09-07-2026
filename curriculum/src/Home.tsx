import { Link } from "react-router-dom";
import {
  GENERAL_NOTES,
  PAGE_LABELS,
  WEEKS,
  pageHref,
  type Day,
  type Week,
} from "./curriculum";

function DayRow({ week, day }: { week: Week; day: Day }) {
  return (
    <li>
      <strong>
        Day {day.number} — {day.title}
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
