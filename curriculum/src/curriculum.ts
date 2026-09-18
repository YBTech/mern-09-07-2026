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
  number: number;
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
      { slug: "day1-html-css-dom", number: 1, title: "HTML & CSS", pages: ALL },
      {
        slug: "day2-typescript-core",
        number: 2,
        title: "TypeScript Core",
        pages: ALL,
      },
      {
        slug: "day3-javascript-core",
        number: 3,
        title: "JavaScript Core",
        pages: ALL,
      },
      {
        slug: "day4-js-functions",
        number: 4,
        title: "JS Functions",
        pages: ALL,
      },
      {
        slug: "day5-promises-apis",
        number: 5,
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
        number: 6,
        title: "Components Basics: Describing the UI",
        pages: ALL,
      },
      {
        slug: "day7-state-interactivity",
        number: 7,
        title: "State & Interactivity",
        pages: ALL,
      },
      {
        slug: "day8-inputs-forms",
        number: 8,
        title: "Inputs & Forms",
        pages: ALL,
      },
      {
        slug: "day9-side-effects-data-fetching",
        number: 9,
        title: "Side Effects & Data Fetching",
        pages: ALL,
      },
      {
        slug: "day10-routing-global-state",
        number: 10,
        title: "Routing & Global State",
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

export function pageHref(week: string, day: string, page: PageKind): string {
  return `/${week}/${day}/${page}`;
}

export function findWeekByDaySlug(daySlug: string): Week | undefined {
  return WEEKS.find((w) => w.days.some((d) => d.slug === daySlug));
}
