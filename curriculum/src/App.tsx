import { Navigate, Routes, Route } from "react-router-dom";
import Home from "./Home";

import IdeShortcuts from "./general/IdeShortcuts";
import CommonSense from "./general/CommonSense";
import EvaluationQuestions from "./evaluation-question-list/EvaluationQuestions";

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

import D9Lecture from "./week2/day9-side-effects-data-fetching/lecture/Lecture";
import D9Notes from "./week2/day9-side-effects-data-fetching/Notes";
import D9Practice from "./week2/day9-side-effects-data-fetching/Practice";
import D9Concepts from "./week2/day9-side-effects-data-fetching/Concepts";
import D9Lab from "./week2/day9-side-effects-data-fetching/Lab";

import D10Lecture from "./week2/day10-routing-global-state/lecture/Lecture";
import D10Notes from "./week2/day10-routing-global-state/Notes";
import D10Practice from "./week2/day10-routing-global-state/Practice";
import D10Concepts from "./week2/day10-routing-global-state/Concepts";
import D10Lab from "./week2/day10-routing-global-state/Lab/Lab";
import D10LabProblems from "./week2/day10-routing-global-state/Lab/LabLegacy";

import D11Lecture from "./week3/day11-node-express/lecture/Lecture";
import D11Notes from "./week3/day11-node-express/Notes";
import D11Practice from "./week3/day11-node-express/Practice";
import D11Concepts from "./week3/day11-node-express/Concepts";
import D11Lab from "./week3/day11-node-express/Lab";

import D12Lecture from "./week3/day12-relational-databases/lecture/Lecture";
import D12Notes from "./week3/day12-relational-databases/Notes";
import D12Practice from "./week3/day12-relational-databases/Practice";
import D12Concepts from "./week3/day12-relational-databases/Concepts";
import D12Lab from "./week3/day12-relational-databases/Lab";

import D13Lecture from "./week3/day13-layered-architecture/lecture/Lecture";
import D13Notes from "./week3/day13-layered-architecture/Notes";
import D13Practice from "./week3/day13-layered-architecture/Practice";
import D13Concepts from "./week3/day13-layered-architecture/Concepts";
import D13Lab from "./week3/day13-layered-architecture/Lab";
import D14Lecture from "./week3/day14-database-performance/Lecture";
import D14Notes from "./week3/day14-database-performance/Notes";
import D14Concepts from "./week3/day14-database-performance/Concepts";
import D15Lecture from "./week3/day15-aws-deployment/lecture/Lecture";
import D15Notes from "./week3/day15-aws-deployment/Notes";
import D15Concepts from "./week3/day15-aws-deployment/Concepts";

import FullSqlFoundation from "./week3/additional-backend-topics/full-sql/Foundation";
import FullSqlQueryOptimization from "./week3/additional-backend-topics/full-sql/QueryOptimization";
import FullSqlScaling from "./week3/additional-backend-topics/full-sql/ScalingAndThroughput";
import FullSqlSchemaDesign from "./week3/additional-backend-topics/full-sql/SchemaDesign";
import FullSqlVsNosql from "./week3/additional-backend-topics/full-sql/SqlVsNosql";

import NodeEventLoopNotes from "./week3/additional-backend-topics/node-event-loop-deep-dive/Notes";
import NodeEventLoopConcepts from "./week3/additional-backend-topics/node-event-loop-deep-dive/Concepts";

import D16Lecture from "./week4/day16-auth-security/lecture/Lecture";
import D16Notes from "./week4/day16-auth-security/Notes";
import D16Concepts from "./week4/day16-auth-security/Concepts";
import D16Lab from "./week4/day16-auth-security/Lab";

import D17Lecture from "./week4/day17-microservices/lecture/Lecture";
import D17Notes from "./week4/day17-microservices/Notes";
import D17Concepts from "./week4/day17-microservices/Concepts";
import D17Lab from "./week4/day17-microservices/Lab";

