import Feather from '@expo/vector-icons/Feather';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { cn } from 'heroui-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../components/app-text';
import { useAppTheme } from '../../../contexts/app-theme-context';
import { MOCK_PRODUCTS } from '../../../helpers/data/qwuik-products';

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
  const borderCol = isDark ? 'border-white' : 'border-black';

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
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
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
          STEP 02 · CART
        </AppText>
        <View className="size-10" />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 260 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-4">
          <View className={cn('border-2', borderCol)}>
            {items.map((item, idx) => (
              <Animated.View
                key={item.id}
                entering={FadeInDown.delay(idx * 40).duration(260)}
                className={cn(
                  'p-3 flex-row items-center gap-3',
                  idx > 0 && 'border-t-2',
                  borderCol
                )}
              >
                <View
                  className={cn(
                    'size-14 items-center justify-center border-2',
                    borderCol
                  )}
                >
                  <AppText className="text-2xl">{item.emoji}</AppText>
                </View>
                <View className="flex-1 gap-0.5">
                  <AppText className="text-sm font-bold text-foreground">
                    {item.name}
                  </AppText>
                  <AppText className="text-[10px] text-muted uppercase tracking-widest">
                    SKU {item.sku.slice(-6)} · {item.category}
                  </AppText>
                  <AppText className="text-sm font-bold text-foreground mt-1">
                    ${item.price.toFixed(2)}
                  </AppText>
                </View>
                <View className={cn('flex-row items-stretch border-2', borderCol)}>
                  <Pressable
                    className={cn(
                      'size-8 items-center justify-center border-r-2',
                      borderCol
                    )}
                    onPress={() => updateQty(item.id, -1)}
                  >
                    <StyledFeather
                      name="minus"
                      size={14}
                      className="text-foreground"
                    />
                  </Pressable>
                  <View className="size-8 items-center justify-center">
                    <AppText className="text-sm font-bold text-foreground">
                      {item.quantity}
                    </AppText>
                  </View>
                  <Pressable
                    className={cn(
                      'size-8 items-center justify-center bg-[#FFD60A] border-l-2',
                      borderCol
                    )}
                    onPress={() => updateQty(item.id, +1)}
                  >
                    <StyledFeather name="plus" size={14} className="text-black" />
                  </Pressable>
                </View>
              </Animated.View>
            ))}
          </View>
          {items.length === 0 && (
            <View className={cn('items-center py-10 gap-2 border-2', borderCol)}>
              <StyledFeather
                name="shopping-bag"
                size={28}
                className="text-muted"
              />
              <AppText className="text-[11px] text-muted uppercase tracking-widest font-semibold">
                CART IS EMPTY
              </AppText>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Summary */}
      <View
        className={cn(
          'absolute left-0 right-0 bottom-0 pt-4 px-5 bg-background border-t-2',
          borderCol
        )}
        style={{ paddingBottom: insets.bottom + 10 }}
      >
        <View className={cn('border-2 p-3 mb-3', borderCol)}>
          <View className="flex-row justify-between">
            <AppText className="text-[10px] text-muted uppercase tracking-widest font-semibold">
              SUBTOTAL
            </AppText>
            <AppText className="text-sm text-foreground font-bold">
              ${subtotal.toFixed(2)}
            </AppText>
          </View>
          <View className="flex-row justify-between mt-1">
            <AppText className="text-[10px] text-muted uppercase tracking-widest font-semibold">
              TAX · 8%
            </AppText>
            <AppText className="text-sm text-foreground font-bold">
              ${tax.toFixed(2)}
            </AppText>
          </View>
          <View className={cn('h-[2px] my-2', isDark ? 'bg-white' : 'bg-black')} />
          <View className="flex-row justify-between items-end">
            <AppText className="text-xs font-bold text-foreground uppercase tracking-[3px]">
              TOTAL
            </AppText>
            <AppText
              className="text-2xl font-bold text-foreground"
              maxFontSizeMultiplier={1.3}
            >
              ${grandTotal.toFixed(2)}
            </AppText>
          </View>
        </View>
        <Pressable
          className={cn(
            'bg-[#FFD60A] py-4 items-center border-2 border-foreground',
            items.length === 0 && 'opacity-40'
          )}
          disabled={items.length === 0}
          onPress={() =>
            router.push(`/app-ui-4/loyalty?total=${grandTotal.toFixed(2)}`)
          }
        >
          <AppText className="text-black font-bold uppercase tracking-[2px]">
            CONTINUE →
          </AppText>
        </Pressable>
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
