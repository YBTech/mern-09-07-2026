export type PageKind = "lecture" | "notes" | "practice" | "concepts" | "lab";

export const PAGE_LABELS: Record<PageKind, string> = {
  lecture: "Lecture",
  notes: "Notes",
  practice: "Practice",
  concepts: "Concepts",
  lab: "Lab",
};

export type Day = {
  slug: string;
  title: string;
  pages: PageKind[];
};

export type Week = {
  slug: string;
  number: number;
  title: string;
  days: Day[];
};

const ALL: PageKind[] = ["lecture", "notes", "practice", "concepts", "lab"];

export const WEEKS: Week[] = [
  {
    slug: "week1",
    number: 1,
    title: "Web Dev Fundamentals",
    days: [
      { slug: "day1-html-css-dom", title: "HTML & CSS", pages: ALL },
      {
        slug: "day2-typescript-core",
        title: "TypeScript Core",
        pages: ALL,
      },
      {
        slug: "day3-javascript-core",
        title: "JavaScript Core",
        pages: ALL,
      },
      {
        slug: "day4-js-functions",
        title: "JS Functions",
        pages: ALL,
      },
      {
        slug: "day5-promises-apis",
        title: "Promises & APIs",
        pages: ALL,
      },
    ],
  },
  {
    slug: "week2",
    number: 2,
    title: "React Fundamentals",
    days: [
      {
        slug: "day6-components-basics",
        title: "Components Basics: Describing the UI",
        pages: ALL,
      },
      {
        slug: "day7-state-interactivity",
        title: "State & Interactivity",
        pages: ALL,
      },
      {
        slug: "day8-inputs-forms",
        title: "Inputs & Forms",
        pages: ALL,
      },
      {
        slug: "day9-side-effects-data-fetching",
        title: "Side Effects & Data Fetching",
        pages: ALL,
      },
      {
        slug: "day10-routing-global-state",
        title: "Routing & Global State",
        pages: ALL,
      },
    ],
  },
  {
    slug: "week3",
    number: 3,
    title: "Node.js Backend Fundamentals",
    days: [
      {
        slug: "day11-node-express",
        title: "Node & Express",
        pages: ALL,
      },
    ],
  },
];

/** Standalone notes that belong to no week — the cross-cutting "how to work" material. */
export type GeneralNote = { slug: string; title: string; blurb: string };

export const GENERAL_NOTES: GeneralNote[] = [
  {
    slug: "ide-shortcuts",
    title: "Common Developer IDE Shortcuts",
    blurb:
      "The everyday editor shortcuts worth making automatic, Mac and Windows side by side.",
  },
  {
    slug: "common-sense",
    title: "Developer Common Sense",
    blurb:
      "The habits that make everything else faster — red lines, logging, formatting, terminals.",
  },
];

export function dayNumber(day: Day): number {
  return Number(day.slug.match(/^day(\d+)/)?.[1] ?? NaN);
}

export function pageHref(week: string, day: string, page: PageKind): string {
  return `/${week}/${day}/${page}`;
}

export function findWeekByDaySlug(daySlug: string): Week | undefined {
  return WEEKS.find((w) => w.days.some((d) => d.slug === daySlug));
}
