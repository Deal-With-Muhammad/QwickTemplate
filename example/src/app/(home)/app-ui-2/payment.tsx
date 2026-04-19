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
import { AppText } from '../../../components/app-text';
import { useAppTheme } from '../../../contexts/app-theme-context';
import { PAYMENT_METHODS } from '../../../helpers/data/qwuik-products';

const StyledFeather = withUniwind(Feather);

const brutalShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 8,
};

type Phase = 'select' | 'waiting' | 'success';

export default function Payment() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useAppTheme();
  const { total } = useLocalSearchParams<{ total: string }>();

  const [phase, setPhase] = useState<Phase>('select');
  const [method, setMethod] = useState('nfc');

  const pulse = useSharedValue(1);

  useEffect(() => {
    if (phase === 'waiting') {
      pulse.value = withRepeat(withTiming(1.2, { duration: 900 }), -1, true);
    }
  }, [phase, pulse]);

  const rPulse = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const charge = () => {
    setPhase('waiting');
    setTimeout(() => setPhase('success'), 2400);
  };

  return (
    <View
      className={cn('flex-1', isDark ? 'bg-black' : 'bg-white')}
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-5 pt-3 pb-3 flex-row items-center justify-between">
        <Pressable
          onPress={() => {
            if (phase === 'select') router.back();
            else setPhase('select');
          }}
          className="size-11 rounded-2xl bg-foreground items-center justify-center"
        >
          <StyledFeather
            name={phase === 'select' ? 'arrow-left' : 'x'}
            size={20}
            className="text-background"
          />
        </Pressable>
        <AppText className="text-lg font-bold text-foreground uppercase tracking-wider">
          PAY
        </AppText>
        <View className="size-11" />
      </View>

      {phase === 'select' && (
        <Animated.View entering={FadeIn.duration(220)} className="flex-1 px-5">
          <View
            className="rounded-3xl p-6 bg-[#FFD60A] border-2 border-foreground mb-5"
            style={brutalShadow}
          >
            <AppText className="text-xs text-black font-bold uppercase tracking-widest">
              AMOUNT DUE
            </AppText>
            <AppText
              className="text-6xl font-bold text-black tracking-tighter"
              maxFontSizeMultiplier={1.3}
            >
              ${total}
            </AppText>
          </View>

          <AppText className="text-xs text-muted uppercase tracking-widest mb-2 font-bold">
            METHOD
          </AppText>
          <View className="gap-2.5">
            {PAYMENT_METHODS.map((m, idx) => (
              <Animated.View
                key={m.id}
                entering={FadeInDown.delay(idx * 30).duration(220)}
              >
                <Pressable onPress={() => setMethod(m.id)}>
                  <View
                    className={cn(
                      'rounded-2xl p-4 flex-row items-center gap-3 border-2',
                      method === m.id
                        ? 'bg-foreground border-foreground'
                        : 'bg-transparent border-foreground'
                    )}
                    style={method === m.id ? brutalShadow : undefined}
                  >
                    <View
                      className={cn(
                        'size-12 rounded-2xl items-center justify-center border-2 border-background',
                        method === m.id ? 'bg-[#FFD60A]' : 'bg-[#FFD60A]'
                      )}
                    >
                      <StyledFeather
                        name={m.icon as keyof typeof Feather.glyphMap}
                        size={22}
                        className="text-black"
                      />
                    </View>
                    <View className="flex-1">
                      <AppText
                        className={cn(
                          'text-base font-bold uppercase tracking-wider',
                          method === m.id ? 'text-background' : 'text-foreground'
                        )}
                      >
                        {m.label}
                      </AppText>
                      {m.primary && (
                        <AppText
                          className={cn(
                            'text-[10px] font-bold uppercase tracking-widest',
                            method === m.id
                              ? 'text-[#FFD60A]'
                              : 'text-muted'
                          )}
                        >
                          RECOMMENDED
                        </AppText>
                      )}
                    </View>
                    {method === m.id && (
                      <View className="size-6 rounded-xl bg-[#FFD60A] items-center justify-center border-2 border-background">
                        <StyledFeather
                          name="check"
                          size={14}
                          className="text-black"
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
          entering={FadeIn.duration(240)}
          className="flex-1 items-center justify-center px-8 gap-6"
        >
          <Animated.View
            style={rPulse}
            className="size-56 rounded-full bg-[#FFD60A] items-center justify-center border-4 border-foreground"
          >
            <View className="size-40 rounded-full bg-foreground items-center justify-center">
              <StyledFeather name="wifi" size={56} className="text-[#FFD60A]" />
            </View>
          </Animated.View>
          <AppText
            className="text-3xl font-bold text-foreground text-center uppercase tracking-tighter"
            maxFontSizeMultiplier={1.3}
          >
            TAP TO PAY
          </AppText>
          <AppText className="text-sm text-muted font-bold uppercase tracking-widest">
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
            className="size-28 rounded-3xl bg-[#FFD60A] items-center justify-center border-4 border-foreground"
            style={brutalShadow}
          >
            <StyledFeather name="check" size={52} className="text-black" />
          </View>
          <AppText
            className="text-4xl font-bold text-foreground text-center uppercase tracking-tighter"
            maxFontSizeMultiplier={1.3}
          >
            APPROVED!
          </AppText>
          <AppText className="text-sm text-muted font-bold uppercase tracking-widest">
            ${total} · #QW-48219
          </AppText>
        </Animated.View>
      )}

      <View className="px-5">
        {phase === 'select' && (
          <Pressable
            onPress={charge}
            className="bg-[#FFD60A] rounded-2xl py-5 items-center border-2 border-foreground"
            style={brutalShadow}
          >
            <AppText className="text-black font-bold uppercase tracking-wider">
              CHARGE ${total}
            </AppText>
          </Pressable>
        )}
        {phase === 'success' && (
          <Pressable
            onPress={() => router.push(`/app-ui-2/receipt?total=${total}`)}
            className="bg-[#FFD60A] rounded-2xl py-5 items-center border-2 border-foreground"
            style={brutalShadow}
          >
            <AppText className="text-black font-bold uppercase tracking-wider">
              SEND RECEIPT →
            </AppText>
          </Pressable>
        )}
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
