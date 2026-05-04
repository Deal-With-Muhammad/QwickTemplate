import Feather from '@expo/vector-icons/Feather';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, Card, cn } from 'heroui-native';
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
  const initialItems = MOCK_PRODUCTS.slice(0, total).map((p) => ({
    ...p,
    quantity: 1,
  }));

  const [items, setItems] = useState(initialItems);

  const subtotal = useMemo(
    () => items.reduce((acc, it) => acc + it.price * it.quantity, 0),
    [items]
  );
  const tax = subtotal * 0.08;
  const grandTotal = subtotal + tax;

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((it) =>
          it.id === id ? { ...it, quantity: Math.max(0, it.quantity + delta) } : it
        )
        .filter((it) => it.quantity > 0)
    );
  };

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top }}
    >
      <View className="px-5 pt-3 pb-3 flex-row items-center justify-between">
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
          Cart
        </AppText>
        <View className="size-10" />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 220 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 gap-3">
          {items.map((item, idx) => (
            <Animated.View
              key={item.id}
              entering={FadeInDown.delay(idx * 40).duration(260)}
            >
              <Card
                className={cn(
                  'p-3 flex-row items-center gap-3 border',
                  isDark ? 'border-white/10' : 'border-black/10'
                )}
              >
                <View className="size-14 rounded-xl bg-surface-secondary items-center justify-center">
                  <AppText className="text-2xl">{item.emoji}</AppText>
                </View>
                <View className="flex-1 gap-0.5">
                  <AppText className="text-sm font-semibold text-foreground">
                    {item.name}
                  </AppText>
                  <AppText className="text-xs text-muted">
                    SKU {item.sku.slice(-6)} · {item.category}
                  </AppText>
                  <AppText className="text-sm font-bold text-foreground mt-1">
                    ${item.price.toFixed(2)}
                  </AppText>
                </View>
                <View
                  className={cn(
                    'flex-row items-center gap-2 rounded-full p-1 border',
                    isDark ? 'border-white/10' : 'border-black/10'
                  )}
                >
                  <Pressable
                    className="size-7 rounded-full bg-surface-secondary items-center justify-center"
                    onPress={() => updateQty(item.id, -1)}
                  >
                    <StyledFeather
                      name="minus"
                      size={14}
                      className="text-foreground"
                    />
                  </Pressable>
                  <AppText className="text-sm font-bold text-foreground w-5 text-center">
                    {item.quantity}
                  </AppText>
                  <Pressable
                    className="size-7 rounded-full bg-[#FFD60A] items-center justify-center"
                    onPress={() => updateQty(item.id, +1)}
                  >
                    <StyledFeather
                      name="plus"
                      size={14}
                      className="text-black"
                    />
                  </Pressable>
                </View>
              </Card>
            </Animated.View>
          ))}
          {items.length === 0 && (
            <View className="items-center py-10 gap-2">
              <StyledFeather
                name="shopping-bag"
                size={28}
                className="text-muted"
              />
              <AppText className="text-sm text-muted">Cart is empty</AppText>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Summary */}
      <View
        className={cn(
          'absolute left-0 right-0 bottom-0 pt-4 px-5 border-t',
          isDark ? 'bg-background border-white/10' : 'bg-background border-black/10'
        )}
        style={{ paddingBottom: insets.bottom + 10 }}
      >
        <View className="gap-1 mb-3">
          <View className="flex-row justify-between">
            <AppText className="text-sm text-muted">Subtotal</AppText>
            <AppText className="text-sm text-foreground font-medium">
              ${subtotal.toFixed(2)}
            </AppText>
          </View>
          <View className="flex-row justify-between">
            <AppText className="text-sm text-muted">Tax (8%)</AppText>
            <AppText className="text-sm text-foreground font-medium">
              ${tax.toFixed(2)}
            </AppText>
          </View>
          <View className="flex-row justify-between mt-1">
            <AppText className="text-base font-bold text-foreground">
              Total
            </AppText>
            <AppText
              className="text-2xl font-bold text-foreground"
              maxFontSizeMultiplier={1.3}
            >
              ${grandTotal.toFixed(2)}
            </AppText>
          </View>
        </View>
        <Button
          className="bg-[#FFD60A]"
          isDisabled={items.length === 0}
          onPress={() =>
            router.push(`/payment?total=${grandTotal.toFixed(2)}`)
          }
        >
          <AppText className="text-black font-bold">
            Continue to checkout
          </AppText>
        </Button>
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
