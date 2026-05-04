import Feather from '@expo/vector-icons/Feather';
import { StatusBar } from 'expo-status-bar';
import { Input, TextField, cn } from 'heroui-native';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../../components/app-text';
import { useAppTheme } from '../../../../contexts/app-theme-context';
import {
  MOCK_PRODUCTS,
  PAYMENT_METHODS,
} from '../../../../helpers/data/qwuik-products';

const StyledFeather = withUniwind(Feather);

type Step = 'scan' | 'cart' | 'loyalty' | 'pay' | 'receipt';

const STEPS: { id: Step; label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { id: 'scan', label: 'Scan', icon: 'maximize' },
  { id: 'cart', label: 'Review', icon: 'shopping-bag' },
  { id: 'loyalty', label: 'Loyalty', icon: 'star' },
  { id: 'pay', label: 'Pay', icon: 'credit-card' },
  { id: 'receipt', label: 'Receipt', icon: 'mail' },
];

export default function CheckoutTab() {
  const insets = useSafeAreaInsets();
  const { isDark } = useAppTheme();

  const [step, setStep] = useState<Step>('scan');
  const [completed, setCompleted] = useState<Step[]>([]);

  // Data
  const [scanned, setScanned] = useState(0);
  const [method, setMethod] = useState('nfc');
  const [loyalty, setLoyalty] = useState<'pending' | 'member' | 'guest'>(
    'pending'
  );
  const [payPhase, setPayPhase] = useState<'idle' | 'waiting' | 'done'>('idle');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [receiptSent, setReceiptSent] = useState(false);

  const items = useMemo(
    () =>
      MOCK_PRODUCTS.slice(0, scanned).map((p) => ({ ...p, quantity: 1 })),
    [scanned]
  );
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const pulse = useSharedValue(1);
  useEffect(() => {
    if (payPhase === 'waiting') {
      pulse.value = withRepeat(
        withTiming(1.18, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      pulse.value = 1;
    }
  }, [payPhase, pulse]);
  const rPulse = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const complete = (s: Step, next: Step) => {
    setCompleted((prev) => (prev.includes(s) ? prev : [...prev, s]));
    setStep(next);
  };

  const reset = () => {
    setStep('scan');
    setCompleted([]);
    setScanned(0);
    setLoyalty('pending');
    setPayPhase('idle');
    setName('');
    setEmail('');
    setReceiptSent(false);
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-5 pt-3 pb-2 flex-row items-center justify-between">
        <View>
          <AppText className="text-xs text-muted uppercase tracking-[3px] font-semibold">
            CHECKOUT FLOW
          </AppText>
          <AppText className="text-2xl font-bold text-foreground tracking-tight">
            New order
          </AppText>
        </View>
        <Pressable
          onPress={reset}
          className={cn(
            'px-3 py-1.5 rounded-full flex-row items-center gap-1.5 border',
            isDark ? 'border-white/10' : 'border-black/10'
          )}
          hitSlop={10}
        >
          <StyledFeather name="rotate-ccw" size={13} className="text-foreground" />
          <AppText className="text-[11px] font-bold text-foreground">
            Reset
          </AppText>
        </Pressable>
      </View>

      {/* Step indicator dots */}
      <View className="px-5 py-2 flex-row items-center gap-1.5">
        {STEPS.map((s) => {
          const active = step === s.id;
          const done = completed.includes(s.id);
          return (
            <View
              key={s.id}
              className={cn(
                'flex-1 h-1 rounded-full',
                active
                  ? 'bg-[#FFD60A]'
                  : done
                    ? 'bg-foreground'
                    : isDark
                      ? 'bg-white/10'
                      : 'bg-black/10'
              )}
            />
          );
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="px-5 gap-3 pt-2">
          {STEPS.map((s) => {
            const isActive = step === s.id;
            const isDone = completed.includes(s.id);
            return (
              <View
                key={s.id}
                className={cn(
                  'rounded-2xl overflow-hidden border',
                  isActive
                    ? 'border-[#FFD60A]'
                    : isDark
                      ? 'border-white/10'
                      : 'border-black/10',
                  !isActive && (isDark ? 'bg-white/[2%]' : 'bg-black/[2%]')
                )}
              >
                <Pressable
                  onPress={() => isDone && setStep(s.id)}
                  className="p-4 flex-row items-center gap-3"
                >
                  <View
                    className={cn(
                      'size-9 rounded-xl items-center justify-center',
                      isDone
                        ? 'bg-foreground'
                        : isActive
                          ? 'bg-[#FFD60A]'
                          : isDark
                            ? 'bg-white/10'
                            : 'bg-black/5'
                    )}
                  >
                    <StyledFeather
                      name={isDone ? 'check' : s.icon}
                      size={16}
                      className={
                        isDone
                          ? 'text-background'
                          : isActive
                            ? 'text-black'
                            : 'text-foreground'
                      }
                    />
                  </View>
                  <AppText
                    className={cn(
                      'flex-1 text-sm font-semibold',
                      isActive || isDone ? 'text-foreground' : 'text-muted'
                    )}
                  >
                    {s.label}
                  </AppText>
                  {isDone && !isActive && (
                    <AppText className="text-[10px] text-muted uppercase tracking-widest font-semibold">
                      DONE
                    </AppText>
                  )}
                  {isActive && (
                    <View className="flex-row items-center gap-1">
                      <View className="size-1.5 rounded-full bg-[#FFD60A]" />
                      <AppText className="text-[10px] text-foreground uppercase tracking-widest font-bold">
                        ACTIVE
                      </AppText>
                    </View>
                  )}
                </Pressable>

                {/* Step body — only renders when active */}
                {isActive && (
                  <Animated.View
                    entering={FadeIn.duration(200)}
                    className="px-4 pb-4 gap-3"
                  >
                    {s.id === 'scan' && (
                      <>
                        <View
                          className={cn(
                            'rounded-xl p-4 items-center gap-3',
                            isDark ? 'bg-white/5' : 'bg-black/5'
                          )}
                        >
                          <View className="size-14 rounded-2xl bg-[#FFD60A] items-center justify-center">
                            <StyledFeather
                              name="maximize"
                              size={26}
                              className="text-black"
                            />
                          </View>
                          <AppText className="text-sm font-semibold text-foreground">
                            {scanned} item{scanned === 1 ? '' : 's'} scanned
                          </AppText>
                          <AppText className="text-xs text-muted text-center">
                            Point the camera at the barcode.{'\n'}Tap below to
                            simulate.
                          </AppText>
                        </View>
                        <View className="flex-row gap-2">
                          <Pressable
                            onPress={() =>
                              setScanned(Math.min(scanned + 1, MOCK_PRODUCTS.length))
                            }
                            className={cn(
                              'flex-1 rounded-2xl py-3 items-center border',
                              isDark ? 'border-white/15' : 'border-black/15'
                            )}
                          >
                            <AppText className="text-sm font-semibold text-foreground">
                              + Scan item
                            </AppText>
                          </Pressable>
                          <Pressable
                            disabled={scanned === 0}
                            onPress={() => complete('scan', 'cart')}
                            className={cn(
                              'flex-1 rounded-2xl py-3 items-center bg-[#FFD60A]',
                              scanned === 0 && 'opacity-40'
                            )}
                          >
                            <AppText className="text-sm font-bold text-black">
                              Continue →
                            </AppText>
                          </Pressable>
                        </View>
                      </>
                    )}

                    {s.id === 'cart' && (
                      <>
                        <View className="gap-2">
                          {items.map((item) => (
                            <View
                              key={item.id}
                              className={cn(
                                'rounded-xl p-3 flex-row items-center gap-3',
                                isDark ? 'bg-white/5' : 'bg-black/5'
                              )}
                            >
                              <View className="size-9 rounded-lg bg-background items-center justify-center">
                                <AppText className="text-xl">
                                  {item.emoji}
                                </AppText>
                              </View>
                              <View className="flex-1">
                                <AppText className="text-sm font-semibold text-foreground">
                                  {item.name}
                                </AppText>
                                <AppText className="text-xs text-muted">
                                  Qty 1
                                </AppText>
                              </View>
                              <AppText className="text-sm font-bold text-foreground">
                                ${item.price.toFixed(2)}
                              </AppText>
                            </View>
                          ))}
                        </View>
                        <View
                          className={cn(
                            'rounded-xl p-3 gap-0.5',
                            isDark ? 'bg-white/5' : 'bg-black/5'
                          )}
                        >
                          <View className="flex-row justify-between">
                            <AppText className="text-xs text-muted">
                              Subtotal
                            </AppText>
                            <AppText className="text-xs text-foreground font-medium">
                              ${subtotal.toFixed(2)}
                            </AppText>
                          </View>
                          <View className="flex-row justify-between">
                            <AppText className="text-xs text-muted">Tax</AppText>
                            <AppText className="text-xs text-foreground font-medium">
                              ${tax.toFixed(2)}
                            </AppText>
                          </View>
                          <View className="flex-row justify-between mt-1">
                            <AppText className="text-sm font-bold text-foreground">
                              Total
                            </AppText>
                            <AppText className="text-sm font-bold text-foreground">
                              ${total.toFixed(2)}
                            </AppText>
                          </View>
                        </View>
                        <Pressable
                          onPress={() => complete('cart', 'loyalty')}
                          className="rounded-2xl bg-[#FFD60A] py-3 items-center"
                        >
                          <AppText className="text-sm font-bold text-black">
                            Continue →
                          </AppText>
                        </Pressable>
                      </>
                    )}

                    {s.id === 'loyalty' && (
                      <>
                        {loyalty === 'pending' ? (
                          <View className="gap-2">
                            <AppText className="text-sm text-foreground">
                              Is the customer a Qwuik member?
                            </AppText>
                            <View className="flex-row gap-2">
                              <Pressable
                                onPress={() => setLoyalty('member')}
                                className="flex-1 rounded-2xl bg-foreground py-3 items-center"
                              >
                                <AppText className="text-sm font-bold text-background">
                                  Scan card
                                </AppText>
                              </Pressable>
                              <Pressable
                                onPress={() => setLoyalty('guest')}
                                className={cn(
                                  'flex-1 rounded-2xl py-3 items-center border',
                                  isDark ? 'border-white/15' : 'border-black/15'
                                )}
                              >
                                <AppText className="text-sm font-semibold text-foreground">
                                  Not a member
                                </AppText>
                              </Pressable>
                            </View>
                          </View>
                        ) : loyalty === 'member' ? (
                          <View
                            className={cn(
                              'rounded-xl p-3 flex-row items-center gap-3',
                              isDark ? 'bg-white/5' : 'bg-black/5'
                            )}
                          >
                            <View className="size-10 rounded-xl bg-[#FFD60A] items-center justify-center">
                              <StyledFeather
                                name="check"
                                size={18}
                                className="text-black"
                              />
                            </View>
                            <View className="flex-1">
                              <AppText className="text-sm font-semibold text-foreground">
                                Priya Mehta · Gold tier
                              </AppText>
                              <AppText className="text-xs text-muted">
                                1,284 pts · -$5.00 reward applied
                              </AppText>
                            </View>
                          </View>
                        ) : (
                          <View
                            className={cn(
                              'rounded-xl p-3 flex-row items-center gap-3',
                              isDark ? 'bg-white/5' : 'bg-black/5'
                            )}
                          >
                            <StyledFeather
                              name="user-x"
                              size={18}
                              className="text-foreground"
                            />
                            <AppText className="text-sm text-foreground">
                              Guest checkout
                            </AppText>
                          </View>
                        )}
                        {loyalty !== 'pending' && (
                          <Pressable
                            onPress={() => complete('loyalty', 'pay')}
                            className="rounded-2xl bg-[#FFD60A] py-3 items-center"
                          >
                            <AppText className="text-sm font-bold text-black">
                              Continue to payment →
                            </AppText>
                          </Pressable>
                        )}
                      </>
                    )}

                    {s.id === 'pay' && (
                      <>
                        {payPhase === 'idle' && (
                          <>
                            <AppText className="text-xs text-muted uppercase tracking-widest font-semibold">
                              PAYMENT METHOD
                            </AppText>
                            <View className="flex-row flex-wrap gap-2">
                              {PAYMENT_METHODS.map((m) => (
                                <Pressable
                                  key={m.id}
                                  onPress={() => setMethod(m.id)}
                                  className={cn(
                                    'rounded-2xl px-3 py-3 flex-row items-center gap-2 border min-w-[48%]',
                                    method === m.id
                                      ? 'border-[#FFD60A] bg-[#FFD60A]'
                                      : isDark
                                        ? 'border-white/10'
                                        : 'border-black/10'
                                  )}
                                >
                                  <StyledFeather
                                    name={m.icon as keyof typeof Feather.glyphMap}
                                    size={16}
                                    className={
                                      method === m.id
                                        ? 'text-black'
                                        : 'text-foreground'
                                    }
                                  />
                                  <AppText
                                    className={cn(
                                      'text-xs font-semibold',
                                      method === m.id
                                        ? 'text-black'
                                        : 'text-foreground'
                                    )}
                                  >
                                    {m.label}
                                  </AppText>
                                </Pressable>
                              ))}
                            </View>
                            <Pressable
                              onPress={() => {
                                setPayPhase('waiting');
                                setTimeout(() => setPayPhase('done'), 2200);
                              }}
                              className="rounded-2xl bg-foreground py-3 items-center mt-1"
                            >
                              <AppText className="text-sm font-bold text-background">
                                Charge ${total.toFixed(2)}
                              </AppText>
                            </Pressable>
                          </>
                        )}

                        {payPhase === 'waiting' && (
                          <View className="py-6 items-center gap-3">
                            <Animated.View
                              style={rPulse}
                              className="size-24 rounded-full bg-[#FFD60A] items-center justify-center"
                            >
                              <StyledFeather
                                name="wifi"
                                size={32}
                                className="text-black"
                              />
                            </Animated.View>
                            <AppText className="text-base font-bold text-foreground">
                              Tap card or phone
                            </AppText>
                            <AppText className="text-xs text-muted">
                              Waiting for customer…
                            </AppText>
                          </View>
                        )}

                        {payPhase === 'done' && (
                          <>
                            <View className="py-4 items-center gap-2">
                              <View className="size-16 rounded-full bg-[#FFD60A] items-center justify-center">
                                <StyledFeather
                                  name="check"
                                  size={32}
                                  className="text-black"
                                />
                              </View>
                              <AppText className="text-base font-bold text-foreground">
                                Approved
                              </AppText>
                              <AppText className="text-xs text-muted">
                                ${total.toFixed(2)} · #QW-48219
                              </AppText>
                            </View>
                            <Pressable
                              onPress={() => complete('pay', 'receipt')}
                              className="rounded-2xl bg-[#FFD60A] py-3 items-center"
                            >
                              <AppText className="text-sm font-bold text-black">
                                Continue to receipt →
                              </AppText>
                            </Pressable>
                          </>
                        )}
                      </>
                    )}

                    {s.id === 'receipt' && (
                      <>
                        {!receiptSent ? (
                          <>
                            <AppText className="text-xs text-muted">
                              Send a digital copy? (optional)
                            </AppText>
                            <View className="gap-2">
                              <TextField>
                                <Input
                                  value={name}
                                  onChangeText={setName}
                                  placeholder="Customer name"
                                />
                              </TextField>
                              <TextField>
                                <Input
                                  value={email}
                                  onChangeText={setEmail}
                                  placeholder="customer@email.com"
                                  autoCapitalize="none"
                                  keyboardType="email-address"
                                />
                              </TextField>
                              <Pressable
                                className={cn(
                                  'rounded-2xl p-3 flex-row items-center gap-3 border',
                                  isDark ? 'border-white/10' : 'border-black/10'
                                )}
                              >
                                <View className="size-8 rounded-lg bg-[#FFD60A] items-center justify-center">
                                  <StyledFeather
                                    name="mic"
                                    size={14}
                                    className="text-black"
                                  />
                                </View>
                                <AppText className="text-sm text-foreground flex-1">
                                  Or dictate with voice
                                </AppText>
                                <StyledFeather
                                  name="chevron-right"
                                  size={14}
                                  className="text-muted"
                                />
                              </Pressable>
                            </View>
                            <View className="flex-row gap-2">
                              <Pressable
                                onPress={reset}
                                className={cn(
                                  'flex-1 rounded-2xl py-3 items-center border',
                                  isDark ? 'border-white/15' : 'border-black/15'
                                )}
                              >
                                <AppText className="text-sm font-semibold text-foreground">
                                  Skip
                                </AppText>
                              </Pressable>
                              <Pressable
                                onPress={() => setReceiptSent(true)}
                                className="flex-1 rounded-2xl bg-[#FFD60A] py-3 items-center"
                              >
                                <AppText className="text-sm font-bold text-black">
                                  Send
                                </AppText>
                              </Pressable>
                            </View>
                          </>
                        ) : (
                          <View className="py-4 items-center gap-2">
                            <View className="size-16 rounded-full bg-[#FFD60A] items-center justify-center">
                              <StyledFeather
                                name="mail"
                                size={28}
                                className="text-black"
                              />
                            </View>
                            <AppText className="text-base font-bold text-foreground">
                              Receipt sent
                            </AppText>
                            <AppText className="text-xs text-muted">
                              {email || 'customer@email.com'}
                            </AppText>
                            <Pressable
                              onPress={reset}
                              className="mt-3 rounded-2xl bg-foreground px-6 py-3"
                            >
                              <AppText className="text-sm font-bold text-background">
                                New checkout
                              </AppText>
                            </Pressable>
                          </View>
                        )}
                      </>
                    )}
                  </Animated.View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
