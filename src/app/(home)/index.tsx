import { Redirect } from 'expo-router';
import { Spinner } from 'heroui-native';
import { View } from 'react-native';

import { useAuth } from '../../features/auth/contexts/auth-context';
import { useSettings } from '../../features/settings/contexts/settings-context';

/**
 * Auth-aware splash. Decides where to send the user based on:
 *   - settings hydration  → wait
 *   - auth status         → /login | /unlock | /dashboard
 *
 * The chosen UI variant is NOT part of the URL — every retailer hits
 * /dashboard, and the variant is resolved at render time inside that screen
 * (see app/(home)/(pos)/dashboard.tsx + features/pos/variant-resolver.tsx).
 * That keeps variant switching free of any navigation work.
 */
export default function HomeIndex() {
  const { status } = useAuth();
  const { isHydrated } = useSettings();

  if (!isHydrated || status === 'loading') {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Spinner />
      </View>
    );
  }

  if (status === 'signed-out') {
    return <Redirect href="/login" />;
  }

  if (status === 'locked') {
    return <Redirect href="/unlock" />;
  }

  return <Redirect href="/dashboard" />;
}
