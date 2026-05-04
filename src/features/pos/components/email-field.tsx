import { Input, TextField, cn } from 'heroui-native';
import { useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { AppText } from '../../../components/app-text';

const DOMAIN_SUGGESTIONS = [
  'gmail.com',
  'outlook.com',
  'hotmail.com',
  'yahoo.com',
  'icloud.com',
];

interface EmailFieldProps {
  value: string;
  onChangeText: (next: string) => void;
  placeholder?: string;
  /** Hide the inline domain suggestions row. */
  hideSuggestions?: boolean;
  isInvalid?: boolean;
  className?: string;
}

/**
 * Email input with one-tap domain suggestions. As soon as the user types
 * `name@`, a horizontal row appears with `gmail.com`, `outlook.com`, … —
 * tapping one fills the rest. Saves a lot of typing on mobile.
 */
export function EmailField({
  value,
  onChangeText,
  placeholder = 'name@example.com',
  hideSuggestions = false,
  isInvalid,
  className,
}: EmailFieldProps) {
  const { localPart, hasAt, currentDomain } = useMemo(() => {
    const at = value.indexOf('@');

    if (at === -1) return { localPart: value, hasAt: false, currentDomain: '' };

    return {
      localPart: value.slice(0, at),
      hasAt: true,
      currentDomain: value.slice(at + 1),
    };
  }, [value]);

  const suggestions = useMemo(() => {
    if (!hasAt || !localPart) return [];
    if (!currentDomain) return DOMAIN_SUGGESTIONS;

    return DOMAIN_SUGGESTIONS.filter(
      (d) =>
        d.toLowerCase().startsWith(currentDomain.toLowerCase()) &&
        d.toLowerCase() !== currentDomain.toLowerCase()
    );
  }, [hasAt, localPart, currentDomain]);

  return (
    <View className={cn('gap-2', className)}>
      <TextField isInvalid={isInvalid}>
        <Input
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
        />
      </TextField>

      {!hideSuggestions && suggestions.length > 0 ? (
        <ScrollView
          horizontal
          keyboardShouldPersistTaps="handled"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {suggestions.map((domain) => (
            <Pressable
              key={domain}
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => onChangeText(`${localPart}@${domain}`)}
              className="rounded-full border border-border/50 bg-surface-secondary px-3 py-1.5"
            >
              <AppText className="text-xs font-medium text-foreground">
                @{domain}
              </AppText>
            </Pressable>
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}
