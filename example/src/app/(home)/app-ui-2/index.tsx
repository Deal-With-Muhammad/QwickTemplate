import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Input, TextField } from 'heroui-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../components/app-text';

const StyledFeather = withUniwind(Feather);

// App UI 2 — Bold / Neobrutalist
// Big yellow blocks, chunky borders, flat shadows

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('aisha@qwuikmarket.com');
  const [password, setPassword] = useState('');

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      className="flex-1 bg-[#FFD60A]"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <Pressable
        onPress={() => router.back()}
        className="mx-5 mt-3 size-11 rounded-2xl bg-black items-center justify-center self-start"
        hitSlop={12}
      >
        <StyledFeather name="x" size={20} className="text-[#FFD60A]" />
      </Pressable>

      {/* Hero block */}
      <Animated.View
        entering={FadeInDown.duration(400)}
        className="px-6 pt-6"
      >
        <View className="flex-row items-center gap-2">
          <View className="size-12 rounded-2xl bg-black items-center justify-center">
            <AppText className="text-[#FFD60A] text-xl font-bold">Q</AppText>
          </View>
          <View className="flex-1 h-[2px] bg-black" />
        </View>
        <AppText
          className="text-6xl font-bold text-black mt-6 tracking-tighter"
          maxFontSizeMultiplier={1.3}
        >
          QWUIK.{'\n'}SELL FAST.
        </AppText>
        <AppText className="text-sm text-black/70 font-medium mt-2">
          RETAILER POS · B2B ACCESS ONLY
        </AppText>
      </Animated.View>

      {/* Login block */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(400)}
        className="mt-8 bg-white mx-5 p-5 rounded-3xl border-2 border-black gap-4"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 6, height: 6 },
          shadowOpacity: 1,
          shadowRadius: 0,
          elevation: 10,
        }}
      >
        <View className="gap-1.5">
          <AppText className="text-xs text-black font-bold uppercase tracking-widest">
            Email
          </AppText>
          <TextField>
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="you@store.com"
              autoCapitalize="none"
              keyboardType="email-address"
              className="text-black"
            />
          </TextField>
        </View>

        <View className="gap-1.5">
          <AppText className="text-xs text-black font-bold uppercase tracking-widest">
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
          onPress={() => router.push('/app-ui-2/dashboard')}
          className="bg-black rounded-2xl py-4 items-center"
        >
          <AppText className="text-[#FFD60A] font-bold tracking-wider uppercase">
            → Sign in
          </AppText>
        </Pressable>

        <View className="flex-row items-center gap-3 mt-1">
          <View className="flex-1 h-[2px] bg-black/10" />
          <AppText className="text-[10px] text-black/60 uppercase tracking-widest font-bold">
            BIOMETRIC
          </AppText>
          <View className="flex-1 h-[2px] bg-black/10" />
        </View>

        <View className="flex-row gap-3">
          <Pressable
            onPress={() => router.push('/app-ui-2/dashboard')}
            className="flex-1 bg-[#FFD60A] rounded-2xl p-4 items-center gap-1 border-2 border-black"
          >
            <StyledFeather name="shield" size={24} className="text-black" />
            <AppText className="text-xs font-bold text-black uppercase">
              Fingerprint
            </AppText>
          </Pressable>
          <Pressable
            onPress={() => router.push('/app-ui-2/dashboard')}
            className="flex-1 bg-[#FFD60A] rounded-2xl p-4 items-center gap-1 border-2 border-black"
          >
            <StyledFeather name="smile" size={24} className="text-black" />
            <AppText className="text-xs font-bold text-black uppercase">
              Face ID
            </AppText>
          </Pressable>
        </View>
      </Animated.View>

      <View className="flex-row items-center justify-center gap-1 mt-auto mb-5">
        <StyledFeather name="lock" size={12} className="text-black" />
        <AppText className="text-[10px] text-black font-bold uppercase tracking-[3px]">
          Secure · Encrypted · Retailer grade
        </AppText>
      </View>

      <StatusBar style="dark" />
    </Animated.View>
  );
}
