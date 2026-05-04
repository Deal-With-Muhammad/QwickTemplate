import Feather from '@expo/vector-icons/Feather';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, Card, Input, TextField, cn } from 'heroui-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../../components/app-text';
import { useAppTheme } from '../../../../contexts/app-theme-context';

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
        className="flex-1 bg-background items-center justify-center px-8 gap-4"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <Animated.View
          entering={FadeIn.duration(260)}
          className="size-24 rounded-full bg-[#FFD60A] items-center justify-center"
        >
          <StyledFeather name="mail" size={40} className="text-black" />
        </Animated.View>
        <AppText
          className="text-3xl font-bold text-foreground text-center"
          maxFontSizeMultiplier={1.3}
        >
          Receipt sent!
        </AppText>
        <AppText className="text-sm text-muted text-center">
          A digital receipt was emailed to {email || 'the customer'}.
        </AppText>
        <View className="w-full gap-2 mt-6">
          <Button className="bg-[#FFD60A]" onPress={done}>
            <Button.Label className="text-black font-bold">
              Back to dashboard
            </Button.Label>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-5 pt-3 pb-3 flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          className="size-10 rounded-full bg-surface-secondary items-center justify-center"
        >
          <StyledFeather
            name="arrow-left"
            size={20}
            className="text-foreground"
          />
        </Pressable>
        <AppText className="text-base font-semibold text-foreground">
          Digital receipt
        </AppText>
        <View className="size-10" />
      </View>

      <View className="flex-1 px-5 pt-3">
        <Animated.View entering={FadeIn.duration(240)} className="gap-2 mb-5">
          <AppText
            className="text-2xl font-bold text-foreground"
            maxFontSizeMultiplier={1.4}
          >
            Send a copy?
          </AppText>
          <AppText className="text-sm text-muted">
            Optional — enter the customer's name and email, or skip.
          </AppText>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(80).duration(240)}
          className="gap-4"
        >
          <View className="gap-1.5">
            <AppText className="text-sm font-medium text-foreground">
              Customer name
            </AppText>
            <TextField>
              <Input
                value={name}
                onChangeText={setName}
                placeholder="e.g. Priya Mehta"
              />
            </TextField>
          </View>

          <View className="gap-1.5">
            <AppText className="text-sm font-medium text-foreground">
              Email
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

          <Card
            className={cn(
              'p-4 flex-row items-center gap-3 border',
              isDark ? 'border-white/10' : 'border-black/10'
            )}
          >
            <View className="size-10 rounded-xl bg-[#FFD60A] items-center justify-center">
              <StyledFeather name="mic" size={20} className="text-black" />
            </View>
            <View className="flex-1">
              <AppText className="text-sm font-semibold text-foreground">
                Or dictate with voice
              </AppText>
              <AppText className="text-xs text-muted">
                Faster when hands are busy
              </AppText>
            </View>
            <StyledFeather
              name="chevron-right"
              size={18}
              className="text-muted"
            />
          </Card>
        </Animated.View>

        <Card
          className={cn(
            'mt-6 p-4 border',
            isDark ? 'border-white/10' : 'border-black/10'
          )}
        >
          <View className="flex-row justify-between mb-1">
            <AppText className="text-xs text-muted">Order</AppText>
            <AppText className="text-xs text-foreground font-medium">
              #QW-48219
            </AppText>
          </View>
          <View className="flex-row justify-between">
            <AppText className="text-xs text-muted">Paid</AppText>
            <AppText className="text-xs text-foreground font-medium">
              NFC · Visa **4921
            </AppText>
          </View>
          <View className="flex-row justify-between mt-3 pt-3 border-t border-border">
            <AppText className="text-base font-bold text-foreground">
              Total
            </AppText>
            <AppText className="text-base font-bold text-foreground">
              ${total}
            </AppText>
          </View>
        </Card>
      </View>

      <View className="px-5 gap-2">
        <Button className="bg-[#FFD60A]" onPress={() => setSent(true)}>
          <Button.Label className="text-black font-bold">
            Send receipt
          </Button.Label>
        </Button>
        <Button
          className={cn(
            'bg-transparent border',
            isDark ? 'border-white/15' : 'border-black/15'
          )}
          onPress={done}
        >
          <Button.Label className="text-foreground font-semibold">
            Skip · no receipt
          </Button.Label>
        </Button>
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
