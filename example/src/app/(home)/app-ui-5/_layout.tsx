import { Stack } from 'expo-router';
import { useThemeColor } from 'heroui-native';

export default function Layout() {
  const themeColorBackground = useThemeColor('background');

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor: themeColorBackground,
        },
      }}
    >
      <Stack.Screen name="index" options={{ animation: 'fade' }} />
      <Stack.Screen name="tabs" />
      <Stack.Screen
        name="quick-actions"
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
        }}
      />
    </Stack>
  );
}
