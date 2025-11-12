/**
 * Number formatting utilities
 * Handles cases where backend returns numbers as strings
 */

/**
 * Safely converts a value to a number and formats it with fixed decimal places
 * @param value - The value to format (can be number or string)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number string
 */
export function formatNumber(value: number | string | null | undefined, decimals: number = 2): string {
  const num = Number(value || 0);
  return isNaN(num) ? '0.00' : num.toFixed(decimals);
}

/**
 * Safely converts a value to a number
 * @param value - The value to convert
 * @param defaultValue - Default value if conversion fails (default: 0)
 * @returns Number value
 */
export function toNumber(value: number | string | null | undefined, defaultValue: number = 0): number {
  const num = Number(value ?? defaultValue);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Formats currency with symbol
 * @param value - The amount
 * @param currency - Currency code (e.g., 'PLN', 'EUR')
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number | string | null | undefined,
  currency: string,
  decimals: number = 2
): string {
  return `${formatNumber(value, decimals)} ${currency}`;
}

/**
 * Formats percentage
 * @param value - The percentage value
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number | string | null | undefined, decimals: number = 0): string {
  return `${formatNumber(value, decimals)}%`;
}

