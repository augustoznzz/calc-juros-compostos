/**
 * Finance calculation library for compound interest calculator
 * All calculations use precise formulas to avoid cumulative errors
 */

export type InterestBase = "monthly" | "yearly";
export type CapitalizationFrequency = "monthly" | "yearly";
export type ContributionFrequency = "monthly" | "yearly" | "none";

export interface CalculationInputs {
  initialInvestment: number;
  contribution: number;
  contributionFrequency: ContributionFrequency;
  interestRate: number;
  interestBase: InterestBase;
  period: number;
  periodUnit: "months" | "years";
  capitalization: CapitalizationFrequency;
  inflationRate: number; // annual
  adminFeeRate: number; // annual
  targetValue?: number; // optional goal
}

export interface PeriodData {
  period: number;
  initialBalance: number;
  contribution: number;
  interest: number;
  finalBalance: number;
  totalInvested: number;
}

export interface CalculationResults {
  futureValueNominal: number;
  futureValueReal: number;
  totalInvested: number;
  totalInterest: number;
  netReturn: number;
  periods: PeriodData[];
  timeToGoal?: {
    months: number;
    years: number;
    monthsRemainder: number;
  };
}

/**
 * Convert annual interest rate to monthly
 */
export function annualToMonthly(annualRate: number): number {
  return Math.pow(1 + annualRate / 100, 1 / 12) - 1;
}

/**
 * Convert monthly interest rate to annual
 */
export function monthlyToAnnual(monthlyRate: number): number {
  return (Math.pow(1 + monthlyRate / 100, 12) - 1) * 100;
}

/**
 * Get the effective interest rate per capitalization period after admin fees
 */
function getEffectiveRate(
  interestRate: number,
  interestBase: InterestBase,
  capitalization: CapitalizationFrequency,
  adminFeeRate: number
): number {
  // First, convert to annual effective rate
  let annualEffectiveRate: number;

  if (interestBase === "monthly") {
    // Convert monthly to annual
    annualEffectiveRate = Math.pow(1 + interestRate / 100, 12) - 1;
  } else {
    annualEffectiveRate = interestRate / 100;
  }

  // Subtract admin fee (annual)
  const netAnnualRate = Math.max(
    annualEffectiveRate - adminFeeRate / 100,
    0
  );

  // Convert back to the capitalization frequency
  if (capitalization === "monthly") {
    return Math.pow(1 + netAnnualRate, 1 / 12) - 1;
  } else {
    return netAnnualRate;
  }
}

/**
 * Convert contribution to match capitalization frequency
 */
function getContributionPerPeriod(
  contribution: number,
  contributionFreq: ContributionFrequency,
  capitalization: CapitalizationFrequency
): number {
  if (contributionFreq === "none") return 0;

  if (contributionFreq === capitalization) {
    return contribution;
  }

  // Convert yearly to monthly or vice versa
  if (contributionFreq === "yearly" && capitalization === "monthly") {
    return contribution / 12;
  }

  if (contributionFreq === "monthly" && capitalization === "yearly") {
    return contribution * 12;
  }

  return contribution;
}

/**
 * Get total number of capitalization periods
 */
function getTotalPeriods(
  period: number,
  periodUnit: "months" | "years",
  capitalization: CapitalizationFrequency
): number {
  const months = periodUnit === "months" ? period : period * 12;

  if (capitalization === "monthly") {
    return months;
  } else {
    return Math.floor(months / 12);
  }
}

/**
 * Calculate compound interest with all features
 */
