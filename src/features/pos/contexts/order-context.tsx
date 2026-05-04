import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';

import { discountTotalCents, evaluateDiscounts } from '../discounts/engine';
import type {
  CartLineItem,
  DiscountLine,
  Member,
  OrderTotals,
} from '../types';
import { POINTS_TO_CENTS } from '../types';

interface OrderContextValue {
  /** Looked-up loyalty member for this checkout, or null for walk-ins. */
  member: Member | null;
  /** Cashier flagged the customer as not-a-member / skipped the lookup. */
  memberSkipped: boolean;
  /** Whether the cashier opted to redeem points at payment time. */
  useRewards: boolean;
  /** Items currently in the cart. */
  items: CartLineItem[];
  /** Auto-evaluated discount lines. Re-computed whenever member or items change. */
  discounts: DiscountLine[];
  /** Aggregated money totals derived from items + discounts + points. */
  totals: OrderTotals;

  setMember: (member: Member | null) => void;
  skipMember: () => void;
  toggleUseRewards: (next?: boolean) => void;

  addItem: (item: CartLineItem) => void;
  /** Bumps quantity of an existing line, or adds a new line if not present. */
  addOrIncrement: (item: CartLineItem) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;

  /** Wipes the entire order — call on receipt or cancel. */
  reset: () => void;
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

function computeTotals(
  items: CartLineItem[],
  discounts: DiscountLine[],
  pointsApplied: number
): OrderTotals {
  const subtotalCents = items.reduce(
    (sum, it) => sum + it.priceCents * it.quantity,
    0
  );
  const discountTotalCents_ = discountTotalCents(discounts);
  const pointsAppliedCents = pointsApplied * POINTS_TO_CENTS;

  const payableCents = Math.max(
    0,
    subtotalCents - discountTotalCents_ - pointsAppliedCents
  );

  return {
    subtotalCents,
    discountTotalCents: discountTotalCents_,
    pointsAppliedCents,
    payableCents,
  };
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [member, setMemberState] = useState<Member | null>(null);
  const [memberSkipped, setMemberSkipped] = useState(false);
  const [useRewards, setUseRewards] = useState(false);
  const [items, setItems] = useState<CartLineItem[]>([]);

  const discounts = useMemo(
    () => evaluateDiscounts(member, items),
    [member, items]
  );

  const pointsApplied = useMemo(() => {
    if (!useRewards || !member) return 0;
    const balance =
      member.programs.find((p) => p.id === 'qwuik-rewards')?.points ?? 0;
    const subtotalCents = items.reduce(
      (sum, it) => sum + it.priceCents * it.quantity,
      0
    );
    const afterDiscountCents = Math.max(
      0,
      subtotalCents - discountTotalCents(discounts)
    );

    // Cap points to whatever's left after auto-discounts so we never owe.
    return Math.min(balance, Math.floor(afterDiscountCents / POINTS_TO_CENTS));
  }, [useRewards, member, items, discounts]);

  const totals = useMemo(
    () => computeTotals(items, discounts, pointsApplied),
    [items, discounts, pointsApplied]
  );

  const setMember = useCallback((next: Member | null) => {
    setMemberState(next);
    setMemberSkipped(false);
  }, []);

  const skipMember = useCallback(() => {
    setMemberState(null);
    setMemberSkipped(true);
    setUseRewards(false);
  }, []);

  const toggleUseRewards = useCallback((next?: boolean) => {
    setUseRewards((prev) => (next === undefined ? !prev : next));
  }, []);

  const addItem = useCallback((item: CartLineItem) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const addOrIncrement = useCallback((incoming: CartLineItem) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.barcode === incoming.barcode);

      if (idx >= 0) {
        const next = prev.slice();
        const existing = next[idx]!;

        next[idx] = {
          ...existing,
          quantity: existing.quantity + incoming.quantity,
        };

        return next;
      }

      return [...prev, incoming];
    });
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((it) => (it.id === lineId ? { ...it, quantity } : it))
        .filter((it) => it.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((lineId: string) => {
    setItems((prev) => prev.filter((it) => it.id !== lineId));
  }, []);

  const reset = useCallback(() => {
    setMemberState(null);
    setMemberSkipped(false);
    setUseRewards(false);
    setItems([]);
  }, []);

  const value = useMemo<OrderContextValue>(
    () => ({
      member,
      memberSkipped,
      useRewards,
      items,
      discounts,
      totals,
      setMember,
      skipMember,
      toggleUseRewards,
      addItem,
      addOrIncrement,
      updateQuantity,
      removeItem,
      reset,
    }),
    [
      member,
      memberSkipped,
      useRewards,
      items,
      discounts,
      totals,
      setMember,
      skipMember,
      toggleUseRewards,
      addItem,
      addOrIncrement,
      updateQuantity,
      removeItem,
      reset,
    ]
  );

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);

  if (!ctx) {
    throw new Error('useOrder must be used within an OrderProvider');
  }

  return ctx;
}
