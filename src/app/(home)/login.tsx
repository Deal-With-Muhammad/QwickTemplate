import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '../../components/app-text';
import { QwuikLogo } from '../../components/qwuik-logo';
import { useAppTheme } from '../../contexts/app-theme-context';
import { LoginForm } from '../../features/auth/components/login-form';
import { useAuth } from '../../features/auth/contexts/auth-context';
import { AuthError } from '../../features/auth/types';

/**
 * First-time sign-in screen. Once a user signs in successfully their
 * credentials are stored in SecureStore and the app remembers them — next
 * launch they'll be sent to /unlock instead.
 */
export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useAppTheme();
  const { signIn } = useAuth();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit({
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

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom }}
    >
      <View className="flex-1 px-6 justify-center">
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
            Sign in
          </AppText>
          <AppText className="text-sm text-muted">
            Retailer accounts only. Use the email + password set up by your
            admin.
          </AppText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <LoginForm
            isSubmitting={isSubmitting}
            errorMessage={errorMessage}
            onSubmit={handleSubmit}
          />
        </Animated.View>
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </Animated.View>
  );
}
