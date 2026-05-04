import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { cn } from 'heroui-native';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../../components/app-text';
import { useAppTheme } from '../../../../contexts/app-theme-context';
import { MOCK_PRODUCTS } from '../../../../helpers/data/qwuik-products';

const StyledFeather = withUniwind(Feather);

export default function Scan() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useAppTheme();
  const [scanned, setScanned] = useState(0);

  const borderCol = isDark ? 'border-white' : 'border-black';

  const linePos = useSharedValue(0);

  useEffect(() => {
    linePos.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [linePos]);

  const rLineStyle = useAnimatedStyle(() => ({
    top: `${linePos.value * 100}%`,
  }));

  const handleScan = () => {
    if (scanned < MOCK_PRODUCTS.length) setScanned(scanned + 1);
  };

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {/* Header */}
      <View
        className={cn(
          'px-5 pt-3 pb-3 flex-row items-center justify-between border-b-2',
          borderCol
        )}
      >
        <Pressable
          onPress={() => router.back()}
          className={cn('size-10 items-center justify-center border-2', borderCol)}
        >
          <StyledFeather
            name="arrow-left"
            size={18}
            className="text-foreground"
          />
        </Pressable>
        <AppText className="text-xs font-bold text-foreground uppercase tracking-[3px]">
          STEP 01 · SCAN
        </AppText>
        <Pressable
          className={cn('size-10 items-center justify-center border-2', borderCol)}
        >
          <StyledFeather name="zap" size={16} className="text-foreground" />
        </Pressable>
      </View>

      {/* Scanner viewport */}
      <View className="px-5 pt-4">
        <View
          className={cn(
            'aspect-[4/5] overflow-hidden relative border-2',
            borderCol
          )}
        >
          {/* fake camera */}
          <View
            className={cn(
              'absolute inset-0',
              isDark ? 'bg-white/5' : 'bg-black/5'
            )}
          />

          {/* Corner brackets — square, no rounding */}
          {(['topLeft', 'topRight', 'bottomLeft', 'bottomRight'] as const).map(
            (corner) => (
              <View
                key={corner}
                className={cn(
                  'absolute size-10 border-[#FFD60A]',
                  corner === 'topLeft' && 'top-6 left-6 border-t-[3px] border-l-[3px]',
                  corner === 'topRight' && 'top-6 right-6 border-t-[3px] border-r-[3px]',
                  corner === 'bottomLeft' &&
                    'bottom-6 left-6 border-b-[3px] border-l-[3px]',
                  corner === 'bottomRight' &&
                    'bottom-6 right-6 border-b-[3px] border-r-[3px]'
                )}
              />
            )
          )}

          {/* Scanning line */}
          <Animated.View
            style={rLineStyle}
            className="absolute left-8 right-8 h-0.5 bg-[#FFD60A]"
          />

          <View className="absolute inset-0 items-center justify-center">
            <StyledFeather name="maximize" size={36} className="text-muted" />
          </View>

          <View className="absolute bottom-3 left-3 right-3 flex-row items-center justify-between px-3 py-2 bg-foreground">
            <AppText className="text-[10px] text-background uppercase tracking-widest font-bold">
              POINT AT BARCODE
            </AppText>
            <View className="flex-row items-center gap-1.5">
              <View className="size-1.5 bg-[#FFD60A]" />
              <AppText className="text-[10px] text-background uppercase tracking-widest font-bold">
                READY
              </AppText>
            </View>
          </View>
        </View>
      </View>

      {/* Scanned list preview */}
      <View className="flex-1 px-5 pt-4">
        <View className="flex-row items-center justify-between mb-2">
          <AppText className="text-xs font-bold text-foreground uppercase tracking-[3px]">
            CART · {scanned}
          </AppText>
          {scanned > 0 && (
            <AppText className="text-[10px] text-muted uppercase tracking-widest">
              TAP TO REMOVE
            </AppText>
          )}
        </View>
        {scanned === 0 ? (
          <View className={cn('items-center justify-center py-6 gap-2 border-2', borderCol)}>
            <StyledFeather name="shopping-bag" size={24} className="text-muted" />
            <AppText className="text-[11px] text-muted uppercase tracking-widest font-semibold">
              NO ITEMS YET
            </AppText>
          </View>
        ) : (
          <View className={cn('border-2', borderCol)}>
            {MOCK_PRODUCTS.slice(0, scanned).map((p, idx) => (
              <View
                key={p.id}
                className={cn(
                  'p-3 flex-row items-center gap-3',
                  idx > 0 && 'border-t-2',
                  borderCol
                )}
              >
                <View
                  className={cn(
                    'size-10 items-center justify-center border-2',
                    borderCol
                  )}
                >
                  <AppText className="text-xl">{p.emoji}</AppText>
                </View>
                <View className="flex-1">
                  <AppText className="text-sm font-bold text-foreground">
                    {p.name}
                  </AppText>
                  <AppText className="text-[10px] text-muted uppercase tracking-widest">
                    {p.category}
                  </AppText>
                </View>
                <AppText className="text-sm font-bold text-foreground">
                  ${p.price.toFixed(2)}
                </AppText>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Bottom actions */}
      <View className="px-5 pb-2 gap-0">
        <Pressable
          className={cn('py-4 items-center border-2', borderCol)}
          onPress={handleScan}
        >
          <AppText className="text-foreground font-bold uppercase tracking-[2px]">
            + SIMULATE SCAN
          </AppText>
        </Pressable>
        <Pressable
          className={cn(
            'py-4 items-center bg-[#FFD60A] border-2 border-t-0',
            borderCol,
            scanned === 0 && 'opacity-40'
          )}
          disabled={scanned === 0}
          onPress={() => router.push(`/cart?count=${scanned}`)}
        >
          <AppText className="text-black font-bold uppercase tracking-[2px]">
            REVIEW CART →
          </AppText>
        </Pressable>
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
