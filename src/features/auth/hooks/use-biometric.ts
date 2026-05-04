import * as LocalAuthentication from 'expo-local-authentication';
import { useEffect, useState } from 'react';

export type BiometricKind = 'face' | 'fingerprint' | 'iris' | 'none';

export interface BiometricCapability {
  /** Hardware exists AND at least one credential is enrolled. */
  available: boolean;
  /** Best biometric kind the device can use right now. */
  primary: BiometricKind;
  /** Still resolving the capability check. */
  loading: boolean;
}

export type BiometricResult = LocalAuthentication.LocalAuthenticationResult;

function pickPrimary(
  types: LocalAuthentication.AuthenticationType[]
): BiometricKind {
  if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION))
    return 'face';
  if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT))
    return 'fingerprint';
  if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) return 'iris';

  return 'none';
}

/**
 * Detects what biometric the device supports and exposes a function to
 * trigger the prompt. `available: false` when:
 *   - the native module isn't compiled in (Expo Go),
 *   - the device has no biometric hardware, or
 *   - no credentials are enrolled.
 *
 * Every native call is wrapped in try/catch so the loading spinner never
 * gets stuck — Expo Go falls through to `available: false` and the unlock
 * screen shows the password form instead.
 */
export function useBiometric(): BiometricCapability & {
  authenticate: (options?: {
    promptMessage?: string;
  }) => Promise<BiometricResult>;
} {
  const [state, setState] = useState<BiometricCapability>({
    available: false,
    primary: 'none',
    loading: true,
  });

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const [hasHardware, enrolled, types] = await Promise.all([
          LocalAuthentication.hasHardwareAsync(),
          LocalAuthentication.isEnrolledAsync(),
          LocalAuthentication.supportedAuthenticationTypesAsync(),
        ]);

        if (!active) return;
        setState({
          available: hasHardware && enrolled,
          primary: pickPrimary(types),
          loading: false,
        });
      } catch (err) {
        if (!active) return;
        // Expo Go reaches this branch — native module isn't bundled.
        console.warn('[biometric] capability check unavailable:', err);
        setState({ available: false, primary: 'none', loading: false });
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const authenticate = async (
    options?: { promptMessage?: string }
  ): Promise<BiometricResult> => {
    try {
      return await LocalAuthentication.authenticateAsync({
        promptMessage: options?.promptMessage ?? 'Unlock Qwuik',
        fallbackLabel: 'Use password',
        disableDeviceFallback: false,
        cancelLabel: 'Cancel',
      });
    } catch (err: any) {
      // Native module unavailable — surface it as a regular auth failure
      // so the unlock screen drops to the password form.
      console.warn('[biometric] authenticate failed:', err);

      return {
        success: false,
        error: 'unknown',
        warning: err?.message,
      } as BiometricResult;
    }
  };

  return { ...state, authenticate };
}
