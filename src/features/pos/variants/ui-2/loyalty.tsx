import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, View } from 'react-native';
import { withUniwind } from 'uniwind';

import { AppText } from '../../../../components/app-text';
import { useAppTheme } from '../../../../contexts/app-theme-context';
import { KeyboardSafeScreen } from '../../../../shared/components/keyboard-safe-screen';
import { MemberLookupFlow } from '../../components/member-lookup-flow';

const StyledFeather = withUniwind(Feather);

// App UI 2 — Bold & Expressive.
export default function LoyaltyScreen() {
  const router = useRouter();
  const { isDark } = useAppTheme();

  return (
    <View className="flex-1 bg-background">
      <KeyboardSafeScreen contentContainerStyle={{ paddingHorizontal: 20 }}>
        <View className="flex-row items-center justify-between mb-5">
          <Pressable
            hitSlop={12}
            onPress={() => router.back()}
            className="size-11 rounded-2xl bg-foreground items-center justify-center border-2 border-foreground"
          >
            <StyledFeather
              name="arrow-left"
              size={18}
              className="text-background"
            />
          </Pressable>
          <View className="px-3 py-2 rounded-2xl bg-[#FFD60A] border-2 border-foreground">
            <AppText className="text-[10px] uppercase tracking-widest font-bold text-black">
              LOYALTY
            </AppText>
          </View>
        </View>

        <MemberLookupFlow nextHref="/scan" />
      </KeyboardSafeScreen>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
