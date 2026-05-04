import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { Button, Card, Switch, cn } from 'heroui-native';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { withUniwind } from 'uniwind';

import { AppText } from '../../components/app-text';
import { ScreenScrollView } from '../../components/screen-scroll-view';
import { useAuth } from '../../features/auth/contexts/auth-context';
import { useBiometric } from '../../features/auth/hooks/use-biometric';
import { useSettings } from '../../features/settings/contexts/settings-context';
import { UI_VARIANTS } from '../../features/settings/types';
import type { UiVariant } from '../../features/settings/types';

const StyledFeather = withUniwind(Feather);

export default function SettingsScreen() {
  const router = useRouter();
  const { settings, update } = useSettings();
  const { user, signOut } = useAuth();
  const biometric = useBiometric();

  function handleVariantSelect(id: UiVariant) {
    update({ uiVariant: id });
  }

  async function handleSignOut() {
    await signOut();
    router.replace('/login');
  }

  return (
    <ScreenScrollView>
      {user ? (
        <Animated.View entering={FadeInDown.duration(300)} className="mb-6">
          <Card className="p-4 flex-row items-center gap-4">
            <View className="size-12 rounded-2xl bg-foreground items-center justify-center">
              <AppText className="text-background font-bold text-lg">
                {user.name.charAt(0).toUpperCase()}
              </AppText>
            </View>
            <View className="flex-1">
              <AppText className="text-base font-semibold text-foreground">
                {user.name}
              </AppText>
              <AppText className="text-xs text-muted">{user.email}</AppText>
              <AppText className="text-[10px] uppercase tracking-[2px] text-muted mt-1">
                {user.type}
              </AppText>
            </View>
          </Card>
        </Animated.View>
      ) : null}

      <SectionTitle>App appearance</SectionTitle>
      <View className="gap-3 mb-8">
        {UI_VARIANTS.map((variant, index) => {
          const isSelected = settings.uiVariant === variant.id;

          return (
            <Animated.View
              key={variant.id}
              entering={FadeInDown.delay(index * 60).duration(280)}
            >
              <Pressable onPress={() => handleVariantSelect(variant.id)}>
                <Card
                  className={cn(
                    'p-4 border',
                    isSelected
                      ? 'border-accent bg-accent/5'
                      : 'border-border/40'
                  )}
                >
                  <View className="flex-row items-start gap-3">
                    <View
                      className={cn(
                        'size-5 rounded-full items-center justify-center mt-0.5 border-2',
                        isSelected
                          ? 'bg-accent border-accent'
                          : 'border-muted/40'
                      )}
                    >
                      {isSelected ? (
                        <StyledFeather
                          name="check"
                          size={12}
                          className="text-background"
                        />
                      ) : null}
                    </View>
                    <View className="flex-1">
                      <AppText className="text-base font-semibold text-foreground">
                        {variant.label}
                      </AppText>
                      <AppText className="text-xs text-muted mt-0.5">
                        {variant.description}
                      </AppText>
                    </View>
                  </View>
                </Card>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>

      <SectionTitle>Security</SectionTitle>
      <View className="gap-3 mb-8">
        <Card className="p-4">
          <View className="flex-row items-center gap-4">
            <View className="size-10 rounded-2xl bg-accent/10 items-center justify-center">
              <StyledFeather
                name={biometric.primary === 'face' ? 'smile' : 'lock'}
                size={18}
                className="text-accent"
              />
            </View>
            <View className="flex-1">
              <AppText className="text-base font-semibold text-foreground">
                Biometric unlock
              </AppText>
              <AppText className="text-xs text-muted mt-0.5">
                {biometric.available
                  ? 'Use Face ID / Touch ID to unlock the app on launch.'
                  : 'No biometric hardware detected on this device.'}
              </AppText>
            </View>
            <Switch
              isSelected={settings.biometricEnabled && biometric.available}
              isDisabled={!biometric.available}
              onSelectedChange={(next) => update({ biometricEnabled: next })}
            />
          </View>
        </Card>
      </View>

      <SectionTitle>Account</SectionTitle>
      <View className="mb-10">
        <Button variant="danger-soft" onPress={handleSignOut}>
          <Button.Label>Sign out</Button.Label>
        </Button>
      </View>
    </ScreenScrollView>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <AppText className="text-[10px] font-medium uppercase tracking-[3px] text-muted mb-3">
      {children}
    </AppText>
  );
}
