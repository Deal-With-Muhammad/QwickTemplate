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

// App UI 3 — Minimal / Modern. Member-lookup is the FIRST checkout step now.
export default function LoyaltyScreen() {
  const router = useRouter();
  const { isDark } = useAppTheme();

  return (
    <View className="flex-1 bg-background">
      <KeyboardSafeScreen contentContainerStyle={{ paddingHorizontal: 24 }}>
        <View className="flex-row items-center justify-between pb-3 mb-4">
          <Pressable
            hitSlop={12}
            onPress={() => router.back()}
            className="py-2"
          >
            <StyledFeather name="x" size={22} className="text-foreground" />
          </Pressable>
          <View className="flex-row items-center gap-1.5">
            <View className="size-1.5 rounded-full bg-[#FFD60A]" />
            <AppText className="text-[10px] uppercase tracking-[3px] text-muted font-medium">
              Step 1 · Member
            </AppText>
          </View>
        </View>

        <MemberLookupFlow nextHref="/scan" />
      </KeyboardSafeScreen>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
