import Feather from '@expo/vector-icons/Feather';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, Card, cn } from 'heroui-native';
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
      <View className="px-5 pt-3 pb-3 flex-row items-center justify-between">
        <Pressable
          onPress={() => {
            if (phase === 'select') router.back();
            else setPhase('select');
          }}
          className="size-10 rounded-full bg-surface-secondary items-center justify-center"
        >
          <StyledFeather
            name={phase === 'select' ? 'arrow-left' : 'x'}
            size={20}
            className="text-foreground"
          />
        </Pressable>
        <AppText className="text-base font-semibold text-foreground">
          Payment
        </AppText>
        <View className="size-10" />
      </View>

      {phase === 'select' && (
        <Animated.View entering={FadeIn.duration(200)} className="flex-1 px-5">
          <Card className="p-5 bg-foreground border-0 mb-5">
            <AppText className="text-xs text-background/70 uppercase tracking-widest">
              Amount due
            </AppText>
            <AppText
              className="text-5xl font-bold text-background mt-1"
              maxFontSizeMultiplier={1.3}
            >
              ${total}
            </AppText>
          </Card>

          <AppText className="text-xs text-muted uppercase tracking-widest mb-2 font-medium">
            Choose payment method
          </AppText>
          <View className="gap-2.5">
            {PAYMENT_METHODS.map((m, idx) => (
              <Animated.View
                key={m.id}
                entering={FadeInDown.delay(idx * 40).duration(220)}
              >
                <Pressable onPress={() => setMethod(m.id)}>
                  <Card
                    className={cn(
                      'p-4 flex-row items-center gap-3 border-2',
                      method === m.id
                        ? 'border-[#FFD60A]'
                        : isDark
                          ? 'border-white/10'
                          : 'border-black/10'
                    )}
                  >
                    <View
                      className={cn(
                        'size-11 rounded-2xl items-center justify-center',
                        method === m.id
                          ? 'bg-[#FFD60A]'
                          : isDark
                            ? 'bg-white/10'
                            : 'bg-black/5'
                      )}
                    >
                      <StyledFeather
                        name={m.icon as keyof typeof Feather.glyphMap}
                        size={20}
                        className={
                          method === m.id ? 'text-black' : 'text-foreground'
                        }
                      />
                    </View>
                    <View className="flex-1">
                      <AppText className="text-base font-semibold text-foreground">
                        {m.label}
                      </AppText>
                      {m.primary && (
                        <AppText className="text-xs text-muted">
                          Recommended · fastest
                        </AppText>
                      )}
                    </View>
                    <View
                      className={cn(
                        'size-5 rounded-full border-2',
                        method === m.id
                          ? 'bg-[#FFD60A] border-[#FFD60A]'
                          : isDark
                            ? 'border-white/20'
                            : 'border-black/15'
                      )}
                    >
                      {method === m.id && (
                        <View className="absolute inset-0 items-center justify-center">
                          <StyledFeather
                            name="check"
                            size={12}
                            className="text-black"
                          />
                        </View>
                      )}
                    </View>
                  </Card>
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
            className="size-48 rounded-full bg-[#FFD60A]/25 items-center justify-center"
          >
            <View className="size-36 rounded-full bg-[#FFD60A]/60 items-center justify-center">
              <View className="size-24 rounded-full bg-[#FFD60A] items-center justify-center">
                <StyledFeather name="wifi" size={36} className="text-black" />
              </View>
            </View>
          </Animated.View>
          <AppText
            className="text-2xl font-bold text-foreground text-center"
            maxFontSizeMultiplier={1.3}
          >
            Tap card or phone
          </AppText>
          <AppText className="text-sm text-muted text-center">
            Waiting for the customer · ${total}
          </AppText>
        </Animated.View>
      )}

      {phase === 'success' && (
        <Animated.View
          entering={FadeIn.duration(240)}
          className="flex-1 items-center justify-center px-8 gap-4"
        >
          <View className="size-24 rounded-full bg-[#FFD60A] items-center justify-center">
            <StyledFeather name="check" size={44} className="text-black" />
          </View>
          <AppText
            className="text-3xl font-bold text-foreground text-center"
            maxFontSizeMultiplier={1.3}
          >
            Payment approved
          </AppText>
          <AppText className="text-sm text-muted text-center">
            ${total} · Transaction #QW-48219
          </AppText>
        </Animated.View>
      )}

      <View className="px-5 pb-2">
        {phase === 'select' && (
          <Button className="bg-[#FFD60A]" onPress={startPayment}>
            <Button.Label className="text-black font-bold">
              Charge ${total}
            </Button.Label>
          </Button>
        )}
        {phase === 'success' && (
          <Button
            className="bg-[#FFD60A]"
            onPress={() => router.push(`/receipt?total=${total}`)}
          >
            <Button.Label className="text-black font-bold">
              Send receipt
            </Button.Label>
          </Button>
        )}
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
