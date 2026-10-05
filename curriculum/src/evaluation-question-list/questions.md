Evaluation Rules
Final Evaluation
All questions that will be asked are in this doc (roughly 500)

Pre-Evaluation Qualifications
Form a group of 3-4 people, mock interview with each other
Unlimited attempts
Ask 30 questions every mock
each black bullet point is one question, even though it may contain multiple question marks or sub questions
The interviewer prepares the questions in advance
interviewer must know the answers themselves
The interviewer will: record the questions using the Pre-Evaluation Group Mock Template
Passing score is 27/30
Metrics for a correct answer:
Use complete, coherent sentences, not just spitting out keywords
Need to cover at least 2 concepts of the answer, not just one part
Question: “Difference between class & functional component?”
Answer: “function has cleaner syntax, class uses this keyword and lifecycle”
Result: Incorrect ❌, it is way too short, and doesn’t cover other core differences.
You must earn at least two “passing badges ✅” to be eligible to participate in the final evaluation
Network & Browser
What is the process between you entering a url in the browser and seeing the content on the browser?
What is an IP address?
What is the DNS (Domain Name System)?
What is the critical rendering path (CRP)?
What is semantic HTML? Why do we need it?
What is the head tag in HTML?
What is a meta tag?
What are some HTML5 new features? (mention the most important one)
What are HTML attributes?
What is HTML injection and how to avoid it?
How does React JSX automatically sanitize input?
Why should you avoid using innerHTML?
What is the difference between Local storage, session storage, and cookies?
Ask about the sizes of each
What’s unique about cookies?
What is event bubbling and event capturing?
What is async and defer in the script tag?
What is Document Object Model (DOM)? Give some examples of how we select DOM elements using Javascript.
If an API request fails, what are the first 3 things you check in the Network Tab?
What is the Intersection Observer API? What is it used for?

Styling
What are different types of css selectors? (just give the most common ones)
What is CSS specificity? Give examples of which elements have higher specificity.
Why should you avoid using inline styles or !important?
What is the CSS box model? Explain content, border, padding, and margin.
What is box-sizing? What are the differences between border-box and content-box?
What are different ways to hide an element using css?
display: none
visibility: hidden
The differences between the above two
What are different positions in CSS?
How do you use static, absolute, fixed, relative, and sticky positioning?
How do you approach responsive web design?
What is a media query and what are breakpoints?
How do you ensure responsiveness?
What is the difference between Flexbox and css grid?
Answer: Flexbox and CSS Grid are both CSS layout systems, but they work in different dimensions. Flexbox is one-dimensional, meaning it handles layout in either a row or a column at a time. CSS Grid is for more complex two-dimensional layouts, so it can handle both rows and columns.
 I usually use Flexbox for smaller-scale layouts, like aligning items in a navbar or centering content inside a card. And I use CSS Grid for larger-scale page layouts when I need to define a complete grid structure. So they can both be used together in a project. 
What is justify-content and align-items in flexbox?
How do you center a div? Give two ways
What is the difference between rem, px, and em?
What is a CSS reset? Why do we need it?
What is the BEM methodology?
What are CSS modules?
What is a Vendor prefix?
What are CSS Preprocessors? Give some examples. Can we directly run them in the browser?
Explain how SASS allows you to write CSS in a programming way? Give some examples of features
Tell me about the basics of tailwind CSS?
What are Component Libraries like Material UI, Chakra, Ant Design? How can you use them in your project?
What are some common design systems that you know?
Answer: Material Design, Bootstrap Design, USWDS(United States Web Design System), Ant Design
What is Styled Component? How does it work?
What is ShadCN and how is it different from the other styles theming framework above?