import D18Lecture from "./week4/day18-event-driven-architecture/lecture/Lecture";
import D18Notes from "./week4/day18-event-driven-architecture/Notes";
import D18Concepts from "./week4/day18-event-driven-architecture/Concepts";
import D18Lab from "./week4/day18-event-driven-architecture/Lab";

import D19Lecture from "./week4/day19-realtime-graphql/lecture/Lecture";
import D19GraphqlDemo from "./week4/day19-realtime-graphql/lecture/GraphqlDemo";
import D19RealtimeDemo from "./week4/day19-realtime-graphql/lecture/RealtimeDemo";
import D19GraphqlNotes from "./week4/day19-realtime-graphql/Notes/Graphql";
import D19RealtimeNotes from "./week4/day19-realtime-graphql/Notes/Realtime";
import D19Concepts from "./week4/day19-realtime-graphql/Concepts";
import D20Lecture from "./week4/day20-system-design/lecture/Lecture";
import D20Notes from "./week4/day20-system-design/Notes";
import D20Concepts from "./week4/day20-system-design/Concepts";
import D21Lecture from "./week5/day21-testing-code-quality/lecture/Lecture";
import D21Notes from "./week5/day21-testing-code-quality/Notes";
import D21Concepts from "./week5/day21-testing-code-quality/Concepts";
import D22Lecture from "./week5/day22-ci-cd/lecture/Lecture";
import D22Notes from "./week5/day22-ci-cd/Notes";
import D22Concepts from "./week5/day22-ci-cd/Concepts";
import D23Lecture from "./week5/day23-monitoring/lecture/Lecture";
import D23Notes from "./week5/day23-monitoring/Notes";
import D23Concepts from "./week5/day23-monitoring/Concepts";

import D24Lecture from "./week5/day24-agile-sdlc/lecture/Lecture";
import D24Notes from "./week5/day24-agile-sdlc/Notes";
import D24Concepts from "./week5/day24-agile-sdlc/Concepts";

import D25Lecture from "./week5/day25-backend-review/lecture/Lecture";
import D25Notes from "./week5/day25-backend-review/Notes";

import Ai26Lecture from "./ai-training/day26-ai-overview-coding-tools/lecture/Lecture";
import Ai26Notes from "./ai-training/day26-ai-overview-coding-tools/Notes";
import Ai26Concepts from "./ai-training/day26-ai-overview-coding-tools/Concepts";

import Ai27Lecture from "./ai-training/day27-llm-prompts-sdk/lecture/Lecture";
import Ai27Notes from "./ai-training/day27-llm-prompts-sdk/Notes";
import Ai27Concepts from "./ai-training/day27-llm-prompts-sdk/Concepts";
import Ai28Lab from "./ai-training/day27-llm-prompts-sdk/Lab";

import Ai28Lecture from "./ai-training/day28-tools-mcp-agent-loop/lecture/Lecture";
import Ai28Notes from "./ai-training/day28-tools-mcp-agent-loop/Notes";
import Ai28Concepts from "./ai-training/day28-tools-mcp-agent-loop/Concepts";
import Ai28DayLab from "./ai-training/day28-tools-mcp-agent-loop/Lab";

import Ai29Lecture from "./ai-training/day29-rag-vector-databases/lecture/Lecture";
import Ai29Notes from "./ai-training/day29-rag-vector-databases/Notes";
import Ai29Concepts from "./ai-training/day29-rag-vector-databases/Concepts";

import Ai30Lecture from "./ai-training/day30-workflows-agents-context/lecture/Lecture";
import Ai30Demo from "./ai-training/day30-workflows-agents-context/lecture/DemoPage";
import Ai30Notes from "./ai-training/day30-workflows-agents-context/Notes";
import Ai30Concepts from "./ai-training/day30-workflows-agents-context/Concepts";

import Ai31Lecture from "./ai-training/day31-langchain-langgraph/lecture/Lecture";
import Ai31Notes from "./ai-training/day31-langchain-langgraph/Notes";
import Ai31Concepts from "./ai-training/day31-langchain-langgraph/Concepts";

