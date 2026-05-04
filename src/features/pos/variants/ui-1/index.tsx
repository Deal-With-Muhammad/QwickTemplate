import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, Card, Input, TextField, cn } from 'heroui-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../../components/app-text';
import { QwuikLogo } from '../../../../components/qwuik-logo';
import { useAppTheme } from '../../../../contexts/app-theme-context';

const StyledFeather = withUniwind(Feather);

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useAppTheme();

  const [email, setEmail] = useState('aisha@qwuikmarket.com');
  const [password, setPassword] = useState('');

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <Pressable
        onPress={() => router.back()}
        className="mx-5 mt-3 size-10 rounded-full bg-surface-secondary items-center justify-center self-start"
        hitSlop={12}
      >
        <StyledFeather name="x" size={20} className="text-foreground" />
      </Pressable>

      <View className="flex-1 px-6 justify-center">
        <Animated.View entering={FadeInDown.duration(400)} className="gap-2 mb-10">
          <QwuikLogo variant="wordmark" size={140} />
          <AppText
            className="text-3xl font-bold text-foreground mt-6"
            maxFontSizeMultiplier={1.5}
          >
            Welcome back
          </AppText>
          <AppText className="text-base text-muted">
            Sign in to access your retailer POS.
          </AppText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(400)} className="gap-4">
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
                placeholder="Enter password"
                secureTextEntry
              />
            </TextField>
          </View>

          <Pressable className="self-end">
            <AppText className="text-sm text-muted font-medium">
              Forgot password?
            </AppText>
          </Pressable>

          <Button
            className="mt-2 bg-[#FFD60A]"
            onPress={() => router.push('/dashboard')}
          >
            <AppText className="text-black font-semibold">Sign in</AppText>
          </Button>

          <View className="flex-row items-center gap-3 my-3">
            <View className="flex-1 h-px bg-border" />
            <AppText className="text-xs text-muted uppercase tracking-widest">
              or
            </AppText>
            <View className="flex-1 h-px bg-border" />
          </View>

          <View className="flex-row gap-3">
            <Card
              className={cn(
                'flex-1 p-4 items-center gap-2 border',
                isDark ? 'border-white/10' : 'border-black/10'
              )}
            >
              <Pressable
                className="items-center gap-2 w-full"
                onPress={() => router.push('/dashboard')}
              >
                <StyledFeather
                  name="shield"
                  size={22}
                  className="text-foreground"
                />
                <AppText className="text-xs font-medium text-foreground">
                  Fingerprint
                </AppText>
              </Pressable>
            </Card>
            <Card
              className={cn(
                'flex-1 p-4 items-center gap-2 border',
                isDark ? 'border-white/10' : 'border-black/10'
              )}
            >
              <Pressable
                className="items-center gap-2 w-full"
                onPress={() => router.push('/dashboard')}
              >
                <StyledFeather
                  name="smile"
                  size={22}
                  className="text-foreground"
                />
                <AppText className="text-xs font-medium text-foreground">
                  Face ID
                </AppText>
              </Pressable>
            </Card>
          </View>
        </Animated.View>

        <View className="flex-row items-center justify-center gap-1 mt-10">
          <StyledFeather name="lock" size={12} className="text-muted" />
          <AppText className="text-xs text-muted">
            Secure B2B access · retailer accounts only
          </AppText>
        </View>
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </Animated.View>
  );
}