Javascript Foundations
Variables, Scopes & Memory
What is the difference between let, const, and var?
Explain the difference between "Pass by Value" and "Pass by Reference" with examples. (aka. primitive vs reference types)
Explain the difference between Global Scope, Function Scope, and Block Scope.
What is lexical scoping? Explain the "Scope Chain." 
Answer: inner scopes have access to outer scopes’ variables
Define "Closure" in your own words. What is its purpose? 
Answer: Closure allows the inner function to have access to the outer function’s scope even after the function has returned. This is how in ES5 developers used to create private variables. We can also use closure to create reusable logics, for example, debounce and throttle both use closure. (Every time a React component re-renders it also creates a closure that’s why we can’t get the latest state right after calling setState, because it’s the state value from the old closure)
What is the temporal deadzone?
What is hoisting?
How could the Global/Window object potentially cause memory leaks in Javascript?
Explain how JavaScript allocates memory. What goes into the "Stack" and what goes into the "Heap"? What does "Stack" and "Heap" mean?
Data Types & Coercion
What are the 7 primitive data types in JavaScript, and how are they stored in memory compared to Objects?
What is the difference between undefined, null, and “not defined”?
What is type coercion? Is it good, how do we deal with it?
Difference between == vs ===, and which one should we use?
Explain the difference between "Pass by Value" and "Pass by Reference" with examples.
Why does [] == [] and {} == {} return false in JavaScript?
Copying & Mutability
How does the "Shallow Copy" differ from a "Deep Copy"? How do you do a shallow copy?
What are the ways to perform deep cloning?
What are the limitations of using JSON.parse(JSON.stringify(obj)) for deep cloning?
What is structuredClone?
Explain the "Spread Operator" (...) and how it behaves when merging objects with conflicting keys.
Operators & Control Flow
What is "Short-circuit evaluation" in Logical Operators (&& and ||)?
Explain the difference between the Logical OR operator (||) and the Nullish Coalescing operator (??).
What is "Falsy" in JavaScript? List all the falsy values you can think of.
What is the difference between + between 1 + "1" vs. 1 + 1?
How to convert a string type into a number? And vice versa?
What are Template Literals / string literal / string interpolation?
What is optional chaining? Demonstrate how to use it.
What is the purpose of the finally block in a try...catch...finally statement?
When using switch statements, what happens if you forget the break keyword?
Functions
What is the difference between console.log(foo) and console.log(foo())?
What is the difference between func(callback) and func(callback())?
Explain the "Rest Parameter" (...args) and how it differs from the spread operator?
How to define Default Parameters for a function?
Why use arrow functions? What is a problem that it solves?
Answer: arrow function is an ES6 feature, the main problem is to solve the “this” keyword binding problem in functions. But it also has very clean syntax similar to Java lambda expression, and we can use implicit return with it.
What is an arrow function’s implicit return and explicit return?
What is an IIFE (Immediately Invoked Function Expression), and its purpose and use cases?
What is a "Higher-Order Function" and its purpose? Provide 3 examples of a built-in JavaScript HOF.
What is a "Callback Function"?
What is function currying? 
Objects & Classes (OOP)
What is hasOwnProperty? How is it different from directly checking the property from the object using obj.something?
Explain the this keyword.
Give more examples of how this keyword behaves differently in different places.
Answer: 
Most of the time this keyword refers to the object that is calling the current method. But it behaves differently in different places, in a function in a script file it refers to the global window object, but if it’s in a module then it is undefined.
That’s why sometimes in a function we need to bind this keyword to the function. But we can also use the arrow function in that case because it doesn’t have its own “this” keyword.
Explain call, apply, and bind. What are their differences?
Explain the difference between a Class and an Object (Instance).
What is the constructor method used for in a Class?
What is the difference between Prototype Methods and Static Methods? Give three examples of a built-in static method of Object, Promise, Array.
What is the "Prototype Chain" in JavaScript in simple words?
What does it mean when we say ES6 Classes are just "Syntax Sugar"?
How do you iterate over the keys and values of an Object? Give three ways.
What is destructuring?
Explain Array and Object destructuring difference
Built-in Methods
Which of the following Array methods mutate (modify) the original array, and which return a new array? map(), filter(), push(), pop(), slice(), splice(), sort() (You can ask one by one)
What is the difference between Array.prototype forEach and map, and filter?
What does the Array.prototype.reduce method do?
Can you break out of a forEach loop? If not, what should you use instead?
Explain the difference between Array.isArray(arr) and typeof arr.
What is the runtime of sort?
Build in Classes
Difference between a normal object {} and Map?
Is an object ordered? How about a Map instance?


Async, Promise & Event Loop
How many threads does Javascript have? Why do we need async / non-blocking operations?
What is the call stack?
What is the callback queue?
What is the event loop? Why do we need it? 
Answer: JavaScript is single-threaded, so it can only execute one thing at a time in the call stack. But in the browser, we have a lot of asynchronous operations — like user events, network requests, and timers. So the browser provides Web APIs to handle these tasks in the background. Once those tasks are done, their callbacks get placed into either the microtask queue (for Promises) or the macrotask queue (for setTimeout, event handlers, etc.). The event loop constantly checks if the call stack is empty, and if it is, it will first get all the microtasks and move to the callstack and then the next macrotask. But yeah event loop basically allows Javascript to handle asynchronous operations without freezing the UI.
What is an Execution context?
What is macrotask and microtask?
What is callback hell? How do we solve this problem?
What is a Promise? Why do we need it?
What is .then, .catch, and .finally?
Why can we not do Promise.then or Promise.catch?
How do we handle multiple promises like concurrent API requests?
What is the difference between Promise.all and Promise.allSettled?
Why would we need Promise.race?
Difference between using .then and .catch, vs using async/await for promises. Which syntax should we use and why?
How to call a few api’s in parallel vs in sequence? When should you do each
What are macrotasks and microtasks? Give examples
Which task has higher priority? For example, given same delay, setTImeout and Promise.resolve, which one comes out first?
Modules
What is a js module and why do we use it?
What is the difference between CommonJS and ES modules?
Difference between default export and named export. How are they imported?
Comprehensive:
Difference between ES5 and ES6?

Typescript Foundations
What is the difference between JavaScript and TypeScript? Which should be preferred by companies and why? 	
Answer:
Typescript is a superset of Javascript, it adds type safety and it’s very important for large projects. It prevents type errors early on, so we can avoid lots of bugs later.
In the past some companies may choose Javascript for faster development speed, but I think now we should use Typescript for everything because AI made writing types a lot faster.
What is the difference between any and unknown & Which is Safer?
What is the difference between void and never, when are they used?
Difference between interface vs. type, and which one should we use?
Can Chrome run a .ts file directly? Or, can typescript run in the browser? Why?
What are generics? What are their use cases? 
Give examples of when you would use generics?
What are union and intersection types?
How do you explicitly mark parameter types and return types in arrow functions?
How do you define optional properties in an interface?
How and when would you use Type Assertion (as)?
How and when would you use the Non-null Assertion operator (!)? 
What are Enums and why do we need them?



