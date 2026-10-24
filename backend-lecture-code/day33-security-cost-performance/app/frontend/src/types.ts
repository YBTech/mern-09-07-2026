// Types that match the backend's /api/demos and /api/:demo/:mode
export type Sample = { label: string; poisoned: boolean; values: Record<string, string> };
export type DemoInfo = {
  id: string;
  title: string;
  story: string;
  attack: string;
  fix: string;
  fields: { name: string; label: string; rows: number }[];
  samples: Sample[];
};
export type Call = { label: string; system: string; user: string; reply: string };
export type Guard = { name: string; fired: boolean; detail: string };
export type Result = { output: string; calls: Call[]; guards: Guard[] };
export type Mode = "vulnerable" | "safe";
