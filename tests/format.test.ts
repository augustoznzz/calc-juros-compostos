import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatPercent,
  formatPeriodLabel,
  formatDuration,
  formatCompact,
} from "@/lib/format";

describe("Format Library", () => {
  describe("formatCurrency", () => {
    it("should format currency in Brazilian Real", () => {
      const formatted = formatCurrency(1000);
      expect(formatted).toContain("R$");
      expect(formatted).toContain("1.000");
      expect(formatted).toContain("00");
    });

    it("should handle negative values", () => {
      const formatted = formatCurrency(-500);
      expect(formatted).toContain("R$");
      expect(formatted).toContain("500");
    });

    it("should handle large values", () => {
      const formatted = formatCurrency(1000000);
      expect(formatted).toContain("R$");
      expect(formatted).toContain("1.000.000");
    });
  });

  describe("formatPercent", () => {
    it("should format percentages correctly", () => {
      expect(formatPercent(10)).toBe("10,00%");
      expect(formatPercent(12.5)).toBe("12,50%");
      expect(formatPercent(0.95)).toBe("0,95%");
    });

    it("should respect decimal places", () => {
      expect(formatPercent(10.12345, 4)).toBe("10,1235%");
      expect(formatPercent(10, 0)).toBe("10%");
    });
  });

  describe("formatPeriodLabel", () => {
    it("should format monthly periods correctly", () => {
      expect(formatPeriodLabel(1, "monthly")).toBe("M1");
      expect(formatPeriodLabel(12, "monthly")).toBe("A1");
      expect(formatPeriodLabel(13, "monthly")).toBe("A1M1");
      expect(formatPeriodLabel(25, "monthly")).toBe("A2M1");
    });

    it("should format yearly periods correctly", () => {
      expect(formatPeriodLabel(1, "yearly")).toBe("Ano 1");
      expect(formatPeriodLabel(5, "yearly")).toBe("Ano 5");
    });
  });

  describe("formatDuration", () => {
    it("should format durations in Portuguese", () => {
      expect(formatDuration(1)).toBe("1 mês");
      expect(formatDuration(6)).toBe("6 meses");
      expect(formatDuration(12)).toBe("1 ano");
      expect(formatDuration(24)).toBe("2 anos");
      expect(formatDuration(13)).toBe("1 ano e 1 mês");
      expect(formatDuration(25)).toBe("2 anos e 1 mês");
      expect(formatDuration(26)).toBe("2 anos e 2 meses");
    });
  });

  describe("formatCompact", () => {
    it("should format large numbers compactly", () => {
      expect(formatCompact(1500)).toContain("1.50K");
      expect(formatCompact(1500000)).toContain("1.50M");
      expect(formatCompact(1500000000)).toContain("1.50B");
    });

    it("should format small numbers normally", () => {
      const formatted = formatCompact(500);
      expect(formatted).toContain("R$");
      expect(formatted).toContain("500");
    });
  });
});

