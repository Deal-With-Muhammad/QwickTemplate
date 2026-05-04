import type { Member } from '../types';

/**
 * Hardcoded mock members until the Appwrite-backed lookup is wired up.
 * Replace `findMemberByCardNumber` with a real query against the
 * `loyalty_cards` + `user` collections when ready.
 */
const MOCK_MEMBERS: Member[] = [
  {
    id: 'mem-aisha',
    name: 'Aisha Tan',
    email: 'aisha@example.com',
    phone: '+6590000010',
    cardNumber: 'QW-0001-2026',
    programs: [
      { id: 'qwuik-rewards', name: 'QWUIK Rewards', points: 250 },
      { id: 'ai-cart', name: 'AI Cart', points: 0 },
    ],
  },
  {
    id: 'mem-marcus',
    name: 'Marcus Lim',
    email: '',
    phone: '+6590000011',
    cardNumber: 'QW-0002-2026',
    programs: [{ id: 'qwuik-rewards', name: 'QWUIK Rewards', points: 80 }],
  },
  {
    id: 'mem-jane',
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '+6590000012',
    cardNumber: 'AC-7788-2026',
    programs: [{ id: 'ai-cart', name: 'AI Cart', points: 0 }],
  },
];

/** Strip non-alphanumeric so `0001` matches `QW-0001-2026`. */
function normalise(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

export function findMemberByCardNumber(input: string): Member | null {
  if (!input) return null;
  const needle = normalise(input);

  if (!needle) return null;

  return (
    MOCK_MEMBERS.find((m) =>
      normalise(m.cardNumber).includes(needle)
    ) ?? null
  );
}

/**
 * Mocks a barcode scan. The cashier hits "Scan" → camera/scanner reads a
 * barcode → it resolves to this card number. When a real scanner is wired
 * in, replace the body with `findMemberByCardNumber(scanned)`.
 */
export function mockScanBarcode(): Member {
  return MOCK_MEMBERS[0]!; // Aisha — has both QWUIK Rewards + AI Cart
}

/**
 * Mocks an NFC tap. Different card → resolves to a different member so the
 * three lookup options visibly behave differently during testing.
 */
export function mockTapCard(): Member {
  return MOCK_MEMBERS[1]!; // Marcus — QWUIK Rewards only
}

/** Exposed for tests + dev tooling. */
export function listMockMembers(): Member[] {
  return MOCK_MEMBERS;
}
