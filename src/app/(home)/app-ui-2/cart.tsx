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

const brutalShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 8,
};

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
      className={cn('flex-1', isDark ? 'bg-black' : 'bg-white')}
      style={{ paddingTop: insets.top }}
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
          CART
        </AppText>
        <View className="size-11" />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 260 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 gap-3">
          {items.map((item, idx) => (
            <Animated.View
              key={item.id}
              entering={FadeInDown.delay(idx * 50).duration(240)}
              className={cn(
                'rounded-2xl p-4 flex-row items-center gap-3 border-2 border-foreground',
                isDark ? 'bg-white' : 'bg-white'
              )}
              style={brutalShadow}
            >
              <View className="size-14 rounded-xl bg-[#FFD60A] items-center justify-center border-2 border-black">
                <AppText className="text-2xl">{item.emoji}</AppText>
              </View>
              <View className="flex-1">
                <AppText className="text-sm font-bold text-black uppercase">
                  {item.name}
                </AppText>
                <AppText className="text-[10px] text-black/60 font-bold uppercase tracking-widest">
                  SKU {item.sku.slice(-6)}
                </AppText>
                <AppText className="text-lg font-bold text-black mt-1">
                  ${item.price.toFixed(2)}
                </AppText>
              </View>
              <View className="gap-1">
                <Pressable
                  onPress={() => updateQty(item.id, +1)}
                  className="size-8 rounded-xl bg-[#FFD60A] items-center justify-center border-2 border-black"
                >
                  <StyledFeather name="plus" size={14} className="text-black" />
                </Pressable>
                <AppText className="text-base font-bold text-black text-center">
                  {item.quantity}
                </AppText>
                <Pressable
                  onPress={() => updateQty(item.id, -1)}
                  className="size-8 rounded-xl bg-white items-center justify-center border-2 border-black"
                >
                  <StyledFeather name="minus" size={14} className="text-black" />
                </Pressable>
              </View>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      {/* Summary block */}
      <View
        className={cn(
          'absolute left-0 right-0 bottom-0 rounded-t-3xl border-t-2 border-foreground p-5',
          isDark ? 'bg-white' : 'bg-foreground'
        )}
        style={{ paddingBottom: insets.bottom + 14 }}
      >
        <View className="flex-row justify-between">
          <AppText
            className={cn(
              'text-xs font-bold uppercase tracking-widest',
              isDark ? 'text-black/70' : 'text-background/70'
            )}
          >
            SUBTOTAL
          </AppText>
          <AppText
            className={cn(
              'text-xs font-bold',
              isDark ? 'text-black' : 'text-background'
            )}
          >
            ${subtotal.toFixed(2)}
          </AppText>
        </View>
        <View className="flex-row justify-between mt-1">
          <AppText
            className={cn(
              'text-xs font-bold uppercase tracking-widest',
              isDark ? 'text-black/70' : 'text-background/70'
            )}
          >
            TAX 8%
          </AppText>
          <AppText
            className={cn(
              'text-xs font-bold',
              isDark ? 'text-black' : 'text-background'
            )}
          >
            ${tax.toFixed(2)}
          </AppText>
        </View>
        <View className="flex-row justify-between mt-3 pt-3 border-t-2 border-[#FFD60A]/30">
          <AppText
            className={cn(
              'text-sm font-bold uppercase tracking-widest',
              isDark ? 'text-black' : 'text-background'
            )}
          >
            TOTAL
          </AppText>
          <AppText
            className={cn(
              'text-4xl font-bold tracking-tighter',
              isDark ? 'text-black' : 'text-[#FFD60A]'
            )}
            maxFontSizeMultiplier={1.3}
          >
            ${grand.toFixed(2)}
          </AppText>
        </View>
        <Pressable
          onPress={() =>
            router.push(`/app-ui-2/loyalty?total=${grand.toFixed(2)}`)
          }
          className="mt-4 bg-[#FFD60A] rounded-2xl py-5 items-center border-2 border-foreground"
          style={brutalShadow}
        >
          <AppText className="text-black font-bold uppercase tracking-wider">
            Continue →
          </AppText>
        </Pressable>
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
