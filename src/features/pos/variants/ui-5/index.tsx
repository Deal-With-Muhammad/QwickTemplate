import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Input, TextField, cn } from 'heroui-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../../components/app-text';
import { QwuikLogo } from '../../../../components/qwuik-logo';
import { useAppTheme } from '../../../../contexts/app-theme-context';

const StyledFeather = withUniwind(Feather);

// App UI 5 — Tab-based navigation + accordion checkout + extra features
// Bottom tab bar (Home · Checkout · Analytics · Inventory · Profile)
// Floating "+" quick-action overlay
// Accordion checkout: all steps collapse/expand in place

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
      {/* Top bar with close */}
      <View className="px-5 pt-3 flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          className={cn(
            'size-10 rounded-2xl items-center justify-center',
            isDark ? 'bg-white/5' : 'bg-black/5'
          )}
          hitSlop={12}
        >
          <StyledFeather name="x" size={20} className="text-foreground" />
        </Pressable>
        <View
          className={cn(
            'px-3 py-1.5 rounded-full flex-row items-center gap-2',
            isDark ? 'bg-white/5' : 'bg-black/5'
          )}
        >
          <View className="size-1.5 rounded-full bg-[#FFD60A]" />
          <AppText className="text-[10px] uppercase tracking-widest text-foreground font-semibold">
            UI 05 · NAVIGATION+
          </AppText>
        </View>
      </View>

      <View className="flex-1 px-6 justify-center">
        {/* Logo */}
        <Animated.View entering={FadeInDown.duration(400)} className="gap-3 mb-12">
          <QwuikLogo variant="wordmark" size={150} />
          <AppText className="text-xs text-muted uppercase tracking-[3px] font-semibold">
            RETAILER COMMAND CENTER
          </AppText>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          className="gap-4"
        >
          <View className="gap-1.5">
            <AppText className="text-sm font-medium text-foreground">
              Email
            </AppText>
            <TextField>
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="you@store.com"
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </TextField>
          </View>

          <View className="gap-1.5">
            <AppText className="text-sm font-medium text-foreground">
              Password
            </AppText>
            <TextField>
              <Input
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
              />
            </TextField>
          </View>

          <Pressable
            onPress={() => router.push('/app-ui-5/tabs')}
            className="mt-2 rounded-2xl bg-foreground py-4 items-center flex-row justify-center gap-2"
          >
            <AppText className="text-background font-bold">
              Enter command center
            </AppText>
            <StyledFeather
              name="arrow-right"
              size={18}
              className="text-background"
            />
          </Pressable>

          {/* Unique: both biometrics on same row with pill style */}
          <View
            className={cn(
              'flex-row rounded-2xl overflow-hidden mt-3 border',
              isDark ? 'border-white/10' : 'border-black/10'
            )}
          >
            <Pressable
              onPress={() => router.push('/app-ui-5/tabs')}
              className={cn(
                'flex-1 py-4 flex-row items-center justify-center gap-2 border-r',
                isDark ? 'border-white/10' : 'border-black/10'
              )}
            >
              <StyledFeather
                name="shield"
                size={18}
                className="text-foreground"
              />
              <AppText className="text-sm font-semibold text-foreground">
                Touch
              </AppText>
            </Pressable>
            <Pressable
              onPress={() => router.push('/app-ui-5/tabs')}
              className="flex-1 py-4 flex-row items-center justify-center gap-2"
            >
              <StyledFeather
                name="smile"
                size={18}
                className="text-foreground"
              />
              <AppText className="text-sm font-semibold text-foreground">
                Face
              </AppText>
            </Pressable>
          </View>
        </Animated.View>
      </View>

      <View className="px-5 pb-2 flex-row items-center justify-center gap-2">
        <StyledFeather name="lock" size={11} className="text-muted" />
        <AppText className="text-[10px] text-muted uppercase tracking-[3px] font-semibold">
          SECURE · B2B RETAILER ACCESS
        </AppText>
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </Animated.View>
  );
}
