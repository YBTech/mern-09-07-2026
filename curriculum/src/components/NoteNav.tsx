import { Link } from "react-router-dom";
import LangToggle from "./LangToggle";

// DayNav lists a day's sibling pages; a general note has no siblings, so this is the same
// .home-nav bar reduced to "back to the index · this note's title".
export default function NoteNav({ title }: { title: string }) {
  return (
    <p className="home-nav">
      <LangToggle />
      <Link to="/">← Curriculum Home</Link>
      {" · "}
      <strong>{title}</strong>
    </p>
  );
}
