import Feather from '@expo/vector-icons/Feather';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { cn } from 'heroui-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../../components/app-text';
import { useAppTheme } from '../../../../contexts/app-theme-context';
import { MOCK_PRODUCTS } from '../../../../helpers/data/qwuik-products';

const StyledFeather = withUniwind(Feather);

export default function Cart() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useAppTheme();
  const { count } = useLocalSearchParams<{ count: string }>();

  const total = parseInt(count || '3', 10) || 3;
  const [items, setItems] = useState(
    MOCK_PRODUCTS.slice(0, total).map((p) => ({ ...p, quantity: 1 }))
  );

  const subtotal = useMemo(
    () => items.reduce((a, it) => a + it.price * it.quantity, 0),
    [items]
  );
  const tax = subtotal * 0.08;
  const grand = subtotal + tax;

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((it) =>
          it.id === id
            ? { ...it, quantity: Math.max(0, it.quantity + delta) }
            : it
        )
        .filter((it) => it.quantity > 0)
    );
  };

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top }}
    >
      <View className="px-6 pt-3 pb-2 flex-row items-center justify-between">
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <StyledFeather
            name="arrow-left"
            size={22}
            className="text-foreground"
          />
        </Pressable>
        <AppText className="text-xs text-muted uppercase tracking-[3px] font-medium">
          CART · {items.length} items
        </AppText>
        <View className="size-6" />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 240 }}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item, idx) => (
          <Animated.View
            key={item.id}
            entering={FadeInDown.delay(idx * 40).duration(220)}
            className={cn(
              'py-4 flex-row items-center gap-4 border-b',
              isDark ? 'border-white/5' : 'border-black/5'
            )}
          >
            <AppText className="text-3xl">{item.emoji}</AppText>
            <View className="flex-1">
              <AppText className="text-base text-foreground font-medium">
                {item.name}
              </AppText>
              <AppText className="text-xs text-muted mt-0.5">
                ${item.price.toFixed(2)} · {item.category}
              </AppText>
            </View>
            <View className="flex-row items-center gap-2">
              <Pressable
                onPress={() => updateQty(item.id, -1)}
                className={cn(
                  'size-7 rounded-full items-center justify-center border',
                  isDark ? 'border-white/15' : 'border-black/10'
                )}
              >
                <StyledFeather
                  name="minus"
                  size={12}
                  className="text-foreground"
                />
              </Pressable>
              <AppText className="text-sm font-medium text-foreground w-5 text-center">
                {item.quantity}
              </AppText>
              <Pressable
                onPress={() => updateQty(item.id, +1)}
                className={cn(
                  'size-7 rounded-full items-center justify-center',
                  isDark ? 'bg-white' : 'bg-black'
                )}
              >
                <StyledFeather
                  name="plus"
                  size={12}
                  className={isDark ? 'text-black' : 'text-white'}
                />
              </Pressable>
            </View>
          </Animated.View>
        ))}
      </ScrollView>

      {/* Summary */}
      <View
        className={cn(
          'absolute left-0 right-0 bottom-0 px-6 pt-5 bg-background border-t',
          isDark ? 'border-white/10' : 'border-black/10'
        )}
        style={{ paddingBottom: insets.bottom + 14 }}
      >
        <View className="flex-row justify-between mb-1">
          <AppText className="text-xs text-muted">Subtotal</AppText>
          <AppText className="text-xs text-foreground">
            ${subtotal.toFixed(2)}
          </AppText>
        </View>
        <View className="flex-row justify-between mb-3">
          <AppText className="text-xs text-muted">Tax · 8%</AppText>
          <AppText className="text-xs text-foreground">
            ${tax.toFixed(2)}
          </AppText>
        </View>
        <View className="flex-row justify-between items-end">
          <View>
            <AppText className="text-[10px] text-muted uppercase tracking-[3px] font-medium">
              TOTAL
            </AppText>
          </View>
          <AppText
            className="text-4xl font-bold text-foreground tracking-tighter"
            maxFontSizeMultiplier={1.3}
          >
            ${grand.toFixed(2)}
          </AppText>
        </View>
        <Pressable
          onPress={() =>
            router.push(`/payment?total=${grand.toFixed(2)}`)
          }
          className={cn(
            'mt-4 rounded-full py-4 items-center flex-row justify-center gap-2',
            isDark ? 'bg-white' : 'bg-black'
          )}
        >
          <AppText
            className={cn(
              'font-medium',
              isDark ? 'text-black' : 'text-white'
            )}
          >
            Continue to checkout
          </AppText>
          <View className="size-1.5 rounded-full bg-[#FFD60A]" />
        </Pressable>
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