RESTful APIs & GraphQL
REST Principles and Routing
What are RESTful URL design principles?
Why shouldn't you include verbs in a REST URL, and why should nouns be plural?
How do you version an API (e.g., v1, v2)?
Answer: 
We should almost always use plural nouns in the url, because verbs can be described by the request method. We should use the correct request method, make sure what we are doing matches the idempotent principle. 
We should have versions (like v1,v2) in the API so it would be easier later on if we are trying to migrate.
We can also have query parameters to add extra information
Use the body to send payload
and use path parameters to show the hierarchy between the data
also need to make sure the request returns meaningful status code
(and we can also use an API logging tool to log every request so we can monitor and make it easier to debug in production)
What is the difference between a Path parameter (e.g., /:variable) and a Query parameter?
What is a request body and a Data Transfer Object (DTO)?
When do we use GET, POST, PUT, PATCH, and DELETE? Explain each method.
What is the OPTION method?
Difference between PUT and PATCH?
What is idempotent?
What is the difference between client-side pagination and server-side pagination?
HTTP Status Codes & Networking
Difference between HTTP 2 vs HTTP 3?
Difference between http and https?
What do 200, 201, and 204 status codes represent?
What do 300-level status codes indicate?
Explain the differences between 400, 401, 403, 404, and 409 status codes.
What is the difference between a 401 and a 403 error?
What do 500-level status codes represent?
What is http cache control?
Axios
How is Axios different from fetch api?
What is an Axios Interceptor?
Data fetching
How do you cancel an API request that has been sent out?
What is an AbortController?
REST vs GraphQL 
What is the difference between RESTful APIs and GraphQL? 
What are "overfetching" and "underfetching," and how does GraphQL solve them?
Answer
Restful API
Graphql
Overfetching & Underfetching
Get exactly what you need


Easy for frontend developers
More work on the backend
HTTP advantage
Status code
Different request methods
Multiple endpoints
Lacks information http response
Status code: always 200
Only one POST method
One single endpoint


Easier to cache
Harder to cache due to dynamic responses
Relatively straight forward, can easily separate different data types to different endpoints
Could be adding engineering complexities: caching, performance, security


