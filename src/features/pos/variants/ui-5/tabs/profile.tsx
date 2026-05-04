import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { cn } from 'heroui-native';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../../../components/app-text';
import { useAppTheme } from '../../../../../contexts/app-theme-context';
import { RETAILER_PROFILE } from '../../../../../helpers/data/qwuik-products';

const StyledFeather = withUniwind(Feather);

const menu = [
  {
    group: 'ACCOUNT',
    items: [
      { icon: 'user', label: 'Personal details' },
      { icon: 'home', label: 'Store information' },
      { icon: 'shield', label: 'Security & biometrics' },
    ] as { icon: keyof typeof Feather.glyphMap; label: string }[],
  },
  {
    group: 'OPERATIONS',
    items: [
      { icon: 'clock', label: 'Shift history' },
      { icon: 'printer', label: 'Receipt printer' },
      { icon: 'credit-card', label: 'Payment terminals' },
    ] as { icon: keyof typeof Feather.glyphMap; label: string }[],
  },
  {
    group: 'SUPPORT',
    items: [
      { icon: 'help-circle', label: 'Help center' },
      { icon: 'message-square', label: 'Contact support' },
      { icon: 'info', label: 'About Qwuik' },
    ] as { icon: keyof typeof Feather.glyphMap; label: string }[],
  },
];

export default function ProfileTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useAppTheme();

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="px-5 pt-3">
          <AppText className="text-xs text-muted uppercase tracking-[3px] font-semibold">
            ACCOUNT
          </AppText>
          <AppText className="text-2xl font-bold text-foreground tracking-tight">
            Profile
          </AppText>
        </View>

        {/* Profile card */}
        <Animated.View
          entering={FadeInDown.duration(300)}
          className="px-5 mt-4"
        >
          <View className="p-4 rounded-3xl bg-foreground">
            <View className="flex-row items-center gap-3">
              <View className="size-14 rounded-2xl bg-[#FFD60A] items-center justify-center">
                <AppText className="text-2xl">
                  {RETAILER_PROFILE.avatar}
                </AppText>
              </View>
              <View className="flex-1">
                <AppText className="text-base font-bold text-background">
                  {RETAILER_PROFILE.name}
                </AppText>
                <AppText className="text-xs text-background/60">
                  {RETAILER_PROFILE.storeName}
                </AppText>
                <View className="flex-row items-center gap-1 mt-1">
                  <View className="size-1.5 rounded-full bg-[#FFD60A]" />
                  <AppText className="text-[10px] text-[#FFD60A] uppercase tracking-widest font-bold">
                    ID · {RETAILER_PROFILE.employeeId}
                  </AppText>
                </View>
              </View>
            </View>
            <View className="flex-row gap-3 mt-4 pt-3 border-t border-background/10">
              <View className="flex-1">
                <AppText className="text-[10px] text-background/60 uppercase tracking-widest">
                  STREAK
                </AppText>
                <AppText className="text-sm font-bold text-background">
                  12 days
                </AppText>
              </View>
              <View className="flex-1">
                <AppText className="text-[10px] text-background/60 uppercase tracking-widest">
                  RATING
                </AppText>
                <AppText className="text-sm font-bold text-background">
                  4.9 ★
                </AppText>
              </View>
              <View className="flex-1">
                <AppText className="text-[10px] text-background/60 uppercase tracking-widest">
                  TERMINAL
                </AppText>
                <AppText className="text-sm font-bold text-background">
                  03
                </AppText>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Menu sections */}
        {menu.map((section, si) => (
          <Animated.View
            key={section.group}
            entering={FadeInDown.delay(60 + si * 40).duration(300)}
            className="px-5 mt-5"
          >
            <AppText className="text-[10px] text-muted uppercase tracking-[3px] font-semibold mb-2">
              {section.group}
            </AppText>
            <View
              className={cn(
                'rounded-2xl border overflow-hidden',
                isDark ? 'border-white/10' : 'border-black/10'
              )}
            >
              {section.items.map((item, i) => (
                <Pressable
                  key={item.label}
                  className={cn(
                    'p-4 flex-row items-center gap-3',
                    i > 0 && 'border-t',
                    isDark ? 'border-white/5' : 'border-black/5'
                  )}
                >
                  <View
                    className={cn(
                      'size-9 rounded-xl items-center justify-center',
                      isDark ? 'bg-white/5' : 'bg-black/5'
                    )}
                  >
                    <StyledFeather
                      name={item.icon}
                      size={16}
                      className="text-foreground"
                    />
                  </View>
                  <AppText className="flex-1 text-sm font-medium text-foreground">
                    {item.label}
                  </AppText>
                  <StyledFeather
                    name="chevron-right"
                    size={16}
                    className="text-muted"
                  />
                </Pressable>
              ))}
            </View>
          </Animated.View>
        ))}

        {/* Sign out */}
        <Animated.View
          entering={FadeInDown.delay(260).duration(300)}
          className="px-5 mt-6"
        >
          <Pressable
            onPress={() => router.dismissAll()}
            className={cn(
              'rounded-2xl py-4 items-center flex-row justify-center gap-2 border-2 border-[#FFD60A]'
            )}
          >
            <StyledFeather
              name="log-out"
              size={18}
              className="text-foreground"
            />
            <AppText className="text-sm font-bold text-foreground">
              Sign out
            </AppText>
          </Pressable>
        </Animated.View>
      </ScrollView>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
