# Qwuik Mobile POS

Expo (React Native) point-of-sale app for Qwuik retailers. Built with HeroUI
Native + uniwind + Tailwind CSS, backed by the same Appwrite project as the
`AdminPanel/NewAdmin` web admin.

## Tech stack

- **Expo** SDK 54 + **expo-router** (file-based routes)
- **HeroUI Native** components, uniwind / Tailwind CSS for styling
- **Appwrite** auth + database (`react-native-appwrite` SDK)
- **expo-local-authentication** — Face ID / Touch ID / Fingerprint
- **expo-secure-store** — encrypted credential storage
- **@react-native-async-storage/async-storage** — non-sensitive prefs

## Setup

```bash
npm install
cp .env.example .env       # then fill in the Appwrite values
```

Required environment variables (all prefixed `EXPO_PUBLIC_`):

| Var | Notes |
|---|---|
| `EXPO_PUBLIC_APPWRITE_ENDPOINT` | e.g. `https://nyc.cloud.appwrite.io/v1` |
| `EXPO_PUBLIC_APPWRITE_PROJECT_ID` | Appwrite project id |
| `EXPO_PUBLIC_APPWRITE_DATABASE_ID` | `default` in our setup |
| `EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID` | `user` |
| `EXPO_PUBLIC_APPWRITE_STORES_COLLECTION_ID` | `store` |
| `EXPO_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID` | `order` |
| `EXPO_PUBLIC_APPWRITE_DISCOUNTS_COLLECTION_ID` | `discounts` |
| `EXPO_PUBLIC_APPWRITE_LOYALTY_CARDS_COLLECTION_ID` | `loyalty_cards` |
| `EXPO_PUBLIC_APPWRITE_PLATFORM` | iOS bundle id (must match Appwrite Platform) |

In **Appwrite Console → Your Project → Settings → Platforms**, register
`com.qwuik.app` (iOS) and `com.qwuik.android` (Android) so the SDK is
authorised.

## Run

```bash
npm run ios          # iOS simulator
npm run android      # Android emulator
npm run web          # web preview (biometric is no-op on web)
npm start            # interactive Expo dev server

npm run build:ios    # EAS production build
npm run submit:ios   # build + auto-submit to App Store
```

## Auth flow

| Trigger | Behaviour |
|---|---|
| First launch (no creds saved) | `/login` — email + password against Appwrite |
| Successful sign-in | Profile loaded, role checked. **Only `retailer` is allowed**; any other role is rejected. Credentials are saved to SecureStore. |
| Subsequent launches (creds saved, biometric ON in Settings) | `/unlock` — biometric prompt opens automatically. After success, the existing Appwrite session is reused (no extra round-trip) unless it has expired. |
| Subsequent launches (creds saved, biometric OFF) | If the Appwrite session is still valid → straight to dashboard. If it expired → `/unlock` with the password form. |
| Biometric unavailable / cancelled / failed | Same `/unlock` screen falls back to a password-only form (email is locked to the saved email) |
| `Sign out` from Settings | Clears the Appwrite session **and** SecureStore — next launch is treated as first launch |

The biometric-ON policy is sampled on each fresh launch — toggling the
Settings switch takes effect on the **next** app launch, not in-place. That
matches user expectation for a security setting.

There is no sign-up flow in the app — accounts are provisioned by an admin
through the web admin panel.

### Platform support

| Runtime | Login | Biometric unlock |
|---|---|---|
| **Expo Go** | ❌ — `react-native-appwrite` is a native module, not bundled in Expo Go | ❌ — `expo-local-authentication` is a native module |
| **iOS dev / preview / production build** | ✅ | ✅ (Face ID / Touch ID; the prompt label comes from the `faceIDPermission` we set in `app.json`) |
| **Android dev / preview / production build** | ✅ | ✅ (Fingerprint / Face Unlock; uses the `USE_BIOMETRIC` + `USE_FINGERPRINT` permissions in `app.json`) |
| **Web preview** | ✅ (Appwrite over fetch) | ❌ — biometric module is no-op; password fallback is automatic |

