// The final-evaluation question bank, transcribed from questions.md with the answers left out.
// A section is one top-level subject (one entry in the page's side tracker); a group is a
// sub-heading inside it. A question is either a plain string, or [question, follow-ups] when
// the source lists sub-points under it — those still count as one question.

export type Question = string | [string, string[]];
export type QuestionGroup = { title?: string; questions: Question[] };
export type QuestionSection = {
  id: string;
  title: string;
  groups: QuestionGroup[];
};

export const EVALUATION_SECTIONS: QuestionSection[] = [
  {
    id: "network-browser",
    title: "Network & Browser",
    groups: [
      {
        questions: [
          "What is the process between you entering a url in the browser and seeing the content on the browser?",
          "What is an IP address?",
          "What is the DNS (Domain Name System)?",
          "What is semantic HTML? Why do we need it?",
          "What is a meta tag?",
          "What are HTML attributes?",
          "What are self-closing (void) elements in HTML? Does <input> need a closing tag?",
          "What is the alt attribute on <img> for?",
          "What is HTML injection and how to avoid it?",
          "How does React JSX automatically sanitize input?",
          [
            "What is the difference between Local storage, session storage, and cookies?",
            ["Ask about the sizes of each", "What’s unique about cookies?"],
          ],
          "What is event bubbling and event capturing?",
          "What is Document Object Model (DOM)? Give some examples of how we select DOM elements using Javascript.",
          "What is the Intersection Observer API? What is it used for?",
        ],
      },
    ],
  },
  {
    id: "styling",
    title: "Styling",
    groups: [
      {
        questions: [
          "What are different types of css selectors? (just give the most common ones)",
          "What is the difference between id and class?",
          "What is CSS specificity? Give examples of which elements have higher specificity.",
          "Why should you avoid using inline styles or !important?",
          "What is the CSS box model? Explain content, border, padding, and margin.",
          "What is box-sizing? What are the differences between border-box and content-box?",
          [
            "What are different positions in CSS?",
            [
              "How do you use static, absolute, fixed, relative, and sticky positioning?",
            ],
          ],
          [
            "How do you approach responsive web design?",
            [
              "What is a media query and what are breakpoints?",
              "How do you ensure responsiveness?",
            ],
          ],
          "What is the difference between Flexbox and css grid?",
          "What is justify-content and align-items in flexbox?",
          "What is the difference between rem, px, and em?",
          "What are CSS modules?",
          "What are CSS Preprocessors? Give 1-2 examples. Can we directly run them in the browser?",
          "Tell me about the basics of tailwind CSS?",
          "What are Component Libraries like Material UI, Chakra, Ant Design?",
          "What are some of the most common design systems for the UI?",
        ],
      },
    ],
  },
  {
    id: "javascript",
    title: "JavaScript Foundations",
    groups: [
      {
        title: "Variables, Scopes & Memory",
        questions: [
          "What is the difference between let, const, and var?",
          "Can you modify the properties of an object declared with const? Why or why not?",
          'Explain the difference between "Pass by Value" and "Pass by Reference" with examples. (aka. primitive vs reference types)',
          "Explain the difference between Global Scope, Function Scope, and Block Scope.",
          'Define "Closure" in your own words. What is its purpose?',
          'What is a "private variable," and how does a closure create one?',
          "What is hoisting?",
          "How could the Global/Window object potentially cause memory leaks in Javascript?",
        ],
      },
      {
        title: "Data Types & Coercion",
        questions: [
          "What are the 7 primitive data types in JavaScript, and how are they stored in memory compared to Objects?",
          "What is the difference between undefined, null, and “not defined”?",
          "What is type coercion? Is it good, how do we deal with it?",
          "Difference between == vs ===, and which one should we use?",
          'Explain the difference between "Pass by Value" and "Pass by Reference" with examples.',
          "Why does [] == [] and {} == {} return false in JavaScript?",
        ],
      },
      {
        title: "Copying & Mutability",
        questions: [
          'How does the "Shallow Copy" differ from a "Deep Copy"? How do you do a shallow copy?',
          "What are the ways to perform deep cloning?",
          "What are the limitations of using JSON.parse(JSON.stringify(obj)) for deep cloning?",
          "What is structuredClone?",
          'Explain the "Spread Operator" (...) and how it behaves when merging objects with conflicting keys.',
        ],
      },
      {
        title: "Operators & Control Flow",
        questions: [
          'What is "Short-circuit evaluation" in Logical Operators (&& and ||)?',
          "Explain the difference between the Logical OR operator (||) and the Nullish Coalescing operator (??).",
          'What is "Falsy" in JavaScript? List all the falsy values you can think of.',
          'What is the difference between + between 1 + "1" vs. 1 + 1?',
          "How to convert a string type into a number? And vice versa?",
          "What are Template Literals / string literal / string interpolation?",
          "What is optional chaining? Demonstrate how to use it.",
          "What is the purpose of the finally block in a try...catch...finally statement?",
          "When using switch statements, what happens if you forget the break keyword?",
        ],
      },
      {
        title: "Functions",
        questions: [
          "What is the difference between console.log(foo) and console.log(foo())?",
          "What is the difference between func(callback) and func(callback())?",
          'Explain the "Rest Parameter" (...args) and how it differs from the spread operator?',
          "How to define Default Parameters for a function?",
          "Why use arrow functions? What is a problem that it solves?",
          [
            "What is an arrow function’s implicit return and explicit return?",
            ["How do you implicitly return an object literal?"],
          ],
          "What is an IIFE (Immediately Invoked Function Expression), and its purpose and use cases?",
          'What is a "Higher-Order Function" and its purpose? Provide 3 examples of a built-in JavaScript HOF.',
          'What is a "Callback Function"?',
          "What is function currying?",
        ],
      },
      {
        title: "Objects & Classes (OOP)",
        questions: [
          "What is hasOwnProperty? How is it different from directly checking the property from the object using obj.something?",
          "Explain the this keyword.",
          "Give more examples of how this keyword behaves differently in different places.",
          "Explain call, apply, and bind. What are their differences?",
          "Explain the difference between a Class and an Object (Instance).",
          "What is the difference between Prototype Methods and Static Methods? Give three examples of a built-in static method of Object, Promise, Array.",
          'What does it mean when we say ES6 Classes are just "Syntax Sugar"?',
          "How do you iterate over the keys and values of an Object? Give three ways.",
          [
            "What is destructuring?",
            ["How do you rename a variable while destructuring?"],
          ],
          "Explain Array and Object destructuring difference",
        ],
      },
      {
        title: "Built-in Methods",
        questions: [
          "Which of the following Array methods mutate (modify) the original array, and which return a new array? map(), filter(), push(), pop(), slice(), splice(), sort() (You can ask one by one)",
          "What is the difference between Array.prototype forEach and map, and filter?",
          "What does the Array.prototype.reduce method do?",
          "Can you break out of a forEach loop? If not, what should you use instead?",
          "Explain the difference between Array.isArray(arr) and typeof arr.",
          "What is the runtime of sort?",
          "What are JSON.parse and JSON.stringify?",
        ],
      },
      {
        title: "Built-in Classes",
        questions: [
          "Difference between a normal object {} and Map?",
          "Is an object ordered? How about a Map instance?",
        ],
      },
    ],
  },
  {
    id: "async",
    title: "Async, Promise & Event Loop",
    groups: [
      {
        questions: [
          "How many threads does Javascript have? Why do we need async / non-blocking operations?",
          "What is the call stack?",
          "What is the callback queue?",
          "What is the event loop? Why do we need it?",
          "What is an Execution context?",
          "What is macrotask and microtask?",
          "What is callback hell? How do we solve this problem?",
          "What is a Promise? Why do we need it?",
          "What is .then, .catch, and .finally?",
          "Why can we not do Promise.then or Promise.catch?",
          "How do we handle multiple promises like concurrent API requests?",
          "What is the difference between Promise.all and Promise.allSettled?",
          "Why would we need Promise.race?",
          "Difference between using .then and .catch, vs using async/await for promises. Which syntax should we use and why?",
          "How to call a few api’s in parallel vs in sequence? When should you do each",
          "Which task has higher priority? For example, given same delay, setTimeout and Promise.resolve, which one comes out first?",
        ],
      },
      {
        title: "Modules",
        questions: [
          "What is a js module and why do we use it?",
          "What is the difference between CommonJS and ES modules?",
          "Difference between default export and named export. How are they imported?",
        ],
      },
      {
        title: "Comprehensive",
        questions: ["Difference between ES5 and ES6?"],
      },
    ],
  },
  {
    id: "typescript",
    title: "TypeScript Foundations",
    groups: [
      {
        questions: [
          "What is the difference between JavaScript and TypeScript? Which should be preferred by companies and why?",
          "What is the difference between any and unknown & Which is Safer?",
          "What is the difference between void and never, when are they used?",
          "Difference between interface vs. type, and which one should we use?",
          "Can Chrome run a .ts file directly? Or, can typescript run in the browser? Why?",
          [
            "What are generics? What are their use cases?",
            ["Give examples of when you would use generics?"],
          ],
          "What are union and intersection types?",
          "How do you explicitly mark parameter types and return types in arrow functions?",
          "How do you define optional properties in an interface?",
          "How and when would you use Type Assertion (as)?",
          "How and when would you use the Non-null Assertion operator (!)",
          "What are Enums and why do we need them?",
        ],
      },
    ],
  },
  {
    id: "rest-graphql",
    title: "APIs, GraphQL & Real-time",
    groups: [
      {
        title: "REST Principles and Routing",
        questions: [
          "What are some RESTful URL design principles?",
          "How can you define the versions of an API (e.g., v1, v2)?",
          "What is the difference between a Path parameter (e.g., /:variable) and a Query parameter?",
          "What is a request body and a Data Transfer Object (DTO)?",
          "When do we use GET, POST, PUT, PATCH, and DELETE? Explain each method.",
          "Difference between PUT and PATCH?",
          "What is idempotent? Give examples, explain in details",
          "What is the difference between client-side pagination and server-side pagination?",
        ],
      },
      {
        title: "HTTP Status Codes & Networking",
        questions: [
          "Difference between http and https?",
          "What do 200, 201, and 204 status codes represent?",
          "What do 300-level status codes indicate?",
          "Explain the differences between 400, 401, 403, 404, and 409 status codes.",
          "What is the difference between a 401 and a 403 error?",
          "What do 500-level status codes represent?",
          "What is http cache control?",
        ],
      },
      {
        title: "Axios",
        questions: [
          "How is Axios different from fetch api?",
          "What is an Axios Interceptor?",
        ],
      },
      {
        title: "Data Fetching",
        questions: [
          "How do you cancel an API request that has been sent out?",
          "What is an AbortController?",
          "What does fetch's promise resolve to, and what does res.json() do? Does fetch reject on a 404 or 500?",
          "What HTTP method does fetch default to, and how do you send a POST with a JSON body?",
        ],
      },
      {
        title: "REST vs GraphQL",
        questions: [
          "What is the difference between RESTful APIs and GraphQL?",
          'What are "overfetching" and "underfetching," and how does GraphQL solve them?',
          "How do HTTP responses differ between REST (multiple status codes) and GraphQL (always 200)?",
          "Why is it easier to cache RESTful APIs compared to GraphQL?",
          "When would you choose RESTful over GraphQL, and vice versa?",
        ],
      },
      {
        title: "GraphQL & BFF",
        questions: [
          "Why was GraphQL created, and why did many teams later move away from it?",
          "What is a GraphQL schema?",
          "What is a resolver?",
          "What's the difference between a query and a mutation?",
          [
            "What is a BFF (Backend for Frontend), and what problem does it solve?",
            [
              "Why is it slow for a browser to call several microservices to build one page?",
            ],
          ],
        ],
      },
      {
        title: "Real-time Communication",
        questions: [
          "What's wrong with short polling?",
          "How is long polling different from short polling?",
          "What is a WebSocket?",
          "What are Server-Sent Events (SSE)?",
          "When would you choose SSE over a WebSocket?",
          "What is Socket.IO, and how does it relate to WebSocket?",
        ],
      },
    ],
  },
  {
    id: "react",
    title: "React",
    groups: [
      {
        title: "JSX and Under the Hood",
        questions: [
          "What is JSX?",
          "How is JSX a syntax sugar, and how is it compiled by Babel into React.createElement?",
          "How does the Virtual DOM use a diffing algorithm to compare copies and update the real DOM?",
          "What is React Reconciliation?",
          "Briefly explain React Fiber.",
          "What is the difference between a React element and a React component?",
          "What is a React component?",
        ],
      },
      {
        title: "Components, Props, and States",
        questions: [
          "What is the difference between state and props?",
          "Why must array/object state be updated immutably instead of mutated in place?",
          "Is a prop mutable?",
          'What is a "children" prop?',
          "What are smart (container) component and dumb (presentation) component?",
          "What is a stateless component?",
          "What is the difference between class components and functional components?",
          "What are Fragments in React and why do we use them?",
          "What is prop drilling? Is it good? If not, how do we deal with it?",
          "How do you handle conditional rendering in React?",
          "What are PropTypes, and do we need them when using React with TypeScript?",
          "Why choose React as a UI library instead of Vanilla JS, Angular, or Vue?",
          "What are the limitations or downsides of React?",
        ],
      },
      {
        title: "Rendering and Lifecycle",
        questions: [
          "What causes a React component to re-render?",
          "How can you prevent unnecessary re-rendering?",
          "Why do we need keys in a list? What are the requirements for a key?",
          "Why can't we use a simple index as a key in a list?",
          "What is a pure function?",
          'What does it mean for a Component to be "Pure"?',
          "What are considered side effects in React components? Where should we handle them?",
          "What is React.StrictMode, and why does it render everything twice?",
          "What are mounting and unmounting in a component's lifecycle?",
          "What are the class component lifecycle methods?",
          "How to prevent unnecessary re-rendering in React?",
        ],
      },
      {
        title: "Error Handling",
        questions: [
          "How do Error Boundaries work, and why can they only be built using class components?",
          "What kind of errors can you use Error Boundaries to handle?",
          "How do you gracefully handle errors when an API call from React fails?",
        ],
      },
      {
        title: "Hooks",
        questions: [
          "Explain how useState works.",
          "What are different ways of calling setState?",
          "How do you queue a series of state updates?",
          "Why is it that, when you console.log the state after calling setState, the value is the old value?",
          "How does useEffect work, and what is its purpose?",
          [
            "Explain the dependency array in useEffect (empty, none, and with dependencies).",
            [
              "Another way of asking: How does useEffect mimic the component lifecycles?",
            ],
          ],
          "How do we clean up in useEffect, and why is it necessary?",
          "How do you clean up a setTimeout or setInterval?",
          "Why might a useEffect call run multiple times unexpectedly, and how do you avoid infinite re-rendering?",
          "What is the difference between handling side effects inside useEffect versus event handlers?",
          "What is useLayoutEffect?",
          "What is useRef, and what are different ways to use it?",
          "What is the difference between useState and useRef?",
          "What is useReducer?",
          [
            "What is the difference between useMemo and useCallback?",
            ["What is useMemo?", "What is useCallback?"],
          ],
          "What is the difference between useMemo and React.memo?",
        ],
      },
      {
        title: "Custom Hooks & Advanced Patterns",
        questions: [
          "What is a custom hook?",
          "What are the rules about using custom hooks?",
          "Provide examples of custom hooks you have used (e.g., useLocalStorage, useDebounce, usePagination, useClickOutside).",
          "What is a Higher Order Component (HOC)?",
          'What is "HOC hell"? And how do we resolve it?',
          "What is React.PureComponent?",
        ],
      },
      {
        title: "Forms and Inputs",
        questions: [
          "What is a controlled component?",
          "What is two-way data binding in React?",
          "How is a controlled component different from an uncontrolled component?",
          "What is a Synthetic Event in React?",
          "What's the difference between onClick={handleClick}, onClick={handleClick()}, and onClick={() => handleClick(id)}?",
          "How do you perform form input validation?",
          "What is the default behavior of forms? How do we prevent it?",
          "What is debounce? When would you use it?",
          "What is throttle? When would you use it?",
        ],
      },
      {
        title: "React 18 & 19 New Features",
        questions: [
          "What is useTransition?",
          "What is automatic batching update for states? Since which version is it supported?",
          "What is React Compiler in React 19?",
          "What are server components in React 19?",
          'What is the "use" API in React 19?',
        ],
      },
      {
        title: "Comprehensive React Questions",
        questions: [
          "Talk about your experience with React hooks?",
          "Tell me about how you design your React folder structure?",
          "Tell me about how you can keep your React app code clean?",
          "How do you identify and improve your React app’s performance?",
          "Real-time Scenario: How would you fix a UI that freezes while a user is typing in an input?",
        ],
      },
    ],
  },
  {
    id: "react-ecosystem",
    title: "React Ecosystem",
    groups: [
      {
        title: "Context API & Zustand",
        questions: [
          "What is the Context API? How does it solve the prop drilling problem?",
          "What happens if useContext is called with no matching Provider above it?",
          "Explain createContext(), useContext, Context Provider, and Context Consumer.",
          "Why is Context API considered bad for performance in large-scale apps?",
          "When would a Context Consumer component re-render?",
        ],
      },
      {
        title: "Redux",
        questions: [
          "Why do we use Redux?",
          "What are the three core principles of Redux?",
          "Explain the Flux pattern.",
          "What is a Redux store?",
          "What is a reducer function?",
          "What is an action?",
          "How do you read from and write to states in Redux store? Which functions?",
          "What are connect api and mapStateToProps?",
          "What is Redux Toolkit? How is it different from traditional Redux?",
          "What is a Redux middleware?",
          "What are Redux Thunk and Redux Saga middlewares? Explain their difference very briefly",
          "What is Redux Persist middleware?",
          "Explain the differences between Redux and the Context API.",
          "How do you choose whether to store data in local state vs global state?",
        ],
      },
      {
        title: "React Query",
        questions: [
          "Explain the difference between client-side state and server-side state.",
          "What is React Query? What features does it provide and what problems does it solve?",
        ],
      },
      {
        title: "React Router & Rendering Techniques",
        questions: [
          "What is React Router?",
          "How is Client Side Routing (CSR) different from traditional routing?",
          "How is Client Side Rendering (CSR) different from Server Side Rendering (SSR)?",
          "Why does Client Side Rendering have slow initial loading and poor SEO, and how could we solve it?",
          "How do you protect a route from unauthorized users in the frontend using Auth Guards?",
        ],
      },
    ],
  },
  {
    id: "general-frontend",
    title: "General Frontend",
    groups: [
      {
        title: "Performance",
        questions: [
          "What are the core web vitals?",
          "Explain Largest Contentful Paint (LCP). And what’s a good LCP score?",
          "What is Interaction to Next Paint? What’s a good INP score?",
          "What is Cumulative Layout Shift (CLS)? How to avoid it?",
          "What tools do you use to measure the core web vitals score?",
          "How do you improve the initial loading speed of your web page? Give as many methods as possible.",
          "How do you handle displaying a very massive amount of data (like 100,000) on the UI without freezing the browser?",
          "What is React virtualization? What library can you use for that?",
          "What is infinite scrolling, why do you need it and how do you implement it?",
          "What is an AutoComplete component? How can you improve its performance?",
          "What is offset based pagination?",
          "What is cursor based pagination?",
          "How do you improve the performance for image loading?",
          "What are responsive images?",
          "How does CDN help with image performance?",
          "What are prefetch and preload?",
          "What is lazy loading? And what is dynamic import in React?",
          "What is the Suspense component?",
          "What are web worker and service worker?",
        ],
      },
      {
        title: "Data Visualization",
        questions: [
          "What tools have you used for Data Visualization?",
          "Give a brief comparison between Chart.js, Highcharts, D3.js",
        ],
      },
      {
        title: "Microfrontend",
        questions: [
          "What is the microfrontend concept? What is a Shell App?",
          "What is module federation? Briefly explain how to set it up.",
          "How do you share data between multiple microfrontends?",
        ],
      },
      {
        title: "Accessibility",
        questions: [
          "How do you make your web application more accessible? What guidelines do you follow?",
          "What are aria attributes? Give some examples.",
          "How do you test accessibility? What tool do you use?",
        ],
      },
      {
        title: "Cross Browser Compatibility",
        questions: [
          "How to make sure your app is cross browser compatible?",
          "How do you test your app’s cross browser compatibility?",
          "What is a Polyfill?",
        ],
      },
      {
        title: "Web Components",
        questions: [
          "What is web component?",
          "What is Shadow DOM?",
          "Name a web component framework",
        ],
      },
      {
        title: "Storybook",
        questions: ["What is Storybook and its purpose?"],
      },
      {
        title: "Comprehensive",
        questions: ["How do you improve the performance of your React app? "],
      },
    ],
  },
  {
    id: "other-frameworks",
    title: "Other Frameworks",
    groups: [
      {
        title: "React Native",
        questions: [
          "Difference between React and React Native?",
          "What does it mean that React Native is cross platform?",
          "What is StyleSheet.create?",
          "What is a FlatList component?",
          "What is a ScrollView component?",
          "What is AsyncStorage?",
        ],
      },
      {
        title: "Next.js",
        questions: [
          "What is the benefit of using Next.js over React? And vice versa?",
          "What is the difference between page router and app router?",
          "What is the difference between client component and server component?",
          "What is hydration?",
          "What is Server Side Rendering (SSR)?",
          "What are Static Site Generation (SSG) and Incremental Static Regeneration (ISR)?",
        ],
      },
      {
        title: "Angular",
        questions: [
          "What does it mean when we say Angular is a framework, but React is a library?",
          "What is NgRx?",
          "What is 'signal' briefly and in which version was it released?",
          "What are RxJs and observables briefly? How are they different from promises?",
          "What is dependency injection?",
          "Difference between Angular and React?",
        ],
      },
      {
        title: "NestJS & Java",
        questions: [
          "What is NestJS briefly? Explain how it's different from Express?",
          "What are common Java versions in enterprise projects?",
          "Talk about three primary ways of doing dependency injection?",
          "What is IoC (inversion of control)?",
          "Talk about the 4 principles of OOP",
          "What are decorators?",
        ],
      },
    ],
  },
  {
    id: "node-express",
    title: "Node.js & Express.js",
    groups: [
      {
        title: "Node.js Core",
        questions: [
          "What is Node.js?",
          'What does "Node is single-threaded" mean? Is it good for CPU-intensive tasks, why?',
          "What is an I/O operation, and why does it make Node fast for this kind of work?",
          "What is the V8 engine?",
          "How does the Node.js event loop work? How could it handle thousands of concurrent requests?",
          "How is Node.js event loop different from the browser's event loop?",
          "What is libuv?",
          "What is setImmediate?",
          "What is process.nextTick()?",
          "What are macrotasks and microtasks? Give examples of each.",
          "What is the scripts field in package.json? How do you run one?",
          "Difference between npm and yarn? Just briefly",
          "What is a .env file? What do we put in it?",
          "How do you start a Node.js project after cloning it?",
          "Explain core Node.js modules and variables like os, fs, path, and env.",
        ],
      },
      {
        title: "Express.js Framework",
        questions: [
          "Explain the layered architecture in Express.js.",
          "What is the purpose of the Controller, Service, and Repository layers?",
          "What is an Express middleware? Give examples of use cases.",
          "How do you handle errors in Express?",
          "What are CORS issues and how do you handle them?",
          "What's the difference between req.params, req.query, and req.body?",
          "How do you implement authentication and authorization middlewares?",
          "How do you handle returning massive amounts of data in an API?",
          "What is Swagger?",
          "What tools do you use to test your APIs and express apps? (not just Postman)",
        ],
      },
    ],
  },
  {
    id: "database",
    title: "Database",
    groups: [
      {
        title: "High-Level Concepts & Ecosystem",
        questions: [
          "What is the difference between SQL (relational) and NoSQL databases (non-relational) on a high level? How to choose?",
          "Give some examples of SQL and NoSQL databases? (3 of each)",
        ],
      },
      {
        title: "Core Relational DB Concepts (Data Modeling)",
        questions: [
          "What is database normalization and denormalization? How do we do them?",
          "What is a Primary key? What is a foreign key?",
          "What's the difference between a PRIMARY KEY and a UNIQUE constraint?",
          [
            "Explain the following relations in relational databases and give an example of each:",
            ["one-to-one", "one-to-many", "many-to-one", "many-to-many"],
          ],
          "How do you implement a many-to-many relationship in a relational database?",
          "What is a View?",
        ],
      },
      {
        title: "Querying & Core Operations",
        questions: [
          "What's the difference between INSERT, UPDATE, and DELETE, and when would you use each?",
          "How do you perform JOINs in SQL?",
          "Difference between Left Join, Right Join, Inner Join, and Outer Join.",
          "What are ACID principles in a database?",
          "What is a database transaction?",
          "What is a stored procedure, and what's one real reason to use one?",
          "What is JSONB in PostgreSQL? When would we need it?",
        ],
      },
      {
        title: "Application Integration & Security",
        questions: [
          "What is an ORM (Object-Relational Mapping)? Give some examples.",
          "What is an ODM (Object-Document Mapping)? Give an example.",
          "What is database migration, and how do we perform them?",
          "How do you handle data validation?",
          "What is SQL injection and how do you prevent it?",
          "What is a database connection pool?",
        ],
      },
      {
        title: "Performance & Optimization",
        questions: [
          "What is indexing, and What's the tradeoff of adding an index?",
          "How do you identify slow queries and optimize them?",
          "In an EXPLAIN plan, what's the difference between a Seq Scan and an Index Scan?",
          "What is the N + 1 query problem? And how do you identify and solve it?",
        ],
      },
      {
        title: "Architecture & Scaling",
        questions: [
          "How do you do vertical scaling and horizontal scaling for relational databases?",
          "What is a primary node and a replica node?",
          "What problem does sharding and replication each solve?",
          "How do you do scaling for Document-based NoSQL databases?",
        ],
      },
    ],
  },
  {
    id: "architecture",
    title: "Architecture",
    groups: [
      {
        title: "Microservices",
        questions: [
          "What is microservice architecture? Why do we need it? Advantages of it.",
          "What do you give up with microservices, and when should you stay a monolith?",
          "Why does each service own its own database, and what replaces JOINs and transactions?",
          "What is the difference between horizontal and vertical scaling?",
          "How do microservices communicate between each other using sync vs async? What are the tradeoffs?",
          "When should you use 'REST Api requests' or 'message queue' between services?",
          "What is modular monolith?",
          "How to migrate a monolithic application to a microservice app?",
          "What is an API Gateway? How does it work in a microservice architecture?",
          "What is service discovery?",
          "What is a Circuit Breaker? What is Opossum?",
        ],
      },
      {
        title: "Message Queue (Kafka)",
        questions: [
          [
            "What are a message queue and event-driven architecture, and how do they relate?",
            ["What is the Pub/Sub pattern?"],
          ],
          "What is Kafka and why would you use it?",
          [
            "Explain Kafka’s core concepts.",
            ["Message", "Topic and partition", "Consumer group", "Offset"],
          ],
          [
            "What delivery guarantees does Kafka give?",
            ["Message ordering", "Preventing data loss"],
          ],
          [
            "How do you handle duplicate messages?",
            ["What does it mean for a consumer to be idempotent?"],
          ],
          [
            "How is Kafka different from RabbitMQ?",
            ["What is a RabbitMQ exchange?"],
          ],
          "What is a dead-letter queue for?",
          "What is the saga pattern, and why does event-driven architecture need one?",
        ],
      },
      {
        title: "Redis",
        questions: [
          "What is Redis and its primary use cases?",
          [
            "Explain caching with Redis.",
            [
              "Cache hit vs. cache miss",
              "The cache-aside pattern",
              "Cache eviction policies (e.g., LRU)",
            ],
          ],
          [
            "How do you scale the read and write operations of Redis?",
            [
              "What is Replication",
              "What is Sharding",
              "What is Redis Cluster?",
            ],
          ],
        ],
      },
      {
        title: "Docker & Kubernetes",
        questions: [
          "What is Docker, why do we need it?",
          "What are a Dockerfile, a docker image and container?",
          "What is docker-compose and what problem does it solve?",
          [
            "What is Kubernetes and its purpose?",
            [
              "What is a pod, a deployment, and a service?",
              "How do Kubernetes and Docker work together?",
            ],
          ],
        ],
      },
      {
        title: "System Design",
        questions: [
          [
            "State the CAP theorem. What does it mean for a design?",
            ["Explain the tradeoffs between consistency and availability?"],
          ],
          [
            "How do you make a system fault tolerant?",
            [
              "What are the four fault-tolerance patterns (timeout, retry, circuit breaker, fallback), and what does each solve?",
            ],
          ],
          "What is a CDN, and how does it improve the performance of a system?",
          [
            "What is a load balancer, and how does it choose an instance?",
            [
              "What is a health check?",
              "What is the difference between an API Gateway and a load balancer?",
            ],
          ],
        ],
      },
      {
        title: "Backend Performance ",
        questions: [
          "How do you identify backend performance issues (e.g., long response times, slow query logs, identifying slow functions)?",
          "How do you solve performance bottlenecks or a slow api? (e.g., caching, Redis, query optimization)",
          [
            "What are the core pillars of performance monitoring tools (Telemetry, Trace, Log, Metrics)?",
            ["How dest Otel-LGTM stack map to these?"],
          ],
        ],
      },
    ],
  },
  {
    id: "cloud-aws",
    title: "Cloud & AWS",
    groups: [
      {
        title: "Compute & Containers",
        questions: [
          "Why run the app on EC2 and the database on RDS, instead of installing Postgres on the same instance?",
          [
            "What kind of workload is Lambda well-suited for, and what's a bad fit for it?",
            [
              "Why keep a background job (like generating a shipping label) in a separate Lambda instead of adding an endpoint to the main app?",
            ],
          ],
          'What\'s a "cold start" in Lambda, and how to handle this issue?',
          "What do ECS and Fargate each do, and how do they work together?",
          "What is EKS? How does it relate to Kubernetes and to ECS?",
          "How do EC2, Fargate, and Lambda compare?",
          [
            "How does auto-scaling work for EC2 and ECS?",
            [
              "What is an Auto Scaling group on EC2, and what does it scale on (CPU, request count, schedule)?",
            ],
          ],
        ],
      },
      {
        title: "Storage, Databases & Caching",
        questions: [
          "What is S3, and what is it used for? How is it different from a database or a file system?",
          "What are S3 storage classes and lifecycle rules, and why use them?",
          "What are the AWS equivalents of Postgres/MySQL, MongoDB, Redis, and Kafka?",
        ],
      },
      {
        title: "Messaging & Streaming",
        questions: [
          [
            "What is SQS and SNS? How do they work together?",
            ["Which one do we put in the front, why?"],
          ],
        ],
      },
      {
        title: "Security & Configuration",
        questions: [
          "What is IAM? What are users, roles, and policies?",
          "What is AWS Secrets Manager, and why use it instead of a .env file in production?",
        ],
      },
      {
        title: "Monitoring",
        questions: [
          "What is CloudWatch? How is it different from other APM like Otel-LGTM?",
        ],
      },
      {
        title: "AI / ML",
        questions: ["What are AWS Bedrock and AWS SageMaker?"],
      },
      {
        title: "Infrastructure as Code",
        questions: [
          "What are Terraform and CloudFormation, and how do they compare?",
        ],
      },
    ],
  },
  {
    id: "testing",
    title: "Testing",
    groups: [
      {
        title: "Core Concepts",
        questions: [
          [
            "Difference between unit testing, integration testing, E2E testing?",
            ["Talk about tools you use for each?"],
          ],
          "What is Test Driven Development (TDD)?",
          "What is BDD (Behavior-Driven Development)? And name one tool for it.",
          [
            "What is test coverage?",
            ["How much is good coverage?", "How to increase coverage?"],
          ],
        ],
      },
      {
        title: "Tools & Implementation",
        questions: [
          [
            "What are the different types of testing, and when do you use each?",
            [
              "Smoke testing",
              "Happy path testing",
              "Regression testing",
              "Snapshot testing",
            ],
          ],
          [
            "How do you write your test cases?",
            [
              "What is a good test coverage?",
              "How do you generate a coverage report?",
            ],
          ],
          [
            "What tools do you use for frontend and backend testing?",
            [
              "Frontend unit testing (e.g., Jest, Vitest, React Testing Library)",
              "Backend testing (e.g., Jest, supertest)",
            ],
          ],
          "Explain how you use Playwright or Cypress for E2E testing.",
        ],
      },
      {
        title: "Methodologies",
        questions: [
          [
            "How do you deal with API calls and mocks during testing?",
            ["When to mock and when to actually call API?"],
          ],
          "How do you integrate automated tests into a CI/CD pipeline?",
        ],
      },
    ],
  },
  {
    id: "security",
    title: "Security & Authentication",
    groups: [
      {
        title: "Authentication & Authorization",
        questions: [
          "What is the difference between authentication and authorization?",
          "What is RBAC and how do you handle very granular user permissions?",
          [
            "Difference between JWT and Session-based authentication?",
            [
              "If millions of users are signed in, which strategy should you use?",
            ],
          ],
          "Walk through a full JWT auth flow, from login to an authenticated request.",
          [
            "What is a JWT, what are the three parts of it?",
            ["How do you sign and verify a JWT token?"],
          ],
          [
            "Token Security",
            [
              "Where to store the JWT Secret?",
              "What if token is stolen? Could you invalidate it? What would you do?",
            ],
          ],
          [
            "What is the difference between an access token and a refresh token?",
            ["How they work together?"],
          ],
          [
            "Where could you store authentication tokens (Local storage vs. Http-only cookies)?",
            ["And explain their own vulnerabilities"],
          ],
          [
            "What are OAuth 2.0, OIDC, and SSO, and how do they relate?",
            ["Give one example for each"],
          ],
        ],
      },
      {
        title: "Browser Security",
        questions: [
          [
            "What is CORS?",
            ["How do you resolve CORS on the backend versus the client?"],
          ],
          [
            "What is XSS (Cross-Site Scripting)? How to defend against it?",
            ["CSP (Content Security Policy)", "How to avoid HTML Injection"],
          ],
          "What is CSRF and how do you defend against it?",
        ],
      },
      {
        title: "Server Security",
        questions: [
          [
            "How do you safely store secrets such as user passwords and API keys?",
            [
              "Why not plain text?",
              "Explain hashing and salt.",
              "Where do you store sensitive API keys?",
            ],
          ],
          "How do you protect a server against DDoS attacks and abuse?",
          "What is SQL Injection? Different ways to prevent it",
        ],
      },
      {
        title: "Comprehensive",
        questions: [
          [
            "How do you ensure a secure web application?",
            ["How do you protect user data?"],
          ],
        ],
      },
    ],
  },
  {
    id: "sdlc-agile",
    title: "SDLC & Agile",
    groups: [
      {
        title: "Roles",
        questions: [
          [
            "What is the difference between Agile and Waterfall methodologies?",
            ["Agile vs Scrum?"],
          ],
          [
            "What are some common roles in scrum and what they do?",
            ["PO, PM, devs, etc"],
          ],
          [
            "Who are some common people that developers have to interact often with?",
            ["Who are the stakeholders?"],
          ],
        ],
      },
      {
        title: "Getting to Work",
        questions: [
          [
            "How do you get your work or ticket?",
            [
              "Who manages Product Backlog",
              "process of assigning the tickets: when, where, how",
            ],
          ],
          [
            "List out some Scrum ceremonies and explain each.",
            [
              "Sprint planning",
              "Daily Standup (DSU): what you discuss",
              "Sprint Review/Demo",
              "Sprint retrospective",
              "Sprint grooming (backlog refinement)",
            ],
          ],
          [
            "What is the typical whole workflow when working on a Jira ticket?",
            ["explain Git workflow", "explain DoD & acceptance criteria"],
          ],
          [
            "How do you make sure you finish your tasks on time, and what do you do if you fall behind?",
            [
              "Planning and prioritizing",
              "Raising blockers early",
              "Renegotiating scope or deadline",
            ],
          ],
        ],
      },
      {
        title: "Code Review / Patterns",
        questions: [
          [
            "What do you look for during code reviews?",
            [
              "What is SOLID principle?",
              "What is DRY principle",
              "What are good naming conventions",
            ],
          ],
          "How do you organize the folder structure of your project?",
          "What is Singleton? Why need it? Give examples.",
          "Explain functional programming vs imperative programming",
        ],
      },
      {
        title: "Comprehensive",
        questions: ["What does your day to day life look like?"],
      },
    ],
  },
  {
    id: "cicd-build",
    title: "CI/CD & Build Tools",
    groups: [
      {
        title: "CI/CD",
        questions: [
          "What does CI/CD stand for, and what is its purpose?",
          [
            "Explain the different environments:",
            ["local, dev, QA, staging, production"],
          ],
          "What is a PR (pull request)? What happens after you open it?",
          "How do you ensure the code quality during the CI/CD pipeline process?",
          "What is SonarQube and Lint? What are their differences?",
          "What are feature flags?",
          [
            "Explain the below deployment strategies, what they are and their benefits:",
            ["Blue/Green deployment", "Canary release"],
          ],
          "What happens immediately after the deployment? How does the engineering team ensure the deployment is successful?",
          "What is a YAML/.yml file? What do we write in it?",
        ],
      },
      {
        title: "Monitoring Tools",
        questions: [
          "How do you monitor your app in production?",
          "What is observability?",
          "What is New Relic?",
          "What is Splunk?",
          "What is Sentry.io?",
          "What is Grafana?",
        ],
      },
      {
        title: "Build Tools",
        questions: [
          "What is a bundler (e.g., Webpack), and what does bundling mean? Why do we need bundling?",
          "What are the differences between Webpack and Vite?",
          "What is dependency resolution in a build tool?",
          "What is tree shaking, and why do we need it?",
          "What is code splitting, and how is it combined with lazy loading? Why do we need it?",
          "What is Hot Module Replacement (HMR) and a dev server?",
        ],
      },
      {
        title: "Comprehensive",
        questions: [
          "Give a detailed explanation on how your code is shipped to production",
          "If there's a bug in production, how would you know? And what are the steps you take to fix it? ",
        ],
      },
    ],
  },
  {
    id: "ai",
    title: "AI",
    groups: [
      {
        title: "AI Fundamentals & Coding Tools",
        questions: [
          "What is a prompt?",
          "What is a token?",
          "What is a context window, and how do you manage your context window?",
          "What is a skill?",
          "What is a hook, and what is its purpose?",
          "How do you use AI in your day-to-day work and to help with your code?",
          "How do you verify the AI's output?",
          "How do you keep the code secure when you use AI?",
        ],
      },
      {
        title: "LLMs, Prompts & SDK",
        questions: [
          "What is a system prompt?",
          "What is the difference between zero-shot, one-shot, and few-shot prompting?",
          "What is chain-of-thought prompting?",
          "What is structured output, why do we need it, and how do you get it?",
          "What is AI's hallucination? How do we reduce it?",
        ],
      },
      {
        title: "Tools, MCP & the Agent Loop",
        questions: [
          "What is a tool?",
          "What is an agent?",
          "What is the agentic loop? How does it work?",
          "What is MCP?",
          "What are an MCP server and its purpose?",
        ],
      },
      {
        title: "RAG & Vector Databases",
        questions: [
          "What is RAG, and what problem does it solve?",
          "Walk through the full RAG ingestion pipeline.",
          "What is vector embedding?",
          "What is a vector database?",
          "What is chunking, and why does it matter?",
          "What is a citation in RAG, and why include it?",
          "What is the difference between keyword search and vector search, and what is hybrid search?",
        ],
      },
      {
        title: "Workflows, Agents & Context",
        questions: [
          "What is a workflow, what is an agent, and what is the difference?",
          "What are some common workflow patterns?",
          "What is context engineering, and how could you do it?",
          "What is agent orchestration (orchestrator-workers)?",
          "What is a checkpoint, and why does a long-running agent need one?",
          "How do you add human approval to an agent?",
        ],
      },
      {
        title: "LangChain & LangGraph",
        questions: [
          "What are LangChain, LangGraph and LangSmith, and how do they fit together?",
          "What are the three parts of a LangGraph graph?",
          "What is the difference between a chain and a graph?",
          "What does LangGraph give you that a plain while loop does not?",
          "What is a checkpointer, and what is thread_id for?",
          "How does interrupt work, and why must you not charge a card before it?",
        ],
      },
      {
        title: "AI Evaluation & Observability",
        questions: [
          "Why does an AI app need evals, and not only unit tests?",
          "What kinds of grader are there, and when do you use each?",
          "What is an LLM as a judge, and how do you write a good test case for it?",
          "How do you evaluate a RAG system?",
          "What are observability and tracing, and how are they different from evaluation?",
          "How do you debug an AI's mistake?",
        ],
      },
      {
        title: "AI Security, Cost & Performance",
        questions: [
          "What is prompt injection, and why does it exist?",
          "What are guardrails, and where do they go?",
          "What is prompt caching?",
          "What is semantic caching?",
          "How do you control the cost of an LLM app?",
        ],
      },
    ],
  },
];
