import { Routes, Route } from "react-router-dom";
import Home from "./Home";

import IdeShortcuts from "./general/IdeShortcuts";
import CommonSense from "./general/CommonSense";

import D1Lecture from "./week1/day1-html-css-dom/lecture/Lecture";
import D1Notes from "./week1/day1-html-css-dom/Notes";
import D1Practice from "./week1/day1-html-css-dom/Practice";
import D1Concepts from "./week1/day1-html-css-dom/Concepts";
import D1Lab from "./week1/day1-html-css-dom/Lab";

import D2Lecture from "./week1/day2-typescript-core/lecture/Lecture";
import D2Notes from "./week1/day2-typescript-core/Notes";
import D2Practice from "./week1/day2-typescript-core/Practice";
import D2Concepts from "./week1/day2-typescript-core/Concepts";
import D2Lab from "./week1/day2-typescript-core/Lab";

import D3Lecture from "./week1/day3-javascript-core/lecture/Lecture";
import D3Notes from "./week1/day3-javascript-core/Notes";
import D3Practice from "./week1/day3-javascript-core/Practice";
import D3Concepts from "./week1/day3-javascript-core/Concepts";
import D3Lab from "./week1/day3-javascript-core/Lab";

import D4Lecture from "./week1/day4-js-functions/lecture/Lecture";
import D4Notes from "./week1/day4-js-functions/Notes";
import D4Practice from "./week1/day4-js-functions/Practice";
import D4Concepts from "./week1/day4-js-functions/Concepts";
import D4Lab from "./week1/day4-js-functions/Lab";

import D5Lecture from "./week1/day5-promises-apis/lecture/Lecture";
import D5Notes from "./week1/day5-promises-apis/Notes";
import D5Practice from "./week1/day5-promises-apis/Practice";
import D5Concepts from "./week1/day5-promises-apis/Concepts";
import D5Lab from "./week1/day5-promises-apis/Lab";

import D6Lecture from "./week2/day6-components-basics/lecture/Lecture";
import D6Notes from "./week2/day6-components-basics/Notes";
import D6Practice from "./week2/day6-components-basics/Practice";
import D6Concepts from "./week2/day6-components-basics/Concepts";
import D6Lab from "./week2/day6-components-basics/Lab";

import D7Lecture from "./week2/day7-state-interactivity/lecture/Lecture";
import D7Notes from "./week2/day7-state-interactivity/Notes";
import D7Practice from "./week2/day7-state-interactivity/Practice";
import D7Concepts from "./week2/day7-state-interactivity/Concepts";
import D7Lab from "./week2/day7-state-interactivity/Lab";

import D8Lecture from "./week2/day8-inputs-forms/lecture/Lecture";
import D8Notes from "./week2/day8-inputs-forms/Notes";
import D8Practice from "./week2/day8-inputs-forms/Practice";
import D8Concepts from "./week2/day8-inputs-forms/Concepts";
import D8Lab from "./week2/day8-inputs-forms/Lab";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

    <Route path="/week1/day1-html-css-dom/lecture" element={<D1Lecture />} />
      <Route path="/week1/day1-html-css-dom/notes" element={<D1Notes />} />
      <Route path="/week1/day1-html-css-dom/practice" element={<D1Practice />} />
      <Route path="/week1/day1-html-css-dom/concepts" element={<D1Concepts />} />
      <Route path="/week1/day1-html-css-dom/lab" element={<D1Lab />} />

      <Route path="/week1/day2-typescript-core/lecture" element={<D2Lecture />} />
      <Route path="/week1/day2-typescript-core/notes" element={<D2Notes />} />
      <Route path="/week1/day2-typescript-core/practice" element={<D2Practice />} />
      <Route path="/week1/day2-typescript-core/concepts" element={<D2Concepts />} />
      <Route path="/week1/day2-typescript-core/lab" element={<D2Lab />} />

      <Route path="/week1/day3-javascript-core/lecture" element={<D3Lecture />} />
      <Route path="/week1/day3-javascript-core/notes" element={<D3Notes />} />
      <Route path="/week1/day3-javascript-core/practice" element={<D3Practice />} />
      <Route path="/week1/day3-javascript-core/concepts" element={<D3Concepts />} />
      <Route path="/week1/day3-javascript-core/lab" element={<D3Lab />} />

      <Route path="/week1/day4-js-functions/lecture" element={<D4Lecture />} />
      <Route path="/week1/day4-js-functions/notes" element={<D4Notes />} />
      <Route path="/week1/day4-js-functions/practice" element={<D4Practice />} />
      <Route path="/week1/day4-js-functions/concepts" element={<D4Concepts />} />
      <Route path="/week1/day4-js-functions/lab" element={<D4Lab />} />

      <Route path="/week1/day5-promises-apis/lecture" element={<D5Lecture />} />
      <Route path="/week1/day5-promises-apis/notes" element={<D5Notes />} />
      <Route path="/week1/day5-promises-apis/practice" element={<D5Practice />} />
      <Route path="/week1/day5-promises-apis/concepts" element={<D5Concepts />} />
      <Route path="/week1/day5-promises-apis/lab" element={<D5Lab />} />

      <Route path="/week2/day6-components-basics/lecture" element={<D6Lecture />} />
      <Route path="/week2/day6-components-basics/notes" element={<D6Notes />} />
      <Route path="/week2/day6-components-basics/practice" element={<D6Practice />} />
      <Route path="/week2/day6-components-basics/concepts" element={<D6Concepts />} />
      <Route path="/week2/day6-components-basics/lab" element={<D6Lab />} />

      <Route path="/week2/day7-state-interactivity/lecture" element={<D7Lecture />} />
      <Route path="/week2/day7-state-interactivity/notes" element={<D7Notes />} />
      <Route path="/week2/day7-state-interactivity/practice" element={<D7Practice />} />
      <Route path="/week2/day7-state-interactivity/concepts" element={<D7Concepts />} />
      <Route path="/week2/day7-state-interactivity/lab" element={<D7Lab />} />

      <Route path="/week2/day8-inputs-forms/lecture" element={<D8Lecture />} />
      <Route path="/week2/day8-inputs-forms/notes" element={<D8Notes />} />
      <Route path="/week2/day8-inputs-forms/practice" element={<D8Practice />} />
      <Route path="/week2/day8-inputs-forms/concepts" element={<D8Concepts />} />
      <Route path="/week2/day8-inputs-forms/lab" element={<D8Lab />} />

      {/* General Notes */}
      <Route path="/general/ide-shortcuts" element={<IdeShortcuts />} />
      <Route path="/general/common-sense" element={<CommonSense />} />
    </Routes>
  );
}

export default App;
