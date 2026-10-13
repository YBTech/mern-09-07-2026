// RoomBook has no time zones: every time is the office's local time, written as plain text.
//   date      "2030-01-07"
//   date-time "2030-01-07T09:30"
// Text in this format sorts in time order, so plain string comparison works.

const pad = (n: number) => String(n).padStart(2, "0");

export function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

export function isValidDateTime(value: string): boolean {
  return (
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) &&
    isValidDate(value.slice(0, 10)) &&
    value.slice(11, 13) < "24" &&
    value.slice(14) < "60"
  );
}

export function dateOf(dateTime: string): string {
  return dateTime.slice(0, 10);
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