How do HTTP responses differ between REST (multiple status codes) and GraphQL (always 200)?
Why is it easier to cache RESTful APIs compared to GraphQL?
When would you choose RESTful over GraphQL, and vice versa?
Answer: I’d say, if the project is mainly doing simple CRUD operations and don’t have problems with overfetching or underfetching. I would go with REST. Because HTTP has headers like cache control, security policy and rate-limiting, so it’s a lot easier to manage the APIs. We don’t want to over-engineer and pick Graphql if there is no need.
But if we are dealing with complex data and have over-fetching & under-fetching problems, then we should consider Graphql. For example, let’s say if we’re building for mobile devices and want to avoid over-fetching to improve performance, then we can use Graphql. Another example is that, if the frontend needs to combine data from multiple microservices in one trip, then we can consider using Graphql Federation and Gateway to solve that.
But yeah, basically REST is great for most basic CRUD apps, and GraphQL is better for more complex and data-heavy apps.
React
JSX and Under the Hood
What is JSX? 
How is JSX a syntax sugar, and how is it compiled by Babel into React.createElement?
Answer: 
JSX is basically a syntax sugar, it looks similar to HTML but behind the scene, the build tool like webpack will use Babel to compile JSX into normal Javascript that the browser can understand.
(In older version JSX is converted into “React.createElement”)
How does the Virtual DOM use a diffing algorithm to compare copies and update the real DOM? 
Answer: Virtual dom is like a copy of the real dom that’s stored in memory. When the states update, it will compare the previous copy and the current copy, then use a diffing algorithm to find the differences and only update these changes to the real DOM.
What is React Reconciliation? 
Answer: That's React's process of figuring out what changed when your component re-renders. It uses a diffing algorithm to compare the new virtual DOM tree with the previous one and updates only the parts that actually changed in the real DOM.
Briefly explain React Fiber. 
What is the difference between a React element and a React component?
Components, Props, and States
What is the difference between state and props?
Is a prop mutable?
What is a "children" prop?
What are smart(container) component and dumb(presentation) component?
What is a stateless component?
What is the difference between class components and functional components?
Answer:
So in modern React we always use function components, they have cleaner syntax, they have hooks that manage the states and side effects, like useState & useEffect. We can also create custom hooks to reuse state and lifecycle logics.
Class components are used a lot in older projects, they use lifecycle methods like component-did-mount, component-did-update, component-will-unmount. But if we want to reuse logics, we have to use higher order components. Emmm… and also, we can only do Error boundary with class component, function component cannot do that yet
What are Fragments in React and why do we use them?
What is prop drilling? Is it good? If not, how do we deal with it?
How do you handle conditional rendering in React?
What are PropTypes, and do we need them when using React with TypeScript?
Why choose React as a UI library instead of Vanilla JS, Angular, or Vue?
Answer: Because react is a very light weight UI library. The main thing is that we can build the UI with smaller and reusable components. It uses a virtual DOM which makes it really fast, because it has minimum real DOM updates. The react ecosystem and community are also great, developers are still actively maintaining it and adding new features, and we have a lot of third-party libraries for state management, component libraries and other utility libraries (like redux / react query / react-hook-form). (Plus React has a large labor market it’d be easier to hire)
What are the limitations or downsides of React?
Answer: 
I would say the major downside of React is the slow initial rendering time and poor SEO due to Client Side Rendering. But we can mitigate it by using optimization techniques like code splitting and lazy loading. If SEO is a major requirement and we don’t have time to migrate to a Server Side Rendering framework like NextJs, then we can use prerender.io to pre-render our pages to improve the SEO score.
Another downside of React is that it doesn’t have real conventions for doing things. For example, for state management you can use Redux or Context or even React Query. For data fetching you could use useEffect, React Query, or even data loader from React Router. We also have too many options for things like styling and form control. 
The coding patterns is also very flexible, we have things like Custom hook, render props, container and presentation components, useReducer and many others, so different engineers do things differently, it’s hard to keep things consistent, so in the project we really have to make sure to document the patterns well, and guide new developers joining the team.
So i’d say, React is very flexible but we need to spend a lot of time debating on the architecture design and enforce a consistent coding pattern.
Rendering and Lifecycle
What causes a React component to re-render?
How can you prevent unnecessary re-rendering?
Why do we need keys in a list? 
Why can't we use a simple index as a key in a list?
What are the requirements for a "Key" in a list?
Answer: Keys help React keep track of items in a list , so it knows which items have been updated, it’s to improve rendering performance for list. The key also has to be unique, and we should avoid using index because index could change if you add or delete an item. 
What is a pure function? 
What does it mean for a Component to be "Pure"? 
What are considered side effects in React components? Where should we handle them?
What is React.StrictMode, and why does it render everything twice?
Answer: 
React components should stay pure (same inputs(props) should always return same outputs (JSX))
Strict makes sure your component is pure during the rendering and avoid unexpected side effects that will cause bugs later on
What are mounting and unmounting in a component's lifecycle?
How to prevent unnecessary re-rendering in React?
Error Handling
How do Error Boundaries work, and why can they only be built using class components?
What kind of errors can you use Error Boundaries to handle?
How do you gracefully handle errors when an API call from React fails?
Hooks
Explain how useState works.
What are different ways of calling setState? 
Answer: There are two main ways. The first is passing a value directly, like setState(newValue). The second is passing an updater function, it takes a previous state and returns a new state. We use the updater function when the new state depends on the previous state.
How do you queue a series of state updates?
Answer: We would use the updater function when the new state depends on the previous state, because React batches state updates. If you call setState(count + 1) three times in a row, they all reference the same count value from that render, so you'd only get one increment. But if you use setState(prev => prev + 1) three times, each one gets the latest value from the previous update, so you'd get three increments.
Why is it that, when you console.log the state after calling setState, the value is the old value? 
Answer: This is because of closures. When a component renders, it creates a closure with the current state value in it. When you call setState, the component re-renders, but the old render is still stuck with the old value. So to get the latest value, we can either use an updater function when calling setState, or just get the value in the next re-render.
How does useEffect work, and what is its purpose? 
Answer: We use useEffect to run side effects in a function component. So side effects are from external systems or outside of the component, like fetching data, setting up subscriptions, manipulating the DOM directly, or setting event listeners and timers. We do that because the rendering process needs to be pure, so we manage some of the side effects in the useEffect. 
And the useEffect hook runs after the re-render and after the DOM updates. It has a dependency array to decide if the callback function should run again in the next re-renders. 
Explain the dependency array in useEffect (empty, none, and with dependencies).
Another way of asking: How does useEffect mimic the component lifecycles? 
Answer: (for both questions) So useEffect kind of mimics the class component lifecycle methods. If there’s no dependency array, the effect runs after every render, similar to componentDidUpdate. If you pass an empty array [], the effect runs just once after the initial render — similar to componentDidMount. If you pass dependencies, the effect will re-run when any of those values changes. Also, you should always include every variable from the outer scope that the effect uses, otherwise you would have outdated values because of closures.
How do we clean up in useEffect, and why is it necessary? 
Answer: You can return a cleanup function in the useEffect callback. React will call this cleanup function before the effect runs again, and also before the component unmounts. If we don’t do the cleanup, we might have memory leaks and unexpected behaviors. 
For example, if you set up a WebSocket connection or add an event listener in your effect, you need to disconnect or remove the listener when the component unmounts or when the effect re-runs. Without cleanup, you'd end up with multiple subscriptions stacking on top of each other, which can cause bugs and performance issues.
How do you clean up a setTimeout or setInterval?
Why might a useEffect call run multiple times unexpectedly, and how do you avoid infinite re-rendering?
What is the difference between handling side effects inside useEffect versus event handlers?
What is useLayoutEffect?
What is useRef, and what are different ways to use it? 
Answer: so useRef returns an object with a “current” property. There are two ways of using useRef.
The most common use case is to get a reference to a DOM element. We can pass it to a JSX element’s “ref” prop, and then we can access the actual DOM element’s properties like height and width, or do things like focusing and scrolling. In React, we shouldn’t directly use the DOM API like document.querySelector, that’s why we need useRef.
Another common use case is if we want to create a value that can persist across renders, or if we want to change a value without making the component re-renders. For example I have used it to store the timer ID, or create an ID for input and labels.
What is the difference between useState and useRef? 
What is forwardRef? 
Answer: So in React you can’t directly pass a ref prop down to a child component, so you have to use forwardRef to wrap the child component and pass the ref as a second parameter. We usually use this when we are building reusable UI component libraries, for example if you want the parent to have access to a child component’s button or input elements.
But in React 19, we don’t need “forwardRef” anymore because we can pass ref as a prop directly.
What is useReducer?
What is the difference between useMemo and useCallback? 
What is useMemo?
What is useCallback?
Answer:
We can use useMemo to memoize the return value of an expensive function, and it will only re-calculate when the dependencies change. 
useCallback memoizes a function itself. It's useful when we want to keep the same reference of the function when the component re-renders. We can use it to save the closure when we are using higher order functions like debounce and throttle
What is the difference between useMemo and React.memo? 
What is the compare function of React.memo’s 2nd argument?
Custom Hooks & Advanced Patterns
What is a custom hook?
What are the rules about using custom hooks?
Provide examples of custom hooks you have used (e.g., useLocalStorage, useDebounce, usePagination, useClickOutside).
What is a Higher Order Component (HOC)? 
Answer:
HOCs are functions that take a component and return a new component with additional  functionality; we use it to reuse state and lifecycle logics. We mainly used them with class components back then, but now we use custom hooks more with function component, because the code is a lot cleaner, and we don’t need to worry about HOC hell
(HOC hell is when we are trying to wrap multiple HOCs around a component and that makes the code very messy)
What is "HOC hell"? And how do we resolve it?
What is React.PureComponent?
Forms and Inputs
What is a controlled component? 
What is two-way data binding in React?
Answer: 
Controlled component is how we achieve two way data binding in react. We pass a value prop and onChange handler to the input element, so we have full control over the input’s values.
Uncontrolled input is when we pass a ref to the input, so DOM controls the input’s value, we just use the ref to get a reference to the DOM element
How is a controlled component different from an uncontrolled component?
What is a Synthetic Event in React?
How do you perform form input validation?
What is the default behavior of forms? How do we prevent it?
What is debounce? When would you use it?
What is throttle? When would you use it?

