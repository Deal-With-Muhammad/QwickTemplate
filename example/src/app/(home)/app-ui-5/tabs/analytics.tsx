import Feather from '@expo/vector-icons/Feather';
import { StatusBar } from 'expo-status-bar';
import { cn } from 'heroui-native';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../../components/app-text';
import { useAppTheme } from '../../../../contexts/app-theme-context';
import { MOCK_PRODUCTS } from '../../../../helpers/data/qwuik-products';

const StyledFeather = withUniwind(Feather);

// Mock hourly sales (9am - 6pm)
const hourlySales = [
  { hr: '9', amt: 42 },
  { hr: '10', amt: 88 },
  { hr: '11', amt: 154 },
  { hr: '12', amt: 312 },
  { hr: '1', amt: 276 },
  { hr: '2', amt: 198 },
  { hr: '3', amt: 234 },
  { hr: '4', amt: 410 },
  { hr: '5', amt: 298 },
  { hr: '6', amt: 186 },
];
const maxSale = Math.max(...hourlySales.map((h) => h.amt));

export default function AnalyticsTab() {
  const insets = useSafeAreaInsets();
  const { isDark } = useAppTheme();

  const [range, setRange] = useState<'today' | 'week' | 'month'>('today');

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="px-5 pt-3">
          <AppText className="text-xs text-muted uppercase tracking-[3px] font-semibold">
            PERFORMANCE
          </AppText>
          <AppText className="text-2xl font-bold text-foreground tracking-tight">
            Analytics
          </AppText>
        </View>

        {/* Range switcher — segmented */}
        <Animated.View
          entering={FadeInDown.duration(300)}
          className="px-5 mt-4"
        >
          <View
            className={cn(
              'rounded-full p-1 flex-row',
              isDark ? 'bg-white/5' : 'bg-black/5'
            )}
          >
            {(['today', 'week', 'month'] as const).map((r) => (
              <Pressable
                key={r}
                onPress={() => setRange(r)}
                className={cn(
                  'flex-1 py-2 items-center rounded-full',
                  range === r && 'bg-foreground'
                )}
              >
                <AppText
                  className={cn(
                    'text-xs font-bold capitalize',
                    range === r ? 'text-background' : 'text-muted'
                  )}
                >
                  {r}
                </AppText>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Headline number */}
        <Animated.View
          entering={FadeInDown.delay(50).duration(300)}
          className="px-5 mt-5"
        >
          <AppText className="text-xs text-muted uppercase tracking-widest font-semibold">
            TOTAL SALES
          </AppText>
          <View className="flex-row items-end gap-3">
            <AppText
              className="text-5xl font-bold text-foreground tracking-tight"
              maxFontSizeMultiplier={1.3}
            >
              $2,148
            </AppText>
            <View className="flex-row items-center gap-1 pb-2">
              <StyledFeather
                name="trending-up"
                size={14}
                className="text-[#FFD60A]"
              />
              <AppText className="text-sm text-[#FFD60A] font-bold">
                +18%
              </AppText>
            </View>
          </View>
        </Animated.View>

        {/* Hourly bar chart */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(300)}
          className="px-5 mt-5"
        >
          <AppText className="text-xs text-muted uppercase tracking-widest font-semibold mb-3">
            HOURLY · TODAY
          </AppText>
          <View
            className={cn(
              'rounded-2xl p-4 border',
              isDark ? 'border-white/10' : 'border-black/10'
            )}
          >
            <View className="flex-row items-end justify-between gap-1.5 h-32">
              {hourlySales.map((h) => {
                const pct = (h.amt / maxSale) * 100;
                const isPeak = h.amt === maxSale;
                return (
                  <View key={h.hr} className="flex-1 items-center gap-1">
                    <View
                      style={{ height: `${pct}%` }}
                      className={cn(
                        'w-full rounded-md',
                        isPeak
                          ? 'bg-[#FFD60A]'
                          : isDark
                            ? 'bg-white/20'
                            : 'bg-black/20'
                      )}
                    />
                    <AppText className="text-[9px] text-muted font-medium">
                      {h.hr}
                    </AppText>
                  </View>
                );
              })}
            </View>
            <View className="flex-row justify-between mt-3 pt-3 border-t border-border">
              <View>
                <AppText className="text-[10px] text-muted uppercase tracking-widest">
                  PEAK HOUR
                </AppText>
                <AppText className="text-sm font-bold text-foreground">
                  4:00 PM
                </AppText>
              </View>
              <View>
                <AppText className="text-[10px] text-muted uppercase tracking-widest">
                  AVG TICKET
                </AppText>
                <AppText className="text-sm font-bold text-foreground">
                  $45.72
                </AppText>
              </View>
              <View>
                <AppText className="text-[10px] text-muted uppercase tracking-widest">
                  ORDERS
                </AppText>
                <AppText className="text-sm font-bold text-foreground">
                  47
                </AppText>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Top products */}
        <Animated.View
          entering={FadeInDown.delay(150).duration(300)}
          className="px-5 mt-6"
        >
          <AppText className="text-xs text-muted uppercase tracking-widest font-semibold mb-3">
            TOP PRODUCTS
          </AppText>
          <View className="gap-2">
            {MOCK_PRODUCTS.slice(0, 4).map((p, i) => (
              <View
                key={p.id}
                className={cn(
                  'rounded-2xl p-3 flex-row items-center gap-3 border',
                  isDark ? 'border-white/10' : 'border-black/10'
                )}
              >
                <AppText className="text-sm font-bold text-muted w-6 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </AppText>
                <View
                  className={cn(
                    'size-10 rounded-xl items-center justify-center',
                    isDark ? 'bg-white/5' : 'bg-black/5'
                  )}
                >
                  <AppText className="text-xl">{p.emoji}</AppText>
                </View>
                <View className="flex-1">
                  <AppText className="text-sm font-semibold text-foreground">
                    {p.name}
                  </AppText>
                  <AppText className="text-xs text-muted">
                    {Math.round((10 - i) * 4.3)} sold
                  </AppText>
                </View>
                <AppText className="text-sm font-bold text-foreground">
                  ${(p.price * (10 - i) * 4.3).toFixed(0)}
                </AppText>
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
