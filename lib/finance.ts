/**
 * Finance calculation library for compound interest calculator
 * All calculations use precise formulas to avoid cumulative errors
 */

export type InterestBase = "monthly" | "yearly";
export type CapitalizationFrequency = "monthly" | "yearly";
export type ContributionFrequency = "monthly" | "yearly" | "none";

export interface VariableContribution {
  id: string;
  amount: number;
  startPeriod: number;
  endPeriod: number;
  periodType: "months" | "years";
}

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
  variableContributions?: VariableContribution[];
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
  lastMonthInterest: number;
  periods: PeriodData[];
  effectiveCapitalization: CapitalizationFrequency;
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
  // If base and capitalization are the same, use the rate directly
  if (interestBase === capitalization) {
    return Math.max(interestRate / 100 - adminFeeRate / 100, 0);
  }

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
 * Get variable contribution for a specific period
 */
function getVariableContribution(
  periodNumber: number,
  capitalization: CapitalizationFrequency,
  variableContributions?: VariableContribution[]
): number {
  if (!variableContributions || variableContributions.length === 0) {
    return 0;
  }

  let totalContribution = 0;

  for (const vc of variableContributions) {
    // Convert current calculation period to months for comparison
    const periodInMonths = capitalization === "monthly" ? periodNumber : periodNumber * 12;

    // Normalize contribution window to months
    // If the contribution is defined in years, map:
    //   Year 1 -> months 1..12, Year 2 -> months 13..24, etc.
    // So: startYear -> (startYear - 1) * 12 + 1, endYear -> endYear * 12
    const startInMonths = vc.periodType === "months"
      ? vc.startPeriod
      : (vc.startPeriod - 1) * 12 + 1;
    const endInMonths = vc.periodType === "months"
      ? vc.endPeriod
      : vc.endPeriod * 12;

    // Check if current period is within configured range
    if (periodInMonths >= startInMonths && periodInMonths <= endInMonths) {
      if (vc.periodType === "months") {
        if (capitalization === "monthly") {
          // Exact monthly contribution at each month within the range
          totalContribution += vc.amount;
        } else {
          // capitalization === 'yearly': sum the exact months within this year window
          const yearStart = (periodNumber - 1) * 12 + 1;
          const yearEnd = periodNumber * 12;
          const overlapStart = Math.max(startInMonths, yearStart);
          const overlapEnd = Math.min(endInMonths, yearEnd);
          const monthsOverlap = Math.max(0, overlapEnd - overlapStart + 1);
          totalContribution += vc.amount * monthsOverlap;
        }
      } else { // vc.periodType === 'years'
        if (capitalization === "monthly") {
          // Apply yearly contribution monthly within the year range
          // Convert year range to months: year 1 = months 1-12, year 2 = months 13-24, etc.
          const yearStartInMonths = (vc.startPeriod - 1) * 12 + 1;
          const yearEndInMonths = vc.endPeriod * 12;
          
          // Check if current period is within the year range
          if (periodInMonths >= yearStartInMonths && periodInMonths <= yearEndInMonths) {
            totalContribution += vc.amount;
          }
        } else {
          // capitalization === 'yearly': add once per year when this year is within the configured years range
          const yearStart = (periodNumber - 1) * 12 + 1;
          if (yearStart >= startInMonths && yearStart <= endInMonths) {
            totalContribution += vc.amount;
          }
        }
      }
    }
  }

  return totalContribution;
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
    variableContributions,
  } = inputs;

  // Keep the original capitalization - don't auto-adjust
  const effectiveCapitalization = capitalization;

  // Get effective interest rate per period
  const effectiveRate = getEffectiveRate(
    interestRate,
    interestBase,
    effectiveCapitalization,
    adminFeeRate
  );

  // Get contribution per capitalization period
  const contributionPerPeriod = getContributionPerPeriod(
    contribution,
    contributionFrequency,
    effectiveCapitalization
  );

  // Get total number of periods
  const totalPeriods = getTotalPeriods(period, periodUnit, effectiveCapitalization);

  // Calculate period by period
  const periods: PeriodData[] = [];
  let balance = initialInvestment;
  let totalInvested = initialInvestment;

  for (let i = 1; i <= totalPeriods; i++) {
    const initialBalance = balance;
    
    // Get variable contribution for this period
    const variableContribution = getVariableContribution(i, effectiveCapitalization, variableContributions);
    
    // Total contribution for this period
    const periodContribution = contributionPerPeriod + variableContribution;
    
    // Calculate interest on current balance (before adding contribution)
    const interest = balance * effectiveRate;
    balance += interest;

    // Add contribution at the end of period (ordinary annuity)
    balance += periodContribution;
    totalInvested += periodContribution;

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
  
  // Calculate annualized return rate (effective annual rate after admin fees)
  // This is the interest rate the investment is earning per year
  let netReturn = 0;
  if (interestBase === "yearly") {
    // Already annual, just subtract admin fee
    netReturn = Math.max(interestRate - adminFeeRate, 0);
  } else {
    // Monthly rate - convert to effective annual rate
    const effectiveRateMonthly = getEffectiveRate(
      interestRate,
      interestBase,
      "monthly" as CapitalizationFrequency,
      adminFeeRate
    );
    netReturn = (Math.pow(1 + effectiveRateMonthly, 12) - 1) * 100;
  }
  
  // Get last month's interest (last period's interest)
  const lastMonthInterest = periods.length > 0 ? periods[periods.length - 1].interest : 0;

  const results: CalculationResults = {
    futureValueNominal,
    futureValueReal,
    totalInvested,
    totalInterest,
    netReturn,
    lastMonthInterest,
    periods,
    effectiveCapitalization,
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
    variableContributions,
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
    
    // Calculate FV for this number of months using the same logic as calculateCompoundInterest
    let balance = initialInvestment;
    
    for (let i = 1; i <= mid; i++) {
      // Get variable contribution for this period (monthly calculation)
      const variableContribution = getVariableContribution(i, "monthly", variableContributions);
      
      // Total contribution for this period
      const periodContribution = monthlyContribution + variableContribution;
      
      // Calculate interest first (ordinary annuity)
      const interest = balance * monthlyRate;
      balance += interest;

      // Then add contribution at end of period
      balance += periodContribution;
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

