import Feather from '@expo/vector-icons/Feather';
import { StatusBar } from 'expo-status-bar';
import { Input, TextField, cn } from 'heroui-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../../../components/app-text';
import { useAppTheme } from '../../../../../contexts/app-theme-context';
import { MOCK_PRODUCTS } from '../../../../../helpers/data/qwuik-products';

const StyledFeather = withUniwind(Feather);

// Synthetic stock levels per product
const stockMap: Record<string, number> = {};
MOCK_PRODUCTS.forEach((p, i) => {
  stockMap[p.id] = [42, 18, 3, 76, 24, 9, 51, 12][i] ?? 20;
});

export default function InventoryTab() {
  const insets = useSafeAreaInsets();
  const { isDark } = useAppTheme();

  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    if (!q.trim()) return MOCK_PRODUCTS;
    const t = q.toLowerCase();
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(t) ||
        p.category.toLowerCase().includes(t) ||
        p.sku.toLowerCase().includes(t)
    );
  }, [q]);

  const lowStock = filtered.filter((p) => (stockMap[p.id] ?? 0) <= 10);

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="px-5 pt-3">
        <AppText className="text-xs text-muted uppercase tracking-[3px] font-semibold">
          STOCK
        </AppText>
        <AppText className="text-2xl font-bold text-foreground tracking-tight">
          Inventory
        </AppText>
      </View>

      {/* Search */}
      <Animated.View
        entering={FadeInDown.duration(300)}
        className="px-5 mt-4"
      >
        <TextField>
          <Input
            value={q}
            onChangeText={setQ}
            placeholder="Search products, SKU…"
            autoCapitalize="none"
          />
        </TextField>
      </Animated.View>

      {/* Low stock banner */}
      {lowStock.length > 0 && (
        <Animated.View
          entering={FadeInDown.delay(60).duration(300)}
          className="px-5 mt-3"
        >
          <View
            className={cn(
              'rounded-2xl p-3 flex-row items-center gap-3 bg-[#FFD60A]'
            )}
          >
            <View className="size-9 rounded-xl bg-black items-center justify-center">
              <StyledFeather
                name="alert-triangle"
                size={16}
                className="text-[#FFD60A]"
              />
            </View>
            <View className="flex-1">
              <AppText className="text-sm font-bold text-black">
                {lowStock.length} low-stock item{lowStock.length === 1 ? '' : 's'}
              </AppText>
              <AppText className="text-xs text-black/70">
                Tap to place a restock order
              </AppText>
            </View>
            <StyledFeather
              name="chevron-right"
              size={18}
              className="text-black"
            />
          </View>
        </Animated.View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        className="mt-4"
      >
        <View className="px-5 gap-2">
          {filtered.map((p, i) => {
            const stock = stockMap[p.id] ?? 0;
            const isLow = stock <= 10;
            const isOut = stock === 0;
            return (
              <Animated.View
                key={p.id}
                entering={FadeInDown.delay(i * 20).duration(240)}
              >
                <Pressable
                  className={cn(
                    'rounded-2xl p-3 flex-row items-center gap-3 border',
                    isDark ? 'border-white/10' : 'border-black/10'
                  )}
                >
                  <View
                    className={cn(
                      'size-11 rounded-xl items-center justify-center',
                      isDark ? 'bg-white/5' : 'bg-black/5'
                    )}
                  >
                    <AppText className="text-2xl">{p.emoji}</AppText>
                  </View>
                  <View className="flex-1 gap-0.5">
                    <AppText className="text-sm font-semibold text-foreground">
                      {p.name}
                    </AppText>
                    <AppText className="text-[11px] text-muted">
                      SKU {p.sku.slice(-6)} · ${p.price.toFixed(2)}
                    </AppText>
                  </View>
                  <View className="items-end gap-1">
                    <AppText
                      className={cn(
                        'text-base font-bold tabular-nums',
                        isOut
                          ? 'text-foreground'
                          : isLow
                            ? 'text-[#FFD60A]'
                            : 'text-foreground'
                      )}
                    >
                      {stock}
                    </AppText>
                    <View
                      className={cn(
                        'px-2 py-0.5 rounded-full',
                        isOut
                          ? isDark
                            ? 'bg-white/10'
                            : 'bg-black/10'
                          : isLow
                            ? 'bg-[#FFD60A]'
                            : isDark
                              ? 'bg-white/5'
                              : 'bg-black/5'
                      )}
                    >
                      <AppText
                        className={cn(
                          'text-[9px] font-bold uppercase tracking-widest',
                          isLow ? 'text-black' : 'text-muted'
                        )}
                      >
                        {isOut ? 'OUT' : isLow ? 'LOW' : 'OK'}
                      </AppText>
                    </View>
                  </View>
                </Pressable>
              </Animated.View>
            );
          })}

          {filtered.length === 0 && (
            <View className="items-center py-10 gap-2">
              <StyledFeather
                name="search"
                size={28}
                className="text-muted"
              />
              <AppText className="text-sm text-muted">
                No products match "{q}"
              </AppText>
            </View>
          )}
        </View>
      </ScrollView>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