React 18 & 19 new features
What is useTransition?
What is automatic batching update for states? Since which version is it supported?
What is React Compiler in React 19?
What are server components in React 19? 
Do we still need forwardRef in React 19? Why?
What is the "use" API in React 19?

Comprehensive React Questions
Talk about your experience with React hooks?
Tell me about how you design your React folder structure?
Tell me about how you can keep your React app code clean?
How do you identify and improve your React app’s performance?
Real-time Scenario: How would you fix a UI that freezes while a user is typing in an input?
React Ecosystems
Context API & Zustand
What is the Context API? How does it solve the prop drilling problem?
Explain createContext(), useContext, Context Provider, and Context Consumer.
Why is Context API considered bad for performance in large-scale apps?
When would a Context Consumer component re-render?
What is Zustand?
Compare the Context API and Zustand.
What are Recoil, MobX? (very short answer)
Redux
Why do we use Redux?
Explain the Flux pattern. 
Answer: The Flux pattern is a one-way data flow architecture. So in Redux, it has a few different parts: the UI dispatches an Action, the action is an object that has a type and payload. That action gets sent to a Reducer, the reducer is a pure function, it takes the current state and the action, and returns a new state. Then we have the store, the store is the single source of truth, it holds the global states for our entire app, and when the state updates, the UI re-renders with the new data. So the flow is always like: UI sends an Action to Reducer, reducer updates the states in Store, then store makes the UI re-render with new data. 
Redux uses this flux pattern to make the state update predictable and easier to debug, because you can track every state change and its actions, it’s especially helpful if we are also using a middleware like redux-logger.
What is a Redux store?
What is a reducer function?
What is an action?
How do you read states from the Redux store? Which function? 
How do you update the global redux state? Which function?
What is connect api? 
What is mapStateToProps function? How about mapDispatchToProps?
What is Redux Toolkit? How is it different from traditional Redux?
What is a slice in Redux Toolkit?
How many stores can we have in Redux?
What is a Redux middleware?
What is the Redux Thunk middleware?
What is Redux Persist middleware?
Compare Redux Thunk versus Redux Saga.
What is a generator function? Where would we use it?
Explain the differences between Redux and the Context API. 
Answer: So both Context API and Redux can be used to manage the global states. Context API is provided by React out of the box, its main purpose is to solve the prop drilling problem. But if the app grows big, it’s going to have performance problems because it’s like, every time the context value changes, all of the consumers of that context will also re-render. Another downside is that if the project doesn’t follow a very strict pattern, the code could be messy and hard to debug because we can have many Context Providers.
And Redux gives a more standard way to manage global states for large apps, because it follows a flux pattern, it has a one way data flow with actions, reducers and only a single source of truth. 
So for smaller apps, Context is fine, we can use it to store global values that don’t change often, like Theme or language setting. But for bigger apps Redux will be better than Context, because it has a very strict pattern and is optimized for performance, plus it has better support with redux devtool and middlewares
How do you choose whether to store data in local state vs global state?
React Query
Explain the difference between client-side state and server-side state.
Answer: Client-side states are states that only exist in the browser — for example for things like theme, whether a modal is open, form input values, the selected tab, or UI preferences. It only lives on the frontend c. Server-side state is data that came from APIs — And there are challenges like being asynchronous, or the data become stale overtime and needs refetching, it might be shared across multiple components, and it needs caching optimization. So that’s what React Query was created for. And on the other hand, Context API and Zustand are better for managing the client states.
Why is React Query gaining popularity in modern development over Redux, and does that mean Redux is obsolete? 
Answer: React Query is gaining popularity because in many older projects with Redux, we had to write a lot of boilerplates for managing the server state, for things like data fetching, handling loading/error states, and caching. Even with Redux Toolkit there would still be a lot of boilerplate code. React Query handles all of that out of the box — the useQuery and useMutation hooks have a lot of built in features for that, the boilerplate code is a lot less than writing the code in Redux. 
But Redux is still very good if the project needs complex client-side and you need a predictable state update pattern. But if for a new project, most states in the project are about server state, then we can just use React Query for server state and a lighter tool like Zustand or even Context API for client state. Redux is still great, and if a project already uses it, they can add RTK Query to manage the server states.
What is React Query caching?
What is React Query deduping?
What is automatic background update in React Query?
What is a queryKey in React Query, and why do we need it?
What is a queryFn in React Query?
What is stale data in React Query?
What is query invalidation?
What is an optimistic update?
React Router & Rendering Techniques
What is React Router?
How is Client Side Routing (CSR) different from traditional routing? 
Answer: So with conventional routing, every time we change route, it sends a request to the server for a new HTML, then the whole page refreshes. But for client side routing with React Router, when the URL changes, the components will be updated by Javascript so the page doesn’t refresh, it feels faster and gives a better user experience
How is Client Side Rendering (CSR) different from Server Side Rendering (SSR)? 
Answer:
explain Client Side Rendering using the answer from above 
And Server Side Rendering is when the server renders the component on the server and sends back the pre-generated HTML, it has better SEO because the bots can see the HTML content. It also has faster initial load time, because we don’t have to wait for javascript to render everything in the browser like client side rendering.
Why does Client Side Rendering have slow initial loading and poor SEO, and how could we solve it?
What is the difference between useParams and useSearchParams?
How do you protect a route from unauthorized users in the frontend using Auth Guards?
What happens when you go to a route that doesn’t exist? How should you handle it?
General Frontend
Performance
What are the core web vitals?
Explain Largest Contentful Paint (LCP). And what’s a good LCP score?
What is Interaction to Next Paint? What’s a good INP score?
What is Cumulative Layout Shift (CLS)? How to avoid it? 
What tools do you use to measure the core web vitals score?
How do you improve the initial loading speed of your web page? Give as many methods as possible. 
Answer:
code splitting & lazy loading
tree shaking
if it’s a new app could consider using a framework that supports server side rendering
use CDN to host the static resources
finally measure LCP, good if <= 2.5s
How do you handle displaying a very massive amount of data (like 100,000) on the UI without freezing the browser?
Answer: AG Grid (then you add more details…)
What is React virtualization? What library can you use for that?
What is infinite scrolling, why do you need it and how do you implement it?
What is an AutoComplete component? How can you improve its performance?
What are debounce and throttle?
What is offset base pagination?
What is cursor based pagination?
How do you improve the performance for image loading?
What are responsive images?
How does CDN help with image performance?
What is the difference between prefetch and preload?
What is eager loading?
What is lazy loading? And what is dynamic import in React?
What is the Suspense component?
How does web worker help improve the performance of expensive blocking operations?
What is service worker? How is it different from web worker?