import Ai32Lecture from "./ai-training/day32-evaluation-observability/lecture/Lecture";
import Ai32Notes from "./ai-training/day32-evaluation-observability/Notes";
import Ai32Concepts from "./ai-training/day32-evaluation-observability/Concepts";
import Ai33Lecture from "./ai-training/day33-security-cost-performance/lecture/Lecture";
import Ai33Notes from "./ai-training/day33-security-cost-performance/Notes";
import Ai33Concepts from "./ai-training/day33-security-cost-performance/Concepts";
import Ai34Lecture from "./ai-training/day34-ai-system-design/lecture/Lecture";
import Ai34Notes from "./ai-training/day34-ai-system-design/Notes";
import Ai34Concepts from "./ai-training/day34-ai-system-design/Concepts";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/week1/day1-html-css-dom/lecture" element={<D1Lecture />} />
      <Route path="/week1/day1-html-css-dom/notes" element={<D1Notes />} />
      <Route
        path="/week1/day1-html-css-dom/practice"
        element={<D1Practice />}
      />
      <Route
        path="/week1/day1-html-css-dom/concepts"
        element={<D1Concepts />}
      />
      <Route path="/week1/day1-html-css-dom/lab" element={<D1Lab />} />

      <Route
        path="/week1/day2-typescript-core/lecture"
        element={<D2Lecture />}
      />
      <Route path="/week1/day2-typescript-core/notes" element={<D2Notes />} />
      <Route
        path="/week1/day2-typescript-core/practice"
        element={<D2Practice />}
      />
      <Route
        path="/week1/day2-typescript-core/concepts"
        element={<D2Concepts />}
      />
      <Route path="/week1/day2-typescript-core/lab" element={<D2Lab />} />

      <Route
        path="/week1/day3-javascript-core/lecture"
        element={<D3Lecture />}
      />
      <Route path="/week1/day3-javascript-core/notes" element={<D3Notes />} />
      <Route
        path="/week1/day3-javascript-core/practice"
        element={<D3Practice />}
      />
      <Route
        path="/week1/day3-javascript-core/concepts"
        element={<D3Concepts />}
      />
      <Route path="/week1/day3-javascript-core/lab" element={<D3Lab />} />

      <Route path="/week1/day4-js-functions/lecture" element={<D4Lecture />} />
      <Route path="/week1/day4-js-functions/notes" element={<D4Notes />} />
      <Route
        path="/week1/day4-js-functions/practice"
        element={<D4Practice />}
      />
      <Route
        path="/week1/day4-js-functions/concepts"
        element={<D4Concepts />}
      />
      <Route path="/week1/day4-js-functions/lab" element={<D4Lab />} />

      <Route path="/week1/day5-promises-apis/lecture" element={<D5Lecture />} />
      <Route path="/week1/day5-promises-apis/notes" element={<D5Notes />} />
      <Route
        path="/week1/day5-promises-apis/practice"
        element={<D5Practice />}
      />
      <Route
        path="/week1/day5-promises-apis/concepts"
        element={<D5Concepts />}
      />
      <Route path="/week1/day5-promises-apis/lab" element={<D5Lab />} />

      <Route
        path="/week2/day6-components-basics/lecture"
        element={<D6Lecture />}
      />
      <Route path="/week2/day6-components-basics/notes" element={<D6Notes />} />
      <Route
        path="/week2/day6-components-basics/practice"
        element={<D6Practice />}
      />
      <Route
        path="/week2/day6-components-basics/concepts"
        element={<D6Concepts />}
      />
      <Route path="/week2/day6-components-basics/lab" element={<D6Lab />} />

      <Route
        path="/week2/day7-state-interactivity/lecture"
        element={<D7Lecture />}
      />
      <Route
        path="/week2/day7-state-interactivity/notes"
        element={<D7Notes />}
      />
      <Route
        path="/week2/day7-state-interactivity/practice"
        element={<D7Practice />}
      />
      <Route
        path="/week2/day7-state-interactivity/concepts"
        element={<D7Concepts />}
      />
      <Route path="/week2/day7-state-interactivity/lab" element={<D7Lab />} />

      <Route path="/week2/day8-inputs-forms/lecture" element={<D8Lecture />} />
      <Route path="/week2/day8-inputs-forms/notes" element={<D8Notes />} />
      <Route
        path="/week2/day8-inputs-forms/practice"
        element={<D8Practice />}
      />
      <Route
        path="/week2/day8-inputs-forms/concepts"
        element={<D8Concepts />}
      />
      <Route path="/week2/day8-inputs-forms/lab" element={<D8Lab />} />

      <Route
        path="/week2/day9-side-effects-data-fetching/lecture"
        element={<D9Lecture />}
      />
      <Route
        path="/week2/day9-side-effects-data-fetching/notes"
        element={<D9Notes />}
      />
      <Route
        path="/week2/day9-side-effects-data-fetching/practice"
        element={<D9Practice />}
      />
      <Route
        path="/week2/day9-side-effects-data-fetching/concepts"
        element={<D9Concepts />}
      />
      <Route
        path="/week2/day9-side-effects-data-fetching/lab"
        element={<D9Lab />}
      />

      <Route
        path="/week2/day10-routing-global-state/lecture"
        element={<D10Lecture />}
      />
      <Route
        path="/week2/day10-routing-global-state/notes"
        element={<D10Notes />}
      />
      <Route
        path="/week2/day10-routing-global-state/practice"
        element={<D10Practice />}
      />
      <Route
        path="/week2/day10-routing-global-state/concepts"
        element={<D10Concepts />}
      />
      <Route
        path="/week2/day10-routing-global-state/lab"
        element={<D10Lab />}
      />
      <Route
        path="/week2/day10-routing-global-state/lab/problem-set"
        element={<D10LabProblems />}
      />

      <Route
        path="/week3/day11-node-express/lecture"
        element={<D11Lecture />}
      />
      <Route path="/week3/day11-node-express/notes" element={<D11Notes />} />
      <Route
        path="/week3/day11-node-express/practice"
        element={<D11Practice />}
      />
      <Route
        path="/week3/day11-node-express/concepts"
        element={<D11Concepts />}
      />
      <Route path="/week3/day11-node-express/lab" element={<D11Lab />} />

      <Route
        path="/week3/day12-relational-databases/lecture"
        element={<D12Lecture />}
      />
      <Route
        path="/week3/day12-relational-databases/notes"
        element={<D12Notes />}
      />
      <Route
        path="/week3/day12-relational-databases/practice"
        element={<D12Practice />}
      />
      <Route
        path="/week3/day12-relational-databases/concepts"
        element={<D12Concepts />}
      />
      <Route
        path="/week3/day12-relational-databases/lab"
        element={<D12Lab />}
      />

      <Route
        path="/week3/day13-layered-architecture/lecture"
        element={<D13Lecture />}
      />
      <Route
        path="/week3/day13-layered-architecture/notes"
        element={<D13Notes />}
      />
      <Route
        path="/week3/day13-layered-architecture/practice"
        element={<D13Practice />}
      />
      <Route
        path="/week3/day13-layered-architecture/concepts"
        element={<D13Concepts />}
      />
      <Route
        path="/week3/day13-layered-architecture/lab"
        element={<D13Lab />}
      />

      <Route
        path="/week3/day14-database-performance/lecture"
        element={<D14Lecture />}
      />
      <Route
        path="/week3/day14-database-performance/notes"
        element={<D14Notes />}
      />
      <Route
        path="/week3/day14-database-performance/concepts"
        element={<D14Concepts />}
      />

      <Route
        path="/week3/day15-aws-deployment/lecture"
        element={<D15Lecture />}
      />
      <Route
        path="/week3/day15-aws-deployment/notes"
        element={<D15Notes />}
      />
      <Route
        path="/week3/day15-aws-deployment/concepts"
        element={<D15Concepts />}
      />

      <Route
        path="/week3/additional-backend-topics/full-sql/foundation"
        element={<FullSqlFoundation />}
      />
      <Route
        path="/week3/additional-backend-topics/full-sql/query-optimization"
        element={<FullSqlQueryOptimization />}
      />
      <Route
        path="/week3/additional-backend-topics/full-sql/scaling-and-throughput"
        element={<FullSqlScaling />}
      />
      <Route
        path="/week3/additional-backend-topics/full-sql/schema-design"
        element={<FullSqlSchemaDesign />}
      />
      <Route
        path="/week3/additional-backend-topics/full-sql/sql-vs-nosql"
        element={<FullSqlVsNosql />}
      />

      <Route
        path="/week3/additional-backend-topics/node-event-loop-deep-dive/notes"
        element={<NodeEventLoopNotes />}
      />
      <Route
        path="/week3/additional-backend-topics/node-event-loop-deep-dive/concepts"
        element={<NodeEventLoopConcepts />}
      />

      <Route
        path="/week4/day16-auth-security/lecture"
        element={<D16Lecture />}
      />
      <Route path="/week4/day16-auth-security/notes" element={<D16Notes />} />
      <Route
        path="/week4/day16-auth-security/concepts"
        element={<D16Concepts />}
      />
      <Route path="/week4/day16-auth-security/lab" element={<D16Lab />} />

      <Route
        path="/week4/day17-microservices/lecture"
        element={<D17Lecture />}
      />
      <Route path="/week4/day17-microservices/notes" element={<D17Notes />} />
      <Route
        path="/week4/day17-microservices/concepts"
        element={<D17Concepts />}
      />
      <Route path="/week4/day17-microservices/lab" element={<D17Lab />} />

      <Route path="/week4/day18-event-driven-architecture/lecture" element={<D18Lecture />} />
      <Route path="/week4/day18-event-driven-architecture/notes" element={<D18Notes />} />
      <Route path="/week4/day18-event-driven-architecture/concepts" element={<D18Concepts />} />
      <Route path="/week4/day18-event-driven-architecture/lab" element={<D18Lab />} />

      <Route path="/week4/day19-realtime-graphql/lecture" element={<D19Lecture />} />
      <Route path="/week4/day19-realtime-graphql/lecture/graphql" element={<D19GraphqlDemo />} />
      <Route path="/week4/day19-realtime-graphql/lecture/realtime" element={<D19RealtimeDemo />} />
      <Route path="/week4/day19-realtime-graphql/notes" element={<Navigate to="/week4/day19-realtime-graphql/notes/graphql" replace />} />
      <Route path="/week4/day19-realtime-graphql/notes/graphql" element={<D19GraphqlNotes />} />
      <Route path="/week4/day19-realtime-graphql/notes/realtime" element={<D19RealtimeNotes />} />
      <Route path="/week4/day19-realtime-graphql/concepts" element={<D19Concepts />} />

      <Route path="/week4/day20-system-design/lecture" element={<D20Lecture />} />
      <Route path="/week4/day20-system-design/notes" element={<D20Notes />} />
      <Route path="/week4/day20-system-design/concepts" element={<D20Concepts />} />
      <Route path="/week5/day21-testing-code-quality/lecture" element={<D21Lecture />} />
      <Route path="/week5/day21-testing-code-quality/notes" element={<D21Notes />} />
      <Route path="/week5/day21-testing-code-quality/concepts" element={<D21Concepts />} />
      <Route path="/week5/day22-ci-cd/lecture" element={<D22Lecture />} />
      <Route path="/week5/day22-ci-cd/notes" element={<D22Notes />} />
      <Route path="/week5/day22-ci-cd/concepts" element={<D22Concepts />} />
      <Route path="/week5/day23-monitoring/lecture" element={<D23Lecture />} />
      <Route path="/week5/day23-monitoring/notes" element={<D23Notes />} />
      <Route path="/week5/day23-monitoring/concepts" element={<D23Concepts />} />

      <Route path="/week5/day24-agile-sdlc/lecture" element={<D24Lecture />} />
      <Route path="/week5/day24-agile-sdlc/notes" element={<D24Notes />} />
      <Route path="/week5/day24-agile-sdlc/concepts" element={<D24Concepts />} />

      <Route path="/week5/day25-backend-review/lecture" element={<D25Lecture />} />
      <Route path="/week5/day25-backend-review/notes" element={<D25Notes />} />

      <Route path="/ai-training/day26-ai-overview-coding-tools/lecture" element={<Ai26Lecture />} />
      <Route path="/ai-training/day26-ai-overview-coding-tools/notes" element={<Ai26Notes />} />
      <Route path="/ai-training/day26-ai-overview-coding-tools/concepts" element={<Ai26Concepts />} />

      <Route path="/ai-training/day27-llm-prompts-sdk/lecture" element={<Ai27Lecture />} />
      <Route path="/ai-training/day27-llm-prompts-sdk/notes" element={<Ai27Notes />} />
      <Route path="/ai-training/day27-llm-prompts-sdk/concepts" element={<Ai27Concepts />} />
      <Route path="/ai-training/day27-llm-prompts-sdk/lab" element={<Ai28Lab />} />

      <Route path="/ai-training/day28-tools-mcp-agent-loop/lecture" element={<Ai28Lecture />} />
      <Route path="/ai-training/day28-tools-mcp-agent-loop/notes" element={<Ai28Notes />} />
      <Route path="/ai-training/day28-tools-mcp-agent-loop/concepts" element={<Ai28Concepts />} />
      <Route path="/ai-training/day28-tools-mcp-agent-loop/lab" element={<Ai28DayLab />} />

      <Route path="/ai-training/day29-rag-vector-databases/lecture" element={<Ai29Lecture />} />
      <Route path="/ai-training/day29-rag-vector-databases/notes" element={<Ai29Notes />} />
      <Route path="/ai-training/day29-rag-vector-databases/concepts" element={<Ai29Concepts />} />

      <Route path="/ai-training/day30-workflows-agents-context/lecture" element={<Ai30Lecture />} />
      <Route path="/ai-training/day30-workflows-agents-context/lecture/:demo" element={<Ai30Demo />} />
      <Route path="/ai-training/day30-workflows-agents-context/notes" element={<Ai30Notes />} />
      <Route path="/ai-training/day30-workflows-agents-context/concepts" element={<Ai30Concepts />} />
      <Route path="/ai-training/day31-langchain-langgraph/lecture" element={<Ai31Lecture />} />
      <Route path="/ai-training/day31-langchain-langgraph/notes" element={<Ai31Notes />} />
      <Route path="/ai-training/day31-langchain-langgraph/concepts" element={<Ai31Concepts />} />
      <Route path="/ai-training/day32-evaluation-observability/lecture" element={<Ai32Lecture />} />
      <Route path="/ai-training/day32-evaluation-observability/notes" element={<Ai32Notes />} />
      <Route path="/ai-training/day32-evaluation-observability/concepts" element={<Ai32Concepts />} />
      <Route path="/ai-training/day33-security-cost-performance/lecture" element={<Ai33Lecture />} />
      <Route path="/ai-training/day33-security-cost-performance/notes" element={<Ai33Notes />} />
      <Route path="/ai-training/day33-security-cost-performance/concepts" element={<Ai33Concepts />} />
      <Route path="/ai-training/day34-ai-system-design/lecture" element={<Ai34Lecture />} />
      <Route path="/ai-training/day34-ai-system-design/notes" element={<Ai34Notes />} />
      <Route path="/ai-training/day34-ai-system-design/concepts" element={<Ai34Concepts />} />

      {/* General Notes */}
      <Route path="/general/ide-shortcuts" element={<IdeShortcuts />} />
      <Route path="/general/common-sense" element={<CommonSense />} />
      <Route path="/evaluation-questions" element={<EvaluationQuestions />} />
    </Routes>
  );
}

export default App;
