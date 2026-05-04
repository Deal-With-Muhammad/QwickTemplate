import type { ReactNode } from 'react';
import { Platform } from 'react-native';
import {
  KeyboardAwareScrollView,
  type KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface KeyboardSafeScreenProps {
  children: ReactNode;
  /** Extra space to keep above the focused input. Defaults to 24. */
  bottomOffset?: number;
  /** Hide the scroll indicator. True by default. */
  hideScrollIndicator?: boolean;
  /** Forwarded to the underlying contentContainerStyle. */
  contentContainerStyle?: KeyboardAwareScrollViewProps['contentContainerStyle'];
  /** Skip the safe-area top padding (e.g. when there's a header above). */
  withoutTopInset?: boolean;
  className?: string;
}

/**
 * Wraps form-bearing screens. Auto-scrolls the focused input above the
 * keyboard on both platforms — fixes the "keyboard covers the input" bug.
 *
 * Use this on every screen that has a TextInput. For pure read-only screens
 * (dashboard, scan results, receipt summary) the existing ScreenScrollView
 * is fine.
 */
export function KeyboardSafeScreen({
  children,
  bottomOffset = 24,
  hideScrollIndicator = true,
  contentContainerStyle,
  withoutTopInset = false,
  className,
}: KeyboardSafeScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAwareScrollView
      bottomOffset={bottomOffset}
      className={className}
      contentContainerStyle={[
        {
          flexGrow: 1,
          paddingTop: withoutTopInset ? 0 : insets.top + 8,
          paddingBottom: insets.bottom + 24,
        },
        contentContainerStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={!hideScrollIndicator}
      // iOS auto-scroll feels best with extraKeyboardSpace at 0; Android needs a nudge
      extraKeyboardSpace={Platform.OS === 'android' ? 12 : 0}
    >
      {children}
    </KeyboardAwareScrollView>
  );
}