Data Visualization
Difference between SVG and Canvas?
What tools have you used for Data Visualization?
Give a brief comparison between Chart.js, Highcharts, D3.js



Microfrontend
What is the microfrontend concept? What is a Shell App?
What is module federation? Briefly explain how to set it up.
How do you share data between multiple microfrontends?
Accessibility
How do you make your web application more accessible? What guidelines do you follow? 
Answer:
Follow WCAG (Web Content Accessibility Guidelines)
Include the below elements:
semantic HTML
aria attributes
alt text for images / label for inputs
visual: high color contrast and responsive font sizes
keyboard navigation
tabs, enter…
“skip to main” button
What are aria attributes? Give some examples.
How do you test accessibility? What tool do you use?
Answer:
E2E testing
Axe Devtool
lighthouse
Cross Browser Compatibility
How to make sure your app is cross browser compatible? 
How do you test your app’s cross browser compatibility?
What is a Polyfill?
Web component
What is web component? 
What is Shadow DOM?
Name a web component framework

Storybook
What is Storybook and its purpose?
Comprehensive:
How do you improve the performance of your React app? ❗
Other frameworks
React Native
Difference between React and React Native?
What does it mean that React Native is cross platform?
What is Stylesheet.create?
What is a FlatList component?
What is a ScrollView component?
Give two common E2E testing frameworks for React Native
Difference between Expo and React Native CLI?
What is AsyncStorage?
What is an Emulator?
Next.js
What is the benefit of using Next.js over React? And vice versa?
What is the difference between page router and app router?
What is the difference between client component and server component?
What is hydration?
What is Server Side Rendering (SSR)?
What is Static Site Generation (SSG)?
What is Incremental Static Regeneration (ISR)?


Angular
What does it mean when we say Angular is a framework, but React is a library?
Difference between Angular and React?
What are directives?
How does Angular do two-way data binding?
Tell me about some lifecycle hooks in Angular?
How does Angular pass data between components?
Difference between template-driven form and reactive form?
What is NgRx?
What is signal?
What is RxJs and observables? How are they different from promises? 
What is dependency injection?
Answer: Dependency Injection is a design pattern where we use Injectables to inject dependencies into the class from outside, usually through a readonly property in the constructor. We do this to make sure our code is loosely coupled, and that makes it easier to test.
Nest JS
What is Nest JS?
Explain the Nest Js architecture: Modules, Controllers, Providers

Java
What are common Java versions in enterprise projects?
11,17,21
What is JVM?
Talk about the 4 principles of OOP
What are Spring boot annotations?
What tool do you use for Java unit testing?
What is data serialization?
talk about three primary ways of doing dependency injection?
What is the Spring boot actuator?
Describe the Spring MVC architecture.


