/**
 * Formatting utilities for currency, percentages, and dates
 */

/**
 * Format number as Brazilian Real currency
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format number as percentage
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

/**
 * Format period label based on capitalization frequency
 */
export function formatPeriodLabel(
  period: number,
  frequency: "monthly" | "yearly"
): string {
  if (frequency === "monthly") {
    const years = Math.floor(period / 12);
    const months = period % 12;

    if (years === 0) {
      return `M${period}`;
    } else if (months === 0) {
      return `A${years}`;
    } else {
      return `A${years}M${months}`;
    }
  } else {
    return `Ano ${period}`;
  }
}

/**
 * Format time duration in a human-readable way
 */
export function formatDuration(months: number): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) {
    return `${months} ${months === 1 ? "mês" : "meses"}`;
  } else if (remainingMonths === 0) {
    return `${years} ${years === 1 ? "ano" : "anos"}`;
  } else {
    return `${years} ${years === 1 ? "ano" : "anos"} e ${remainingMonths} ${
      remainingMonths === 1 ? "mês" : "meses"
    }`;
  }
}

/**
 * Format large numbers in a compact way (K, M, B)
 */
export function formatCompact(value: number): string {
  if (Math.abs(value) >= 1_000_000_000) {
    return `R$ ${(value / 1_000_000_000).toFixed(2)}B`;
  } else if (Math.abs(value) >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toFixed(2)}M`;
  } else if (Math.abs(value) >= 1_000) {
    return `R$ ${(value / 1_000).toFixed(2)}K`;
  }
  return formatCurrency(value);
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^\d,.-]/g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}

/**
 * Parse percentage string to number
 */
export function parsePercent(value: string): number {
  const cleaned = value.replace(/[^\d,.-]/g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}

