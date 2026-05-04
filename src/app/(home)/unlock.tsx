import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button } from 'heroui-native';
import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { withUniwind } from 'uniwind';

import { AppText } from '../../components/app-text';
import { QwuikLogo } from '../../components/qwuik-logo';
import { useAppTheme } from '../../contexts/app-theme-context';
import { LoginForm } from '../../features/auth/components/login-form';
import { useAuth } from '../../features/auth/contexts/auth-context';
import { useBiometric } from '../../features/auth/hooks/use-biometric';
import { AuthError } from '../../features/auth/types';
import { useSettings } from '../../features/settings/contexts/settings-context';
import { KeyboardSafeScreen } from '../../shared/components/keyboard-safe-screen';

const StyledFeather = withUniwind(Feather);

const ICON_FOR_KIND = {
  face: 'smile',
  fingerprint: 'lock',
  iris: 'eye',
  none: 'lock',
} as const;

const LABEL_FOR_KIND = {
  face: 'Use Face ID',
  fingerprint: 'Use Touch ID',
  iris: 'Use Iris',
  none: 'Unlock',
} as const;

/**
 * Returning-user unlock screen. Tries biometric first; if hardware is missing
 * or the user cancels, falls back to a password-only form (email is locked).
 */
export default function UnlockScreen() {
  const router = useRouter();
  const { isDark } = useAppTheme();
  const { unlock, signOut, signIn, storedEmail } = useAuth();
  const { settings } = useSettings();
  const biometric = useBiometric();

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const autoTriggered = useRef(false);

  const canUseBiometric = biometric.available && settings.biometricEnabled;

  // Auto-trigger biometric the first time the screen is shown — but only once
  // per mount, otherwise cancellation would loop.
  useEffect(() => {
    if (autoTriggered.current) return;
    if (biometric.loading) return;
    autoTriggered.current = true;

    if (canUseBiometric) {
      runBiometric();
    } else {
      setShowPassword(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [biometric.loading, canUseBiometric]);

  async function runBiometric() {
    setErrorMessage(null);
    const result = await biometric.authenticate({
      promptMessage: 'Unlock Qwuik',
    });

    if (result.success) {
      setIsSubmitting(true);
      try {
        const profile = await unlock();

        if (profile) {
          router.replace('/');
        } else {
          setErrorMessage('Stored credentials are no longer valid.');
          setShowPassword(true);
        }
      } catch (err) {
        const message =
          err instanceof AuthError
            ? err.message
            : err instanceof Error
              ? err.message
              : 'Could not unlock the app.';

        setErrorMessage(message);
        setShowPassword(true);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // user cancelled or failed — let them use password
      setShowPassword(true);
    }
  }

  async function handlePasswordSubmit({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await signIn({ email, password });
      router.replace('/');
    } catch (err) {
      if (err instanceof AuthError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(
          err instanceof Error ? err.message : 'Something went wrong.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    router.replace('/login');
  }

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      className="flex-1 bg-background"
    >
      <KeyboardSafeScreen
        contentContainerStyle={{
          paddingHorizontal: 24,
          justifyContent: 'center',
          paddingTop: 32,
        }}
      >
        <Animated.View
          entering={FadeInDown.duration(400)}
          className="items-center mb-10"
        >
          <QwuikLogo variant="wordmark" size={140} />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          className="mb-8 gap-2"
        >
          <AppText className="text-3xl font-bold text-foreground tracking-tight">
            Welcome back
          </AppText>
          <AppText className="text-sm text-muted">
            {storedEmail
              ? `Signed in as ${storedEmail}`
              : 'Unlock to continue.'}
          </AppText>
        </Animated.View>

        {!showPassword ? (
          <Animated.View
            entering={FadeInDown.delay(200).duration(400)}
            className="gap-4 items-center"
          >
            <Pressable onPress={runBiometric} className="items-center gap-3">
              <View className="size-24 items-center justify-center rounded-3xl bg-foreground">
                <StyledFeather
                  name={ICON_FOR_KIND[biometric.primary]}
                  size={36}
                  className="text-background"
                />
              </View>
              <AppText className="text-base font-semibold text-foreground">
                {LABEL_FOR_KIND[biometric.primary]}
              </AppText>
            </Pressable>

            {errorMessage ? (
              <AppText className="text-sm text-danger text-center px-4">
                {errorMessage}
              </AppText>
            ) : null}

            <Button
              size="sm"
              variant="ghost"
              onPress={() => setShowPassword(true)}
            >
              <Button.Label>Use password instead</Button.Label>
            </Button>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown.delay(150).duration(400)}>
            <LoginForm
              defaultEmail={storedEmail ?? ''}
              emailLocked
              isSubmitting={isSubmitting}
              errorMessage={errorMessage}
              submitLabel="Unlock"
              onSubmit={handlePasswordSubmit}
            />

            {canUseBiometric ? (
              <View className="mt-3 items-center">
                <Button
                  size="sm"
                  variant="ghost"
                  onPress={() => {
                    setShowPassword(false);
                    setErrorMessage(null);
                    runBiometric();
                  }}
                >
                  <Button.Label>
                    Use {LABEL_FOR_KIND[biometric.primary].toLowerCase()}
                  </Button.Label>
                </Button>
              </View>
            ) : null}
          </Animated.View>
        )}

        <View className="mt-10 items-center">
          <Button size="sm" variant="ghost" onPress={handleSignOut}>
            <Button.Label>Sign out and forget this device</Button.Label>
          </Button>
        </View>
      </KeyboardSafeScreen>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </Animated.View>
  );
}
