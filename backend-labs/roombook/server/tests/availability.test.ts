import { describe, expect, it } from "vitest";
import { overlaps } from "../src/modules/availability/availability.service";

const t = (time: string) => `2030-01-07T${time}`;

describe("overlaps", () => {
  it("is true when the ranges partly overlap", () => {
    expect(overlaps(t("10:00"), t("11:00"), t("10:30"), t("11:30"))).toBe(true);
  });

  it("is true when one range sits inside the other", () => {
    expect(overlaps(t("09:00"), t("12:00"), t("10:00"), t("11:00"))).toBe(true);
  });

  it("is true for identical ranges", () => {
    expect(overlaps(t("10:00"), t("11:00"), t("10:00"), t("11:00"))).toBe(true);
  });

  it("is false for ranges with a gap between them", () => {
    expect(overlaps(t("09:00"), t("10:00"), t("11:00"), t("12:00"))).toBe(false);
  });

  it("is false for back-to-back ranges: one ends exactly when the next starts", () => {
    expect(overlaps(t("10:00"), t("11:00"), t("11:00"), t("12:00"))).toBe(false);
    expect(overlaps(t("11:00"), t("12:00"), t("10:00"), t("11:00"))).toBe(false);
  });
});
