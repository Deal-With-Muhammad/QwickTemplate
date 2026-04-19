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
  const borderCol = isDark ? 'border-white' : 'border-black';

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
            'size-24 items-center justify-center bg-[#FFD60A] border-2',
            borderCol
          )}
        >
          <StyledFeather name="mail" size={40} className="text-black" />
        </Animated.View>
        <AppText
          className="text-3xl font-bold text-foreground tracking-tight text-center"
          maxFontSizeMultiplier={1.3}
        >
          RECEIPT SENT
        </AppText>
        <AppText className="text-xs text-muted text-center uppercase tracking-widest">
          EMAILED TO {(email || 'CUSTOMER').toUpperCase()}
        </AppText>
        <Pressable
          onPress={done}
          className="bg-[#FFD60A] py-4 px-10 items-center border-2 border-foreground mt-4"
        >
          <AppText className="text-black font-bold uppercase tracking-[2px]">
            DONE →
          </AppText>
        </Pressable>
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View
        className={cn(
          'px-5 pt-3 pb-3 flex-row items-center justify-between border-b-2',
          borderCol
        )}
      >
        <Pressable
          onPress={() => router.back()}
          className={cn('size-10 items-center justify-center border-2', borderCol)}
        >
          <StyledFeather
            name="arrow-left"
            size={18}
            className="text-foreground"
          />
        </Pressable>
        <AppText className="text-xs font-bold text-foreground uppercase tracking-[3px]">
          STEP 05 · RECEIPT
        </AppText>
        <View className="size-10" />
      </View>

      <View className="flex-1 px-5 pt-4">
        <Animated.View entering={FadeIn.duration(240)} className="gap-2 mb-5">
          <View className="flex-row items-center gap-2">
            <View className="size-2 bg-[#FFD60A]" />
            <AppText className="text-[10px] text-muted uppercase tracking-[3px] font-semibold">
              OPTIONAL
            </AppText>
          </View>
          <AppText
            className="text-3xl font-bold text-foreground tracking-tight"
            maxFontSizeMultiplier={1.4}
          >
            SEND A COPY?
          </AppText>
          <AppText className="text-xs text-muted uppercase tracking-widest">
            TYPE OR DICTATE — OR SKIP.
          </AppText>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(60).duration(240)}
          className="gap-3"
        >
          <View className="gap-1.5">
            <AppText className="text-[10px] text-foreground uppercase tracking-[3px] font-semibold">
              NAME
            </AppText>
            <View className={cn('border-2 px-3', borderCol)}>
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
            <AppText className="text-[10px] text-foreground uppercase tracking-[3px] font-semibold">
              EMAIL
            </AppText>
            <View className={cn('border-2 px-3', borderCol)}>
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

          <Pressable className={cn('p-3 flex-row items-center gap-3 border-2', borderCol)}>
            <View
              className={cn(
                'size-10 items-center justify-center border-2 bg-[#FFD60A]',
                borderCol
              )}
            >
              <StyledFeather name="mic" size={18} className="text-black" />
            </View>
            <View className="flex-1">
              <AppText className="text-sm font-bold text-foreground uppercase tracking-[2px]">
                OR DICTATE
              </AppText>
              <AppText className="text-[10px] text-muted uppercase tracking-widest">
                HANDS-FREE INPUT
              </AppText>
            </View>
            <StyledFeather
              name="chevron-right"
              size={16}
              className="text-muted"
            />
          </Pressable>
        </Animated.View>

        <View className={cn('mt-5 p-3 border-2', borderCol)}>
          <View className="flex-row justify-between">
            <AppText className="text-[10px] text-muted uppercase tracking-widest font-semibold">
              ORDER
            </AppText>
            <AppText className="text-[10px] text-foreground uppercase tracking-widest font-bold">
              #QW-48219
            </AppText>
          </View>
          <View className="flex-row justify-between mt-1">
            <AppText className="text-[10px] text-muted uppercase tracking-widest font-semibold">
              PAID
            </AppText>
            <AppText className="text-[10px] text-foreground uppercase tracking-widest font-bold">
              NFC · VISA 4921
            </AppText>
          </View>
          <View className={cn('h-[2px] my-2', isDark ? 'bg-white' : 'bg-black')} />
          <View className="flex-row justify-between items-end">
            <AppText className="text-xs text-muted uppercase tracking-[3px] font-semibold">
              TOTAL
            </AppText>
            <AppText className="text-lg font-bold text-foreground">
              ${total}
            </AppText>
          </View>
        </View>
      </View>

      <View className="px-5 gap-0 pb-2">
        <Pressable
          onPress={() => setSent(true)}
          className="bg-[#FFD60A] py-4 items-center border-2 border-foreground"
        >
          <AppText className="text-black font-bold uppercase tracking-[2px]">
            SEND RECEIPT
          </AppText>
        </Pressable>
        <Pressable
          onPress={done}
          className={cn('py-4 items-center border-2 border-t-0', borderCol)}
        >
          <AppText className="text-foreground font-bold uppercase tracking-[2px]">
            SKIP · NO RECEIPT
          </AppText>
        </Pressable>
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
