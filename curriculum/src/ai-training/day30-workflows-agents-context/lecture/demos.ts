import type { ComponentType } from "react";
import PromptChainDemo from "./PromptChainDemo";
import RouterDemo from "./RouterDemo";
import ParallelDemo from "./ParallelDemo";
import AgentLoopDemo from "./AgentLoopDemo";

// Every live demo for Day 30, in Notes order. Adding one is a single entry here plus its
// component: the index (Lecture.tsx), the tab strip and the route (/lecture/:demo) all
// read this list, so App.tsx never changes.
//
// Still to build, from Notes section 2+: evaluator-optimizer (2.4),
// the window filling up (4.1), orchestrator-workers (5.2), checkpoint + approval (6.1–6.2).

export type Demo = {
  slug: string;
  section: string;
  title: string;
  blurb: string;
  Component: ComponentType;
};

export const DEMOS: Demo[] = [
  {
    slug: "prompt-chain",
    section: "2.1",
    title: "Prompt chain",
    blurb: "A fixed sequence of steps: look up the order, fetch the policy, decide, refund or deny, draft, check tone. Every message runs the same steps, even one that isn't a refund.",
    Component: PromptChainDemo,
  },
  {
    slug: "router",
    section: "2.2",
    title: "Router",
    blurb: "Classify the message first, then send it down one path with its own tools. Try Dana's email: it fits two paths, and only one gets answered.",
    Component: RouterDemo,
  },
  {
    slug: "parallel",
    section: "2.3",
    title: "Parallelization",
    blurb: "Independent checks start together and the reply waits for the slowest. Sectioning merges different checks; voting asks the same question three times.",
    Component: ParallelDemo,
  },
  {
    slug: "agent-loop",
    section: "3.1",
    title: "The agent loop",
    blurb: "No fixed steps: each turn the model reads everything so far and either calls tools or stops. Easy questions end in a turn or two; hard ones chain several tools, and one never resolves, so the turn cap ends it.",
    Component: AgentLoopDemo,
  },
];

export const LECTURE_PATH = "/ai-training/day30-workflows-agents-context/lecture";
