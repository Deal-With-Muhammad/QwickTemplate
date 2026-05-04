export type QwuikProduct = {
  id: string;
  name: string;
  sku: string;
  price: number;
  emoji: string;
  category: string;
};

export const MOCK_PRODUCTS: QwuikProduct[] = [
  {
    id: 'p001',
    name: 'Organic Bananas',
    sku: '8901234567890',
    price: 2.49,
    emoji: '🍌',
    category: 'Produce',
  },
  {
    id: 'p002',
    name: 'Whole Milk 1L',
    sku: '8901234567891',
    price: 3.29,
    emoji: '🥛',
    category: 'Dairy',
  },
  {
    id: 'p003',
    name: 'Sourdough Loaf',
    sku: '8901234567892',
    price: 5.5,
    emoji: '🍞',
    category: 'Bakery',
  },
  {
    id: 'p004',
    name: 'Avocado Pack',
    sku: '8901234567893',
    price: 4.99,
    emoji: '🥑',
    category: 'Produce',
  },
  {
    id: 'p005',
    name: 'Cheddar Cheese',
    sku: '8901234567894',
    price: 7.8,
    emoji: '🧀',
    category: 'Dairy',
  },
  {
    id: 'p006',
    name: 'Cold Brew Coffee',
    sku: '8901234567895',
    price: 4.25,
    emoji: '☕️',
    category: 'Beverage',
  },
  {
    id: 'p007',
    name: 'Dark Chocolate',
    sku: '8901234567896',
    price: 3.99,
    emoji: '🍫',
    category: 'Snacks',
  },
  {
    id: 'p008',
    name: 'Sparkling Water',
    sku: '8901234567897',
    price: 1.99,
    emoji: '🥤',
    category: 'Beverage',
  },
];

export const RETAILER_PROFILE = {
  name: 'Aisha Khan',
  storeName: 'Qwuik Market — Downtown',
  employeeId: 'QW-10234',
  avatar: '👩🏽‍💼',
  checkoutsToday: 47,
  salesToday: 2148.65,
  itemsSoldToday: 213,
};

export const PAYMENT_METHODS = [
  { id: 'nfc', label: 'Tap to Pay (NFC)', icon: 'wifi', primary: true },
  { id: 'card', label: 'Card', icon: 'credit-card', primary: false },
  { id: 'cash', label: 'Cash', icon: 'dollar-sign', primary: false },
  { id: 'qr', label: 'QR Code', icon: 'maximize', primary: false },
];
