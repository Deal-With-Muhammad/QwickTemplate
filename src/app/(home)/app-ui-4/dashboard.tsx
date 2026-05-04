import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { cn } from 'heroui-native';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../components/app-text';
import { QwuikLogo } from '../../../components/qwuik-logo';
import { useAppTheme } from '../../../contexts/app-theme-context';
import { RETAILER_PROFILE } from '../../../helpers/data/qwuik-products';

const StyledFeather = withUniwind(Feather);

const quickActions = [
  { id: 'scan', label: 'SCAN', icon: 'maximize', primary: true },
  { id: 'sales', label: 'SALES', icon: 'bar-chart-2', primary: false },
  { id: 'refund', label: 'REFUND', icon: 'rotate-ccw', primary: false },
  { id: 'reports', label: 'REPORTS', icon: 'file-text', primary: false },
];

export default function Dashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useAppTheme();

  const borderCol = isDark ? 'border-white' : 'border-black';

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* Header bar */}
        <View
          className={cn(
            'px-5 pt-3 pb-3 flex-row items-center justify-between border-b-2',
            borderCol
          )}
        >
          <QwuikLogo variant="icon" size={32} />
          <View className="flex-row gap-0">
            <Pressable
              className={cn(
                'size-10 items-center justify-center border-2',
                borderCol
              )}
            >
              <StyledFeather
                name="bell"
                size={16}
                className="text-foreground"
              />
            </Pressable>
            <Pressable
              onPress={() => router.push('/settings')}
              className={cn(
                'size-10 items-center justify-center border-2 border-l-0',
                borderCol
              )}
            >
              <StyledFeather
                name="settings"
                size={16}
                className="text-foreground"
              />
            </Pressable>
          </View>
        </View>

        {/* Profile strip */}
        <Animated.View
          entering={FadeInDown.duration(300)}
          className={cn(
            'px-5 py-4 flex-row items-center gap-3 border-b-2',
            borderCol
          )}
        >
          <View
            className={cn(
              'size-12 items-center justify-center border-2 bg-[#FFD60A]',
              borderCol
            )}
          >
            <AppText className="text-xl">{RETAILER_PROFILE.avatar}</AppText>
          </View>
          <View className="flex-1">
            <AppText className="text-[10px] text-muted uppercase tracking-[3px] font-semibold">
              WELCOME BACK
            </AppText>
            <AppText className="text-base font-bold text-foreground">
              {RETAILER_PROFILE.name}
            </AppText>
            <AppText className="text-[11px] text-muted mt-0.5">
              {RETAILER_PROFILE.storeName}
            </AppText>
          </View>
          <View className={cn('border-2 px-2 py-1 flex-row items-center gap-1', borderCol)}>
            <View className="size-1.5 bg-[#FFD60A]" />
            <AppText className="text-[9px] font-bold text-foreground uppercase tracking-widest">
              LIVE
            </AppText>
          </View>
        </Animated.View>

        {/* Today's performance — stat grid */}
        <Animated.View
          entering={FadeInDown.delay(50).duration(300)}
          className="px-5 pt-5"
        >
          <AppText className="text-[10px] text-muted uppercase tracking-[3px] font-semibold mb-2">
            TODAY · PERFORMANCE
          </AppText>
          <View className="flex-row gap-0">
            <View
              className={cn(
                'flex-1 p-4 bg-[#FFD60A] border-2',
                borderCol
              )}
            >
              <StyledFeather
                name="shopping-cart"
                size={18}
                className="text-black mb-3"
              />
              <AppText
                className="text-3xl font-bold text-black"
                maxFontSizeMultiplier={1.4}
              >
                {RETAILER_PROFILE.checkoutsToday}
              </AppText>
              <AppText className="text-[10px] text-black/70 mt-1 uppercase tracking-widest font-semibold">
                CHECKOUTS
              </AppText>
            </View>
            <View
              className={cn(
                'flex-1 p-4 border-2 border-l-0',
                borderCol
              )}
            >
              <StyledFeather
                name="dollar-sign"
                size={18}
                className="text-foreground mb-3"
              />
              <AppText
                className="text-3xl font-bold text-foreground"
                maxFontSizeMultiplier={1.4}
              >
                ${RETAILER_PROFILE.salesToday.toFixed(0)}
              </AppText>
              <AppText className="text-[10px] text-muted mt-1 uppercase tracking-widest font-semibold">
                SALES
              </AppText>
            </View>
            <View
              className={cn(
                'flex-1 p-4 border-2 border-l-0',
                borderCol
              )}
            >
              <StyledFeather
                name="package"
                size={18}
                className="text-foreground mb-3"
              />
              <AppText
                className="text-3xl font-bold text-foreground"
                maxFontSizeMultiplier={1.4}
              >
                {RETAILER_PROFILE.itemsSoldToday}
              </AppText>
              <AppText className="text-[10px] text-muted mt-1 uppercase tracking-widest font-semibold">
                ITEMS
              </AppText>
            </View>
          </View>
        </Animated.View>

        {/* Quick actions — 2x2 grid */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(300)}
          className="px-5 mt-6"
        >
          <AppText className="text-[10px] text-muted uppercase tracking-[3px] font-semibold mb-2">
            QUICK ACTIONS
          </AppText>
          <View className="flex-row flex-wrap">
            {quickActions.map((action, idx) => (
              <Pressable
                key={action.id}
                onPress={() => {
                  if (action.id === 'scan') router.push('/app-ui-4/scan');
                }}
                className={cn(
                  'w-1/2 p-4 gap-3 border-2',
                  borderCol,
                  idx > 0 && idx % 2 === 1 && 'border-l-0',
                  idx > 1 && 'border-t-0',
                  action.primary && 'bg-[#FFD60A]'
                )}
              >
                <View
                  className={cn(
                    'size-10 items-center justify-center border-2',
                    action.primary ? 'border-black bg-black' : borderCol
                  )}
                >
                  <StyledFeather
                    name={action.icon as keyof typeof Feather.glyphMap}
                    size={18}
                    className={action.primary ? 'text-[#FFD60A]' : 'text-foreground'}
                  />
                </View>
                <AppText
                  className={cn(
                    'text-sm font-bold uppercase tracking-[2px]',
                    action.primary ? 'text-black' : 'text-foreground'
                  )}
                >
                  {action.label}
                </AppText>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Recent checkouts — table */}
        <Animated.View
          entering={FadeInDown.delay(150).duration(300)}
          className="px-5 mt-6"
        >
          <View className="flex-row items-center justify-between mb-2">
            <AppText className="text-[10px] text-muted uppercase tracking-[3px] font-semibold">
              RECENT CHECKOUTS
            </AppText>
            <AppText className="text-[10px] text-foreground uppercase tracking-[3px] font-bold">
              VIEW ALL →
            </AppText>
          </View>
          <View className={cn('border-2', borderCol)}>
            {[
              { id: '#4821', amount: 42.5, time: '2 min', items: 4 },
              { id: '#4820', amount: 18.99, time: '7 min', items: 2 },
              { id: '#4819', amount: 103.75, time: '15 min', items: 9 },
            ].map((t, idx) => (
              <View
                key={t.id}
                className={cn(
                  'p-4 flex-row items-center justify-between',
                  idx > 0 && 'border-t-2',
                  borderCol
                )}
              >
                <View className="flex-row items-center gap-3">
                  <View
                    className={cn(
                      'size-9 items-center justify-center border-2',
                      borderCol
                    )}
                  >
                    <StyledFeather
                      name="check"
                      size={16}
                      className="text-foreground"
                    />
                  </View>
                  <View>
                    <AppText className="text-sm font-bold text-foreground">
                      {t.id}
                    </AppText>
                    <AppText className="text-[11px] text-muted">
                      {t.items} items · {t.time} ago
                    </AppText>
                  </View>
                </View>
                <AppText className="text-base font-bold text-foreground">
                  ${t.amount.toFixed(2)}
                </AppText>
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Floating scan CTA */}
      <View
        className="absolute left-5 right-5"
        style={{ bottom: insets.bottom + 12 }}
      >
        <Pressable
          onPress={() => router.push('/app-ui-4/scan')}
          className="bg-[#FFD60A] py-5 flex-row items-center justify-center gap-2 border-2 border-foreground"
        >
          <StyledFeather name="maximize" size={20} className="text-black" />
          <AppText className="text-black font-bold uppercase tracking-[2px]">
            START NEW CHECKOUT
          </AppText>
        </Pressable>
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
