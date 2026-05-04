import Feather from '@expo/vector-icons/Feather';
import { Tabs, useRouter } from 'expo-router';
import { useThemeColor } from 'heroui-native';
import { Platform, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../../components/app-text';
import { useAppTheme } from '../../../../contexts/app-theme-context';

const StyledFeather = withUniwind(Feather);

type TabConfig = {
  name: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
};

const TABS: TabConfig[] = [
  { name: 'index', label: 'Home', icon: 'home' },
  { name: 'checkout', label: 'Checkout', icon: 'shopping-bag' },
  // fab injected in the middle
  { name: 'analytics', label: 'Stats', icon: 'bar-chart-2' },
  { name: 'inventory', label: 'Stock', icon: 'package' },
];

export default function TabsLayout() {
  const { isDark } = useAppTheme();
  const themeColorBackground = useThemeColor('background');
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: themeColorBackground,
        },
        tabBarStyle: { display: 'none' }, // hide the default tab bar — we render our own
      }}
      tabBar={({ state, navigation }) => {
        const currentIndex = state.index;
        const currentName = state.routes[currentIndex]?.name;

        return (
          <View
            style={{
              paddingBottom: Platform.select({
                ios: insets.bottom,
                android: 12,
              }),
              paddingTop: 8,
              paddingHorizontal: 16,
              backgroundColor: themeColorBackground,
              borderTopWidth: 1,
              borderTopColor: isDark
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(0,0,0,0.06)',
            }}
          >
            <View className="flex-row items-center justify-between">
              {/* left tabs: home + checkout */}
              {TABS.slice(0, 2).map((t) => {
                const active = currentName === t.name;
                return (
                  <Pressable
                    key={t.name}
                    onPress={() => navigation.navigate(t.name)}
                    className="flex-1 items-center gap-1 py-1"
                  >
                    <StyledFeather
                      name={t.icon}
                      size={22}
                      className={
                        active
                          ? 'text-foreground'
                          : isDark
                            ? 'text-white/40'
                            : 'text-black/40'
                      }
                    />
                    <AppText
                      className={
                        active
                          ? 'text-[10px] font-bold text-foreground'
                          : 'text-[10px] font-medium text-muted'
                      }
                    >
                      {t.label}
                    </AppText>
                    {active && (
                      <View className="size-1 rounded-full bg-[#FFD60A] mt-0.5" />
                    )}
                  </Pressable>
                );
              })}

              {/* center: FAB quick actions */}
              <Pressable
                onPress={() => router.push('/app-ui-5/quick-actions')}
                className="size-14 rounded-full bg-[#FFD60A] items-center justify-center -mt-8 mx-2"
                style={{
                  shadowColor: '#FFD60A',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 10,
                  elevation: 8,
                }}
              >
                <StyledFeather name="plus" size={26} className="text-black" />
              </Pressable>

              {/* right tabs: analytics + inventory + profile */}
              {TABS.slice(2).map((t) => {
                const active = currentName === t.name;
                return (
                  <Pressable
                    key={t.name}
                    onPress={() => navigation.navigate(t.name)}
                    className="flex-1 items-center gap-1 py-1"
                  >
                    <StyledFeather
                      name={t.icon}
                      size={22}
                      className={
                        active
                          ? 'text-foreground'
                          : isDark
                            ? 'text-white/40'
                            : 'text-black/40'
                      }
                    />
                    <AppText
                      className={
                        active
                          ? 'text-[10px] font-bold text-foreground'
                          : 'text-[10px] font-medium text-muted'
                      }
                    >
                      {t.label}
                    </AppText>
                    {active && (
                      <View className="size-1 rounded-full bg-[#FFD60A] mt-0.5" />
                    )}
                  </Pressable>
                );
              })}

              {/* profile tab */}
              <Pressable
                onPress={() => navigation.navigate('profile')}
                className="flex-1 items-center gap-1 py-1"
              >
                <StyledFeather
                  name="user"
                  size={22}
                  className={
                    currentName === 'profile'
                      ? 'text-foreground'
                      : isDark
                        ? 'text-white/40'
                        : 'text-black/40'
                  }
                />
                <AppText
                  className={
                    currentName === 'profile'
                      ? 'text-[10px] font-bold text-foreground'
                      : 'text-[10px] font-medium text-muted'
                  }
                >
                  Me
                </AppText>
                {currentName === 'profile' && (
                  <View className="size-1 rounded-full bg-[#FFD60A] mt-0.5" />
                )}
              </Pressable>
            </View>
          </View>
        );
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="checkout" />
      <Tabs.Screen name="analytics" />
      <Tabs.Screen name="inventory" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
