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
  const borderCol = isDark ? 'border-white' : 'border-black';

  const [phase, setPhase] = useState<Phase>('select');
  const [method, setMethod] = useState<string>('nfc');

  const pulse = useSharedValue(1);

  useEffect(() => {
    if (phase === 'waiting') {
      pulse.value = withRepeat(withTiming(1.15, { duration: 900 }), -1, true);
    }
  }, [phase, pulse]);

  const rPulse = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const startPayment = () => {
    setPhase('waiting');
    setTimeout(() => setPhase('success'), 2400);
  };

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
          onPress={() => {
            if (phase === 'select') router.back();
            else setPhase('select');
          }}
          className={cn('size-10 items-center justify-center border-2', borderCol)}
        >
          <StyledFeather
            name={phase === 'select' ? 'arrow-left' : 'x'}
            size={18}
            className="text-foreground"
          />
        </Pressable>
        <AppText className="text-xs font-bold text-foreground uppercase tracking-[3px]">
          STEP 04 · PAY
        </AppText>
        <View className="size-10" />
      </View>

      {phase === 'select' && (
        <Animated.View entering={FadeIn.duration(200)} className="flex-1 px-5 pt-4">
          <View className="p-5 bg-foreground mb-4">
            <AppText className="text-[10px] text-background/60 uppercase tracking-[3px] font-semibold">
              AMOUNT DUE
            </AppText>
            <AppText
              className="text-5xl font-bold text-background mt-1 tracking-tight"
              maxFontSizeMultiplier={1.3}
            >
              ${total}
            </AppText>
          </View>

          <AppText className="text-[10px] text-muted uppercase tracking-[3px] mb-2 font-semibold">
            PAYMENT METHOD
          </AppText>
          <View className={cn('border-2', borderCol)}>
            {PAYMENT_METHODS.map((m, idx) => (
              <Animated.View
                key={m.id}
                entering={FadeInDown.delay(idx * 40).duration(220)}
              >
                <Pressable onPress={() => setMethod(m.id)}>
                  <View
                    className={cn(
                      'p-4 flex-row items-center gap-3',
                      idx > 0 && 'border-t-2',
                      borderCol,
                      method === m.id && 'bg-[#FFD60A]'
                    )}
                  >
                    <View
                      className={cn(
                        'size-10 items-center justify-center border-2',
                        method === m.id ? 'border-black bg-black' : borderCol
                      )}
                    >
                      <StyledFeather
                        name={m.icon as keyof typeof Feather.glyphMap}
                        size={18}
                        className={
                          method === m.id ? 'text-[#FFD60A]' : 'text-foreground'
                        }
                      />
                    </View>
                    <View className="flex-1">
                      <AppText
                        className={cn(
                          'text-sm font-bold uppercase tracking-[2px]',
                          method === m.id ? 'text-black' : 'text-foreground'
                        )}
                      >
                        {m.label}
                      </AppText>
                      {m.primary && (
                        <AppText
                          className={cn(
                            'text-[10px] uppercase tracking-widest',
                            method === m.id ? 'text-black/70' : 'text-muted'
                          )}
                        >
                          RECOMMENDED · FASTEST
                        </AppText>
                      )}
                    </View>
                    <View
                      className={cn(
                        'size-5 border-2',
                        method === m.id ? 'border-black bg-black' : borderCol
                      )}
                    >
                      {method === m.id && (
                        <View className="absolute inset-0 items-center justify-center">
                          <StyledFeather
                            name="check"
                            size={12}
                            className="text-[#FFD60A]"
                          />
                        </View>
                      )}
                    </View>
                  </View>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      )}

      {phase === 'waiting' && (
        <Animated.View
          entering={FadeIn.duration(240)}
          className="flex-1 items-center justify-center px-8 gap-6"
        >
          <Animated.View
            style={rPulse}
            className={cn(
              'size-48 items-center justify-center border-2',
              borderCol
            )}
          >
            <View
              className={cn(
                'size-36 items-center justify-center border-2',
                borderCol
              )}
            >
              <View
                className={cn(
                  'size-24 bg-[#FFD60A] items-center justify-center border-2',
                  borderCol
                )}
              >
                <StyledFeather name="wifi" size={36} className="text-black" />
              </View>
            </View>
          </Animated.View>
          <AppText
            className="text-2xl font-bold text-foreground text-center tracking-tight"
            maxFontSizeMultiplier={1.3}
          >
            TAP CARD OR PHONE
          </AppText>
          <AppText className="text-xs text-muted text-center uppercase tracking-widest">
            WAITING · ${total}
          </AppText>
        </Animated.View>
      )}

      {phase === 'success' && (
        <Animated.View
          entering={FadeIn.duration(240)}
          className="flex-1 items-center justify-center px-8 gap-4"
        >
          <View
            className={cn(
              'size-24 bg-[#FFD60A] items-center justify-center border-2',
              borderCol
            )}
          >
            <StyledFeather name="check" size={44} className="text-black" />
          </View>
          <AppText
            className="text-3xl font-bold text-foreground text-center tracking-tight"
            maxFontSizeMultiplier={1.3}
          >
            APPROVED
          </AppText>
          <AppText className="text-xs text-muted text-center uppercase tracking-widest">
            ${total} · TX #QW-48219
          </AppText>
        </Animated.View>
      )}

      <View className="px-5 pb-2">
        {phase === 'select' && (
          <Pressable
            className="bg-[#FFD60A] py-4 items-center border-2 border-foreground"
            onPress={startPayment}
          >
            <AppText className="text-black font-bold uppercase tracking-[2px]">
              CHARGE ${total}
            </AppText>
          </Pressable>
        )}
        {phase === 'success' && (
          <Pressable
            className="bg-[#FFD60A] py-4 items-center border-2 border-foreground"
            onPress={() => router.push(`/receipt?total=${total}`)}
          >
            <AppText className="text-black font-bold uppercase tracking-[2px]">
              SEND RECEIPT →
            </AppText>
          </Pressable>
        )}
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
