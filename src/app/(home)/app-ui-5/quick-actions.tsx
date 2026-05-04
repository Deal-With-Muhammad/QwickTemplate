import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { cn } from 'heroui-native';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../components/app-text';
import { useAppTheme } from '../../../contexts/app-theme-context';

const StyledFeather = withUniwind(Feather);

const actions: {
  id: string;
  label: string;
  desc: string;
  icon: keyof typeof Feather.glyphMap;
  primary?: boolean;
}[] = [
  {
    id: 'scan',
    label: 'New checkout',
    desc: 'Scan products · take payment',
    icon: 'maximize',
    primary: true,
  },
  {
    id: 'refund',
    label: 'Instant refund',
    desc: 'Reverse a recent transaction',
    icon: 'rotate-ccw',
  },
  {
    id: 'discount',
    label: 'Apply discount',
    desc: 'One-off % or $ off next sale',
    icon: 'percent',
  },
  {
    id: 'shift',
    label: 'Close shift',
    desc: 'Cash-out · end-of-day summary',
    icon: 'log-out',
  },
  {
    id: 'note',
    label: 'Leave a note',
    desc: 'For the next terminal operator',
    icon: 'edit-3',
  },
];

export default function QuickActions() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useAppTheme();

  const close = () => router.back();

  const run = (id: string) => {
    close();
    if (id === 'scan') {
      setTimeout(() => router.push('/app-ui-5/tabs/checkout'), 50);
    }
  };

  return (
    <View className="flex-1 justify-end">
      {/* Backdrop */}
      <Animated.View
        entering={FadeIn.duration(180)}
        className="absolute inset-0 bg-black/60"
      >
        <Pressable onPress={close} style={{ flex: 1 }} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        entering={FadeInDown.duration(240)}
        className={cn(
          'rounded-t-3xl pt-3 px-5 pb-8',
          isDark ? 'bg-[#111214]' : 'bg-white'
        )}
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        {/* Handle */}
        <View className="items-center mb-3">
          <View
            className={cn(
              'w-10 h-1 rounded-full',
              isDark ? 'bg-white/20' : 'bg-black/15'
            )}
          />
        </View>

        <View className="flex-row items-center justify-between mb-2">
          <View>
            <AppText className="text-xs text-muted uppercase tracking-[3px] font-semibold">
              QUICK ACTIONS
            </AppText>
            <AppText className="text-xl font-bold text-foreground tracking-tight">
              What do you want to do?
            </AppText>
          </View>
          <Pressable
            onPress={close}
            className={cn(
              'size-9 rounded-full items-center justify-center',
              isDark ? 'bg-white/10' : 'bg-black/5'
            )}
          >
            <StyledFeather name="x" size={16} className="text-foreground" />
          </Pressable>
        </View>

        <View className="gap-2 mt-3">
          {actions.map((a) => (
            <Pressable
              key={a.id}
              onPress={() => run(a.id)}
              className={cn(
                'p-4 rounded-2xl flex-row items-center gap-3',
                a.primary
                  ? 'bg-[#FFD60A]'
                  : isDark
                    ? 'bg-white/5'
                    : 'bg-black/5'
              )}
            >
              <View
                className={cn(
                  'size-10 rounded-xl items-center justify-center',
                  a.primary
                    ? 'bg-black'
                    : isDark
                      ? 'bg-white/10'
                      : 'bg-white'
                )}
              >
                <StyledFeather
                  name={a.icon}
                  size={18}
                  className={a.primary ? 'text-[#FFD60A]' : 'text-foreground'}
                />
              </View>
              <View className="flex-1">
                <AppText
                  className={cn(
                    'text-sm font-bold',
                    a.primary ? 'text-black' : 'text-foreground'
                  )}
                >
                  {a.label}
                </AppText>
                <AppText
                  className={cn(
                    'text-xs',
                    a.primary ? 'text-black/70' : 'text-muted'
                  )}
                >
                  {a.desc}
                </AppText>
              </View>
              <StyledFeather
                name="chevron-right"
                size={16}
                className={a.primary ? 'text-black' : 'text-muted'}
              />
            </Pressable>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}