export function calculateCompoundInterest(
  inputs: CalculationInputs
): CalculationResults {
  const {
    initialInvestment,
    contribution,
    contributionFrequency,
    interestRate,
    interestBase,
    period,
    periodUnit,
    capitalization,
    inflationRate,
    adminFeeRate,
  } = inputs;

  // Get effective interest rate per period
  const effectiveRate = getEffectiveRate(
    interestRate,
    interestBase,
    capitalization,
    adminFeeRate
  );

  // Get contribution per capitalization period
  const contributionPerPeriod = getContributionPerPeriod(
    contribution,
    contributionFrequency,
    capitalization
  );

  // Get total number of periods
  const totalPeriods = getTotalPeriods(period, periodUnit, capitalization);

  // Calculate period by period
  const periods: PeriodData[] = [];
  let balance = initialInvestment;
  let totalInvested = initialInvestment;

  for (let i = 1; i <= totalPeriods; i++) {
    const initialBalance = balance;
    const periodContribution = contributionPerPeriod;
    
    // Add contribution at the end of period
    balance += periodContribution;
    totalInvested += periodContribution;
    
    // Calculate interest
    const interest = balance * effectiveRate;
    balance += interest;

    periods.push({
      period: i,
      initialBalance,
      contribution: periodContribution,
      interest,
      finalBalance: balance,
      totalInvested,
    });
  }

  const futureValueNominal = balance;

  // Calculate real value (inflation adjusted)
  const monthlyInflationRate = Math.pow(1 + inflationRate / 100, 1 / 12) - 1;
  const totalMonths =
    periodUnit === "months" ? period : period * 12;
  const inflationFactor = Math.pow(1 + monthlyInflationRate, totalMonths);
  const futureValueReal = futureValueNominal / inflationFactor;

  const totalInterest = futureValueNominal - totalInvested;
  const netReturn = totalInvested > 0 ? (totalInterest / totalInvested) * 100 : 0;

  const results: CalculationResults = {
    futureValueNominal,
    futureValueReal,
    totalInvested,
    totalInterest,
    netReturn,
    periods,
  };

  return results;
}

/**
 * Calculate time needed to reach a target value
 */
export function calculateTimeToGoal(
  inputs: Omit<CalculationInputs, "period" | "periodUnit">,
  targetValue: number
): { months: number; years: number; monthsRemainder: number } | null {
  const {
    initialInvestment,
    contribution,
    contributionFrequency,
    interestRate,
    interestBase,
    adminFeeRate,
  } = inputs;

  // Get effective interest rate per month (always calculate monthly for precision)
  let monthlyRate: number;
  if (interestBase === "monthly") {
    const annualRate = Math.pow(1 + interestRate / 100, 12) - 1;
    const netAnnualRate = Math.max(annualRate - adminFeeRate / 100, 0);
    monthlyRate = Math.pow(1 + netAnnualRate, 1 / 12) - 1;
  } else {
    const netAnnualRate = Math.max(interestRate / 100 - adminFeeRate / 100, 0);
    monthlyRate = Math.pow(1 + netAnnualRate, 1 / 12) - 1;
  }

  // Get monthly contribution
  let monthlyContribution = 0;
  if (contributionFrequency === "monthly") {
    monthlyContribution = contribution;
  } else if (contributionFrequency === "yearly") {
    monthlyContribution = contribution / 12;
  }

  // Binary search for the number of months
  let low = 0;
  let high = 1200; // Max 100 years
  let result = -1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    
    // Calculate FV for this number of months
    let balance = initialInvestment;
    for (let i = 0; i < mid; i++) {
      balance += monthlyContribution;
      balance *= 1 + monthlyRate;
    }

    if (Math.abs(balance - targetValue) < 0.01) {
      result = mid;
      break;
    } else if (balance < targetValue) {
      low = mid + 1;
    } else {
      result = mid;
      high = mid - 1;
    }
  }

  if (result === -1 || result >= 1200) {
    return null; // Goal not reachable or takes too long
  }

  return {
    months: result,
    years: Math.floor(result / 12),
    monthsRemainder: result % 12,
  };
}

/**
 * Calculate future value using the standard compound interest formula
 * FV = P * (1 + i)^n + A * [((1 + i)^n - 1) / i]
 */
export function calculateFutureValue(
  principal: number,
  contribution: number,
  rate: number,
  periods: number
): number {
  if (rate === 0) {
    return principal + contribution * periods;
  }

  const principalFV = principal * Math.pow(1 + rate, periods);
  const contributionFV =
    contribution * ((Math.pow(1 + rate, periods) - 1) / rate);

  return principalFV + contributionFV;
}

