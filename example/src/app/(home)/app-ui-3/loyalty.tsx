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

  const [state, setState] = useState<'ask' | 'scanned' | 'skipped'>('ask');

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-6 pt-3 pb-3 flex-row items-center justify-between">
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <StyledFeather
            name="arrow-left"
            size={22}
            className="text-foreground"
          />
        </Pressable>
        <AppText className="text-xs text-muted uppercase tracking-[3px] font-medium">
          STEP 2 · LOYALTY
        </AppText>
        <View className="size-6" />
      </View>

      <View className="flex-1 px-6 pt-8">
        {state === 'ask' && (
          <Animated.View entering={FadeIn.duration(220)} className="gap-8">
            <View>
              <View className="size-1.5 rounded-full bg-[#FFD60A] mb-6" />
              <AppText
                className="text-3xl font-bold text-foreground tracking-tight"
                maxFontSizeMultiplier={1.4}
              >
                Does the customer{'\n'}have a Qwuik{'\n'}membership?
              </AppText>
              <AppText className="text-sm text-muted leading-relaxed mt-3">
                Scan their card to apply points and tier rewards. You can skip
                this step if they're a guest.
              </AppText>
            </View>

            <View className="gap-4 mt-auto">
              <Pressable
                onPress={() => setState('scanned')}
                className={cn(
                  'rounded-2xl py-5 px-5 flex-row items-center gap-4',
                  isDark ? 'bg-white' : 'bg-black'
                )}
              >
                <View className="size-10 rounded-xl bg-[#FFD60A] items-center justify-center">
                  <StyledFeather
                    name="maximize"
                    size={18}
                    className="text-black"
                  />
                </View>
                <View className="flex-1">
                  <AppText
                    className={cn(
                      'text-base font-medium',
                      isDark ? 'text-black' : 'text-white'
                    )}
                  >
                    Scan member card
                  </AppText>
                  <AppText
                    className={cn(
                      'text-xs',
                      isDark ? 'text-black/60' : 'text-white/60'
                    )}
                  >
                    Yes, they're a member
                  </AppText>
                </View>
                <StyledFeather
                  name="arrow-right"
                  size={18}
                  className={isDark ? 'text-black' : 'text-white'}
                />
              </Pressable>

              <Pressable
                onPress={() => setState('skipped')}
                className={cn(
                  'rounded-2xl py-5 px-5 flex-row items-center gap-4 border',
                  isDark ? 'border-white/15' : 'border-black/10'
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
                  <AppText className="text-base font-medium text-foreground">
                    Continue as guest
                  </AppText>
                  <AppText className="text-xs text-muted">
                    Not a member
                  </AppText>
                </View>
                <StyledFeather
                  name="arrow-right"
                  size={18}
                  className="text-muted"
                />
              </Pressable>
            </View>
          </Animated.View>
        )}

        {state === 'scanned' && (
          <Animated.View entering={FadeInDown.duration(220)} className="gap-6">
            <View className="items-center gap-4 pt-10">
              <View
                className={cn(
                  'size-16 rounded-2xl items-center justify-center',
                  isDark ? 'bg-white' : 'bg-black'
                )}
              >
                <StyledFeather
                  name="check"
                  size={28}
                  className={isDark ? 'text-black' : 'text-white'}
                />
              </View>
              <AppText
                className="text-2xl font-bold text-foreground tracking-tight"
                maxFontSizeMultiplier={1.4}
              >
                Priya Mehta · Gold
              </AppText>
            </View>
            <View
              className={cn(
                'rounded-3xl p-5 border',
                isDark ? 'border-white/10' : 'border-black/10'
              )}
            >
              <View className="flex-row">
                <View className="flex-1">
                  <AppText className="text-[10px] text-muted uppercase tracking-[3px] font-medium">
                    Points
                  </AppText>
                  <AppText className="text-xl font-bold text-foreground mt-1">
                    1,284
                  </AppText>
                </View>
                <View
                  className={cn('w-px', isDark ? 'bg-white/10' : 'bg-black/10')}
                />
                <View className="flex-1 pl-4">
                  <AppText className="text-[10px] text-muted uppercase tracking-[3px] font-medium">
                    Tier
                  </AppText>
                  <AppText className="text-xl font-bold text-foreground mt-1">
                    Gold
                  </AppText>
                </View>
                <View
                  className={cn('w-px', isDark ? 'bg-white/10' : 'bg-black/10')}
                />
                <View className="flex-1 pl-4">
                  <AppText className="text-[10px] text-muted uppercase tracking-[3px] font-medium">
                    Reward
                  </AppText>
                  <AppText className="text-xl font-bold text-[#FFD60A] mt-1">
                    −$5
                  </AppText>
                </View>
              </View>
            </View>
          </Animated.View>
        )}

        {state === 'skipped' && (
          <Animated.View entering={FadeInDown.duration(220)} className="gap-3 pt-10">
            <View className="size-1.5 rounded-full bg-[#FFD60A]" />
            <AppText
              className="text-2xl font-bold text-foreground tracking-tight"
              maxFontSizeMultiplier={1.4}
            >
              Guest checkout
            </AppText>
            <AppText className="text-sm text-muted leading-relaxed">
              No membership applied. You'll still be able to email a digital
              receipt after payment.
            </AppText>
          </Animated.View>
        )}
      </View>

      <View className="px-6">
        <Pressable
          disabled={state === 'ask'}
          onPress={() => router.push(`/app-ui-3/payment?total=${total}`)}
          className={cn(
            'rounded-full py-4 items-center flex-row justify-center gap-2',
            state === 'ask'
              ? isDark
                ? 'bg-white/10'
                : 'bg-black/5'
              : isDark
                ? 'bg-white'
                : 'bg-black'
          )}
        >
          <AppText
            className={cn(
              'font-medium',
              state === 'ask'
                ? 'text-muted'
                : isDark
                  ? 'text-black'
                  : 'text-white'
            )}
          >
            Proceed · ${total}
          </AppText>
          {state !== 'ask' && (
            <View className="size-1.5 rounded-full bg-[#FFD60A]" />
          )}
        </Pressable>
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
