import Feather from '@expo/vector-icons/Feather';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, Card, cn } from 'heroui-native';
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

  const [state, setState] = useState<'ask' | 'scanned' | 'skipped'>('ask');

  const proceed = () => router.push(`/app-ui-1/payment?total=${total}`);

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
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
          Loyalty program
        </AppText>
        <View className="size-10" />
      </View>

      <View className="flex-1 px-5 pt-4">
        {state === 'ask' && (
          <Animated.View entering={FadeIn.duration(240)} className="gap-5">
            <Card
              className={cn(
                'p-5 bg-[#FFD60A] border-0'
              )}
            >
              <View className="size-11 rounded-2xl bg-black items-center justify-center mb-3">
                <StyledFeather name="star" size={20} className="text-[#FFD60A]" />
              </View>
              <AppText className="text-2xl font-bold text-black">
                Is this customer a Qwuik member?
              </AppText>
              <AppText className="text-sm text-black/70 mt-1">
                Scan their loyalty card to apply points and rewards to this
                checkout.
              </AppText>
            </Card>

            <View className="gap-3">
              <Pressable
                onPress={() => setState('scanned')}
                className="bg-foreground rounded-2xl p-4 flex-row items-center gap-3"
              >
                <View className="size-10 rounded-xl bg-[#FFD60A] items-center justify-center">
                  <StyledFeather
                    name="maximize"
                    size={18}
                    className="text-black"
                  />
                </View>
                <View className="flex-1">
                  <AppText className="text-base font-semibold text-background">
                    Scan loyalty card
                  </AppText>
                  <AppText className="text-xs text-background/70">
                    Customer has a member card or app
                  </AppText>
                </View>
                <StyledFeather
                  name="chevron-right"
                  size={18}
                  className="text-background/70"
                />
              </Pressable>

              <Pressable
                onPress={() => setState('skipped')}
                className={cn(
                  'rounded-2xl p-4 flex-row items-center gap-3 border',
                  isDark ? 'border-white/10' : 'border-black/10'
                )}
              >
                <View
                  className={cn(
                    'size-10 rounded-xl items-center justify-center',
                    isDark ? 'bg-white/10' : 'bg-black/5'
                  )}
                >
                  <StyledFeather
                    name="user-x"
                    size={18}
                    className="text-foreground"
                  />
                </View>
                <View className="flex-1">
                  <AppText className="text-base font-semibold text-foreground">
                    Not a member
                  </AppText>
                  <AppText className="text-xs text-muted">
                    Skip and continue to payment
                  </AppText>
                </View>
                <StyledFeather
                  name="chevron-right"
                  size={18}
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
            <View className="size-20 rounded-3xl bg-[#FFD60A] items-center justify-center">
              <StyledFeather name="check" size={36} className="text-black" />
            </View>
            <AppText
              className="text-2xl font-bold text-foreground text-center"
              maxFontSizeMultiplier={1.4}
            >
              Member verified
            </AppText>
            <Card
              className={cn(
                'w-full p-5 border',
                isDark ? 'border-white/10' : 'border-black/10'
              )}
            >
              <AppText className="text-xs text-muted uppercase tracking-widest">
                Member
              </AppText>
              <AppText className="text-lg font-semibold text-foreground">
                Priya Mehta
              </AppText>
              <View className="flex-row justify-between mt-3">
                <View>
                  <AppText className="text-xs text-muted">Points</AppText>
                  <AppText className="text-xl font-bold text-foreground">
                    1,284
                  </AppText>
                </View>
                <View>
                  <AppText className="text-xs text-muted">Tier</AppText>
                  <AppText className="text-xl font-bold text-foreground">
                    Gold
                  </AppText>
                </View>
                <View>
                  <AppText className="text-xs text-muted">Reward</AppText>
                  <AppText className="text-xl font-bold text-[#FFD60A]">
                    -$5.00
                  </AppText>
                </View>
              </View>
            </Card>
          </Animated.View>
        )}

        {state === 'skipped' && (
          <Animated.View
            entering={FadeInDown.duration(260)}
            className="gap-4 items-center justify-center flex-1"
          >
            <View
              className={cn(
                'size-20 rounded-3xl items-center justify-center',
                isDark ? 'bg-white/10' : 'bg-black/5'
              )}
            >
              <StyledFeather
                name="user-x"
                size={32}
                className="text-foreground"
              />
            </View>
            <AppText
              className="text-2xl font-bold text-foreground text-center"
              maxFontSizeMultiplier={1.4}
            >
              Checkout as guest
            </AppText>
            <AppText className="text-sm text-muted text-center px-5">
              You can still send a digital receipt to their email after payment.
            </AppText>
          </Animated.View>
        )}
      </View>

      <View className="px-5 pb-2">
        <Button
          className="bg-[#FFD60A]"
          isDisabled={state === 'ask'}
          onPress={proceed}
        >
          <Button.Label className="text-black font-bold">
            Proceed to payment · ${total}
          </Button.Label>
        </Button>
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
