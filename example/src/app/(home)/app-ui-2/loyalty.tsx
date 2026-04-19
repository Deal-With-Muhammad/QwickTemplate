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

const brutalShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 8,
};

export default function Loyalty() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useAppTheme();
  const { total } = useLocalSearchParams<{ total: string }>();

  const [state, setState] = useState<'ask' | 'scanned' | 'skipped'>('ask');

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
          LOYALTY
        </AppText>
        <View className="size-11" />
      </View>

      <View className="flex-1 px-5 pt-4">
        {state === 'ask' && (
          <Animated.View entering={FadeIn.duration(220)} className="gap-4">
            <View
              className="bg-[#FFD60A] rounded-3xl p-6 border-2 border-foreground"
              style={brutalShadow}
            >
              <StyledFeather name="star" size={28} className="text-black" />
              <AppText
                className="text-3xl font-bold text-black tracking-tighter mt-3"
                maxFontSizeMultiplier={1.4}
              >
                QWUIK MEMBER?
              </AppText>
              <AppText className="text-sm text-black/70 font-medium mt-2">
                Scan the customer's loyalty card to apply points, tier perks and
                personalised rewards.
              </AppText>
            </View>

            <Pressable
              onPress={() => setState('scanned')}
              className="bg-foreground rounded-3xl p-5 flex-row items-center gap-3 border-2 border-foreground"
              style={brutalShadow}
            >
              <View className="size-12 rounded-2xl bg-[#FFD60A] items-center justify-center border-2 border-background">
                <StyledFeather name="maximize" size={20} className="text-black" />
              </View>
              <View className="flex-1">
                <AppText className="text-base font-bold text-background uppercase tracking-wider">
                  SCAN CARD
                </AppText>
                <AppText className="text-xs text-background/60 font-medium">
                  Tap and point at member QR
                </AppText>
              </View>
              <StyledFeather
                name="chevron-right"
                size={20}
                className="text-background"
              />
            </Pressable>

            <Pressable
              onPress={() => setState('skipped')}
              className={cn(
                'rounded-3xl p-5 flex-row items-center gap-3 border-2 border-foreground',
                isDark ? 'bg-white' : 'bg-white'
              )}
              style={brutalShadow}
            >
              <View className="size-12 rounded-2xl bg-white items-center justify-center border-2 border-black">
                <StyledFeather name="user-x" size={20} className="text-black" />
              </View>
              <View className="flex-1">
                <AppText className="text-base font-bold text-black uppercase tracking-wider">
                  NOT A MEMBER
                </AppText>
                <AppText className="text-xs text-black/60 font-medium">
                  Skip and continue
                </AppText>
              </View>
              <StyledFeather
                name="chevron-right"
                size={20}
                className="text-black"
              />
            </Pressable>
          </Animated.View>
        )}

        {state === 'scanned' && (
          <Animated.View
            entering={FadeInDown.duration(240)}
            className="gap-4 items-center justify-center flex-1"
          >
            <View className="size-24 rounded-3xl bg-[#FFD60A] items-center justify-center border-2 border-foreground">
              <StyledFeather name="check" size={40} className="text-black" />
            </View>
            <AppText
              className="text-3xl font-bold text-foreground tracking-tighter text-center"
              maxFontSizeMultiplier={1.3}
            >
              GOLD MEMBER
            </AppText>
            <View
              className="w-full rounded-3xl p-5 bg-foreground border-2 border-foreground"
              style={brutalShadow}
            >
              <AppText className="text-xs text-background/60 font-bold uppercase tracking-widest">
                PRIYA MEHTA
              </AppText>
              <View className="flex-row justify-between mt-4">
                <View>
                  <AppText className="text-[10px] text-background/60 font-bold uppercase">
                    POINTS
                  </AppText>
                  <AppText className="text-2xl font-bold text-[#FFD60A]">
                    1,284
                  </AppText>
                </View>
                <View>
                  <AppText className="text-[10px] text-background/60 font-bold uppercase">
                    TIER
                  </AppText>
                  <AppText className="text-2xl font-bold text-background">
                    GOLD
                  </AppText>
                </View>
                <View>
                  <AppText className="text-[10px] text-background/60 font-bold uppercase">
                    REWARD
                  </AppText>
                  <AppText className="text-2xl font-bold text-[#FFD60A]">
                    -$5
                  </AppText>
                </View>
              </View>
            </View>
          </Animated.View>
        )}

        {state === 'skipped' && (
          <Animated.View
            entering={FadeInDown.duration(240)}
            className="gap-4 items-center justify-center flex-1"
          >
            <View className="size-24 rounded-3xl bg-foreground items-center justify-center">
              <StyledFeather
                name="user-x"
                size={36}
                className="text-background"
              />
            </View>
            <AppText
              className="text-2xl font-bold text-foreground uppercase tracking-wider text-center"
              maxFontSizeMultiplier={1.4}
            >
              GUEST CHECKOUT
            </AppText>
            <AppText className="text-sm text-muted text-center px-6">
              No member card. You can still email a digital receipt after
              payment.
            </AppText>
          </Animated.View>
        )}
      </View>

      <View className="px-5">
        <Pressable
          onPress={() => router.push(`/app-ui-2/payment?total=${total}`)}
          disabled={state === 'ask'}
          className={cn(
            'rounded-2xl py-5 items-center border-2 border-foreground',
            state === 'ask' ? 'bg-muted/30' : 'bg-[#FFD60A]'
          )}
          style={state !== 'ask' ? brutalShadow : undefined}
        >
          <AppText className="text-black font-bold uppercase tracking-wider">
            Pay ${total} →
          </AppText>
        </Pressable>
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
