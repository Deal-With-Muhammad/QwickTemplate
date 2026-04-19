import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { cn } from 'heroui-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../components/app-text';
import { useAppTheme } from '../../../contexts/app-theme-context';
import { MOCK_PRODUCTS } from '../../../helpers/data/qwuik-products';

const StyledFeather = withUniwind(Feather);

export default function Scan() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useAppTheme();
  const [scanned, setScanned] = useState(0);

  const linePos = useSharedValue(0);

  useEffect(() => {
    linePos.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [linePos]);

  const rLineStyle = useAnimatedStyle(() => ({
    top: `${linePos.value * 100}%`,
  }));

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-6 pt-3 pb-4 flex-row items-center justify-between">
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <StyledFeather
            name="arrow-left"
            size={22}
            className="text-foreground"
          />
        </Pressable>
        <AppText className="text-xs text-muted uppercase tracking-[3px] font-medium">
          SCAN
        </AppText>
        <Pressable hitSlop={12}>
          <StyledFeather name="zap" size={18} className="text-muted" />
        </Pressable>
      </View>

      {/* Minimal scanner */}
      <View className="px-6">
        <View
          className={cn(
            'aspect-[4/5] rounded-[32px] overflow-hidden relative',
            isDark ? 'bg-white/5' : 'bg-black/5'
          )}
        >
          {(['tl', 'tr', 'bl', 'br'] as const).map((c) => (
            <View
              key={c}
              className={cn(
                'absolute size-8 border-foreground',
                c === 'tl' && 'top-10 left-10 border-t-2 border-l-2',
                c === 'tr' && 'top-10 right-10 border-t-2 border-r-2',
                c === 'bl' && 'bottom-10 left-10 border-b-2 border-l-2',
                c === 'br' && 'bottom-10 right-10 border-b-2 border-r-2'
              )}
            />
          ))}

          <Animated.View
            style={rLineStyle}
            className="absolute left-12 right-12 h-[2px] bg-[#FFD60A]"
          />

          <View className="absolute inset-0 items-center justify-center gap-2">
            <StyledFeather
              name="maximize"
              size={28}
              className="text-muted/60"
            />
            <AppText className="text-xs text-muted">
              Align barcode inside
            </AppText>
          </View>
        </View>

        <View className="flex-row items-center justify-center gap-2 mt-4">
          <View className="size-1.5 rounded-full bg-[#FFD60A]" />
          <AppText className="text-[10px] text-muted uppercase tracking-[3px] font-medium">
            Camera ready · {scanned} scanned
          </AppText>
        </View>
      </View>

      {/* Live list */}
      <ScrollView
        className="flex-1 mt-6"
        contentContainerStyle={{ paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_PRODUCTS.slice(0, scanned).map((p) => (
          <Animated.View
            key={p.id}
            entering={FadeIn.duration(200)}
            className={cn(
              'py-3 flex-row items-center gap-3 border-b',
              isDark ? 'border-white/5' : 'border-black/5'
            )}
          >
            <AppText className="text-xl">{p.emoji}</AppText>
            <View className="flex-1">
              <AppText className="text-sm text-foreground font-medium">
                {p.name}
              </AppText>
              <AppText className="text-xs text-muted">
                ·{p.sku.slice(-4)}
              </AppText>
            </View>
            <AppText className="text-sm text-foreground">
              ${p.price.toFixed(2)}
            </AppText>
          </Animated.View>
        ))}
        {scanned === 0 && (
          <View className="items-center py-10 gap-2">
            <AppText className="text-xs text-muted">
              No products scanned yet.
            </AppText>
          </View>
        )}
      </ScrollView>

      <View className="px-6 gap-2 pt-2">
        <Pressable
          onPress={() => setScanned(Math.min(scanned + 1, MOCK_PRODUCTS.length))}
          className={cn(
            'rounded-full py-3.5 items-center border',
            isDark ? 'border-white/15' : 'border-black/10'
          )}
        >
          <AppText className="text-sm text-foreground font-medium">
            Simulate scan +1
          </AppText>
        </Pressable>
        <Pressable
          onPress={() => router.push('/app-ui-3/cart?count=' + scanned)}
          disabled={scanned === 0}
          className={cn(
            'rounded-full py-4 items-center flex-row justify-center gap-2',
            scanned === 0
              ? isDark
                ? 'bg-white/10'
                : 'bg-black/5'
              : isDark
                ? 'bg-white'
                : 'bg-black'
          )}
        >
          <AppText
            className={cn(
              'font-medium',
              scanned === 0
                ? 'text-muted'
                : isDark
                  ? 'text-black'
                  : 'text-white'
            )}
          >
            Review {scanned} items
          </AppText>
          {scanned > 0 && (
            <View className="size-1.5 rounded-full bg-[#FFD60A]" />
          )}
        </Pressable>
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
