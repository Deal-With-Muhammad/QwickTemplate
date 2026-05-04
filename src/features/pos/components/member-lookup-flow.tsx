import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { Button, Input, Switch, TextField, cn } from 'heroui-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { withUniwind } from 'uniwind';

import { AppText } from '../../../components/app-text';
import { useOrder } from '../contexts/order-context';
import {
  findMemberByCardNumber,
  mockScanBarcode,
  mockTapCard,
} from '../mock/members';
import type { Member } from '../types';

const StyledFeather = withUniwind(Feather);

type Step = 'ask' | 'lookup' | 'review';

export interface MemberLookupFlowProps {
  /** Where to send the cashier on continue (always the next POS step). */
  nextHref?: string;
  /** Optional override for the title shown on step 1. */
  title?: string;
  /** Optional override for the subtitle shown on step 1. */
  subtitle?: string;
}

/**
 * Three-step checkout-start flow:
 *   1. ask     → "Is this customer a loyalty member?"
 *   2. lookup  → Scan barcode · Tap card (NFC) · Enter card number manually
 *   3. review  → show member + programs + "use points?" toggle, then continue
 *
 * Scan / Tap / Manual all resolve to the same Member object via cardNumber —
 * different ways of getting the same identifier. There is no phone-number
 * lookup. Skip / Not-a-member jumps straight to nextHref. The result is
 * persisted in OrderContext so the rest of checkout (scan, cart, payment)
 * sees the same member without prop drilling.
 */
