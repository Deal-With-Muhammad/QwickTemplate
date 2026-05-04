import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Input, TextField, cn } from 'heroui-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../components/app-text';
import { QwuikLogo } from '../../../components/qwuik-logo';
import { useAppTheme } from '../../../contexts/app-theme-context';

const StyledFeather = withUniwind(Feather);

// App UI 4 — Square / Geometric
// Zero rounded corners anywhere. Crisp 2px borders, grid-feel, mono-ish vibes.

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useAppTheme();

  const [email, setEmail] = useState('aisha@qwuikmarket.com');
  const [password, setPassword] = useState('');

  const borderCol = isDark ? 'border-white' : 'border-black';

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {/* Top bar */}
      <View
        className={cn(
          'px-5 pt-3 pb-3 flex-row items-center justify-between border-b-2',
          borderCol
        )}
      >
        <Pressable
          onPress={() => router.back()}
          className={cn(
            'size-10 items-center justify-center border-2',
            borderCol
          )}
          hitSlop={10}
        >
          <StyledFeather name="x" size={18} className="text-foreground" />
        </Pressable>
        <View className="flex-row items-center gap-2">
          <View className="size-2 bg-[#FFD60A]" />
          <AppText className="text-[10px] uppercase tracking-[4px] text-muted font-semibold">
            UI 04 · SQUARE
          </AppText>
        </View>
        <View className="size-10" />
      </View>

      <View className="flex-1 px-5 pt-8">
        <Animated.View entering={FadeInDown.duration(400)} className="gap-4 mb-10">
          <QwuikLogo variant="wordmark" size={140} />
          <View className="flex-row items-center gap-2">
            <View className="size-2 bg-[#FFD60A]" />
            <AppText className="text-[10px] text-muted uppercase tracking-[3px] font-semibold">
              RETAILER TERMINAL · B2B
            </AppText>
          </View>
          <AppText
            className="text-4xl font-bold text-foreground tracking-tight mt-2"
            maxFontSizeMultiplier={1.4}
          >
            Sign in.
          </AppText>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(80).duration(400)}
          className="gap-4"
        >
          <View className="gap-1.5">
            <AppText className="text-[10px] uppercase tracking-[3px] text-foreground font-semibold">
              EMAIL
            </AppText>
            <View className={cn('border-2 px-3', borderCol)}>
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
            <AppText className="text-[10px] uppercase tracking-[3px] text-foreground font-semibold">
              PASSWORD
            </AppText>
            <View className={cn('border-2 px-3', borderCol)}>
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

          <Pressable className="self-end" hitSlop={8}>
            <AppText className="text-[10px] uppercase tracking-[3px] text-muted font-semibold">
              FORGOT PASSWORD →
            </AppText>
          </Pressable>

          <Pressable
            onPress={() => router.push('/app-ui-4/dashboard')}
            className="bg-[#FFD60A] py-4 items-center border-2 border-foreground"
          >
            <AppText className="text-black font-bold uppercase tracking-[2px]">
              CONTINUE →
            </AppText>
          </Pressable>

          {/* Biometric grid */}
          <View className="flex-row items-center gap-2 mt-2">
            <View className={cn('flex-1 h-[2px]', isDark ? 'bg-white' : 'bg-black')} />
            <AppText className="text-[10px] text-muted uppercase tracking-[3px] font-semibold">
              BIOMETRIC
            </AppText>
            <View className={cn('flex-1 h-[2px]', isDark ? 'bg-white' : 'bg-black')} />
          </View>

          <View className="flex-row gap-0">
            <Pressable
              onPress={() => router.push('/app-ui-4/dashboard')}
              className={cn(
                'flex-1 py-5 items-center gap-2 border-2',
                borderCol
              )}
            >
              <StyledFeather
                name="shield"
                size={24}
                className="text-foreground"
              />
              <AppText className="text-[10px] font-bold text-foreground uppercase tracking-[2px]">
                FINGERPRINT
              </AppText>
            </Pressable>
            <Pressable
              onPress={() => router.push('/app-ui-4/dashboard')}
              className={cn(
                'flex-1 py-5 items-center gap-2 border-2 border-l-0',
                borderCol
              )}
            >
              <StyledFeather
                name="smile"
                size={24}
                className="text-foreground"
              />
              <AppText className="text-[10px] font-bold text-foreground uppercase tracking-[2px]">
                FACE ID
              </AppText>
            </Pressable>
          </View>
        </Animated.View>
      </View>

      <View className="flex-row items-center justify-center gap-2 mb-3">
        <View className="size-1 bg-[#FFD60A]" />
        <AppText className="text-[9px] text-muted uppercase tracking-[3px] font-semibold">
          SECURE · ENCRYPTED · RETAILER-GRADE
        </AppText>
        <View className="size-1 bg-[#FFD60A]" />
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </Animated.View>
  );
}
