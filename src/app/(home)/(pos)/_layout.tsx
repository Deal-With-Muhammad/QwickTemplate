import { Stack } from 'expo-router';
import { useThemeColor } from 'heroui-native';

/**
 * Canonical POS route stack — every screen lives at /<screen>, regardless of
 * which UI variant the retailer has picked. Variant components are resolved
 * inside each screen (see ./dashboard.tsx etc.). This means switching the
 * variant from Settings does not change the URL or the navigation stack —
 * only the rendered tree updates, so the swap is instant.
 */
export default function PosLayout() {
  const themeColorBackground = useThemeColor('background');

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        animation: 'fade',
        animationDuration: 200,
        contentStyle: {
          backgroundColor: themeColorBackground,
        },
      }}
    >
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="scan" />
      <Stack.Screen name="cart" />
      <Stack.Screen name="loyalty" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="receipt" />
    </Stack>
  );
}
