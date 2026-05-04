import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Card, cn } from 'heroui-native';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../../components/app-text';
import { useAppTheme } from '../../../../contexts/app-theme-context';
import { RETAILER_PROFILE } from '../../../../helpers/data/qwuik-products';

const StyledFeather = withUniwind(Feather);

const quickActions = [
  { id: 'scan', label: 'Scan', icon: 'maximize', primary: true },
  { id: 'sales', label: 'Sales', icon: 'bar-chart-2', primary: false },
  { id: 'refund', label: 'Refund', icon: 'rotate-ccw', primary: false },
  { id: 'report', label: 'Reports', icon: 'file-text', primary: false },
];

export default function Dashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useAppTheme();

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(300)}
          className="px-5 pt-3 pb-5 flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-3">
            <View className="size-11 rounded-2xl bg-[#FFD60A] items-center justify-center">
              <AppText className="text-xl">{RETAILER_PROFILE.avatar}</AppText>
            </View>
            <View>
              <AppText className="text-xs text-muted">Welcome back</AppText>
              <AppText className="text-base font-semibold text-foreground">
                {RETAILER_PROFILE.name}
              </AppText>
            </View>
          </View>
          <View className="flex-row gap-2">
            <Pressable className="size-10 rounded-full bg-surface-secondary items-center justify-center">
              <StyledFeather
                name="bell"
                size={18}
                className="text-foreground"
              />
            </Pressable>
            <Pressable
              onPress={() => router.push('/settings')}
              className="size-10 rounded-full bg-surface-secondary items-center justify-center"
            >
              <StyledFeather
                name="settings"
                size={18}
                className="text-foreground"
              />
            </Pressable>
          </View>
        </Animated.View>

        {/* Store card */}
        <Animated.View
          entering={FadeInDown.delay(50).duration(300)}
          className="px-5"
        >
          <Card
            className={cn(
              'p-4 border-0 bg-foreground'
            )}
          >
            <View className="flex-row items-start justify-between mb-4">
              <View>
                <AppText className="text-xs text-background/60">
                  Store
                </AppText>
                <AppText className="text-lg font-semibold text-background">
                  {RETAILER_PROFILE.storeName}
                </AppText>
              </View>
              <View className="flex-row items-center gap-1 px-2 py-1 rounded-full bg-[#FFD60A]">
                <View className="size-1.5 rounded-full bg-black" />
                <AppText className="text-xs font-medium text-black">
                  Live
                </AppText>
              </View>
            </View>
            <View className="flex-row gap-3 pt-3 border-t border-background/10">
              <AppText className="text-xs text-background/60">
                ID {RETAILER_PROFILE.employeeId}
              </AppText>
              <AppText className="text-xs text-background/60">·</AppText>
              <AppText className="text-xs text-background/60">
                Terminal 03
              </AppText>
            </View>
          </Card>
        </Animated.View>

        {/* Today Stats */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(300)}
          className="px-5 mt-5"
        >
          <AppText className="text-xs text-muted uppercase tracking-widest mb-2 font-medium">
            Today's performance
          </AppText>
          <View className="flex-row gap-3">
            <Card className="flex-1 p-4 bg-[#FFD60A] border-0">
              <StyledFeather
                name="shopping-cart"
                size={18}
                className="text-black mb-3"
              />
              <AppText
                className="text-3xl font-bold text-black"
                maxFontSizeMultiplier={1.5}
              >
                {RETAILER_PROFILE.checkoutsToday}
              </AppText>
              <AppText className="text-xs text-black/70 mt-1">
                Checkouts
              </AppText>
            </Card>
            <Card
              className={cn(
                'flex-1 p-4 border',
                isDark ? 'border-white/10' : 'border-black/10'
              )}
            >
              <StyledFeather
                name="dollar-sign"
                size={18}
                className="text-foreground mb-3"
              />
              <AppText
                className="text-3xl font-bold text-foreground"
                maxFontSizeMultiplier={1.5}
              >
                ${RETAILER_PROFILE.salesToday.toFixed(0)}
              </AppText>
              <AppText className="text-xs text-muted mt-1">Sales</AppText>
            </Card>
            <Card
              className={cn(
                'flex-1 p-4 border',
                isDark ? 'border-white/10' : 'border-black/10'
              )}
            >
              <StyledFeather
                name="package"
                size={18}
                className="text-foreground mb-3"
              />
              <AppText
                className="text-3xl font-bold text-foreground"
                maxFontSizeMultiplier={1.5}
              >
                {RETAILER_PROFILE.itemsSoldToday}
              </AppText>
              <AppText className="text-xs text-muted mt-1">Items</AppText>
            </Card>
          </View>
        </Animated.View>

        {/* Quick actions */}
        <Animated.View
          entering={FadeInDown.delay(150).duration(300)}
          className="px-5 mt-6"
        >
          <AppText className="text-xs text-muted uppercase tracking-widest mb-2 font-medium">
            Quick actions
          </AppText>
          <View className="flex-row gap-3 flex-wrap">
            {quickActions.map((action) => (
              <Pressable
                key={action.id}
                onPress={() => {
                  if (action.id === 'scan') router.push('/loyalty');
                }}
                className="flex-1 min-w-[45%]"
              >
                <Card
                  className={cn(
                    'p-4 gap-3 border',
                    isDark ? 'border-white/10' : 'border-black/10'
                  )}
                >
                  <View
                    className={cn(
                      'size-10 rounded-2xl items-center justify-center',
                      action.primary
                        ? 'bg-[#FFD60A]'
                        : isDark
                          ? 'bg-white/10'
                          : 'bg-black/5'
                    )}
                  >
                    <StyledFeather
                      name={action.icon as keyof typeof Feather.glyphMap}
                      size={20}
                      className={cn(
                        action.primary ? 'text-black' : 'text-foreground'
                      )}
                    />
                  </View>
                  <AppText className="text-sm font-semibold text-foreground">
                    {action.label}
                  </AppText>
                </Card>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Recent transactions */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(300)}
          className="px-5 mt-6"
        >
          <View className="flex-row items-center justify-between mb-2">
            <AppText className="text-xs text-muted uppercase tracking-widest font-medium">
              Recent checkouts
            </AppText>
            <AppText className="text-xs text-foreground font-medium">
              View all
            </AppText>
          </View>
          {[
            { id: '#4821', amount: 42.5, time: '2 min ago', items: 4 },
            { id: '#4820', amount: 18.99, time: '7 min ago', items: 2 },
            { id: '#4819', amount: 103.75, time: '15 min ago', items: 9 },
          ].map((t) => (
            <Card
              key={t.id}
              className={cn(
                'p-4 mb-2 flex-row items-center justify-between border',
                isDark ? 'border-white/10' : 'border-black/10'
              )}
            >
              <View className="flex-row items-center gap-3">
                <View className="size-10 rounded-2xl bg-surface-secondary items-center justify-center">
                  <StyledFeather
                    name="check"
                    size={18}
                    className="text-foreground"
                  />
                </View>
                <View>
                  <AppText className="text-sm font-semibold text-foreground">
                    Order {t.id}
                  </AppText>
                  <AppText className="text-xs text-muted">
                    {t.items} items · {t.time}
                  </AppText>
                </View>
              </View>
              <AppText className="text-sm font-bold text-foreground">
                ${t.amount.toFixed(2)}
              </AppText>
            </Card>
          ))}
        </Animated.View>
      </ScrollView>

      {/* Floating scan CTA */}
      <View
        className="absolute left-5 right-5"
        style={{ bottom: insets.bottom + 12 }}
      >
        <Pressable
          onPress={() => router.push('/loyalty')}
          className="bg-[#FFD60A] rounded-2xl py-4 flex-row items-center justify-center gap-2"
        >
          <StyledFeather name="maximize" size={20} className="text-black" />
          <AppText className="text-black font-bold text-base">
            Start new checkout
          </AppText>
        </Pressable>
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
