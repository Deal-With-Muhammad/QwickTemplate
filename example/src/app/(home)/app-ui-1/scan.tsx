import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, Card, cn } from 'heroui-native';
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
      <View className="px-5 pt-3 pb-4 flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          className="size-10 rounded-full bg-surface-secondary items-center justify-center"
        >
          <StyledFeather
            name="arrow-left"
            size={20}
            className="text-foreground"
          />
        </Pressable>
        <AppText className="text-base font-semibold text-foreground">
          Scan products
        </AppText>
        <Pressable className="size-10 rounded-full bg-surface-secondary items-center justify-center">
          <StyledFeather name="zap" size={18} className="text-foreground" />
        </Pressable>
      </View>

      {/* Scanner viewport */}
      <View className="px-5">
        <View
          className={cn(
            'aspect-[4/5] rounded-3xl overflow-hidden relative border-2 border-dashed',
            isDark ? 'border-white/20' : 'border-black/15'
          )}
        >
          {/* fake camera */}
          <View
            className={cn(
              'absolute inset-0',
              isDark ? 'bg-white/5' : 'bg-black/5'
            )}
          />

          {/* Corner brackets */}
          {(['topLeft', 'topRight', 'bottomLeft', 'bottomRight'] as const).map(
            (corner) => (
              <View
                key={corner}
                className={cn(
                  'absolute size-10 border-[#FFD60A]',
                  corner === 'topLeft' &&
                    'top-8 left-8 border-t-4 border-l-4 rounded-tl-xl',
                  corner === 'topRight' &&
                    'top-8 right-8 border-t-4 border-r-4 rounded-tr-xl',
                  corner === 'bottomLeft' &&
                    'bottom-8 left-8 border-b-4 border-l-4 rounded-bl-xl',
                  corner === 'bottomRight' &&
                    'bottom-8 right-8 border-b-4 border-r-4 rounded-br-xl'
                )}
              />
            )
          )}

          {/* Scanning line */}
          <Animated.View
            style={rLineStyle}
            className="absolute left-10 right-10 h-0.5 bg-[#FFD60A]"
          />

          <View className="absolute inset-0 items-center justify-center">
            <StyledFeather name="maximize" size={36} className="text-muted" />
          </View>

          <View className="absolute bottom-3 left-3 right-3 flex-row items-center justify-between px-3 py-2 rounded-xl bg-foreground/80">
            <AppText className="text-xs text-background">
              Point at barcode
            </AppText>
            <View className="flex-row items-center gap-1">
              <View className="size-1.5 rounded-full bg-[#FFD60A]" />
              <AppText className="text-xs text-background font-medium">
                Ready
              </AppText>
            </View>
          </View>
        </View>
      </View>

      {/* Scanned list preview */}
      <View className="flex-1 px-5 pt-4">
        <View className="flex-row items-center justify-between mb-2">
          <AppText className="text-sm font-semibold text-foreground">
            Cart ({scanned})
          </AppText>
          {scanned > 0 && (
            <AppText className="text-xs text-muted">Tap item to remove</AppText>
          )}
        </View>
        {scanned === 0 ? (
          <View className="items-center justify-center py-6 gap-2">
            <StyledFeather name="shopping-bag" size={24} className="text-muted" />
            <AppText className="text-sm text-muted">No items yet</AppText>
          </View>
        ) : (
          MOCK_PRODUCTS.slice(0, scanned).map((p) => (
            <Card
              key={p.id}
              className={cn(
                'p-3 mb-2 flex-row items-center gap-3 border',
                isDark ? 'border-white/10' : 'border-black/10'
              )}
            >
              <View className="size-10 rounded-xl bg-surface-secondary items-center justify-center">
                <AppText className="text-xl">{p.emoji}</AppText>
              </View>
              <View className="flex-1">
                <AppText className="text-sm font-semibold text-foreground">
                  {p.name}
                </AppText>
                <AppText className="text-xs text-muted">{p.category}</AppText>
              </View>
              <AppText className="text-sm font-bold text-foreground">
                ${p.price.toFixed(2)}
              </AppText>
            </Card>
          ))
        )}
      </View>

      {/* Bottom actions */}
      <View className="px-5 pb-2 gap-2">
        <Button
          className={cn(
            'border',
            isDark ? 'border-white/15' : 'border-black/15',
            'bg-transparent'
          )}
          onPress={handleScan}
        >
          <Button.Label className="text-foreground font-semibold">
            Simulate scan +1 product
          </Button.Label>
        </Button>
        <Button
          className="bg-[#FFD60A]"
          isDisabled={scanned === 0}
          onPress={() => router.push('/app-ui-1/cart?count=' + scanned)}
        >
          <Button.Label className="text-black font-bold">
            Review cart
          </Button.Label>
        </Button>
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
