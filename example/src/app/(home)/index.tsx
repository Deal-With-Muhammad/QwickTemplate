import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Card, Chip, cn } from 'heroui-native';
import type { FC } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
} from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { AppText } from '../../components/app-text';
import { ScreenScrollView } from '../../components/screen-scroll-view';
import { useAppTheme } from '../../contexts/app-theme-context';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const StyledFeather = withUniwind(Feather);

type AppUIProps = {
  title: string;
  subtitle: string;
  tagline: string;
  path: string;
  accent: 'yellow' | 'dark' | 'outlined';
};

const cards: AppUIProps[] = [
  {
    title: 'App UI 1',
    subtitle: 'Classic & Clean',
    tagline:
      'Professional POS with familiar patterns. Ideal for quick onboarding.',
    path: '/app-ui-1',
    accent: 'yellow',
  },
  {
    title: 'App UI 2',
    subtitle: 'Bold & Expressive',
    tagline:
      'Neobrutalist design with strong yellow blocks and chunky buttons.',
    path: '/app-ui-2',
    accent: 'dark',
  },
  {
    title: 'App UI 3',
    subtitle: 'Minimal & Modern',
    tagline:
      'Quiet, airy layout with soft surfaces and precise micro-typography.',
    path: '/app-ui-3',
    accent: 'outlined',
  },
];

const AppUICard: FC<AppUIProps & { index: number }> = ({
  title,
  subtitle,
  tagline,
  path,
  accent,
  index,
}) => {
  const router = useRouter();
  const { isDark } = useAppTheme();

  const isYellow = accent === 'yellow';
  const isSolidDark = accent === 'dark';

  return (
    <AnimatedPressable
      entering={FadeInDown.duration(350)
        .delay(index * 120)
        .easing(Easing.out(Easing.ease))}
      onPress={() => router.push(path)}
    >
      <Card
        className={cn(
          'p-0 overflow-hidden border',
          isYellow && 'bg-[#FFD60A] border-[#FFD60A]',
          isSolidDark &&
            (isDark
              ? 'bg-white border-white'
              : 'bg-black border-black'),
          accent === 'outlined' &&
            (isDark
              ? 'bg-transparent border-white/20'
              : 'bg-transparent border-black/15')
        )}
      >
        <View className="p-5 gap-6">
          <View className="flex-row items-start justify-between">
            <Chip
              size="sm"
              className={cn(
                isYellow && 'bg-black/10',
                isSolidDark && (isDark ? 'bg-black/10' : 'bg-white/15'),
                accent === 'outlined' &&
                  (isDark ? 'bg-white/10' : 'bg-black/5')
              )}
            >
              <Chip.Label
                className={cn(
                  'uppercase tracking-widest text-[10px]',
                  isYellow && 'text-black',
                  isSolidDark && (isDark ? 'text-black' : 'text-white'),
                  accent === 'outlined' &&
                    (isDark ? 'text-white' : 'text-black')
                )}
              >
                {subtitle}
              </Chip.Label>
            </Chip>
            <View
              className={cn(
                'size-10 rounded-2xl items-center justify-center',
                isYellow && 'bg-black',
                isSolidDark && (isDark ? 'bg-black' : 'bg-[#FFD60A]'),
                accent === 'outlined' && 'bg-[#FFD60A]'
              )}
            >
              <StyledFeather
                name="arrow-up-right"
                size={20}
                className={cn(
                  isYellow && 'text-[#FFD60A]',
                  isSolidDark && (isDark ? 'text-[#FFD60A]' : 'text-black'),
                  accent === 'outlined' && 'text-black'
                )}
              />
            </View>
          </View>

          <View className="gap-2 pt-8">
            <AppText
              className={cn(
                'text-4xl font-bold tracking-tight',
                isYellow && 'text-black',
                isSolidDark && (isDark ? 'text-black' : 'text-white'),
                accent === 'outlined' &&
                  (isDark ? 'text-white' : 'text-black')
              )}
              maxFontSizeMultiplier={1.5}
            >
              {title}
            </AppText>
            <AppText
              className={cn(
                'text-sm',
                isYellow && 'text-black/70',
                isSolidDark && (isDark ? 'text-black/70' : 'text-white/70'),
                accent === 'outlined' &&
                  (isDark ? 'text-white/60' : 'text-black/60')
              )}
            >
              {tagline}
            </AppText>
          </View>

          <View
            className={cn(
              'flex-row items-center gap-2 pt-2 border-t pt-4',
              isYellow && 'border-black/10',
              isSolidDark && (isDark ? 'border-black/10' : 'border-white/15'),
              accent === 'outlined' &&
                (isDark ? 'border-white/10' : 'border-black/10')
            )}
          >
            <StyledFeather
              name="play-circle"
              size={14}
              className={cn(
                isYellow && 'text-black/80',
                isSolidDark && (isDark ? 'text-black/80' : 'text-white/80'),
                accent === 'outlined' &&
                  (isDark ? 'text-white/80' : 'text-black/80')
              )}
            />
            <AppText
              className={cn(
                'text-xs font-medium',
                isYellow && 'text-black/80',
                isSolidDark && (isDark ? 'text-black/80' : 'text-white/80'),
                accent === 'outlined' &&
                  (isDark ? 'text-white/80' : 'text-black/80')
              )}
            >
              Tap to preview full flow · login → checkout
            </AppText>
          </View>
        </View>
      </Card>
    </AnimatedPressable>
  );
};

export default function App() {
  const { isDark } = useAppTheme();

  return (
    <ScreenScrollView>
      <View className="mt-2 mb-6 items-center gap-2">
        <View className="flex-row items-center gap-2">
          <View className="size-2 rounded-full bg-[#FFD60A]" />
          <AppText className="text-muted text-xs uppercase tracking-[3px] font-medium">
            Retailer POS · v1.0.0
          </AppText>
          <View className="size-2 rounded-full bg-[#FFD60A]" />
        </View>
        <AppText
          className="text-3xl font-bold text-foreground text-center"
          maxFontSizeMultiplier={1.5}
        >
          Pick your Qwuik flavor
        </AppText>
        <AppText className="text-sm text-muted text-center px-6">
          Three full flows — login, scan, loyalty, checkout, receipt — with
          different UI personalities.
        </AppText>
      </View>

      <View className="gap-5">
        {cards.map((card, index) => (
          <AppUICard key={card.title} {...card} index={index} />
        ))}
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </ScreenScrollView>
  );
}
