import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Card, cn } from 'heroui-native';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../../../components/app-text';
import { QwuikLogo } from '../../../../../components/qwuik-logo';
import { useAppTheme } from '../../../../../contexts/app-theme-context';
import { RETAILER_PROFILE } from '../../../../../helpers/data/qwuik-products';

const StyledFeather = withUniwind(Feather);

// Synthetic live feed of activity
const liveFeed = [
  { id: 1, kind: 'sale', text: 'Checkout #4821', amt: 42.5, time: '2m' },
  { id: 2, kind: 'member', text: 'Member "Priya M." earned 42 pts', time: '4m' },
  { id: 3, kind: 'sale', text: 'Checkout #4820', amt: 18.99, time: '7m' },
  { id: 4, kind: 'stock', text: 'Oat Milk 1L · low stock (3 left)', time: '12m' },
  { id: 5, kind: 'sale', text: 'Checkout #4819', amt: 103.75, time: '15m' },
];

export default function HomeTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useAppTheme();

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(300)}
          className="px-5 pt-3 pb-4 flex-row items-center justify-between"
        >
          <QwuikLogo variant="wordmark" size={100} />
          <Pressable
            className={cn(
              'size-10 rounded-2xl items-center justify-center',
              isDark ? 'bg-white/5' : 'bg-black/5'
            )}
          >
            <StyledFeather name="bell" size={18} className="text-foreground" />
          </Pressable>
        </Animated.View>

        {/* Shift widget — unique */}
        <Animated.View
          entering={FadeInDown.delay(50).duration(300)}
          className="px-5"
        >
          <Card className="p-4 bg-foreground border-0">
            <View className="flex-row items-start justify-between">
              <View>
                <View className="flex-row items-center gap-1.5">
                  <View className="size-2 rounded-full bg-[#FFD60A]" />
                  <AppText className="text-[10px] text-background/60 uppercase tracking-[3px] font-semibold">
                    SHIFT · OPEN
                  </AppText>
                </View>
                <AppText className="text-base font-semibold text-background mt-1">
                  Hi, {RETAILER_PROFILE.name.split(' ')[0]}
                </AppText>
                <AppText className="text-xs text-background/60">
                  {RETAILER_PROFILE.storeName}
                </AppText>
              </View>
              <View className="items-end">
                <AppText className="text-[10px] text-background/60 uppercase tracking-widest font-semibold">
                  OPENED
                </AppText>
                <AppText className="text-sm font-bold text-background">
                  08:34 AM
                </AppText>
                <AppText className="text-[10px] text-background/50">
                  6h 12m ago
                </AppText>
              </View>
            </View>

            {/* Mini stats row */}
            <View className="flex-row gap-3 mt-4 pt-3 border-t border-background/10">
              <View className="flex-1">
                <AppText className="text-[10px] text-background/60 uppercase tracking-widest">
                  CHECKOUTS
                </AppText>
                <AppText className="text-xl font-bold text-background">
                  {RETAILER_PROFILE.checkoutsToday}
                </AppText>
              </View>
              <View className="flex-1">
                <AppText className="text-[10px] text-background/60 uppercase tracking-widest">
                  SALES
                </AppText>
                <AppText className="text-xl font-bold text-background">
                  ${RETAILER_PROFILE.salesToday.toFixed(0)}
                </AppText>
              </View>
              <View className="flex-1">
                <AppText className="text-[10px] text-background/60 uppercase tracking-widest">
                  ITEMS
                </AppText>
                <AppText className="text-xl font-bold text-background">
                  {RETAILER_PROFILE.itemsSoldToday}
                </AppText>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Streak / motivation widget */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(300)}
          className="px-5 mt-4"
        >
          <View
            className={cn(
              'p-4 rounded-2xl flex-row items-center gap-3 bg-[#FFD60A]'
            )}
          >
            <View className="size-11 rounded-2xl bg-black items-center justify-center">
              <StyledFeather name="trending-up" size={20} className="text-[#FFD60A]" />
            </View>
            <View className="flex-1">
              <AppText className="text-sm font-bold text-black">
                +18% vs yesterday
              </AppText>
              <AppText className="text-xs text-black/70">
                On track to beat your daily best
              </AppText>
            </View>
            <StyledFeather name="chevron-right" size={20} className="text-black" />
          </View>
        </Animated.View>

        {/* Live feed — unique */}
        <Animated.View
          entering={FadeInDown.delay(150).duration(300)}
          className="px-5 mt-6"
        >
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2">
              <AppText className="text-xs text-muted uppercase tracking-[3px] font-semibold">
                LIVE FEED
              </AppText>
              <View className="flex-row items-center gap-1">
                <View className="size-1.5 rounded-full bg-[#FFD60A]" />
                <AppText className="text-[10px] text-foreground font-bold">
                  LIVE
                </AppText>
              </View>
            </View>
            <Pressable>
              <AppText className="text-xs text-foreground font-semibold">
                See all
              </AppText>
            </Pressable>
          </View>
          <View className="gap-2">
            {liveFeed.map((item) => (
              <View
                key={item.id}
                className={cn(
                  'rounded-2xl p-3 flex-row items-center gap-3 border',
                  isDark ? 'border-white/10' : 'border-black/10'
                )}
              >
                <View
                  className={cn(
                    'size-9 rounded-xl items-center justify-center',
                    item.kind === 'sale' && 'bg-[#FFD60A]',
                    item.kind === 'member' &&
                      (isDark ? 'bg-white/10' : 'bg-black/5'),
                    item.kind === 'stock' &&
                      (isDark ? 'bg-white/10' : 'bg-black/5')
                  )}
                >
                  <StyledFeather
                    name={
                      item.kind === 'sale'
                        ? 'dollar-sign'
                        : item.kind === 'member'
                          ? 'star'
                          : 'alert-triangle'
                    }
                    size={16}
                    className={item.kind === 'sale' ? 'text-black' : 'text-foreground'}
                  />
                </View>
                <View className="flex-1">
                  <AppText className="text-sm font-semibold text-foreground">
                    {item.text}
                  </AppText>
                  <AppText className="text-[11px] text-muted">
                    {item.time} ago
                  </AppText>
                </View>
                {item.amt && (
                  <AppText className="text-sm font-bold text-foreground">
                    +${item.amt.toFixed(2)}
                  </AppText>
                )}
              </View>
            ))}
          </View>
        </Animated.View>

        {/* CTA to checkout tab */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(300)}
          className="px-5 mt-6"
        >
          <Pressable
            onPress={() => router.push('/app-ui-5/tabs/checkout')}
            className="rounded-2xl bg-foreground py-4 items-center flex-row justify-center gap-2"
          >
            <StyledFeather name="maximize" size={18} className="text-background" />
            <AppText className="text-background font-bold">
              Start a new checkout
            </AppText>
          </Pressable>
        </Animated.View>
      </ScrollView>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
