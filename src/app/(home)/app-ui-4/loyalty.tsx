import Feather from '@expo/vector-icons/Feather';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { cn } from 'heroui-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../components/app-text';
import { useAppTheme } from '../../../contexts/app-theme-context';

const StyledFeather = withUniwind(Feather);

export default function Loyalty() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useAppTheme();
  const { total } = useLocalSearchParams<{ total: string }>();
  const borderCol = isDark ? 'border-white' : 'border-black';

  const [state, setState] = useState<'ask' | 'scanned' | 'skipped'>('ask');

  const proceed = () => router.push(`/app-ui-4/payment?total=${total}`);

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
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
          STEP 03 · LOYALTY
        </AppText>
        <View className="size-10" />
      </View>

      <View className="flex-1 px-5 pt-4">
        {state === 'ask' && (
          <Animated.View entering={FadeIn.duration(240)} className="gap-4">
            <View
              className={cn(
                'p-5 bg-[#FFD60A] border-2',
                borderCol
              )}
            >
              <View
                className={cn(
                  'size-11 items-center justify-center border-2 bg-black mb-3',
                  borderCol
                )}
              >
                <StyledFeather name="star" size={18} className="text-[#FFD60A]" />
              </View>
              <AppText className="text-2xl font-bold text-black tracking-tight">
                QWUIK MEMBER?
              </AppText>
              <AppText className="text-xs text-black/70 mt-1 font-medium">
                Scan their loyalty card to apply rewards.
              </AppText>
            </View>

            <View className="gap-0">
              <Pressable
                onPress={() => setState('scanned')}
                className={cn(
                  'p-4 flex-row items-center gap-3 border-2 bg-foreground',
                  borderCol
                )}
              >
                <View
                  className={cn(
                    'size-10 items-center justify-center border-2 bg-[#FFD60A]',
                    borderCol
                  )}
                >
                  <StyledFeather
                    name="maximize"
                    size={16}
                    className="text-black"
                  />
                </View>
                <View className="flex-1">
                  <AppText className="text-sm font-bold text-background uppercase tracking-[2px]">
                    SCAN LOYALTY CARD
                  </AppText>
                  <AppText className="text-[10px] text-background/60 uppercase tracking-widest">
                    CUSTOMER HAS A MEMBER CARD
                  </AppText>
                </View>
                <StyledFeather
                  name="chevron-right"
                  size={16}
                  className="text-background"
                />
              </Pressable>

              <Pressable
                onPress={() => setState('skipped')}
                className={cn(
                  'p-4 flex-row items-center gap-3 border-2 border-t-0',
                  borderCol
                )}
              >
                <View
                  className={cn(
                    'size-10 items-center justify-center border-2',
                    borderCol
                  )}
                >
                  <StyledFeather
                    name="user-x"
                    size={16}
                    className="text-foreground"
                  />
                </View>
                <View className="flex-1">
                  <AppText className="text-sm font-bold text-foreground uppercase tracking-[2px]">
                    NOT A MEMBER
                  </AppText>
                  <AppText className="text-[10px] text-muted uppercase tracking-widest">
                    SKIP TO PAYMENT
                  </AppText>
                </View>
                <StyledFeather
                  name="chevron-right"
                  size={16}
                  className="text-muted"
                />
              </Pressable>
            </View>
          </Animated.View>
        )}

        {state === 'scanned' && (
          <Animated.View
            entering={FadeInDown.duration(260)}
            className="gap-4 items-center justify-center flex-1"
          >
            <View
              className={cn(
                'size-20 items-center justify-center bg-[#FFD60A] border-2',
                borderCol
              )}
            >
              <StyledFeather name="check" size={36} className="text-black" />
            </View>
            <AppText
              className="text-2xl font-bold text-foreground text-center tracking-tight"
              maxFontSizeMultiplier={1.4}
            >
              MEMBER VERIFIED
            </AppText>
            <View className={cn('w-full p-4 border-2', borderCol)}>
              <AppText className="text-[10px] text-muted uppercase tracking-[3px] font-semibold">
                MEMBER
              </AppText>
              <AppText className="text-lg font-bold text-foreground">
                Priya Mehta
              </AppText>
              <View className={cn('h-[2px] my-3', isDark ? 'bg-white' : 'bg-black')} />
              <View className="flex-row justify-between">
                <View>
                  <AppText className="text-[10px] text-muted uppercase tracking-widest font-semibold">
                    POINTS
                  </AppText>
                  <AppText className="text-xl font-bold text-foreground">
                    1,284
                  </AppText>
                </View>
                <View>
                  <AppText className="text-[10px] text-muted uppercase tracking-widest font-semibold">
                    TIER
                  </AppText>
                  <AppText className="text-xl font-bold text-foreground">
                    GOLD
                  </AppText>
                </View>
                <View>
                  <AppText className="text-[10px] text-muted uppercase tracking-widest font-semibold">
                    REWARD
                  </AppText>
                  <AppText className="text-xl font-bold text-foreground">
                    -$5.00
                  </AppText>
                </View>
              </View>
            </View>
          </Animated.View>
        )}

        {state === 'skipped' && (
          <Animated.View
            entering={FadeInDown.duration(260)}
            className="gap-4 items-center justify-center flex-1"
          >
            <View
              className={cn(
                'size-20 items-center justify-center border-2',
                borderCol
              )}
            >
              <StyledFeather
                name="user-x"
                size={32}
                className="text-foreground"
              />
            </View>
            <AppText
              className="text-2xl font-bold text-foreground text-center tracking-tight"
              maxFontSizeMultiplier={1.4}
            >
              CHECKOUT AS GUEST
            </AppText>
            <AppText className="text-xs text-muted text-center px-5 uppercase tracking-widest">
              YOU CAN STILL SEND A DIGITAL RECEIPT AFTER PAYMENT.
            </AppText>
          </Animated.View>
        )}
      </View>

      <View className="px-5 pb-2">
        <Pressable
          className={cn(
            'bg-[#FFD60A] py-4 items-center border-2 border-foreground',
            state === 'ask' && 'opacity-40'
          )}
          disabled={state === 'ask'}
          onPress={proceed}
        >
          <AppText className="text-black font-bold uppercase tracking-[2px]">
            PROCEED TO PAYMENT · ${total}
          </AppText>
        </Pressable>
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
