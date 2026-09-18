import DayNav from "../../../components/DayNav";
import CodeBlock from "../../../components/CodeBlock";
import LabNav from "./LabNav";
import RecipeBookFrame from "./RecipeBookFrame";

export default function Lab() {
  return (
    <div className="page lab-page">
      <title>Day 10 Lab — Recipe Book</title>
      <DayNav day="day10-routing-global-state" current="lab" />
      <LabNav current="recipe-book" />
      <h1>Day 10 — Lab</h1>

      <p className="callout">
        Go to the root of the repo, open <code>lab-recipe-book</code>, and build in there.
      </p>
      <CodeBlock
        language="bash"
        code={`cd lab-recipe-book
npm install
npm run dev`}
      />
      <p className="callout">
        Every file you need to edit has a TODO comment in it marking what's missing.
      </p>

      <h2>The finished app</h2>
      <div className="demo-result demo-live">
        <p className="demo-result-label">Click through it — this is what you're building</p>
        <RecipeBookFrame />
      </div>

      <h2>Finish today</h2>

      <div className="task">
        <span className="task-num">1</span>
        <div className="task-body">
          <p>Create a favorites context so Home and Favorites read and write the same list.</p>
          <ul className="task-list">
            <li>
              The provider owns the favorited recipes; both routes reach them through a custom
              hook, not through props.
            </li>
          </ul>
        </div>
      </div>

      <div className="task">
        <span className="task-num">2</span>
        <div className="task-body">
          <p>Add a recipe to favorites, and remove it again, from either route.</p>
          <ul className="task-list">
            <li>The button reads "Remove from Favorites" once that recipe is favorited.</li>
            <li>
              <code>/favorites</code> lists the favorited recipes, and shows{" "}
              <code>No favorites yet!</code> when there are none.
            </li>
          </ul>
        </div>
      </div>

      <h2>Take home</h2>

      <div className="task">
        <span className="task-num">3</span>
        <div className="task-body">
          <p>
            The home page renders every recipe in <code>src/data.ts</code>.
          </p>
        </div>
      </div>

      <div className="task">
        <span className="task-num">4</span>
        <div className="task-body">
          <p>Search the home page by recipe name.</p>
          <ul className="task-list">
            <li>Case insensitive, filtering as the user types.</li>
            <li>
              Show <code>No recipes match your search.</code> when nothing matches.
            </li>
          </ul>
        </div>
      </div>

      <div className="task">
        <span className="task-num">5</span>
        <div className="task-body">
          <p>The details page shows one recipe.</p>
          <ul className="task-list">
            <li>Its name, its ingredients, its instructions, and a back button to the list.</li>
          </ul>
        </div>
      </div>

    </div>
  );
}
