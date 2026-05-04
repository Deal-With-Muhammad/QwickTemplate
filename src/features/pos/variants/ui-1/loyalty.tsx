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

// App UI 1 — Classic & Clean.
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
            className="size-10 rounded-full bg-surface-secondary items-center justify-center"
          >
            <StyledFeather
              name="arrow-left"
              size={18}
              className="text-foreground"
            />
          </Pressable>
          <View className="flex-row items-center gap-1.5 px-3 py-1 rounded-full bg-surface-secondary">
            <View className="size-1.5 rounded-full bg-[#FFD60A]" />
            <AppText className="text-[10px] uppercase tracking-widest text-muted font-medium">
              Loyalty
            </AppText>
          </View>
        </View>

        <MemberLookupFlow nextHref="/scan" />
      </KeyboardSafeScreen>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}
