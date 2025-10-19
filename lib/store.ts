"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CalculationInputs,
  CalculationResults,
  calculateCompoundInterest,
  calculateTimeToGoal,
  type InterestBase,
  type CapitalizationFrequency,
  type ContributionFrequency,
} from "./finance";

interface CalculatorState {
  // Inputs
  initialInvestment: number;
  contribution: number;
  contributionFrequency: ContributionFrequency;
  interestRate: number;
  interestBase: InterestBase;
  period: number;
  periodUnit: "months" | "years";
  capitalization: CapitalizationFrequency;
  inflationRate: number;
  adminFeeRate: number;
  targetValue: number | null;

  // Advanced options toggle
  showAdvanced: boolean;

  // Results (computed)
  results: CalculationResults | null;

  // Actions
  setInitialInvestment: (value: number) => void;
  setContribution: (value: number) => void;
  setContributionFrequency: (value: ContributionFrequency) => void;
  setInterestRate: (value: number) => void;
  setInterestBase: (value: InterestBase) => void;
  setPeriod: (value: number) => void;
  setPeriodUnit: (value: "months" | "years") => void;
  setCapitalization: (value: CapitalizationFrequency) => void;
  setInflationRate: (value: number) => void;
  setAdminFeeRate: (value: number) => void;
  setTargetValue: (value: number | null) => void;
  setShowAdvanced: (value: boolean) => void;
  calculate: () => void;
  reset: () => void;
}

// Default values
const defaultState = {
  initialInvestment: 1000,
  contribution: 200,
  contributionFrequency: "monthly" as ContributionFrequency,
  interestRate: 1,
  interestBase: "monthly" as InterestBase,
  period: 12,
  periodUnit: "months" as "months" | "years",
  capitalization: "monthly" as CapitalizationFrequency,
  inflationRate: 4,
  adminFeeRate: 0,
  targetValue: null,
  showAdvanced: false,
  results: null,
};

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set, get) => ({
      ...defaultState,

      setInitialInvestment: (value) => {
        set({ initialInvestment: value });
        get().calculate();
      },

      setContribution: (value) => {
        set({ contribution: value });
        get().calculate();
      },

      setContributionFrequency: (value) => {
        set({ contributionFrequency: value });
        get().calculate();
      },

      setInterestRate: (value) => {
        set({ interestRate: value });
        get().calculate();
      },

      setInterestBase: (value) => {
        set({ interestBase: value });
        get().calculate();
      },

      setPeriod: (value) => {
        set({ period: value });
        get().calculate();
      },

      setPeriodUnit: (value) => {
        set({ periodUnit: value });
        get().calculate();
      },

      setCapitalization: (value) => {
        set({ capitalization: value });
        get().calculate();
      },

      setInflationRate: (value) => {
        set({ inflationRate: value });
        get().calculate();
      },

      setAdminFeeRate: (value) => {
        set({ adminFeeRate: value });
        get().calculate();
      },

      setTargetValue: (value) => {
        set({ targetValue: value });
        get().calculate();
      },

      setShowAdvanced: (value) => {
        set({ showAdvanced: value });
      },

      calculate: () => {
        const state = get();
        const inputs: CalculationInputs = {
          initialInvestment: state.initialInvestment,
          contribution: state.contribution,
          contributionFrequency: state.contributionFrequency,
          interestRate: state.interestRate,
          interestBase: state.interestBase,
          period: state.period,
          periodUnit: state.periodUnit,
          capitalization: state.capitalization,
          inflationRate: state.inflationRate,
          adminFeeRate: state.adminFeeRate,
        };

        const results = calculateCompoundInterest(inputs);

        // Calculate time to goal if target is set
        if (state.targetValue && state.targetValue > 0) {
          const timeToGoal = calculateTimeToGoal(inputs, state.targetValue);
          results.timeToGoal = timeToGoal || undefined;
        }

        set({ results });
      },

      reset: () => {
        set({ ...defaultState });
      },
    }),
    {
      name: "compound-calc:v1",
      partialize: (state) => ({
        initialInvestment: state.initialInvestment,
        contribution: state.contribution,
        contributionFrequency: state.contributionFrequency,
        interestRate: state.interestRate,
        interestBase: state.interestBase,
        period: state.period,
        periodUnit: state.periodUnit,
        capitalization: state.capitalization,
        inflationRate: state.inflationRate,
        adminFeeRate: state.adminFeeRate,
        targetValue: state.targetValue,
        showAdvanced: state.showAdvanced,
      }),
    }
  )
);

