import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { cn } from 'heroui-native';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../components/app-text';
import { useAppTheme } from '../../../contexts/app-theme-context';
import { RETAILER_PROFILE } from '../../../helpers/data/qwuik-products';

const StyledFeather = withUniwind(Feather);

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
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
      >
        {/* Minimal header */}
        <Animated.View
          entering={FadeIn.duration(240)}
          className="px-6 pt-4 flex-row items-center justify-between"
        >
          <View>
            <AppText className="text-[10px] text-muted uppercase tracking-[3px] font-medium">
              GOOD MORNING
            </AppText>
            <AppText
              className="text-3xl font-bold text-foreground tracking-tight mt-1"
              maxFontSizeMultiplier={1.4}
            >
              {RETAILER_PROFILE.name.split(' ')[0]}.
            </AppText>
          </View>
          <View className="flex-row gap-2">
            <Pressable
              className={cn(
                'size-10 rounded-full items-center justify-center border',
                isDark ? 'border-white/10' : 'border-black/10'
              )}
            >
              <StyledFeather name="bell" size={16} className="text-foreground" />
            </Pressable>
            <Pressable
              onPress={() => router.push('/settings')}
              className={cn(
                'size-10 rounded-full items-center justify-center border',
                isDark ? 'border-white/10' : 'border-black/10'
              )}
            >
              <StyledFeather
                name="settings"
                size={16}
                className="text-foreground"
              />
            </Pressable>
          </View>
        </Animated.View>

        {/* Store row */}
        <Animated.View
          entering={FadeInDown.delay(40).duration(240)}
          className="px-6 mt-8 flex-row items-center gap-3"
        >
          <View className="size-2 rounded-full bg-[#FFD60A]" />
          <AppText className="text-xs text-muted font-medium flex-1">
            {RETAILER_PROFILE.storeName} · Terminal 03
          </AppText>
          <AppText className="text-[10px] text-muted uppercase tracking-widest">
            Live
          </AppText>
        </Animated.View>

        {/* Big Number */}
        <Animated.View
          entering={FadeInDown.delay(80).duration(280)}
          className="px-6 mt-8"
        >
          <AppText className="text-[10px] text-muted uppercase tracking-[3px] font-medium">
            CHECKOUTS TODAY
          </AppText>
          <View className="flex-row items-end gap-3 mt-1">
            <AppText
              className="text-[96px] font-bold text-foreground leading-none tracking-tighter"
              maxFontSizeMultiplier={1.2}
            >
              {RETAILER_PROFILE.checkoutsToday}
            </AppText>
            <View className="pb-4 flex-row items-center gap-1">
              <StyledFeather
                name="trending-up"
                size={14}
                className="text-[#FFD60A]"
              />
              <AppText className="text-xs font-medium text-[#FFD60A]">
                +12%
              </AppText>
            </View>
          </View>
        </Animated.View>

        {/* Simple metric row */}
        <Animated.View
          entering={FadeInDown.delay(120).duration(280)}
          className="px-6 mt-6 flex-row"
        >
          <View className="flex-1">
            <AppText className="text-[10px] text-muted uppercase tracking-[3px] font-medium">
              Sales
            </AppText>
            <AppText
              className="text-xl font-bold text-foreground mt-1"
              maxFontSizeMultiplier={1.3}
            >
              ${RETAILER_PROFILE.salesToday.toFixed(0)}
            </AppText>
          </View>
          <View
            className={cn('w-px', isDark ? 'bg-white/10' : 'bg-black/10')}
          />
          <View className="flex-1 pl-5">
            <AppText className="text-[10px] text-muted uppercase tracking-[3px] font-medium">
              Items
            </AppText>
            <AppText
              className="text-xl font-bold text-foreground mt-1"
              maxFontSizeMultiplier={1.3}
            >
              {RETAILER_PROFILE.itemsSoldToday}
            </AppText>
          </View>
          <View
            className={cn('w-px', isDark ? 'bg-white/10' : 'bg-black/10')}
          />
          <View className="flex-1 pl-5">
            <AppText className="text-[10px] text-muted uppercase tracking-[3px] font-medium">
              Avg
            </AppText>
            <AppText
              className="text-xl font-bold text-foreground mt-1"
              maxFontSizeMultiplier={1.3}
            >
              $
              {(
                RETAILER_PROFILE.salesToday / RETAILER_PROFILE.checkoutsToday
              ).toFixed(0)}
            </AppText>
          </View>
        </Animated.View>

        {/* Divider */}
        <View
          className={cn(
            'h-px mx-6 mt-8',
            isDark ? 'bg-white/10' : 'bg-black/10'
          )}
        />

        {/* Actions — list style */}
        <Animated.View
          entering={FadeInDown.delay(160).duration(280)}
          className="px-6 mt-6"
        >
          <AppText className="text-[10px] text-muted uppercase tracking-[3px] font-medium mb-3">
            QUICK ACCESS
          </AppText>
          {[
            { id: 'sales', label: 'Sales history', icon: 'bar-chart-2' },
            { id: 'refund', label: 'Issue refund', icon: 'rotate-ccw' },
            { id: 'reports', label: 'Reports & exports', icon: 'file-text' },
            { id: 'inventory', label: 'Inventory', icon: 'package' },
          ].map((a) => (
            <Pressable
              key={a.id}
              className={cn(
                'py-4 flex-row items-center gap-3 border-b',
                isDark ? 'border-white/5' : 'border-black/5'
              )}
            >
              <View
                className={cn(
                  'size-8 rounded-lg items-center justify-center',
                  isDark ? 'bg-white/5' : 'bg-black/5'
                )}
              >
                <StyledFeather
                  name={a.icon as keyof typeof Feather.glyphMap}
                  size={16}
                  className="text-foreground"
                />
              </View>
              <AppText className="flex-1 text-sm text-foreground">
                {a.label}
              </AppText>
              <StyledFeather
                name="chevron-right"
                size={16}
                className="text-muted"
              />
            </Pressable>
          ))}
        </Animated.View>

        {/* Recent */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(280)}
          className="px-6 mt-6"
        >
          <View className="flex-row items-center justify-between mb-3">
            <AppText className="text-[10px] text-muted uppercase tracking-[3px] font-medium">
              RECENT
            </AppText>
            <AppText className="text-[10px] text-muted uppercase tracking-widest font-medium">
              View all
            </AppText>
          </View>
          {[
            { id: '#4821', amount: 42.5, time: '2 min ago' },
            { id: '#4820', amount: 18.99, time: '7 min ago' },
            { id: '#4819', amount: 103.75, time: '15 min ago' },
          ].map((t) => (
            <View
              key={t.id}
              className={cn(
                'py-3 flex-row items-center justify-between border-b',
                isDark ? 'border-white/5' : 'border-black/5'
              )}
            >
              <View>
                <AppText className="text-sm text-foreground font-medium">
                  {t.id}
                </AppText>
                <AppText className="text-xs text-muted">{t.time}</AppText>
              </View>
              <AppText className="text-sm text-foreground font-medium">
                ${t.amount.toFixed(2)}
              </AppText>
            </View>
          ))}
        </Animated.View>
      </ScrollView>

      {/* Floating */}
      <View
        className="absolute left-6 right-6"
        style={{ bottom: insets.bottom + 10 }}
      >
        <Pressable
          onPress={() => router.push('/app-ui-3/scan')}
          className={cn(
            'rounded-full py-4 flex-row items-center justify-center gap-2',
            isDark ? 'bg-white' : 'bg-black'
          )}
        >
          <StyledFeather
            name="maximize"
            size={18}
            className={isDark ? 'text-black' : 'text-white'}
          />
          <AppText
            className={cn(
              'font-medium',
              isDark ? 'text-black' : 'text-white'
            )}
          >
            New checkout
          </AppText>
          <View className="size-1.5 rounded-full bg-[#FFD60A] ml-1" />
        </Pressable>
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
