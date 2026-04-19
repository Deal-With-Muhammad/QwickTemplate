import Feather from '@expo/vector-icons/Feather';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Input, TextField, cn } from 'heroui-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../components/app-text';
import { useAppTheme } from '../../../contexts/app-theme-context';

const StyledFeather = withUniwind(Feather);

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
        className="flex-1 bg-background items-center justify-center px-8 gap-5"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <Animated.View
          entering={FadeIn.duration(260)}
          className={cn(
            'size-16 rounded-2xl items-center justify-center',
            isDark ? 'bg-white' : 'bg-black'
          )}
        >
          <StyledFeather
            name="mail"
            size={28}
            className={isDark ? 'text-black' : 'text-white'}
          />
        </Animated.View>
        <AppText
          className="text-3xl font-bold text-foreground tracking-tight text-center"
          maxFontSizeMultiplier={1.3}
        >
          Receipt sent
        </AppText>
        <AppText className="text-sm text-muted text-center">
          Emailed to {email || 'the customer'}
        </AppText>
        <Pressable
          onPress={done}
          className={cn(
            'mt-4 rounded-full py-4 px-10 flex-row items-center gap-2',
            isDark ? 'bg-white' : 'bg-black'
          )}
        >
          <AppText
            className={cn(
              'font-medium',
              isDark ? 'text-black' : 'text-white'
            )}
          >
            Back to dashboard
          </AppText>
          <View className="size-1.5 rounded-full bg-[#FFD60A]" />
        </Pressable>
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-6 pt-3 pb-3 flex-row items-center justify-between">
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <StyledFeather
            name="arrow-left"
            size={22}
            className="text-foreground"
          />
        </Pressable>
        <AppText className="text-xs text-muted uppercase tracking-[3px] font-medium">
          STEP 4 · RECEIPT
        </AppText>
        <View className="size-6" />
      </View>

      <View className="flex-1 px-6 pt-6">
        <Animated.View entering={FadeIn.duration(220)} className="gap-3">
          <View className="size-1.5 rounded-full bg-[#FFD60A]" />
          <AppText
            className="text-3xl font-bold text-foreground tracking-tight"
            maxFontSizeMultiplier={1.4}
          >
            Send a digital{'\n'}receipt?
          </AppText>
          <AppText className="text-sm text-muted leading-relaxed">
            Optional — type or dictate the customer's details to email a copy.
          </AppText>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(60).duration(240)}
          className="gap-5 mt-8"
        >
          <View className="gap-1.5">
            <AppText className="text-[10px] text-muted uppercase tracking-[3px] font-medium">
              NAME
            </AppText>
            <View
              className={cn(
                'border-b pb-1',
                isDark ? 'border-white/10' : 'border-black/10'
              )}
            >
              <TextField>
                <Input
                  value={name}
                  onChangeText={setName}
                  placeholder="Priya Mehta"
                  className="bg-transparent"
                />
              </TextField>
            </View>
          </View>

          <View className="gap-1.5">
            <AppText className="text-[10px] text-muted uppercase tracking-[3px] font-medium">
              EMAIL
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
                  placeholder="customer@email.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  className="bg-transparent"
                />
              </TextField>
            </View>
          </View>

          <Pressable
            className={cn(
              'mt-2 rounded-full py-3 px-4 flex-row items-center gap-3 border',
              isDark ? 'border-white/10' : 'border-black/10'
            )}
          >
            <View className="size-7 rounded-full bg-[#FFD60A] items-center justify-center">
              <StyledFeather name="mic" size={14} className="text-black" />
            </View>
            <AppText className="text-sm text-foreground font-medium flex-1">
              Or use voice dictation
            </AppText>
            <StyledFeather
              name="chevron-right"
              size={16}
              className="text-muted"
            />
          </Pressable>
        </Animated.View>

        <View
          className={cn(
            'mt-8 p-5 rounded-2xl border',
            isDark ? 'border-white/10' : 'border-black/10'
          )}
        >
          <View className="flex-row justify-between">
            <AppText className="text-[10px] text-muted uppercase tracking-widest">
              Order
            </AppText>
            <AppText className="text-[10px] text-foreground uppercase tracking-widest">
              #QW-48219
            </AppText>
          </View>
          <View className="flex-row justify-between mt-1">
            <AppText className="text-[10px] text-muted uppercase tracking-widest">
              Paid via
            </AppText>
            <AppText className="text-[10px] text-foreground uppercase tracking-widest">
              NFC · Visa 4921
            </AppText>
          </View>
          <View
            className={cn(
              'h-px my-3',
              isDark ? 'bg-white/10' : 'bg-black/10'
            )}
          />
          <View className="flex-row justify-between items-end">
            <AppText className="text-[10px] text-muted uppercase tracking-widest">
              Total
            </AppText>
            <AppText className="text-lg font-bold text-foreground">
              ${total}
            </AppText>
          </View>
        </View>
      </View>

      <View className="px-6 gap-2">
        <Pressable
          onPress={() => setSent(true)}
          className={cn(
            'rounded-full py-4 items-center flex-row justify-center gap-2',
            isDark ? 'bg-white' : 'bg-black'
          )}
        >
          <AppText
            className={cn(
              'font-medium',
              isDark ? 'text-black' : 'text-white'
            )}
          >
            Send receipt
          </AppText>
          <View className="size-1.5 rounded-full bg-[#FFD60A]" />
        </Pressable>
        <Pressable
          onPress={done}
          className={cn(
            'rounded-full py-3 items-center border',
            isDark ? 'border-white/15' : 'border-black/10'
          )}
        >
          <AppText className="text-sm text-foreground font-medium">
            Skip · no receipt
          </AppText>
        </Pressable>
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
