import { Image, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import LogoDark from '../../assets/logo-dark.png';
import LogoLight from '../../assets/logo-light.png';
import { useAppTheme } from '../contexts/app-theme-context';

// Q-only icon SVG (the cursor-shaped Q from assets/icon.svg).
// We use react-native-svg's SvgXml so the `fg` color tracks light/dark theme.
const qIconXml = (fg: string) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 314.13 209.55" fill="none">
  <path fill="${fg}" d="M230.69,56.94a2,2,0,0,0-2-2.56H67.4a2,2,0,0,0-2,2.56l24.65,96.17a3.05,3.05,0,0,0,3,2h100l8.42,11.1a6,6,0,0,0,4.24,2.11h17.8c1.45,0,1.91-.94,1-2.09l-16.44-21.08a11.35,11.35,0,0,0,.41-1.73,19.35,19.35,0,0,1,.57-2.56Zm-31.44,21L188.53,120l-7-8.94a6.14,6.14,0,0,0-4.27-2.09H160.72c-1.45,0-1.92.95-1,2.11l17.56,23.13H111.18s-.28-1.16-.64-2.57L96.84,77.9a2,2,0,0,1,2-2.56h98.43A2,2,0,0,1,199.25,77.9Z"/>
  <path fill="#FDDA00" d="M263.48,76.92H245.89a.53.53,0,0,1-.53-.53V41.7a.53.53,0,0,0-.53-.53H208.18a.53.53,0,0,1-.53-.53V23.05a.53.53,0,0,1,.53-.53h55.31a.53.53,0,0,1,.53.53V76.39A.53.53,0,0,1,263.48,76.92Z"/>
  <path fill="#FDDA00" d="M101.16,187H45.85a.53.53,0,0,1-.53-.53V133.16a.53.53,0,0,1,.53-.53H63.44a.53.53,0,0,1,.53.53v34.69a.53.53,0,0,0,.53.53h36.66a.53.53,0,0,1,.53.53v17.59A.53.53,0,0,1,101.16,187Z"/>
</svg>
`;

type QwuikLogoProps = {
  variant?: 'icon' | 'wordmark';
  /** Width in points. Height is derived from the intrinsic aspect ratio. */
  size?: number;
  /** Override foreground color of the cursor-Q (icon only). Defaults to theme foreground. */
  color?: string;
};

/**
 * Qwuik brand mark.
 * - `icon`     → the standalone cursor-Q glyph (from assets/icon.svg).
 *                Aspect ratio ≈ 314.13 / 209.55 = 1.5.
 * - `wordmark` → the full "Qwuik" logo (Q + wordmark).
 *                Uses logo-dark.png on light mode and logo-light.png on dark mode.
 *                Aspect ratio 720 / 318 = 2.264.
 */
export function QwuikLogo({
  variant = 'wordmark',
  size = 120,
  color,
}: QwuikLogoProps) {
  const { isDark } = useAppTheme();

  if (variant === 'icon') {
    const iconAspect = 314.13 / 209.55; // ≈ 1.499
    const height = size / iconAspect;
    const fg = color ?? (isDark ? '#FFFFFF' : '#0B0B0F');
    return (
      <View style={{ width: size, height }}>
        <SvgXml xml={qIconXml(fg)} width={size} height={height} />
      </View>
    );
  }

  // wordmark
  const wordmarkAspect = 720 / 318; // ≈ 2.264
  const height = size / wordmarkAspect;
  return (
    <Image
      source={isDark ? LogoLight : LogoDark}
      style={{ width: size, height }}
      resizeMode="contain"
    />
  );
}