export function MemberLookupFlow({
  nextHref = '/scan',
  title = 'Loyalty membership',
  subtitle = 'Quick check before we start scanning.',
}: MemberLookupFlowProps) {
  const router = useRouter();
  const { member, setMember, skipMember, useRewards, toggleUseRewards } =
    useOrder();

  const [step, setStep] = useState<Step>(member ? 'review' : 'ask');

  function handleNotAMember() {
    skipMember();
    router.replace(nextHref);
  }

  function handleContinue() {
    router.replace(nextHref);
  }

  // ----------------------------------------------------------------- step 1
  if (step === 'ask') {
    return (
      <Animated.View entering={FadeIn.duration(220)} className="gap-6">
        <View className="gap-2">
          <AppText className="text-3xl font-bold text-foreground">
            {title}
          </AppText>
          <AppText className="text-sm text-muted">{subtitle}</AppText>
        </View>

        <Pressable
          onPress={() => setStep('lookup')}
          className="rounded-3xl bg-foreground px-5 py-6 flex-row items-center gap-4"
        >
          <View className="size-12 rounded-2xl bg-[#FFD60A] items-center justify-center">
            <StyledFeather name="award" size={20} className="text-black" />
          </View>
          <View className="flex-1">
            <AppText className="text-lg font-bold text-background">
              Yes, they're a member
            </AppText>
            <AppText className="text-xs text-background/70">
              Scan, tap, or enter the card number
            </AppText>
          </View>
          <StyledFeather
            name="chevron-right"
            size={22}
            className="text-background/70"
          />
        </Pressable>

        <Pressable
          onPress={handleNotAMember}
          className="rounded-3xl border border-border/40 px-5 py-6 flex-row items-center gap-4"
        >
          <View className="size-12 rounded-2xl bg-surface-secondary items-center justify-center">
            <StyledFeather name="user-x" size={20} className="text-muted" />
          </View>
          <View className="flex-1">
            <AppText className="text-lg font-bold text-foreground">
              Not a member
            </AppText>
            <AppText className="text-xs text-muted">
              Continue to scan products
            </AppText>
          </View>
          <StyledFeather
            name="chevron-right"
            size={22}
            className="text-muted"
          />
        </Pressable>
      </Animated.View>
    );
  }

  // ----------------------------------------------------------------- step 2
  if (step === 'lookup') {
    return (
      <LookupStep
        onResolved={(found) => {
          setMember(found);
          setStep('review');
        }}
        onBack={() => setStep('ask')}
        onSkip={handleNotAMember}
      />
    );
  }

  // ----------------------------------------------------------------- step 3
  return (
    <Animated.View entering={FadeInDown.duration(240)} className="gap-6">
      {member ? <MemberCard member={member} /> : null}

      <View className="rounded-3xl border border-border/40 px-5 py-4 flex-row items-center gap-4">
        <View className="size-10 rounded-2xl bg-[#FFD60A] items-center justify-center">
          <StyledFeather name="zap" size={18} className="text-black" />
        </View>
        <View className="flex-1">
          <AppText className="text-base font-semibold text-foreground">
            Use rewards points
          </AppText>
          <AppText className="text-xs text-muted">
            Apply available points at payment.
          </AppText>
        </View>
        <Switch
          isSelected={useRewards}
          onSelectedChange={(next) => toggleUseRewards(next)}
        />
      </View>

      <View className="gap-3">
        <Button onPress={handleContinue}>
          <Button.Label>Continue to scan</Button.Label>
        </Button>
        <Button
          variant="ghost"
          onPress={() => {
            setMember(null);
            setStep('ask');
          }}
        >
          <Button.Label>Wrong customer? Start over</Button.Label>
        </Button>
      </View>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — Scan / Tap / Enter
// ---------------------------------------------------------------------------

interface LookupStepProps {
  onResolved: (member: Member) => void;
  onBack: () => void;
  onSkip: () => void;
}

type Busy = null | 'scan' | 'tap' | 'manual';

function LookupStep({ onResolved, onBack, onSkip }: LookupStepProps) {
  const [showManual, setShowManual] = useState(false);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState<Busy>(null);
  const [error, setError] = useState<string | null>(null);

  function runScan() {
    if (busy) return;
    setBusy('scan');
    setError(null);
    setTimeout(() => {
      onResolved(mockScanBarcode());
      setBusy(null);
    }, 600);
  }

  function runTap() {
    if (busy) return;
    setBusy('tap');
    setError(null);
    setTimeout(() => {
      onResolved(mockTapCard());
      setBusy(null);
    }, 500);
  }

  function runManual() {
    if (busy) return;
    if (!code.trim()) {
      setError('Type the card number first.');

      return;
    }
    setBusy('manual');
    setError(null);
    setTimeout(() => {
      const found = findMemberByCardNumber(code);

      if (!found) {
        setError('No member matches that card number.');
        setBusy(null);

        return;
      }
      onResolved(found);
      setBusy(null);
    }, 300);
  }

  return (
    <Animated.View entering={FadeInDown.duration(240)} className="gap-5">
      <View className="gap-2">
        <AppText className="text-3xl font-bold text-foreground">
          Find their card
        </AppText>
        <AppText className="text-sm text-muted">
          Scan the barcode, tap the card, or type the number.
        </AppText>
      </View>

      <LookupOption
        title="Scan barcode"
        subtitle="Use the device camera or scanner"
        icon="maximize"
        loading={busy === 'scan'}
        disabled={!!busy && busy !== 'scan'}
        onPress={runScan}
      />

      <LookupOption
        title="Tap card"
        subtitle="Hold the card to the back of the phone"
        icon="wifi"
        loading={busy === 'tap'}
        disabled={!!busy && busy !== 'tap'}
        onPress={runTap}
      />

      <LookupOption
        title="Enter card number"
        subtitle="Type the digits on the card"
        icon="hash"
        loading={false}
        disabled={!!busy && busy !== 'manual'}
        onPress={() => setShowManual((s) => !s)}
        expanded={showManual}
      />

      {showManual ? (
        <Animated.View
          entering={FadeIn.duration(180)}
          className="gap-2 rounded-3xl border border-border/40 px-4 py-4"
        >
          <View className="flex-row items-center gap-2">
            <StyledFeather name="hash" size={14} className="text-muted" />
            <AppText className="text-xs font-medium uppercase tracking-[2px] text-muted">
              Card number
            </AppText>
          </View>
          <TextField>
            <Input
              autoCapitalize="characters"
              keyboardType="number-pad"
              placeholder="0001"
              value={code}
              onChangeText={setCode}
              onSubmitEditing={runManual}
              returnKeyType="search"
            />
          </TextField>
          <Button
            isDisabled={busy === 'manual' || !code.trim()}
            onPress={runManual}
          >
            <Button.Label>
              {busy === 'manual' ? 'Looking up…' : 'Look up card'}
            </Button.Label>
          </Button>
        </Animated.View>
      ) : null}

      {error ? (
        <View className="rounded-2xl bg-danger/10 border border-danger/20 px-4 py-3">
          <AppText className="text-sm text-danger">{error}</AppText>
        </View>
      ) : null}

      <View className="flex-row gap-3">
        <Button variant="ghost" onPress={onBack} className="flex-1">
          <Button.Label>Back</Button.Label>
        </Button>
        <Button variant="ghost" onPress={onSkip} className="flex-1">
          <Button.Label>Skip — not a member</Button.Label>
        </Button>
      </View>
    </Animated.View>
  );
}

interface LookupOptionProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Feather.glyphMap;
  loading: boolean;
  disabled: boolean;
  onPress: () => void;
  expanded?: boolean;
}

function LookupOption({
  title,
  subtitle,
  icon,
  loading,
  disabled,
  onPress,
  expanded,
}: LookupOptionProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={cn(
        'rounded-3xl border px-5 py-5 flex-row items-center gap-4',
        loading
          ? 'border-[#FFD60A] bg-[#FFD60A]/10'
          : expanded
            ? 'border-foreground'
            : 'border-border/50',
        disabled && 'opacity-40'
      )}
    >
      <View
        className={cn(
          'size-12 rounded-2xl items-center justify-center',
          loading ? 'bg-[#FFD60A]' : 'bg-surface-secondary'
        )}
      >
        <StyledFeather
          name={loading ? 'loader' : icon}
          size={20}
          className={loading ? 'text-black' : 'text-foreground'}
        />
      </View>
      <View className="flex-1">
        <AppText className="text-base font-bold text-foreground">
          {loading ? `${title}…` : title}
        </AppText>
        <AppText className="text-xs text-muted">{subtitle}</AppText>
      </View>
      <StyledFeather
        name={expanded ? 'chevron-up' : 'chevron-right'}
        size={20}
        className="text-muted"
      />
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — Member preview
// ---------------------------------------------------------------------------

function MemberCard({ member }: { member: Member }) {
  return (
    <View className="rounded-3xl bg-foreground px-5 py-4 gap-3">
      <View className="flex-row items-center gap-3">
        <View className="size-12 rounded-2xl bg-[#FFD60A] items-center justify-center">
          <AppText className="text-base font-bold text-black">
            {member.name.charAt(0).toUpperCase()}
          </AppText>
        </View>
        <View className="flex-1">
          <AppText className="text-lg font-bold text-background">
            {member.name}
          </AppText>
          <AppText className="text-xs text-background/60">
            {member.cardNumber}
            {member.email ? ` · ${member.email}` : ''}
          </AppText>
        </View>
      </View>
      <View className="flex-row flex-wrap gap-2 pt-2 border-t border-background/10">
        {member.programs.map((p) => (
          <View
            key={p.id}
            className="flex-row items-center gap-1.5 rounded-full bg-background/10 px-3 py-1"
          >
            <View className="size-1.5 rounded-full bg-[#FFD60A]" />
            <AppText className="text-[11px] font-semibold text-background">
              {p.name}
            </AppText>
            {p.points > 0 ? (
              <AppText className="text-[11px] text-background/70">
                · {p.points} pts
              </AppText>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}
