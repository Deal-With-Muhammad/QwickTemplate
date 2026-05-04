import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, Input, TextField, cn } from 'heroui-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../../components/app-text';
import { QwuikLogo } from '../../../../components/qwuik-logo';
import { useAppTheme } from '../../../../contexts/app-theme-context';

const StyledFeather = withUniwind(Feather);

// App UI 3 — Minimal / Modern
// Airy spacing, thin strokes, micro-typography, subtle yellow accent only

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useAppTheme();

  const [email, setEmail] = useState('aisha@qwuikmarket.com');
  const [password, setPassword] = useState('');

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-6 pt-3 flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          className="py-2 pr-3"
        >
          <StyledFeather name="x" size={22} className="text-foreground" />
        </Pressable>
        <View className="flex-row items-center gap-1.5">
          <View className="size-1.5 rounded-full bg-[#FFD60A]" />
          <AppText className="text-[10px] uppercase tracking-[3px] text-muted font-medium">
            UI 3 · Minimal
          </AppText>
        </View>
      </View>

      <View className="flex-1 px-6 justify-center">
        <Animated.View
          entering={FadeInDown.duration(400)}
          className="gap-3 mb-12"
        >
          <QwuikLogo variant="wordmark" size={110} />
          <AppText
            className="text-4xl font-bold text-foreground tracking-tight mt-8"
            maxFontSizeMultiplier={1.5}
          >
            Sign in
          </AppText>
          <AppText className="text-base text-muted leading-relaxed">
            Access your retailer terminal. B2B accounts only — no public sign-up.
          </AppText>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          className="gap-5"
        >
          <View className="gap-1.5">
            <AppText className="text-xs text-muted uppercase tracking-widest font-medium">
              Email
            </AppText>
            <View
              className={cn(
                'border-b pb-1',
                isDark ? 'border-white/10' : 'border-black/10'
              )}
            >
              <TextField>
                <Input
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@store.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  className="bg-transparent"
                />
              </TextField>
            </View>
          </View>

          <View className="gap-1.5">
            <AppText className="text-xs text-muted uppercase tracking-widest font-medium">
              Password
            </AppText>
            <View
              className={cn(
                'border-b pb-1',
                isDark ? 'border-white/10' : 'border-black/10'
              )}
            >
              <TextField>
                <Input
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  secureTextEntry
                  className="bg-transparent"
                />
              </TextField>
            </View>
          </View>

          <Pressable className="self-end" hitSlop={10}>
            <AppText className="text-xs text-muted font-medium">
              Forgot your password?
            </AppText>
          </Pressable>

          <Button
            className="mt-4 bg-foreground"
            onPress={() => router.push('/dashboard')}
          >
            <Button.Label className="text-background font-medium">
              Continue
            </Button.Label>
          </Button>

          <View className="flex-row items-center gap-3 my-2">
            <View className="flex-1 h-px bg-border" />
            <AppText className="text-[10px] text-muted uppercase tracking-widest">
              biometric
            </AppText>
            <View className="flex-1 h-px bg-border" />
          </View>

          <View className="flex-row items-center justify-center gap-10">
            <Pressable
              onPress={() => router.push('/dashboard')}
              className="items-center gap-2"
            >
              <View
                className={cn(
                  'size-14 rounded-2xl items-center justify-center border',
                  isDark ? 'border-white/15' : 'border-black/10'
                )}
              >
                <StyledFeather
                  name="shield"
                  size={22}
                  className="text-foreground"
                />
              </View>
              <AppText className="text-xs text-muted font-medium">
                Fingerprint
              </AppText>
            </Pressable>

            <View className="w-px h-12 bg-border" />

            <Pressable
              onPress={() => router.push('/dashboard')}
              className="items-center gap-2"
            >
              <View
                className={cn(
                  'size-14 rounded-2xl items-center justify-center border',
                  isDark ? 'border-white/15' : 'border-black/10'
                )}
              >
                <StyledFeather
                  name="smile"
                  size={22}
                  className="text-foreground"
                />
              </View>
              <AppText className="text-xs text-muted font-medium">
                Face ID
              </AppText>
            </Pressable>
          </View>
        </Animated.View>
      </View>

      <AppText className="text-[10px] text-muted text-center tracking-widest uppercase mb-2">
        Secure · retailer-grade encryption
      </AppText>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </Animated.View>
  );
}
