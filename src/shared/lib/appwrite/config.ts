/**
 * Appwrite environment config — read from EXPO_PUBLIC_* env vars.
 * Mirror of the NewAdmin config so both clients hit the same backend.
 */
export const appwriteConfig = {
  endpoint:
    process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT ??
    'https://nyc.cloud.appwrite.io/v1',
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID ?? '',
  platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM ?? 'com.qwuik.app',
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID ?? 'default',
  collections: {
    users: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID ?? 'user',
    stores: process.env.EXPO_PUBLIC_APPWRITE_STORES_COLLECTION_ID ?? 'store',
    orders: process.env.EXPO_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID ?? 'order',
    discounts:
      process.env.EXPO_PUBLIC_APPWRITE_DISCOUNTS_COLLECTION_ID ?? 'discounts',
    loyaltyCards:
      process.env.EXPO_PUBLIC_APPWRITE_LOYALTY_CARDS_COLLECTION_ID ??
      'loyalty_cards',
  },
} as const;

export type AppwriteConfig = typeof appwriteConfig;
