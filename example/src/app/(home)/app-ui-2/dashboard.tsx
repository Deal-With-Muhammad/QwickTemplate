import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { cn } from 'heroui-native';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../components/app-text';
import { useAppTheme } from '../../../contexts/app-theme-context';
import { RETAILER_PROFILE } from '../../../helpers/data/qwuik-products';

const StyledFeather = withUniwind(Feather);

const brutalShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 8,
};

export default function Dashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useAppTheme();

  return (
    <View
      className={cn('flex-1', isDark ? 'bg-black' : 'bg-white')}
      style={{ paddingTop: insets.top }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        {/* Header row */}
        <Animated.View
          entering={FadeInDown.duration(280)}
          className="px-5 pt-3 flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-3">
            <View className="size-12 rounded-2xl bg-[#FFD60A] items-center justify-center border-2 border-foreground">
              <AppText className="text-2xl">{RETAILER_PROFILE.avatar}</AppText>
            </View>
            <View>
              <AppText className="text-[10px] text-muted uppercase tracking-widest font-bold">
                ON SHIFT · {RETAILER_PROFILE.employeeId}
              </AppText>
              <AppText
                className="text-xl font-bold text-foreground"
                maxFontSizeMultiplier={1.3}
              >
                {RETAILER_PROFILE.name.toUpperCase()}
              </AppText>
            </View>
          </View>
          <Pressable
            onPress={() => router.back()}
            className="size-11 rounded-2xl bg-foreground items-center justify-center border-2 border-foreground"
          >
            <StyledFeather name="log-out" size={18} className="text-background" />
          </Pressable>
        </Animated.View>

        {/* Store banner */}
        <Animated.View
          entering={FadeInDown.delay(50).duration(280)}
          className="mx-5 mt-5 bg-foreground rounded-3xl p-5 border-2 border-foreground"
          style={brutalShadow}
        >
          <AppText className="text-xs text-background/60 font-bold uppercase tracking-widest">
            YOUR STORE
          </AppText>
          <AppText
            className="text-2xl font-bold text-background mt-1"
            maxFontSizeMultiplier={1.3}
          >
            {RETAILER_PROFILE.storeName}
          </AppText>
          <View className="flex-row items-center gap-2 mt-3">
            <View className="size-2 rounded-full bg-[#FFD60A]" />
            <AppText className="text-xs text-[#FFD60A] font-bold uppercase tracking-widest">
              LIVE · Terminal 03
            </AppText>
          </View>
        </Animated.View>

        {/* Huge checkouts counter */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(280)}
          className="mx-5 mt-4 bg-[#FFD60A] rounded-3xl p-6 border-2 border-foreground"
          style={brutalShadow}
        >
          <AppText className="text-xs text-black font-bold uppercase tracking-widest">
            CHECKOUTS TODAY
          </AppText>
          <View className="flex-row items-end gap-2">
            <AppText
              className="text-[88px] font-bold text-black leading-none tracking-tighter"
              maxFontSizeMultiplier={1.2}
            >
              {RETAILER_PROFILE.checkoutsToday}
            </AppText>
            <AppText className="text-sm text-black/70 font-bold mb-3">
              + 12% vs yesterday
            </AppText>
          </View>
          <View className="flex-row gap-3 mt-4 pt-4 border-t-2 border-black/15">
            <View className="flex-1">
              <AppText className="text-[10px] text-black/70 font-bold uppercase">
                Sales
              </AppText>
              <AppText
                className="text-xl font-bold text-black"
                maxFontSizeMultiplier={1.3}
              >
                ${RETAILER_PROFILE.salesToday.toFixed(0)}
              </AppText>
            </View>
            <View className="w-[2px] bg-black/15" />
            <View className="flex-1">
              <AppText className="text-[10px] text-black/70 font-bold uppercase">
                Items
              </AppText>
              <AppText
                className="text-xl font-bold text-black"
                maxFontSizeMultiplier={1.3}
              >
                {RETAILER_PROFILE.itemsSoldToday}
              </AppText>
            </View>
            <View className="w-[2px] bg-black/15" />
            <View className="flex-1">
              <AppText className="text-[10px] text-black/70 font-bold uppercase">
                Avg
              </AppText>
              <AppText
                className="text-xl font-bold text-black"
                maxFontSizeMultiplier={1.3}
              >
                $
                {(
                  RETAILER_PROFILE.salesToday / RETAILER_PROFILE.checkoutsToday
                ).toFixed(2)}
              </AppText>
            </View>
          </View>
        </Animated.View>

        {/* Actions grid */}
        <Animated.View
          entering={FadeInDown.delay(150).duration(280)}
          className="px-5 mt-4 gap-3 flex-row flex-wrap"
        >
          {[
            { id: 'sales', label: 'SALES', icon: 'bar-chart-2' },
            { id: 'refund', label: 'REFUND', icon: 'rotate-ccw' },
            { id: 'reports', label: 'REPORTS', icon: 'file-text' },
            { id: 'inventory', label: 'INVENTORY', icon: 'package' },
          ].map((a) => (
            <Pressable key={a.id} className="w-[48%]">
              <View
                className={cn(
                  'rounded-2xl p-4 gap-3 border-2 border-foreground',
                  isDark ? 'bg-white' : 'bg-white'
                )}
                style={brutalShadow}
              >
                <StyledFeather
                  name={a.icon as keyof typeof Feather.glyphMap}
                  size={22}
                  className="text-black"
                />
                <AppText className="text-sm font-bold text-black uppercase">
                  {a.label}
                </AppText>
              </View>
            </Pressable>
          ))}
        </Animated.View>
      </ScrollView>

      {/* Floating CTA */}
      <View
        className="absolute left-5 right-5"
        style={{ bottom: insets.bottom + 12 }}
      >
        <Pressable
          onPress={() => router.push('/app-ui-2/scan')}
          className="bg-foreground rounded-3xl py-5 border-2 border-foreground flex-row items-center justify-center gap-3"
          style={brutalShadow}
        >
          <View className="size-8 rounded-xl bg-[#FFD60A] items-center justify-center">
            <StyledFeather name="maximize" size={18} className="text-black" />
          </View>
          <AppText className="text-background font-bold text-base uppercase tracking-wider">
            New checkout
          </AppText>
        </Pressable>
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
