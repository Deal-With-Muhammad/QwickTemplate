import { Platform } from 'react-native';

/**
 * Resolve the platform identifier Appwrite expects. iOS uses the bundle id,
 * Android uses the application id. Both must be registered as separate
 * platforms in Appwrite Console → Project → Settings → Platforms.
 *
 * Override per-OS via env if needed (rarely necessary):
 *   EXPO_PUBLIC_APPWRITE_PLATFORM_IOS
 *   EXPO_PUBLIC_APPWRITE_PLATFORM_ANDROID
 *   EXPO_PUBLIC_APPWRITE_PLATFORM        (legacy single-value fallback)
 */
function resolvePlatform(): string {
  const fromIos = process.env.EXPO_PUBLIC_APPWRITE_PLATFORM_IOS;
  const fromAndroid = process.env.EXPO_PUBLIC_APPWRITE_PLATFORM_ANDROID;
  const legacy = process.env.EXPO_PUBLIC_APPWRITE_PLATFORM;

  return (
    Platform.select({
      ios: fromIos ?? legacy ?? 'com.qwuik.app',
      android: fromAndroid ?? legacy ?? 'com.qwuik.android',
      default: legacy ?? 'com.qwuik.app',
    }) ?? 'com.qwuik.app'
  );
}

/**
 * Appwrite environment config — read from EXPO_PUBLIC_* env vars.
 * Mirror of the NewAdmin config so both clients hit the same backend.
 */
export const appwriteConfig = {
  endpoint:
    process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT ??
    'https://nyc.cloud.appwrite.io/v1',
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID ?? '',
  platform: resolvePlatform(),
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
