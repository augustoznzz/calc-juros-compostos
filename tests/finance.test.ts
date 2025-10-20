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
      expect(results.effectiveCapitalization).toBe("monthly");
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

    it("should match example: 10k initial, 1k monthly, 5% a.m., 5 years", () => {
      const inputs: CalculationInputs = {
        initialInvestment: 10000,
        contribution: 1000,
        contributionFrequency: "monthly",
        interestRate: 5, // 5% a.m.
        interestBase: "monthly",
        period: 5,
        periodUnit: "years",
        capitalization: "monthly",
        inflationRate: 0,
        adminFeeRate: 0,
      };

      const results = calculateCompoundInterest(inputs);

      // Expected approximately R$ 540.375,58 per user report
      expect(results.futureValueNominal).toBeCloseTo(540375.58, 0);
    });

    it("should calculate correctly: 1k initial, 200 monthly, 5% a.m., 2 years", () => {
      const inputs: CalculationInputs = {
        initialInvestment: 1000,
        contribution: 200,
        contributionFrequency: "monthly",
        interestRate: 5, // 5% a.m.
        interestBase: "monthly",
        period: 2,
        periodUnit: "years",
        capitalization: "monthly",
        inflationRate: 0,
        adminFeeRate: 0,
      };

      const results = calculateCompoundInterest(inputs);

      // Expected result: R$ 12.125,50
      expect(results.futureValueNominal).toBeCloseTo(12125.50, 2);
      expect(results.totalInvested).toBe(5800); // 1000 + (200 * 24)
      expect(results.totalInterest).toBeCloseTo(6325.50, 2);
      expect(results.periods).toHaveLength(24);
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

  describe("Variable Contributions", () => {
    it("should apply yearly variable contributions correctly", () => {
      const inputs: CalculationInputs = {
        initialInvestment: 1000,
        contribution: 0,
        contributionFrequency: "none",
        interestRate: 0,
        interestBase: "monthly",
        period: 36, // 3 years
        periodUnit: "months",
        capitalization: "monthly",
        inflationRate: 0,
        adminFeeRate: 0,
        variableContributions: [
          {
            id: "1",
            amount: 1000,
            startPeriod: 1,
            endPeriod: 3,
            periodType: "years",
          },
        ],
      };

      const results = calculateCompoundInterest(inputs);

      // Should have 36 periods (36 months) - no auto-adjustment
      expect(results.periods).toHaveLength(36);
      expect(results.effectiveCapitalization).toBe("monthly");

      // Check that contribution appears in months 1-36 (years 1-3)
      expect(results.periods[0].contribution).toBe(1000);   // Month 1
      expect(results.periods[1].contribution).toBe(1000);   // Month 2
      expect(results.periods[11].contribution).toBe(1000);  // Month 12
      expect(results.periods[12].contribution).toBe(1000);  // Month 13
      expect(results.periods[23].contribution).toBe(1000);  // Month 24
      expect(results.periods[24].contribution).toBe(1000);  // Month 25
      expect(results.periods[35].contribution).toBe(1000);  // Month 36

      // Total invested should be 1000 (initial) + 36000 (1000 * 36 months in years 1-3)
      expect(results.totalInvested).toBe(37000);
    });

    it("should apply yearly variable contributions in specific year range", () => {
      const inputs: CalculationInputs = {
        initialInvestment: 1000,
        contribution: 0,
        contributionFrequency: "none",
        interestRate: 0,
        interestBase: "monthly",
        period: 60, // 5 years
        periodUnit: "months",
        capitalization: "monthly",
        inflationRate: 0,
        adminFeeRate: 0,
        variableContributions: [
          {
            id: "1",
            amount: 500,
            startPeriod: 2, // Year 2
            endPeriod: 4,   // Year 4
            periodType: "years",
          },
        ],
      };

      const results = calculateCompoundInterest(inputs);

      // Should have 60 periods (60 months) - no auto-adjustment
      expect(results.periods).toHaveLength(60);
      expect(results.effectiveCapitalization).toBe("monthly");

      // No contribution in months 1-12 (year 1)
      expect(results.periods[0].contribution).toBe(0);   // Month 1
      expect(results.periods[11].contribution).toBe(0);  // Month 12

      // Contribution in months 13-48 (years 2-4)
      expect(results.periods[12].contribution).toBe(500);  // Month 13
      expect(results.periods[23].contribution).toBe(500);  // Month 24
      expect(results.periods[24].contribution).toBe(500);  // Month 25
      expect(results.periods[35].contribution).toBe(500);  // Month 36
      expect(results.periods[47].contribution).toBe(500);  // Month 48

      // No contribution in months 49-60 (year 5)
      expect(results.periods[48].contribution).toBe(0);    // Month 49
      expect(results.periods[59].contribution).toBe(0);    // Month 60

      // Total invested should be 1000 (initial) + 18000 (500 * 36 months in years 2-4)
      expect(results.totalInvested).toBe(19000);
    });

    it("should apply yearly variable contributions for years 1-2 correctly", () => {
      const inputs: CalculationInputs = {
        initialInvestment: 1000,
        contribution: 0,
        contributionFrequency: "none",
        interestRate: 0,
        interestBase: "monthly",
        period: 60, // 5 years
        periodUnit: "months",
        capitalization: "monthly",
        inflationRate: 0,
        adminFeeRate: 0,
        variableContributions: [
          {
            id: "1",
            amount: 200,
            startPeriod: 1, // Year 1
            endPeriod: 2,   // Year 2
            periodType: "years",
          },
        ],
      };

      const results = calculateCompoundInterest(inputs);

      // Should have 60 periods (60 months) - no auto-adjustment since we're using monthly capitalization
      expect(results.periods).toHaveLength(60);
      expect(results.effectiveCapitalization).toBe("monthly");

      // Contribution should appear in months 1-24 (years 1-2)
      expect(results.periods[0].contribution).toBe(200);   // Month 1
      expect(results.periods[1].contribution).toBe(200);   // Month 2
      expect(results.periods[11].contribution).toBe(200);  // Month 12
      expect(results.periods[12].contribution).toBe(200);  // Month 13
      expect(results.periods[23].contribution).toBe(200);  // Month 24

      // No contribution in months 25-60 (years 3-5)
      expect(results.periods[24].contribution).toBe(0);    // Month 25
      expect(results.periods[59].contribution).toBe(0);    // Month 60

      // Total invested should be 1000 (initial) + 4800 (200 * 24 months in years 1-2)
      expect(results.totalInvested).toBe(5800);
    });

    it("should maintain monthly capitalization when yearly contributions are present", () => {
      const inputs: CalculationInputs = {
        initialInvestment: 1000,
        contribution: 0,
        contributionFrequency: "none",
        interestRate: 1,
        interestBase: "monthly",
        period: 5,
        periodUnit: "years",
        capitalization: "monthly", // User configured monthly
        inflationRate: 0,
        adminFeeRate: 0,
        variableContributions: [
          {
            id: "1",
            amount: 1000,
            startPeriod: 1,
            endPeriod: 2,
            periodType: "years", // Yearly contribution
          },
        ],
      };

      const results = calculateCompoundInterest(inputs);

      // Should maintain monthly capitalization
      expect(results.effectiveCapitalization).toBe("monthly");
      
      // Should have 60 periods (60 months)
      expect(results.periods).toHaveLength(60);
      
      // Months 1-24 should have the contribution (years 1-2)
      expect(results.periods[0].contribution).toBe(1000);   // Month 1
      expect(results.periods[1].contribution).toBe(1000);   // Month 2
      expect(results.periods[23].contribution).toBe(1000);  // Month 24
      
      // Months 25-60 should have no contribution (years 3-5)
      expect(results.periods[24].contribution).toBe(0);     // Month 25
      expect(results.periods[59].contribution).toBe(0);     // Month 60
    });

    it("should apply monthly variable contributions correctly", () => {
      const inputs: CalculationInputs = {
        initialInvestment: 1000,
        contribution: 0,
        contributionFrequency: "none",
        interestRate: 0,
        interestBase: "monthly",
        period: 12,
        periodUnit: "months",
        capitalization: "monthly",
        inflationRate: 0,
        adminFeeRate: 0,
        variableContributions: [
          {
            id: "1",
            amount: 100,
            startPeriod: 3,
            endPeriod: 6,
            periodType: "months",
          },
        ],
      };

      const results = calculateCompoundInterest(inputs);

      // Should have 12 periods
      expect(results.periods).toHaveLength(12);

      // No contribution in months 1-2
      expect(results.periods[0].contribution).toBe(0);
      expect(results.periods[1].contribution).toBe(0);

      // Contribution in months 3-6
      expect(results.periods[2].contribution).toBe(100);
      expect(results.periods[3].contribution).toBe(100);
      expect(results.periods[4].contribution).toBe(100);
      expect(results.periods[5].contribution).toBe(100);

      // No contribution in months 7-12
      expect(results.periods[6].contribution).toBe(0);

      // Total invested should be 1000 (initial) + 400 (4 monthly contributions)
      expect(results.totalInvested).toBe(1400);
    });
  });
});

