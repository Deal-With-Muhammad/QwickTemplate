import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { cn } from 'heroui-native';
import { Pressable, View } from 'react-native';
import { withUniwind } from 'uniwind';

import { AppText } from '../../../../components/app-text';
import { useAppTheme } from '../../../../contexts/app-theme-context';
import { KeyboardSafeScreen } from '../../../../shared/components/keyboard-safe-screen';
import { MemberLookupFlow } from '../../components/member-lookup-flow';

const StyledFeather = withUniwind(Feather);

// App UI 4 — Square & Geometric.
export default function LoyaltyScreen() {
  const router = useRouter();
  const { isDark } = useAppTheme();
  const borderCol = isDark ? 'border-white' : 'border-black';

  return (
    <View className="flex-1 bg-background">
      <KeyboardSafeScreen contentContainerStyle={{ paddingHorizontal: 20 }}>
        <View
          className={cn(
            'flex-row items-center justify-between pb-3 mb-5 border-b-2',
            borderCol
          )}
        >
          <Pressable
            hitSlop={12}
            onPress={() => router.back()}
            className={cn(
              'size-10 items-center justify-center border-2',
              borderCol
            )}
          >
            <StyledFeather
              name="arrow-left"
              size={16}
              className="text-foreground"
            />
          </Pressable>
          <View
            className={cn(
              'px-3 py-2 border-2 bg-[#FFD60A]',
              borderCol
            )}
          >
            <AppText className="text-[10px] font-bold uppercase tracking-[3px] text-black">
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