In short: **you must use a development build or preview APK to test
auth/biometric.** Expo Go cannot run this app. See "Run" above —
`eas build --profile preview --platform android` produces an installable APK.

## App appearance / UI variants

The app ships with **four UI variants** for the same POS flow:

| Variant | Style | Default? |
|---|---|---|
| `ui-1` | Classic & Clean | |
| `ui-2` | Bold & Expressive | |
| **`ui-3`** | **Minimal & Modern** | ✅ |
| `ui-4` | Square & Geometric | |

Users switch variants from **Settings → App appearance**. The choice is
persisted to AsyncStorage and applied on next route resolution.

> **App UI 5** is intentionally disabled. The folder is preserved on disk at
> `src/app/(home)/app-ui-5/` for future re-enable. To bring it back: uncomment
> the entry in `src/features/settings/types.ts` and re-add the
> `<Stack.Screen name="app-ui-5" />` block in `src/app/(home)/_layout.tsx`.

## Project layout

```
.
├── app.json
├── babel.config.js
├── metro.config.js
├── global.css              tailwind / uniwind / heroui-native styles
├── package.json
├── tsconfig.json
├── assets/                 fonts, logos, splash icons
├── themes/                 uniwind theme CSS files
└── src/
    ├── app/                          expo-router routes
    │   ├── _layout.tsx               root providers (theme, settings, auth, …)
    │   └── (home)/
    │       ├── _layout.tsx           Stack config
    │       ├── index.tsx             auth-aware splash → /login | /unlock | /<variant>/dashboard
    │       ├── login.tsx             first-time email + password
    │       ├── unlock.tsx            biometric + password fallback
    │       ├── settings.tsx          UI variant + biometric prefs + sign out
    │       ├── app-ui-1/             POS flow variants (dashboard / scan / cart …)
    │       ├── app-ui-2/
    │       ├── app-ui-3/             default
    │       ├── app-ui-4/
    │       └── app-ui-5/             disabled — left on disk for later
    ├── features/
    │   ├── auth/
    │   │   ├── components/
    │   │   │   └── login-form.tsx    reusable email + password form
    │   │   ├── contexts/auth-context.tsx
    │   │   ├── hooks/use-biometric.ts
    │   │   ├── services/auth-service.ts
    │   │   └── types.ts              Role, RetailerUser, AuthError
    │   └── settings/
    │       ├── contexts/settings-context.tsx
    │       └── types.ts              UiVariant, AppSettings, defaults
    ├── shared/
    │   └── lib/
    │       ├── appwrite/
    │       │   ├── client.ts         shared Appwrite Client / Account / Databases
    │       │   └── config.ts         env-driven config
    │       ├── secure-storage.ts     SecureStore wrapper for credentials
    │       └── storage.ts            AsyncStorage wrapper for prefs
    ├── components/                   shared UI primitives (kept from template)
    ├── contexts/                     theme context (kept from template)
    └── helpers/                      shared utilities (kept from template)
```

### Conventions

- **Feature-based** organisation under `src/features/<feature>/` —
  `components/`, `contexts/`, `hooks/`, `services/`, `types.ts`. UI is kept
  separate from data (services) and logic (hooks/contexts).
- **kebab-case** filenames, **PascalCase** component exports,
  **camelCase** functions.
- Files **≤ 500 lines** — break out subcomponents when bigger.
- ESLint + Prettier are set up at the repo root.

## Known TS issues

`tsc --noEmit` reports 2 type errors that pre-date the auth work — both
in showcase code, not on the auth path:

- `src/components/select/placement-select.tsx:99`
- `src/components/showcases/raycast/model-select/select-item.tsx:22`

Worth fixing when you have a moment.

## Roadmap (next phases)

- **POS feature**: extract `dashboard / scan / cart / loyalty / payment /
  receipt` into `src/features/pos/` so each variant becomes a thin route shell
  composing shared business logic
- **Tests**: Jest + React Native Testing Library smoke tests for auth-context,
  biometric hook, settings persistence
- **Sync queue**: offline order queue with Appwrite sync once connection is
  restored