Node.js & Express.js
Node.js Core
What is Node.js?
Which Node.js version are you using?
What is Node Version Manager (NVM)?
How does the Node.js event loop work, 
Answer: 
So Node.js runs on the V8 engine, it’s a single-threaded process. So when there are asynchronous operations like network requests, timers, reading files, the callstack will send these tasks to libuv. libuv is a C library, after it’s done with these tasks, it will send them to the Task Queues. 
Then the Event Loop is like a dispatcher. It will check to see if the callstack is empty, and if yes, it will first empty the Microtask Queues, and process the Promises and process.nextTick(). And then the event loop will go through several phases. First it will clear up all the Timers (setTimeout / setInterval), and then it will enter the Poll Phase, this is the core phase / the most important phase, it will execute all the callbacks for I/O operations like network request and file reading. And after the Poll Phase, it will enter the Check Phase to check for any setImmedidate functions.
But in summary, the event loop will poll from the callback functions from the Task Queues whenever the callstack is empty, so that’s how Node.js is able to handle a very large amount of asynchronous I/O operations.
How is Node.js event loop different from the browser's event loop? 
Answer:
They are similar, but the Node.js Event Loop is more complex
It uses the libuv library to process the async operations, and browser event loop uses the Web APIs.
The callback queue in the browser just has a macrotask queue and microtask queue, but Node.js has more task queues for timer, I/O, file systems, setImmediate and nextTick.
But on a high level they are pretty similar, they allow a single-threaded language like Javascript to be able to process a large amount of asynchronous operations.
(you might wanna refer to some answers from the previous question)
What is libuv?
Answer: libuv is a C library that helps Node.js handle the asynchronous I/O operations like network request and files system. so that it doesn’t block the main thread. And Node.js uses libuv as part of its runtime environment.
What is setImmediate?
Answer: So the name is quite confusing, the setImmedidate function actually will delay the callback function to after the event loop’s polling phase. We use this function when we want to run an expensive callback function but make it asynchronous so that we can wait for other async I/O operations to finish processing first.
reference 
What are macrotasks and microtasks? Give examples of each.
Explain what CommonJS is and how it compares to ES Modules.
What is the purpose of the package.json file?
How do you start a Node.js project after cloning it?
Explain core Node.js modules and variables like os, fs, path, and env.
Explain hardware concepts related to backend hosting, such as RAM, CPU, and storage.
Express.js Framework
Explain the layered architecture in Express.js.
What is the purpose of the Controller, Service, and Repository layers?
What is an Express middleware? Give examples of use cases.
How do you handle errors in Express? 
Answer: So in Express we would create a global error handling middleware, we add it at the end of all routes. So in our service or repository layers we can throw errors without having to write try / catch over and over again. 
And then we would also create a Custom Error class, then we can create subclasses to handle different types of errors like AuthError, NotFoundError or database ORM errors. And then in the error handling middleware we check the type of the error and then send back the error response.
What are CORS issues and how do you handle them?
How do you parse JSON / URL-encoded data using middlewares?
How do you implement authentication and authorization middlewares? 
Answer: So we can write the authentication middleware and add it before the protected routes. The middleware will read the JWT from either the Authorization header or the http-only cookie, then it verifies the token and passes the payload to the next middleware or controller. If the token is missing or invalid, we will return a 401 code. And for authorization middleware the logic is similar, we just check if the user’s role is in the allowed list, if not then we throw a 403 error.
How do you handle returning massive amounts of data in an API
What is Swagger?
What tools do you use to test your APIs and express apps?

Database
High-Level Concepts & Ecosystem
What is the difference between SQL(relational) and NoSQL databases(non-relational) on a high level? 
Answer: SQL databases like PostgreSQL and MySQL store data in tables with rows and columns. The tables have a very strict schema, and they have relationships through foreign keys and joins. NoSQL is any database that’s not a SQL database, so the most common one is document databases like MongoDB, it stores data in documents and collections. There are also databases that use key-value pairs, like local storage, and there are graph based and vector databases as well
SQL databases are great when your data has clear schema and relationships, so you can write complex queries with JOINs. You should also use SQL if data integrity is important, for example like financial systems. NoSQL databases are better when your data structure is more flexible or changes a lot, or when you need horizontal scalability, for example for social media websites, then we can use a NoSQL database like mongoDB.
Give some examples of SQL and NoSQL databases? (3 of each)
Core Relational DB Concepts (Data Modeling)
What is database normalization and denormalization? How do we do them?
What is a Primary key? What is a foreign key?
Explain the following relations in relational databases and give an example of each:
one-to-one
one-to-many
many-to-one
many-to-many
How do you implement a many-to-many relationship in a relational database?
Querying & Core Operations
What is a raw query?
How do you perform JOINs in SQL?
Difference between Left Join, Right Join, Inner Join, and Outer Join.
What are ACID principles in a database?
What is a database transaction?
Application Integration & Security
What is an ORM (Object-Relational Mapping)? Give some examples.
What is an ODM (Object-Document Mapping)? Give an example.
What is database migration, and how do we perform them?
How do you handle data validation?
What is SQL injection and how do you prevent it?
What is a database connection pool?
Performance & Optimization
What is indexing, and how does a b-tree work?
How do you identify slow queries and optimize them?
What is the N + 1 query problem? And how do you solve it?
Architecture & Scaling
How do you do vertical scaling and horizontal scaling for relational databases?
sharding
What is a primary node and a replica node?
How do you do scaling for Document-based NoSQL databases?
Specific/Advanced Features
What is JsonB in Postgresql? When would we need it?
Architecture
Microservices
What is microservice architecture? Why do we need it? Advantages of it.
What is the difference between a Monolithic and Microservice architecture?
What is the difference between horizontal and vertical scaling?
How do microservices communicate between each other?
When should you use REST Api requests between services?
When should you use message queue between services?
How to migrate a monolithic application to a microservice app?
What is an API Gateway? How does it work in a microservice architecture?
What is a Circuit Breaker? What is Opossum?
Message Queue (Kafka)
What is a message queue?
What is event-driven architecture?
What is Kafka and why would you use it?
What is a message in message queue?
What is a topic and a partition?
What is a consumer group?
What is an offset?
How does Kafka guarantee message ordering?
How does Kafka prevent data lost?
How to prevent duplicate messages?
How is Kafka different from RabbitMQ?
What is the Pub/Sub pattern? How is this different from Kafka’s event driven architecture?
Redis
What is Redis and its primary use cases?
What is a cache hit and a cache miss?
Where does Redis store its data? What types of data does Redis store?
What is a Cache Eviction policy (e.g., LRU)
How to scale up the read and write operations of Redis?
What is Redis Sharing and Replication?
What is Redis Cluster? How does Redis work in microservice architecture?
Docker & Kubernetes
What is Docker, why do we need it?
What are the differences between docker image and container, 
What is a Dockerfile? What should you include in it?
What is docker-compose?
What is Kubernetes and its purpose?
What is a pod, a deployment, and a service in Kubernetes?
How do Kubernetes and Docker work together?

