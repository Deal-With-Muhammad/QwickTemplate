import { Redirect } from 'expo-router';
import { Spinner } from 'heroui-native';
import { View } from 'react-native';

import { useAuth } from '../../features/auth/contexts/auth-context';
import { useSettings } from '../../features/settings/contexts/settings-context';
import { UI_VARIANTS } from '../../features/settings/types';

/**
 * Auth-aware splash. Decides where to send the user based on:
 *   - settings hydration  → wait
 *   - auth status         → /login | /unlock | active variant
 *
 * No UI of its own apart from a centred spinner while we resolve.
 */
export default function HomeIndex() {
  const { status } = useAuth();
  const { settings, isHydrated } = useSettings();

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

  const variant = UI_VARIANTS.find((v) => v.id === settings.uiVariant);
  const target = variant ?? UI_VARIANTS[0];

  if (!target) {
    // No variants registered — should never happen unless every entry is
    // commented out in src/features/settings/types.ts.
    return null;
  }

  return <Redirect href={`/${target.routeSegment}/dashboard`} />;
}
