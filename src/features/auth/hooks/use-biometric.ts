import * as LocalAuthentication from 'expo-local-authentication';
import { useEffect, useState } from 'react';

export type BiometricKind = 'face' | 'fingerprint' | 'iris' | 'none';

export interface BiometricCapability {
  /** Hardware exists AND at least one credential is enrolled. */
  available: boolean;
  /** Best biometric kind the device can use right now. */
  primary: BiometricKind;
  loading: boolean;
}

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
 * Detects what (if any) biometric the device supports and exposes a function
 * to actually trigger the prompt. Returns `available: false` when:
 *   - the device has no biometric hardware, or
 *   - the user hasn't enrolled any credentials.
 *
 * Callers should fall back to a password prompt in that case.
 */
export function useBiometric(): BiometricCapability & {
  authenticate: (options?: {
    promptMessage?: string;
  }) => Promise<LocalAuthentication.LocalAuthenticationResult>;
} {
  const [state, setState] = useState<BiometricCapability>({
    available: false,
    primary: 'none',
    loading: true,
  });

  useEffect(() => {
    let active = true;

    (async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const types =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

      if (!active) return;
      setState({
        available: hasHardware && enrolled,
        primary: pickPrimary(types),
        loading: false,
      });
    })();

    return () => {
      active = false;
    };
  }, []);

  const authenticate = async (options?: { promptMessage?: string }) => {
    return LocalAuthentication.authenticateAsync({
      promptMessage: options?.promptMessage ?? 'Unlock Qwuik',
      fallbackLabel: 'Use password',
      disableDeviceFallback: false,
      cancelLabel: 'Cancel',
    });
  };

  return { ...state, authenticate };
}
