/**
 * Domain types for the in-progress order. Each checkout owns one Order
 * instance via OrderContext. Reset on receipt / cancel.
 */

export type LoyaltyProgramId = 'qwuik-rewards' | 'ai-cart';

export interface LoyaltyProgram {
  id: LoyaltyProgramId;
  name: string;
  /** Member's points balance under this program (0 if N/A). */
  points: number;
}

export interface Member {
  id: string;
  name: string;
  /** May be empty for walk-ins. */
  email?: string;
  /** Stored on the record but never used for lookup. */
  phone?: string;
  /** Loyalty card number — the value scanned, tapped, or typed manually. */
  cardNumber: string;
  programs: LoyaltyProgram[];
}

export interface CartLineItem {
  id: string;
  /** Stable barcode (or manually entered code). */
  barcode: string;
  name: string;
  category: string;
  /** Unit price before discount, in cents. */
  priceCents: number;
  quantity: number;
}

export interface DiscountLine {
  /** Stable id so we can dedupe across re-evaluations. */
  id: string;
  /** Which program triggered this discount. */
  programId: LoyaltyProgramId;
  /** Human label shown on the cart line. */
  label: string;
  /** Total deduction in cents. Always non-negative. */
  amountCents: number;
  /** Cart line ids this discount applies to (for traceability). */
  appliesTo: string[];
}

export interface OrderTotals {
  subtotalCents: number;
  discountTotalCents: number;
  pointsAppliedCents: number;
  /** Final amount the customer pays. */
  payableCents: number;
}

export const POINTS_TO_CENTS = 1; // 1 point = 1 cent (= $0.01)
