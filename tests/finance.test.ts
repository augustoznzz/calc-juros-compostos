import { describe, it, expect } from "vitest";
import {
  annualToMonthly,
  monthlyToAnnual,
  calculateCompoundInterest,
  calculateTimeToGoal,
  calculateFutureValue,
  type CalculationInputs,
} from "@/lib/finance";

describe("Finance Library", () => {
  describe("Interest Rate Conversions", () => {
    it("should convert annual rate to monthly correctly", () => {
      // 12% a.a. ≈ 0.9489% a.m. (returns as decimal, not percentage)
      const monthlyRate = annualToMonthly(12);
      expect(monthlyRate * 100).toBeCloseTo(0.9489, 3);
    });

    it("should convert monthly rate to annual correctly", () => {
      // 1% a.m. ≈ 12.6825% a.a.
      const annualRate = monthlyToAnnual(1);
      expect(annualRate).toBeCloseTo(12.6825, 3);
    });

    it("should handle zero rates", () => {
      expect(annualToMonthly(0)).toBe(0);
      expect(monthlyToAnnual(0)).toBe(0);
    });

    it("should be inverse operations", () => {
      const original = 10; // 10% a.a.
      const monthly = annualToMonthly(original);
      const backToAnnual = monthlyToAnnual(monthly * 100);
      expect(backToAnnual).toBeCloseTo(original, 1);
    });
  });

  describe("Compound Interest Calculations", () => {
    it("should calculate future value without contributions", () => {
      const inputs: CalculationInputs = {
        initialInvestment: 1000,
        contribution: 0,
        contributionFrequency: "none",
        interestRate: 1,
        interestBase: "monthly",
        period: 12,
        periodUnit: "months",
        capitalization: "monthly",
        inflationRate: 0,
        adminFeeRate: 0,
      };

      const results = calculateCompoundInterest(inputs);

      // FV = 1000 * (1.01)^12 ≈ 1126.83
      expect(results.futureValueNominal).toBeCloseTo(1126.83, 1);
      expect(results.totalInvested).toBe(1000);
      expect(results.totalInterest).toBeCloseTo(126.83, 1);
    });

    it("should calculate future value with monthly contributions", () => {
      const inputs: CalculationInputs = {
        initialInvestment: 1000,
        contribution: 200,
        contributionFrequency: "monthly",
        interestRate: 1,
        interestBase: "monthly",
        period: 12,
        periodUnit: "months",
        capitalization: "monthly",
        inflationRate: 0,
        adminFeeRate: 0,
      };

      const results = calculateCompoundInterest(inputs);

      expect(results.totalInvested).toBe(1000 + 200 * 12); // 3400
      expect(results.futureValueNominal).toBeGreaterThan(
        results.totalInvested
      );
      expect(results.totalInterest).toBeGreaterThan(0);
    });

    it("should apply inflation adjustment correctly", () => {
      const inputs: CalculationInputs = {
        initialInvestment: 1000,
        contribution: 0,
        contributionFrequency: "none",
        interestRate: 12,
        interestBase: "yearly",
        period: 1,
        periodUnit: "years",
        capitalization: "yearly",
        inflationRate: 4,
        adminFeeRate: 0,
      };

      const results = calculateCompoundInterest(inputs);

      // Nominal FV = 1120
      expect(results.futureValueNominal).toBeCloseTo(1120, 1);

      // Real FV should be less (adjusted for 4% inflation)
      expect(results.futureValueReal).toBeLessThan(
        results.futureValueNominal
      );
      expect(results.futureValueReal).toBeCloseTo(1076.92, 1);
    });

    it("should apply admin fee correctly", () => {
      const inputs: CalculationInputs = {
        initialInvestment: 1000,
        contribution: 0,
        contributionFrequency: "none",
        interestRate: 12,
        interestBase: "yearly",
        period: 1,
        periodUnit: "years",
        capitalization: "yearly",
        inflationRate: 0,
        adminFeeRate: 2, // 2% admin fee
      };

      const resultsWithFee = calculateCompoundInterest(inputs);

      // With fee, effective rate = 12% - 2% = 10%
      // FV = 1000 * 1.10 = 1100
      expect(resultsWithFee.futureValueNominal).toBeCloseTo(1100, 1);

      const inputsNoFee = { ...inputs, adminFeeRate: 0 };
      const resultsNoFee = calculateCompoundInterest(inputsNoFee);

      expect(resultsWithFee.futureValueNominal).toBeLessThan(
        resultsNoFee.futureValueNominal
      );
    });

    it("should generate correct period data", () => {
      const inputs: CalculationInputs = {
        initialInvestment: 1000,
        contribution: 100,
        contributionFrequency: "monthly",
        interestRate: 1,
        interestBase: "monthly",
        period: 3,
        periodUnit: "months",
        capitalization: "monthly",
        inflationRate: 0,
        adminFeeRate: 0,
      };

      const results = calculateCompoundInterest(inputs);

      expect(results.periods).toHaveLength(3);
      expect(results.periods[0].period).toBe(1);
      expect(results.periods[2].period).toBe(3);

      // Each period should have positive interest
      results.periods.forEach((p) => {
        expect(p.interest).toBeGreaterThan(0);
        expect(p.finalBalance).toBeGreaterThan(p.initialBalance);
      });
    });
  });

  describe("Time to Goal Calculations", () => {
    it("should calculate months to reach target", () => {
      const inputs = {
        initialInvestment: 1000,
        contribution: 200,
        contributionFrequency: "monthly" as const,
        interestRate: 1,
        interestBase: "monthly" as const,
        capitalization: "monthly" as const,
        inflationRate: 0,
        adminFeeRate: 0,
      };

      const target = 5000;
      const result = calculateTimeToGoal(inputs, target);

      expect(result).not.toBeNull();
      if (result) {
        expect(result.months).toBeGreaterThan(0);
        expect(result.years).toBeGreaterThanOrEqual(0);
        expect(result.monthsRemainder).toBeGreaterThanOrEqual(0);
        expect(result.monthsRemainder).toBeLessThan(12);
      }
    });

    it("should return null for unreachable goals", () => {
      const inputs = {
        initialInvestment: 1000,
        contribution: 0,
        contributionFrequency: "none" as const,
        interestRate: 0,
        interestBase: "monthly" as const,
        capitalization: "monthly" as const,
        inflationRate: 0,
        adminFeeRate: 0,
      };

      const target = 10000; // Unreachable with 0% interest and no contributions
      const result = calculateTimeToGoal(inputs, target);

      expect(result).toBeNull();
    });
  });

  describe("Future Value Formula", () => {
    it("should calculate correctly with the standard formula", () => {
      const fv = calculateFutureValue(1000, 100, 0.01, 12);

      // Should match compound interest calculation
      expect(fv).toBeGreaterThan(1000 + 100 * 12);
    });

    it("should handle zero interest rate", () => {
      const fv = calculateFutureValue(1000, 100, 0, 12);

      // With 0% interest, FV = principal + contributions
      expect(fv).toBe(1000 + 100 * 12);
    });
  });
});

