import { memo } from 'react';
import type { ComponentType } from 'react';

import { useSettings } from '../settings/contexts/settings-context';
import type { UiVariant } from '../settings/types';

export type VariantMap = Partial<Record<UiVariant, ComponentType>>;

interface ResolveVariantProps {
  /** One component per variant. Missing entries fall back to `fallback`. */
  variants: VariantMap;
  /** Default variant to render when the active one isn't in `variants`. */
  fallback: UiVariant;
}

/**
 * Picks and renders the variant component matching the user's current
 * `uiVariant` from Settings. Memoised so unrelated re-renders of the parent
 * don't cause the variant to remount — only an actual variant change does.
 *
 * Live-swap behaviour: when the user toggles a variant in /settings the
 * SettingsContext value changes, every consumer re-renders, and this resolver
 * picks up the new component in-place. No navigation, no route change, the
 * containing Stack screen and header stay mounted — so the swap feels
 * instantaneous even on low-end Android devices.
 */
export const ResolveVariant = memo(function ResolveVariant({
  variants,
  fallback,
}: ResolveVariantProps) {
  const { settings } = useSettings();
  const Active = variants[settings.uiVariant] ?? variants[fallback];

  if (!Active) return null;

  return <Active />;
});