Backend Performance ❗
How do you identify backend performance issues (e.g., long response times, slow query logs, identifying slow functions)?
How do you solve performance bottlenecks (e.g., caching, Redis, query optimization)?
What are the core pillars of performance monitoring tools (Error, APM, Log, Metrics)?
How do you improve the performance of a slow API?
Testing
Core Concepts
Have you done testing before, and what tools do you use?
What is E2E (End-to-End) testing?
Difference between unit testing, integration testing, E2E testing?
What is Test Driven Development (TDD)?
What is BDD (Behavior-Driven Development)
and have you used Cucumber?
What is test coverage? How much is good coverage?
Tools & Implementation~
What is smoke testing?
What is happy path testing?
What is regression testing?
What is snapshot testing?
How do you write your test cases?
What is a good test coverage? How do you generate a coverage report?
What tools do you use for Frontend Unit Testing (e.g., Jest, Vitest, React Testing Library)?
What tools do you use for Backend Testing (e.g., Jest, supertest)?
Explain how you use Playwright or Cypress for E2E testing.
Methodologies
How do you use selectors and assertions in React Testing Library & Jest?
How do you use selectors and assertions in E2E testing?
What is the difference between headless mode and UI testing?
How do you deal with API calls and mocks during testing?
How do you integrate automated tests into a CI/CD pipeline?
Security & Authentication
Authentication & Authorization
What is the difference between JWT and Session-based authentication?
If millions of users are signed in, which above authentication strategy should you use/
What are the three parts of a JWT token? 
Is the payload encrypted or just encoded that anyone can read it?
How do you sign and verify a JWT token?
What should you do if a user’s JWT token is compromised?
What is the difference between an access token and a refresh token?
Where could you store authentication tokens (Local storage vs. Http-only cookies)? How safe are they?
What is RBAC (Role-Based Access Control) and how do you handle user permissions?
What are authentication and authorization middlewares in express.js?
What is OAuth 2.0?
What is SSO (Single Sign-On)? Give an example.
Browser Security
What is XSS (Cross-Site Scripting)? How to defend against it?
What is CSRF? How to defend against it?
What is CSP (Content Security Policy) and how does it mitigate XSS attacks?
What is CORS (Cross-Origin Resource Sharing)?
How do you resolve CORS on the backend versus the client?
What is HTML Injection, and how does React JSX automatically sanitize inputs?
Why should you avoid using innerHTML to prevent injection attacks?
Server Security
How do you safely store a user password in the database? In plain text?
Explain hashing and salt.
How do you protect a server against DDoS attacks?
What is rate limiting, why is it important and how do you implement it?
Where do you store sensitive API keys?
Answer: Environment variables, AWS Secrets Manager)
What is SQL Injection, and how do you prevent it using ORMs, sanitizing inputs, or parameterized queries?
Comprehensive
How do you ensure a secure web application?
How do you protect user data? ❗
SDLC & Agile

Roles

What is the difference between Agile and Waterfall methodologies?
What is the difference between Product Owner, Project Manager, and scrum master?
Who are the stakeholders?
Who are some common people that developers have to interact often with?
Answer: UI/UX designer, Devops Team, PO, PM, QA
Getting to work

How do you get tickets assigned to you?
What is a story point? How do you estimate story points?
Who assigns it to you?
What is the Product Backlog? Who manages it?
Explain Scrum ceremonies
What do you discuss during the Daily Standup (DSU) meetings?
What is sprint planning meeting?
What is sprint Review/Demo
What is sprint retrospective
What is the typical Git workflow when working on a Jira ticket? ❗
What is the “Definition of Done”? What is acceptance criteria? How are they different?
How do you make sure you finish your tasks on time?
What do you do if you fall behind or are about to miss a deadline?
What is a Sprint Grooming Meeting?
Code Review / Patterns
What do you look for during code reviews?
How do you organize the folder structure of your project?
What is the SOLID principle?
What is the DRY principle?
What is Singleton? Why need it? Give examples.
Explain function programming vs imperial programming
Comprehensive
What does your day to day life look like?
CI/CD & Build Tools
CI/CD
What does CI/CD stand for, and what is its purpose?
Explain the difference environments:
local, dev, QA, staging, production
What is a PR (pull request)? What happens after you open it?
How do you ensure the code quality during the CI/CD pipeline process?
What is SonarQube and Lint? What are their differences?
What are feature flags?
Explain the below deployment strategies, what they are and their benefits:
Blue/Green deployment
Canary release
What happens immediately after the deployment? How does the engineering team ensure the deployment is successful?
What is a YAML/.yml file? What do we write in it?
Monitoring Tools
How do you monitor your app in production?
What is New Relic?
What is Splunk?
What is Sentry.io?
What is Grafana?
What is AWS Cloudwatch?
Build Tools
What is a bundler (e.g., Webpack), and what does bundling mean? Why do we need bundling?
What are the differences between Webpack and Vite?
What is dependency resolution in a build tool?
What is tree shaking, and why do we need it?
What is code splitting, and how is it combined with lazy loading? Why do we need it?
What is Hot Module Replacement (HMR) and a dev server?
Comprehensive
Give a detailed explanation on how your code is shipped to production
If there's a bug in production, how would you know? And what are the steps you take to fix it? ❗
