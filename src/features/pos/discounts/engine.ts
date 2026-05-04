import type {
  CartLineItem,
  DiscountLine,
  LoyaltyProgramId,
  Member,
} from '../types';

/**
 * Per-program discount rules. Each rule receives the active member and the
 * cart, and returns 0..N DiscountLine entries.
 *
 * Adding a new program = adding one entry here. The cart never has to know
 * which programs exist.
 */
type DiscountRule = (params: {
  member: Member;
  programId: LoyaltyProgramId;
  items: CartLineItem[];
}) => DiscountLine[];

const RULES: Record<LoyaltyProgramId, DiscountRule | undefined> = {
  // AI Cart (insurance): 10% off vegetables, on every line.
  'ai-cart': ({ programId, items }) => {
    return items
      .filter((it) => it.category === 'vegetables')
      .map((it) => ({
        id: `${programId}:${it.id}`,
        programId,
        label: `AI Cart 10% off — ${it.name}`,
        amountCents: Math.round(it.priceCents * it.quantity * 0.1),
        appliesTo: [it.id],
      }));
  },

  // QWUIK Rewards: no auto-discount, points are redeemed manually at payment.
  'qwuik-rewards': undefined,
};

export function evaluateDiscounts(
  member: Member | null,
  items: CartLineItem[]
): DiscountLine[] {
  if (!member) return [];

  const out: DiscountLine[] = [];

  for (const program of member.programs) {
    const rule = RULES[program.id];

    if (!rule) continue;
    out.push(...rule({ member, programId: program.id, items }));
  }

  return out;
}

/** Sum of all discount amounts. */
export function discountTotalCents(discounts: DiscountLine[]): number {
  return discounts.reduce((sum, d) => sum + d.amountCents, 0);
}
