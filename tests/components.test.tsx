import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InputsCard from "@/components/InputsCard";
import ResultsCard from "@/components/ResultsCard";

// Mock the store
vi.mock("@/lib/store", () => ({
  useCalculatorStore: vi.fn(() => ({
    initialInvestment: 1000,
    contribution: 200,
    contributionFrequency: "monthly",
    interestRate: 1,
    interestBase: "monthly",
    period: 12,
    periodUnit: "months",
    capitalization: "monthly",
    inflationRate: 4,
    adminFeeRate: 0,
    targetValue: null,
    showAdvanced: false,
    results: {
      futureValueNominal: 3500,
      futureValueReal: 3400,
      totalInvested: 3400,
      totalInterest: 100,
      netReturn: 2.94,
      periods: [],
    },
    setInitialInvestment: vi.fn(),
    setContribution: vi.fn(),
    setContributionFrequency: vi.fn(),
    setInterestRate: vi.fn(),
    setInterestBase: vi.fn(),
    setPeriod: vi.fn(),
    setPeriodUnit: vi.fn(),
    setCapitalization: vi.fn(),
    setInflationRate: vi.fn(),
    setAdminFeeRate: vi.fn(),
    setTargetValue: vi.fn(),
    setShowAdvanced: vi.fn(),
  })),
}));

describe("Components", () => {
  describe("InputsCard", () => {
    it("should render all input fields", () => {
      render(<InputsCard />);

      expect(
        screen.getByLabelText(/investimento inicial/i)
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/aporte recorrente/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/taxa de juros/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/duração do período/i)).toBeInTheDocument();
    });

    it("should have proper accessibility labels", () => {
      render(<InputsCard />);

      const initialInvestmentInput = screen.getByLabelText(
        /investimento inicial/i
      );
      expect(initialInvestmentInput).toHaveAttribute("aria-label");
    });

    it("should render advanced options toggle", () => {
      render(<InputsCard />);

      const advancedButton = screen.getByText(/opções avançadas/i);
      expect(advancedButton).toBeInTheDocument();
      expect(advancedButton).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("ResultsCard", () => {
    it("should render KPI cards", () => {
      render(<ResultsCard />);

      expect(screen.getByText(/valor futuro \(nominal\)/i)).toBeInTheDocument();
      expect(screen.getByText(/valor futuro \(real\)/i)).toBeInTheDocument();
      expect(screen.getByText(/total investido/i)).toBeInTheDocument();
      expect(screen.getByText(/juros totais/i)).toBeInTheDocument();
      expect(screen.getByText(/rentabilidade líquida/i)).toBeInTheDocument();
    });

    it("should display formatted values", () => {
      render(<ResultsCard />);

      // Check if currency formatting is working
      expect(screen.getByText(/R\$/)).toBeInTheDocument();
    });
  });
});

