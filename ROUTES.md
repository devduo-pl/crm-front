# Application Routes Guide

## ✅ Build Status
- **Build:** Successful
- **Warnings:** None (middleware deprecation fixed!)
- **Total Routes:** 11 pages across 2 locales

## Available Routes

### 🌍 Public Routes (Marketing/Landing)

#### English
- **`/`** or **`/en`** - Homepage
  - Header with Login button, language & theme switchers
  - CTA buttons to Sign Up and Dashboard
  - Uses default layout (no sidebar)

#### Spanish  
- **`/es`** - Homepage (Spanish)
  - Same as English but with Spanish translations

---

### 🔐 Authentication Routes

These routes use a **centered, minimal layout** without header/sidebar.

#### English
- **`/en/login`** - Login page
  - Email & password fields
  - Link to sign up page
  
- **`/en/signup`** - Sign up page
  - Name, email & password fields
  - Link to login page

#### Spanish
- **`/es/login`** - Login page (Spanish)
- **`/es/signup`** - Sign up page (Spanish)

---

### 📊 Dashboard Routes

These routes use a **sidebar + header layout** with full navigation.

#### English
- **`/en/dashboard`** - Main dashboard
  - Stats cards (contacts, companies, deals, revenue)
  - Recent activity section
  - Full sidebar navigation
  
#### Spanish
- **`/es/dashboard`** - Main dashboard (Spanish)

#### Future Dashboard Routes
These are in the sidebar but pages need to be created:
- `/en/dashboard/contacts` - Contacts management
- `/en/dashboard/companies` - Companies management  
- `/en/dashboard/deals` - Deals pipeline
- `/en/dashboard/settings` - Settings

---

## Route Structure

```
├── / (redirects to /en)
├── /en
│   ├── /                    # Homepage
│   ├── /login               # Auth layout
│   ├── /signup              # Auth layout
│   └── /dashboard           # Dashboard layout
│       ├── /                # Dashboard home
│       ├── /contacts        # (to be created)
│       ├── /companies       # (to be created)
│       ├── /deals           # (to be created)
│       └── /settings        # (to be created)
└── /es
    ├── /                    # Homepage
    ├── /login               # Auth layout
    ├── /signup              # Auth layout
    └── /dashboard           # Dashboard layout
```

## Layout Assignment

| Route Pattern | Layout Used |
|--------------|-------------|
| `/[locale]` | Public (no sidebar, simple header) |
| `/[locale]/login` | Auth (centered, minimal) |
| `/[locale]/signup` | Auth (centered, minimal) |
| `/[locale]/dashboard/*` | Dashboard (sidebar + header) |

## Navigation Between Routes

### From Homepage:
```typescript
<Link href="/login">Login</Link>
<Link href="/signup">Sign Up</Link>
<Link href="/dashboard">Dashboard</Link>
```

### From Login/Signup:
```typescript
<Link href="/login">Login</Link>
<Link href="/signup">Sign Up</Link>
```

### From Dashboard:
```typescript
<Link href="/dashboard">Dashboard</Link>
<Link href="/dashboard/contacts">Contacts</Link>
<Link href="/dashboard/companies">Companies</Link>
<Link href="/dashboard/deals">Deals</Link>
<Link href="/dashboard/settings">Settings</Link>
<Link href="/login">Logout</Link>
```

## Middleware & Routing

### ✅ Middleware Fixed!
- Renamed `middleware.ts` → **`proxy.ts`** (Next.js 16 convention)
- No more deprecation warnings
- Handles locale routing automatically

### Locale Handling
- Default locale: **en**
- Supported locales: **en**, **es**
- Always includes locale prefix in URL
- Middleware redirects `/` → `/en`

### Example Redirects:
- `/` → `/en`
- `/login` → `/en/login`
- `/dashboard` → `/en/dashboard`

## Adding New Routes

### 1. Public Page
```bash
# Create: app/[locale]/about/page.tsx
```

```typescript
import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('about');
  return <div>{t('title')}</div>;
}
```
**Result:** `/en/about`, `/es/about`

### 2. Auth Page
```bash
# Create: app/[locale]/(auth)/forgot-password/page.tsx
```

```typescript
export default function ForgotPasswordPage() {
  return <div>Forgot Password</div>;
}
```
**Result:** `/en/forgot-password` (uses auth layout)

### 3. Dashboard Page
```bash
# Create: app/[locale]/(dashboard)/dashboard/contacts/page.tsx
```

```typescript
export default function ContactsPage() {
  return <div>Contacts</div>;
}
```
**Result:** `/en/dashboard/contacts` (uses dashboard layout)

## Protected Routes

**⚠️ Currently, routes are NOT protected by authentication.**

To add protection:

1. Install auth library (NextAuth.js recommended)
2. Add auth check to `proxy.ts`:

```typescript
import { NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export default async function middleware(request) {
  // Check authentication for dashboard routes
  if (request.nextUrl.pathname.includes('/dashboard')) {
    const token = request.cookies.get('auth-token');
    
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Continue with i18n middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(es|en)/:path*']
};
```

## Translations

All routes support both languages. Add translations in:
- `messages/en.json`
- `messages/es.json`

### Current Translation Keys:
- `common.*` - Shared UI elements
- `home.*` - Homepage content
- `auth.*` - Login/signup pages
- `dashboard.*` - Dashboard pages

## Testing Routes

### Local Development:
```bash
npm run dev
```

Visit:
- http://localhost:3000 (→ redirects to /en)
- http://localhost:3000/en
- http://localhost:3000/es
- http://localhost:3000/en/login
- http://localhost:3000/en/dashboard

### Production Build:
```bash
npm run build
npm start
```

## Route Features

### ✅ Implemented:
- Internationalization (en/es)
- Theme switching (light/dark/system)
- Language switching  
- Separate layouts (public/auth/dashboard)
- Clean URLs (route groups)
- Type-safe navigation

### 🚧 To Implement:
- Authentication & protected routes
- Dashboard sub-pages (contacts, companies, deals, settings)
- Loading states
- Error boundaries
- 404 pages per locale
- Breadcrumbs in dashboard
- Mobile responsive sidebar

## Quick Reference

| I want to... | File to create |
|--------------|----------------|
| Add public page | `app/[locale]/pagename/page.tsx` |
| Add auth page | `app/[locale]/(auth)/pagename/page.tsx` |
| Add dashboard page | `app/[locale]/(dashboard)/dashboard/pagename/page.tsx` |
| Add translations | `messages/en.json` & `messages/es.json` |
| Modify sidebar | `app/[locale]/(dashboard)/layout.tsx` |
| Change auth styling | `app/[locale]/(auth)/layout.tsx` |

---

**✨ All routes are working perfectly with no build warnings or errors!**


