import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { cn } from 'heroui-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, {
  Easing,
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

const brutalShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 8,
};

export default function Scan() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useAppTheme();
  const [scanned, setScanned] = useState(0);

  const linePos = useSharedValue(0);

  useEffect(() => {
    linePos.value = withRepeat(
      withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [linePos]);

  const rLineStyle = useAnimatedStyle(() => ({
    top: `${linePos.value * 100}%`,
  }));

  return (
    <View
      className={cn('flex-1', isDark ? 'bg-black' : 'bg-white')}
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-5 pt-3 pb-3 flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          className="size-11 rounded-2xl bg-foreground items-center justify-center"
        >
          <StyledFeather
            name="arrow-left"
            size={20}
            className="text-background"
          />
        </Pressable>
        <AppText className="text-lg font-bold text-foreground uppercase tracking-wider">
          SCAN
        </AppText>
        <Pressable className="size-11 rounded-2xl bg-[#FFD60A] items-center justify-center border-2 border-foreground">
          <StyledFeather name="zap" size={18} className="text-black" />
        </Pressable>
      </View>

      {/* Scanner block */}
      <View className="px-5">
        <View
          className="aspect-[4/5] rounded-3xl relative overflow-hidden bg-foreground border-2 border-foreground"
          style={brutalShadow}
        >
          <View className="absolute inset-0 bg-foreground" />

          {(['tl', 'tr', 'bl', 'br'] as const).map((c) => (
            <View
              key={c}
              className={cn(
                'absolute size-12 border-[#FFD60A]',
                c === 'tl' && 'top-6 left-6 border-t-[6px] border-l-[6px]',
                c === 'tr' && 'top-6 right-6 border-t-[6px] border-r-[6px]',
                c === 'bl' && 'bottom-6 left-6 border-b-[6px] border-l-[6px]',
                c === 'br' && 'bottom-6 right-6 border-b-[6px] border-r-[6px]'
              )}
            />
          ))}

          <Animated.View
            style={rLineStyle}
            className="absolute left-8 right-8 h-1 bg-[#FFD60A]"
          />

          <View className="absolute inset-0 items-center justify-center">
            <StyledFeather name="maximize" size={40} className="text-[#FFD60A]" />
          </View>

          <View className="absolute top-3 left-3 right-3 flex-row justify-between">
            <View className="bg-[#FFD60A] px-3 py-1.5 rounded-full">
              <AppText className="text-[10px] font-bold text-black uppercase tracking-widest">
                ● READY
              </AppText>
            </View>
            <View className="bg-white px-3 py-1.5 rounded-full">
              <AppText className="text-[10px] font-bold text-black uppercase tracking-widest">
                CAM ON
              </AppText>
            </View>
          </View>
        </View>
      </View>

      {/* Running total */}
      <View className="flex-1 px-5 pt-4">
        <View className="flex-row items-center justify-between mb-2">
          <AppText className="text-xs text-muted uppercase tracking-widest font-bold">
            {scanned} ITEMS IN CART
          </AppText>
          <AppText className="text-xs text-muted uppercase tracking-widest font-bold">
            $
            {MOCK_PRODUCTS.slice(0, scanned)
              .reduce((a, p) => a + p.price, 0)
              .toFixed(2)}
          </AppText>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {MOCK_PRODUCTS.slice(0, scanned).map((p) => (
            <View
              key={p.id}
              className="mb-2 p-3 flex-row items-center gap-3 rounded-2xl bg-[#FFD60A] border-2 border-foreground"
            >
              <AppText className="text-2xl">{p.emoji}</AppText>
              <View className="flex-1">
                <AppText className="text-sm font-bold text-black uppercase">
                  {p.name}
                </AppText>
                <AppText className="text-xs text-black/60 font-medium">
                  SKU {p.sku.slice(-6)}
                </AppText>
              </View>
              <AppText className="text-base font-bold text-black">
                ${p.price.toFixed(2)}
              </AppText>
            </View>
          ))}
          {scanned === 0 && (
            <View className="items-center py-10 gap-2">
              <StyledFeather
                name="shopping-bag"
                size={28}
                className="text-muted"
              />
              <AppText className="text-xs text-muted uppercase font-bold tracking-widest">
                CART IS EMPTY
              </AppText>
            </View>
          )}
        </ScrollView>
      </View>

      <View className="px-5 gap-2">
        <Pressable
          onPress={() => setScanned(Math.min(scanned + 1, MOCK_PRODUCTS.length))}
          className="bg-transparent border-2 border-foreground rounded-2xl py-4 items-center"
          style={brutalShadow}
        >
          <AppText className="text-foreground font-bold uppercase tracking-wider">
            + Simulate scan
          </AppText>
        </Pressable>
        <Pressable
          onPress={() => router.push('/app-ui-2/cart?count=' + scanned)}
          disabled={scanned === 0}
          className={cn(
            'rounded-2xl py-5 items-center border-2',
            scanned === 0 ? 'bg-muted/40 border-muted' : 'bg-[#FFD60A] border-foreground'
          )}
          style={scanned > 0 ? brutalShadow : undefined}
        >
          <AppText className="text-black font-bold uppercase tracking-wider">
            Review cart →
          </AppText>
        </Pressable>
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
