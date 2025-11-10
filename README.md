# DevDuo CRM

A modern Next.js CRM application with internationalization, theming, and state management.

## Features

- 🌍 **Internationalization (i18n)** - Multi-language support using next-intl with JSON translation files
- 🎨 **Theme Support** - Light/Dark/System theme switching with next-themes
- 🔄 **State Management** - Global state management with Zustand
- 🎯 **shadcn/ui** - Beautiful UI components built with Radix UI and Tailwind CSS
- ⚡ **Next.js 16** - Built with the latest Next.js App Router
- 📱 **Responsive Design** - Mobile-first responsive design

## Tech Stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Internationalization:** next-intl
- **Theme Management:** next-themes
- **State Management:** Zustand
- **Icons:** lucide-react

## Project Structure

```
├── app/
│   ├── [locale]/          # Locale-based routing
│   │   ├── layout.tsx     # Locale layout with providers
│   │   └── page.tsx       # Home page
│   ├── globals.css        # Global styles with theme variables
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── language-switcher.tsx
│   └── theme-switcher.tsx
├── i18n/
│   ├── request.ts         # i18n request configuration
│   └── routing.ts         # Locale routing configuration
├── lib/
│   └── utils.ts           # Utility functions
├── messages/
│   ├── en.json            # English translations
│   └── es.json            # Spanish translations
├── providers/
│   └── theme-provider.tsx # Theme provider component
├── store/
│   ├── useLanguageStore.ts
│   └── useThemeStore.ts
└── middleware.ts          # Next.js middleware for i18n
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application. You'll be redirected to `/en` (default locale).

### Build

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Adding New Languages

1. Add the locale to `i18n/routing.ts`:

```typescript
export const routing = defineRouting({
  locales: ['en', 'es', 'fr'], // Add 'fr'
  defaultLocale: 'en',
  localePrefix: 'always'
});
```

2. Create a new translation file in `messages/`:

```bash
messages/fr.json
```

3. Add translations following the same structure as existing files.

## Adding New Translations

Edit the JSON files in the `messages/` directory:

```json
// messages/en.json
{
  "common": {
    "welcome": "Welcome",
    "home": "Home"
  },
  "home": {
    "title": "Welcome to DevDuo CRM"
  }
}
```

Use translations in components:

```typescript
import { useTranslations } from 'next-intl';

export default function Component() {
  const t = useTranslations('common');
  return <h1>{t('welcome')}</h1>;
}
```

## Theme Customization

Edit theme colors in `app/globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --primary: 0 0% 9%;
  /* ... more theme variables */
}

.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  /* ... dark mode colors */
}
```

## Adding shadcn/ui Components

```bash
npx shadcn@latest add [component-name]
```

Example:

```bash
npx shadcn@latest add card
npx shadcn@latest add dialog
```

## State Management with Zustand

Create a new store:

```typescript
// store/useExampleStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ExampleStore {
  count: number;
  increment: () => void;
}

export const useExampleStore = create<ExampleStore>()(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),
    {
      name: 'example-storage',
    }
  )
);
```

Use in components:

```typescript
import { useExampleStore } from '@/store/useExampleStore';

export default function Component() {
  const { count, increment } = useExampleStore();
  return <button onClick={increment}>Count: {count}</button>;
}
```

## Available Routes

- `/en` - English version (default)
- `/es` - Spanish version

## Environment Variables

Create a `.env.local` file for environment-specific configuration:

```env
# Add your environment variables here
NEXT_PUBLIC_API_URL=your_api_url
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
