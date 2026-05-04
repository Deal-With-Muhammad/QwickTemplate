import Feather from '@expo/vector-icons/Feather';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { cn } from 'heroui-native';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../../components/app-text';
import { useAppTheme } from '../../../../contexts/app-theme-context';
import { PAYMENT_METHODS } from '../../../../helpers/data/qwuik-products';

const StyledFeather = withUniwind(Feather);

type Phase = 'select' | 'waiting' | 'success';

export default function Payment() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useAppTheme();
  const { total } = useLocalSearchParams<{ total: string }>();

  const [phase, setPhase] = useState<Phase>('select');
  const [method, setMethod] = useState('nfc');

  const pulse = useSharedValue(0);

  useEffect(() => {
    if (phase === 'waiting') {
      pulse.value = withRepeat(withTiming(1, { duration: 1500 }), -1, false);
    }
  }, [phase, pulse]);

  const rInner = useAnimatedStyle(() => ({
    opacity: 1 - pulse.value,
    transform: [{ scale: 1 + pulse.value * 0.8 }],
  }));
  const rOuter = useAnimatedStyle(() => ({
    opacity: 0.6 - pulse.value * 0.6,
    transform: [{ scale: 1 + pulse.value * 1.2 }],
  }));

  const charge = () => {
    setPhase('waiting');
    setTimeout(() => setPhase('success'), 2400);
  };

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-6 pt-3 pb-3 flex-row items-center justify-between">
        <Pressable
          onPress={() => {
            if (phase === 'select') router.back();
            else setPhase('select');
          }}
          hitSlop={12}
        >
          <StyledFeather
            name={phase === 'select' ? 'arrow-left' : 'x'}
            size={22}
            className="text-foreground"
          />
        </Pressable>
        <AppText className="text-xs text-muted uppercase tracking-[3px] font-medium">
          STEP 3 · PAY
        </AppText>
        <View className="size-6" />
      </View>

      {phase === 'select' && (
        <Animated.View entering={FadeIn.duration(220)} className="flex-1 px-6">
          <View className="mt-6">
            <AppText className="text-[10px] text-muted uppercase tracking-[3px] font-medium">
              AMOUNT DUE
            </AppText>
            <AppText
              className="text-6xl font-bold text-foreground tracking-tighter mt-1"
              maxFontSizeMultiplier={1.3}
            >
              ${total}
            </AppText>
          </View>

          <View
            className={cn(
              'h-px mt-8 mb-6',
              isDark ? 'bg-white/10' : 'bg-black/10'
            )}
          />

          <AppText className="text-[10px] text-muted uppercase tracking-[3px] font-medium mb-3">
            METHOD
          </AppText>
          <View>
            {PAYMENT_METHODS.map((m, idx) => (
              <Animated.View
                key={m.id}
                entering={FadeInDown.delay(idx * 30).duration(220)}
              >
                <Pressable
                  onPress={() => setMethod(m.id)}
                  className={cn(
                    'py-4 flex-row items-center gap-4 border-b',
                    isDark ? 'border-white/5' : 'border-black/5'
                  )}
                >
                  <View
                    className={cn(
                      'size-10 rounded-xl items-center justify-center',
                      method === m.id
                        ? 'bg-[#FFD60A]'
                        : isDark
                          ? 'bg-white/5'
                          : 'bg-black/5'
                    )}
                  >
                    <StyledFeather
                      name={m.icon as keyof typeof Feather.glyphMap}
                      size={18}
                      className={method === m.id ? 'text-black' : 'text-foreground'}
                    />
                  </View>
                  <View className="flex-1">
                    <AppText className="text-base text-foreground font-medium">
                      {m.label}
                    </AppText>
                    {m.primary && (
                      <AppText className="text-[10px] text-muted uppercase tracking-widest">
                        Recommended
                      </AppText>
                    )}
                  </View>
                  <View
                    className={cn(
                      'size-5 rounded-full border',
                      method === m.id
                        ? 'bg-foreground border-foreground'
                        : isDark
                          ? 'border-white/20'
                          : 'border-black/15'
                    )}
                  >
                    {method === m.id && (
                      <View className="absolute inset-0 items-center justify-center">
                        <View
                          className={cn(
                            'size-1.5 rounded-full',
                            isDark ? 'bg-black' : 'bg-white'
                          )}
                        />
                      </View>
                    )}
                  </View>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      )}

      {phase === 'waiting' && (
        <Animated.View
          entering={FadeIn.duration(220)}
          className="flex-1 items-center justify-center px-8 gap-8"
        >
          <View className="size-60 items-center justify-center">
            <Animated.View
              style={rOuter}
              className={cn(
                'absolute size-60 rounded-full',
                isDark ? 'bg-white/10' : 'bg-black/10'
              )}
            />
            <Animated.View
              style={rInner}
              className={cn(
                'absolute size-40 rounded-full',
                isDark ? 'bg-white/20' : 'bg-black/10'
              )}
            />
            <View
              className={cn(
                'size-24 rounded-full items-center justify-center',
                isDark ? 'bg-white' : 'bg-black'
              )}
            >
              <StyledFeather
                name="wifi"
                size={40}
                className={isDark ? 'text-black' : 'text-white'}
              />
            </View>
          </View>
          <View className="items-center gap-2">
            <AppText
              className="text-2xl font-bold text-foreground tracking-tight"
              maxFontSizeMultiplier={1.3}
            >
              Waiting for tap
            </AppText>
            <AppText className="text-xs text-muted tracking-widest uppercase">
              ${total} · NFC ready
            </AppText>
          </View>
        </Animated.View>
      )}

      {phase === 'success' && (
        <Animated.View
          entering={FadeIn.duration(220)}
          className="flex-1 items-center justify-center px-8 gap-4"
        >
          <View
            className={cn(
              'size-16 rounded-2xl items-center justify-center',
              isDark ? 'bg-white' : 'bg-black'
            )}
          >
            <StyledFeather
              name="check"
              size={30}
              className={isDark ? 'text-black' : 'text-white'}
            />
          </View>
          <AppText
            className="text-3xl font-bold text-foreground tracking-tight"
            maxFontSizeMultiplier={1.3}
          >
            Paid · ${total}
          </AppText>
          <AppText className="text-xs text-muted tracking-widest uppercase">
            Transaction #QW-48219
          </AppText>
        </Animated.View>
      )}

      <View className="px-6">
        {phase === 'select' && (
          <Pressable
            onPress={charge}
            className={cn(
              'rounded-full py-4 items-center flex-row justify-center gap-2',
              isDark ? 'bg-white' : 'bg-black'
            )}
          >
            <AppText
              className={cn(
                'font-medium',
                isDark ? 'text-black' : 'text-white'
              )}
            >
              Charge ${total}
            </AppText>
            <View className="size-1.5 rounded-full bg-[#FFD60A]" />
          </Pressable>
        )}
        {phase === 'success' && (
          <Pressable
            onPress={() => router.push(`/receipt?total=${total}`)}
            className={cn(
              'rounded-full py-4 items-center flex-row justify-center gap-2',
              isDark ? 'bg-white' : 'bg-black'
            )}
          >
            <AppText
              className={cn(
                'font-medium',
                isDark ? 'text-black' : 'text-white'
              )}
            >
              Send receipt
            </AppText>
            <View className="size-1.5 rounded-full bg-[#FFD60A]" />
          </Pressable>
        )}
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
