/**
 * Available UI variants — each one maps to an `app-ui-{N}` route folder.
 * UI 5 is intentionally commented out for now (per current scope).
 */
export type UiVariant = 'ui-1' | 'ui-2' | 'ui-3' | 'ui-4'; // | 'ui-5'

export interface UiVariantOption {
  id: UiVariant;
  label: string;
  description: string;
  /** Route segment under /app-ui-{N}/ — e.g. /app-ui-3/dashboard. */
  routeSegment: string;
}

export const UI_VARIANTS: UiVariantOption[] = [
  {
    id: 'ui-1',
    label: 'Classic & Clean',
    description: 'Familiar patterns with a strong yellow accent.',
    routeSegment: 'app-ui-1',
  },
  {
    id: 'ui-2',
    label: 'Bold & Expressive',
    description: 'Neobrutalist blocks, chunky buttons, high contrast.',
    routeSegment: 'app-ui-2',
  },
  {
    id: 'ui-3',
    label: 'Minimal & Modern',
    description: 'Quiet, airy layout with thin strokes (default).',
    routeSegment: 'app-ui-3',
  },
  {
    id: 'ui-4',
    label: 'Square & Geometric',
    description: 'Hard edges, grid layouts, industrial feel.',
    routeSegment: 'app-ui-4',
  },
  // {
  //   id: 'ui-5',
  //   label: 'Command Center',
  //   description: 'Tab bar with FAB · accordion checkout · analytics.',
  //   routeSegment: 'app-ui-5',
  // },
];

export const DEFAULT_UI_VARIANT: UiVariant = 'ui-3';

export interface AppSettings {
  uiVariant: UiVariant;
  /** Whether the user has opted into biometric unlock for the next session. */
  biometricEnabled: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  uiVariant: DEFAULT_UI_VARIANT,
  biometricEnabled: true,
};
