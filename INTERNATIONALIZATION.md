# Internationalization (i18n) Guide

This project uses `next-intl` for internationalization support with English and Polish languages.

## 🔄 Architecture

The i18n system is structured with a **client-side provider at the root level**, which means:

- ✅ **All pages have access to translations** (including auth pages)
- ✅ **Automatic locale detection** from URL pathname
- ✅ **Dynamic message loading** based on current locale
- ✅ **Fallback to default locale** if translations fail to load

## ✅ Implementation Status

### Root & Auth Pages - **COMPLETED** ✅

- ✅ Root page (`/`) - Loading state
- ✅ Login page - Complete translation including form fields, buttons, messages
- ✅ Forgot password page - All text and notifications
- ✅ Reset password page - Form validation, success/error messages
- ✅ Verify account page - Status messages

### Dashboard Pages - **PARTIALLY COMPLETED** 🔄

- ✅ **Dashboard Navigation & Layout** - Sidebar, UserMenu, navigation items
- ✅ **Main Dashboard Page** - Account info cards, status indicators
- ✅ **Users Management Page** - Complete with table, forms, actions, notifications
- ⏳ **Companies Management Page** - Ready for translation (structure exists)
- ⏳ **Roles Management Page** - Ready for translation (structure exists)

### Translation Infrastructure - **COMPLETED** ✅

- ✅ **115+ translation keys** added across 7 namespaces
- ✅ **Complete English translations** with user-friendly text
- ✅ **Complete Polish translations** with proper localization
- ✅ **TypeScript support** with full intellisense and validation
- ✅ **Utility hooks** for each namespace (dashboard, users, companies, roles, etc.)

### 📋 **Remaining Work for Companies & Roles Pages**
The translation keys are ready, but the components need to be updated to use:
```tsx
// Companies Page - Update these:
const tCompanies = useCompaniesTranslations();
const tTable = useTableTranslations();
const tCommon = useCommonTranslations();

// Similar pattern for Roles Page
const tRoles = useRolesTranslations();
```

Both pages follow the exact same pattern as the completed Users page.

## 🌍 Supported Languages

- English (`en`) - Default language
- Polish (`pl`)

## 📁 File Structure

```
├── i18n.ts                     # Main i18n configuration
├── locales/
│   ├── en.json                 # English translations
│   └── pl.json                 # Polish translations
├── app/
│   ├── [locale]/               # Locale-based routing
│   │   ├── layout.tsx          # Simple locale layout (passthrough)
│   │   └── ...                 # All your pages
│   └── layout.tsx              # Root layout with Providers
├── providers/
│   ├── Providers.tsx           # Main providers wrapper
│   └── IntlProvider.tsx        # Client-side i18n provider
├── hooks/
│   ├── useLanguage.ts          # Language switching hook
│   └── useTranslations.ts      # Translation utilities
└── lib/
    └── i18n-utils.ts           # i18n utility functions
```

## 🔧 Usage

### Using Translations in Components

#### Method 1: Using the general hook

```tsx
import { useTranslations } from "@/hooks/useTranslations";

export function MyComponent() {
  const t = useTranslations("common");

  return <button>{t("save")}</button>;
}
```

#### Method 2: Using namespace-specific hooks

```tsx
import {
  useCommonTranslations,
  useAuthTranslations,
} from "@/hooks/useTranslations";

export function MyComponent() {
  const tCommon = useCommonTranslations();
  const tAuth = useAuthTranslations();

  return (
    <div>
      <button>{tCommon("save")}</button>
      <h1>{tAuth("login")}</h1>
    </div>
  );
}
```

### Language Switching

```tsx
import { useLanguage } from "@/hooks/useLanguage";

export function LanguageSwitcher() {
  const {
    currentLocale,
    switchToEnglish,
    switchToPolish,
    switchLanguage,
    isEnglish,
    isPolish,
  } = useLanguage();

  return (
    <div>
      <button onClick={switchToEnglish} disabled={isEnglish}>
        English
      </button>
      <button onClick={switchToPolish} disabled={isPolish}>
        Polski
      </button>
      {/* Or use the general switch function */}
      <button onClick={() => switchLanguage("en")}>EN</button>
    </div>
  );
}
```

### Server Components

For server components, use the `getTranslations` function from next-intl:

```tsx
import { getTranslations } from "next-intl/server";

export default async function ServerComponent() {
  const t = await getTranslations("common");

  return <h1>{t("loading")}</h1>;
}
```

## 📝 Adding New Translations

### 1. Add to Translation Files

Add new keys to both `locales/en.json` and `locales/pl.json`:

```json
// locales/en.json
{
  "navigation": {
    "home": "Home",
    "about": "About"
  }
}

// locales/pl.json
{
  "navigation": {
    "home": "Strona główna",
    "about": "O nas"
  }
}
```

### 2. Update TypeScript Types

Update the `TranslationKeys` type in `hooks/useTranslations.ts`:

```tsx
export type TranslationKeys = {
  // ... existing keys
  navigation:
    | "home"
    | "about"
    | "dashboard"
    | "users"
    | "companies"
    | "roles"
    | "settings";
};
```

### 3. Create Utility Hook (Optional)

Add a new utility hook for the namespace:

```tsx
export function useNavigationTranslations() {
  return useNextIntlTranslations("navigation");
}
```

## 🔀 Routing

The application uses locale-based routing:

- `/` → Default locale (English)
- `/en/dashboard` → English dashboard
- `/pl/dashboard` → Polish dashboard

The middleware automatically handles:

- Locale detection from URL
- Redirecting to appropriate locale
- Preserving locale in authentication redirects

## 🛠️ Configuration

### Changing Default Locale

Update `i18n.ts`:

```tsx
export const defaultLocale: Locale = "pl"; // Change to Polish
```

### Adding New Locales

1. Add to `i18n.ts`:

```tsx
export const locales = ["en", "pl", "de"] as const;
```

2. Create translation file:

```bash
touch locales/de.json
```

3. Add translations to the new file following the same structure.

## 🎯 Best Practices

1. **Namespace Organization**: Group related translations into namespaces (common, auth, navigation, etc.)

2. **Key Naming**: Use camelCase for keys and be descriptive:

   ```json
   {
     "forms": {
       "emailValidationError": "Please enter a valid email address",
       "passwordTooShort": "Password must be at least 8 characters"
     }
   }
   ```

3. **Placeholders**: Use ICU message format for dynamic content:

   ```json
   {
     "welcome": "Welcome back, {name}!"
   }
   ```

4. **TypeScript**: Always update the `TranslationKeys` type when adding new namespaces or keys.

5. **Testing**: Test your application in both languages to ensure proper text rendering and layout.

## 🔍 Example Component

See `components/examples/LanguageSwitcher.tsx` for a complete example of how to implement language switching in your components.

## 🚀 Development

To add the language switcher to your application, import and use the example component:

```tsx
import { LanguageSwitcher } from "@/components/examples/LanguageSwitcher";

export function Header() {
  return (
    <header>
      <nav>
        {/* Your navigation */}
        <LanguageSwitcher />
      </nav>
    </header>
  );
}
```

## 📚 Additional Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [ICU Message Format](https://formatjs.io/docs/core-concepts/icu-syntax/)
- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
