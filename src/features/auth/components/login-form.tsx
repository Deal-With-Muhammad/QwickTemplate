import Feather from '@expo/vector-icons/Feather';
import { Button, Input, TextField, cn } from 'heroui-native';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { withUniwind } from 'uniwind';

import { AppText } from '../../../components/app-text';

const StyledFeather = withUniwind(Feather);

export interface LoginFormProps {
  /** Pre-filled email — used by the /unlock screen. */
  defaultEmail?: string;
  /** When true, the email field is read-only (unlock flow). */
  emailLocked?: boolean;
  /** Submit label override. Defaults to "Sign in". */
  submitLabel?: string;
  /** Loading state from the parent (e.g. waiting on Appwrite). */
  isSubmitting?: boolean;
  /** Error message to display above the submit button. */
  errorMessage?: string | null;
  onSubmit: (creds: { email: string; password: string }) => void;
  onForgotPassword?: () => void;
}

/**
 * Reusable email + password form — used by both `/login` (first sign-in) and
 * the password fallback path on `/unlock`. Presentation only — the parent
 * handles auth and surfaces errors via `errorMessage`.
 */
export function LoginForm({
  defaultEmail = '',
  emailLocked = false,
  submitLabel = 'Sign in',
  isSubmitting = false,
  errorMessage = null,
  onSubmit,
  onForgotPassword,
}: LoginFormProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState('');

  useEffect(() => {
    setEmail(defaultEmail);
  }, [defaultEmail]);

  const canSubmit =
    email.trim().length > 0 && password.length > 0 && !isSubmitting;

  return (
    <View className="gap-5">
      <FieldRow icon="mail" label="Email">
        <TextField>
          <Input
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            editable={!emailLocked}
            keyboardType="email-address"
            placeholder="retailer@example.com"
            value={email}
            onChangeText={setEmail}
          />
        </TextField>
      </FieldRow>

      <FieldRow icon="lock" label="Password">
        <TextField>
          <Input
            autoCapitalize="none"
            autoComplete="password"
            autoCorrect={false}
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </TextField>
      </FieldRow>

      {errorMessage ? (
        <View
          className={cn(
            'rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3'
          )}
        >
          <AppText className="text-sm text-danger">{errorMessage}</AppText>
        </View>
      ) : null}

      <Button
        size="lg"
        isDisabled={!canSubmit}
        onPress={() =>
          canSubmit && onSubmit({ email: email.trim(), password })
        }
      >
        <Button.Label>
          {isSubmitting ? 'Signing in…' : submitLabel}
        </Button.Label>
      </Button>

      {onForgotPassword ? (
        <Button variant="ghost" size="sm" onPress={onForgotPassword}>
          <Button.Label>Forgot password?</Button.Label>
        </Button>
      ) : null}
    </View>
  );
}

interface FieldRowProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  children: React.ReactNode;
}

function FieldRow({ icon, label, children }: FieldRowProps) {
  return (
    <View className="gap-2">
      <View className="flex-row items-center gap-2">
        <StyledFeather name={icon} size={14} className="text-muted" />
        <AppText className="text-xs font-medium uppercase tracking-[2px] text-muted">
          {label}
        </AppText>
      </View>
      {children}
    </View>
  );
}
