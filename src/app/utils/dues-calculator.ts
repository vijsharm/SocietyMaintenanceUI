import { Member, Payment } from "@/app/types";

// ApiCall: GET /api/config/baseline-date
// Response format: { baselineDate: string (YYYY-MM-DD) }
// Hardcoded: Baseline starting date for dues calculation
export const BASELINE_START_DATE = "2025-12-01"; // December 2025

/**
 * Get all months a member should have paid for based on their onboarding date
 * @param onboardingDate Member's onboarding date (YYYY-MM-DD)
 * @param currentDate Current date (defaults to today)
 * @returns Array of month strings in YYYY-MM format
 */
export function getExpectedMonths(onboardingDate: string, currentDate: Date = new Date()): string[] {
  const months: string[] = [];
  
  // Use the later of baseline date or onboarding date
  const baselineDate = new Date(BASELINE_START_DATE);
  const memberStartDate = new Date(onboardingDate);
  const startDate = memberStartDate > baselineDate ? memberStartDate : baselineDate;
  
  // Start from the first day of the month
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const end = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  
  let current = new Date(start);
  while (current <= end) {
    months.push(current.toISOString().slice(0, 7));
    current.setMonth(current.getMonth() + 1);
  }
  
  return months;
}

/**
 * Get unpaid months for a member
 * @param member Member object
 * @param payments All payments for this member
 * @returns Array of unpaid month strings in YYYY-MM format
 */
export function getUnpaidMonths(member: Member, payments: Payment[]): string[] {
  const expectedMonths = getExpectedMonths(member.onboardingDate);
  const paidMonths = payments.map(p => p.month);
  return expectedMonths.filter(month => !paidMonths.includes(month));
}

/**
 * Calculate total pending dues for a member
 * @param member Member object
 * @param payments All payments for this member
 * @returns Total pending amount
 */
export function calculatePendingDues(member: Member, payments: Payment[]): number {
  const unpaidMonths = getUnpaidMonths(member, payments);
  return unpaidMonths.length * member.monthlyAmount;
}

/**
 * Get current month in YYYY-MM format
 */
export function getCurrentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

/**
 * Format month for display
 */
export function formatMonth(month: string): string {
  const date = new Date(month + '-01');
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

/**
 * Format month short (e.g., "Jan 2026")
 */
export function formatMonthShort(month: string): string {
  const date = new Date(month + '-01');
  return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}
