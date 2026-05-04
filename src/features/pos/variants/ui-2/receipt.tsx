import Feather from '@expo/vector-icons/Feather';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Input, TextField, cn } from 'heroui-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../../components/app-text';
import { useAppTheme } from '../../../../contexts/app-theme-context';

const StyledFeather = withUniwind(Feather);

const brutalShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 8,
};

export default function Receipt() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useAppTheme();
  const { total } = useLocalSearchParams<{ total: string }>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const done = () => router.dismissAll();

  if (sent) {
    return (
      <View
        className={cn(
          'flex-1 items-center justify-center px-8 gap-5',
          isDark ? 'bg-black' : 'bg-white'
        )}
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <Animated.View
          entering={FadeIn.duration(260)}
          className="size-28 rounded-3xl bg-[#FFD60A] items-center justify-center border-4 border-foreground"
          style={brutalShadow}
        >
          <StyledFeather name="mail" size={48} className="text-black" />
        </Animated.View>
        <AppText
          className="text-4xl font-bold text-foreground text-center uppercase tracking-tighter"
          maxFontSizeMultiplier={1.3}
        >
          SENT!
        </AppText>
        <AppText className="text-sm text-muted text-center font-medium">
          Receipt emailed to {email || 'the customer'}
        </AppText>
        <Pressable
          onPress={done}
          className="bg-[#FFD60A] rounded-2xl py-5 px-10 items-center border-2 border-foreground mt-4"
          style={brutalShadow}
        >
          <AppText className="text-black font-bold uppercase tracking-wider">
            DONE →
          </AppText>
        </Pressable>
      </View>
    );
  }

  return (
    <View
      className={cn('flex-1', isDark ? 'bg-black' : 'bg-white')}
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-5 pt-3 pb-3 flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          className="size-11 rounded-2xl bg-foreground items-center justify-center"
        >
          <StyledFeather
            name="arrow-left"
            size={20}
            className="text-background"
          />
        </Pressable>
        <AppText className="text-lg font-bold text-foreground uppercase tracking-wider">
          RECEIPT
        </AppText>
        <View className="size-11" />
      </View>

      <View className="flex-1 px-5 pt-3">
        <Animated.View
          entering={FadeIn.duration(240)}
          className="bg-[#FFD60A] rounded-3xl p-5 border-2 border-foreground"
          style={brutalShadow}
        >
          <AppText className="text-xs text-black font-bold uppercase tracking-widest">
            PAID · ${total}
          </AppText>
          <AppText
            className="text-3xl font-bold text-black tracking-tighter mt-1"
            maxFontSizeMultiplier={1.4}
          >
            WHERE TO{'\n'}SEND COPY?
          </AppText>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(60).duration(240)}
          className="gap-3 mt-5"
        >
          <View className="gap-1.5">
            <AppText className="text-xs text-foreground font-bold uppercase tracking-widest">
              NAME (OPTIONAL)
            </AppText>
            <TextField>
              <Input
                value={name}
                onChangeText={setName}
                placeholder="Priya Mehta"
              />
            </TextField>
          </View>

          <View className="gap-1.5">
            <AppText className="text-xs text-foreground font-bold uppercase tracking-widest">
              EMAIL (OPTIONAL)
            </AppText>
            <TextField>
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="customer@email.com"
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </TextField>
          </View>

          <Pressable
            className="bg-foreground rounded-2xl p-4 flex-row items-center gap-3 border-2 border-foreground"
            style={brutalShadow}
          >
            <View className="size-11 rounded-2xl bg-[#FFD60A] items-center justify-center border-2 border-background">
              <StyledFeather name="mic" size={20} className="text-black" />
            </View>
            <View className="flex-1">
              <AppText className="text-sm font-bold text-background uppercase tracking-wider">
                OR DICTATE VOICE
              </AppText>
              <AppText className="text-[10px] text-background/60 font-bold uppercase tracking-widest">
                Hands-free input
              </AppText>
            </View>
            <StyledFeather
              name="chevron-right"
              size={20}
              className="text-background"
            />
          </Pressable>
        </Animated.View>
      </View>

      <View className="px-5 gap-2">
        <Pressable
          onPress={() => setSent(true)}
          className="bg-[#FFD60A] rounded-2xl py-5 items-center border-2 border-foreground"
          style={brutalShadow}
        >
          <AppText className="text-black font-bold uppercase tracking-wider">
            SEND RECEIPT
          </AppText>
        </Pressable>
        <Pressable
          onPress={done}
          className="bg-transparent rounded-2xl py-4 items-center border-2 border-foreground"
        >
          <AppText className="text-foreground font-bold uppercase tracking-wider">
            SKIP · NO RECEIPT
          </AppText>
        </Pressable>
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
