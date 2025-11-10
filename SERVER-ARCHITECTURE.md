# Server-Side Architecture Guide

## 🏗️ Architecture Overview

Your CRM now supports **three ways** to make API calls:

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js App)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Server Components  → lib/api-server.ts → Backend            │
│  2. Server Actions     → lib/api-server.ts → Backend            │
│  3. Client Components  → /api/proxy → Backend                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Architecture Benefits

✅ **No CORS Issues** - All requests go through Next.js  
✅ **Hide Backend URL** - Client never knows the backend URL  
✅ **Server-Side Rendering** - Fast initial page loads  
✅ **Automatic Cookies** - Handled by Next.js  
✅ **Type Safety** - Full TypeScript support  
✅ **Revalidation** - Smart cache invalidation  

---

## 📁 File Structure

```
├── lib/
│   ├── api-server.ts       # Server-side API client (Server Components/Actions)
│   ├── api-client-proxy.ts # Client-side API client (uses /api/proxy)
│   └── api-client.ts       # Legacy direct backend calls (deprecated)
│
├── app/api/
│   └── proxy/
│       └── [...path]/
│           └── route.ts    # Universal API proxy
│
├── actions/
│   ├── auth-actions.ts     # Server Actions for auth
│   ├── users-actions.ts    # Server Actions for users
│   └── [feature]-actions.ts
│
└── services/
    ├── auth/
    ├── users/
    └── ...                 # Can use either api-server or api-client-proxy
```

---

## 🎯 When to Use Each Approach

### 1️⃣ Server Components (for Data Fetching)

**Use for:**
- Initial page loads
- SEO-important content
- Data that doesn't change often
- Protected data

**Example:**

```typescript
// app/[locale]/(dashboard)/users/page.tsx
import { getUsersAction } from "@/actions/users-actions";

export default async function UsersPage() {
  const { data: users } = await getUsersAction();
  
  return (
    <div>
      {users?.data.map(user => (
        <div key={user.id}>{user.email}</div>
      ))}
    </div>
  );
}
```

**Benefits:**
- ✅ Fast initial render
- ✅ SEO friendly
- ✅ No loading states needed
- ✅ Server-side auth check

---

### 2️⃣ Server Actions (for Mutations)

**Use for:**
- Form submissions
- Data mutations (create, update, delete)
- Actions triggered from client components
- Any operation that changes data

**Example:**

```typescript
// components/CreateUserForm.tsx
"use client";

import { createUserAction } from "@/actions/users-actions";
import { useTransition } from "react";

export function CreateUserForm() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    const userData = {
      email: formData.get("email") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
    };

    startTransition(async () => {
      const result = await createUserAction(userData);
      if (result.success) {
        // Success! Page will auto-revalidate
      }
    });
  };

  return (
    <form action={handleSubmit}>
      <input name="email" type="email" />
      <input name="firstName" />
      <input name="lastName" />
      <button disabled={isPending}>
        {isPending ? "Creating..." : "Create User"}
      </button>
    </form>
  );
}
```

**Benefits:**
- ✅ Automatic revalidation with `revalidatePath()`
- ✅ Progressive enhancement (works without JS)
- ✅ Built-in loading states with `useTransition`
- ✅ Type-safe

---

### 3️⃣ Client Components with Proxy (for Interactivity)

**Use for:**
- Real-time updates
- Interactive features
- Client-side state management (Zustand)
- When you need immediate feedback

**Example:**

```typescript
// hooks/useUsers.ts
"use client";

import { useState, useEffect } from "react";
import { fetchApiProxy } from "@/lib/api-client-proxy";
import type { User, PaginatedResponse } from "@/types/user";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApiProxy<PaginatedResponse<User>>("/users")
      .then(data => setUsers(data.data))
      .finally(() => setLoading(false));
  }, []);

  return { users, loading };
}
```

**Benefits:**
- ✅ No CORS issues (uses Next.js proxy)
- ✅ Works with client state (Zustand)
- ✅ Immediate user feedback
- ✅ Cookies automatically included

---

## 🔄 Migration Guide

### Step 1: Update Auth Service (if using client-side)

```typescript
// services/auth/api.ts
import { fetchApiProxy } from "@/lib/api-client-proxy"; // ← Changed

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await fetchApiProxy<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    return response;
  },
  // ... rest stays the same
};
```

### Step 2: Update Other Services

```typescript
// services/users/api.ts
import { fetchApiProxy, buildQueryString } from "@/lib/api-client-proxy";

export const usersService = {
  getUsers: async (params = {}) => {
    const queryString = buildQueryString(params);
    return fetchApiProxy<PaginatedResponse<User>>(`/users${queryString}`);
  },
  // ...
};
```

### Step 3: Convert Pages to Server Components

**Before (Client Component):**
```typescript
"use client";

import { useEffect, useState } from "react";
import { usersService } from "@/services/users";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    usersService.getUsers().then(setUsers);
  }, []);

  return <div>{/* render users */}</div>;
}
```

**After (Server Component):**
```typescript
import { getUsersAction } from "@/actions/users-actions";

export default async function UsersPage() {
  const { data: users } = await getUsersAction();

  return <div>{/* render users */}</div>;
}
```

### Step 4: Use Server Actions for Forms

**Before:**
```typescript
"use client";

const handleSubmit = async () => {
  await usersService.createUser(userData);
  router.refresh(); // Manual refresh
};
```

**After:**
```typescript
"use client";

import { createUserAction } from "@/actions/users-actions";
import { useTransition } from "react";

const [isPending, startTransition] = useTransition();

const handleSubmit = async () => {
  startTransition(async () => {
    const result = await createUserAction(userData);
    // Page auto-revalidates!
  });
};
```

---

## 🔐 Authentication Flow

### Server Components

```typescript
import { getCurrentUser } from "@/actions/auth-actions";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }

  return <div>Welcome {user.firstName}!</div>;
}
```

### Client Components (keeps Zustand)

```typescript
"use client";

import { useAuthStore } from "@/store";

export function UserMenu() {
  const { user, logout } = useAuthStore();
  
  // Auth store still works for client-side state
  return <div>{user?.email}</div>;
}
```

---

## 📊 Comparison Table

| Feature | Server Components | Server Actions | Client + Proxy |
|---------|------------------|----------------|----------------|
| **Initial Load** | ⚡ Fastest | ⚡ Fast | 🐌 Slower |
| **SEO** | ✅ Yes | ✅ Yes | ❌ No |
| **Interactivity** | ❌ No | ⚡ Medium | ✅ Full |
| **Loading States** | ❌ Not needed | ✅ useTransition | ✅ Manual |
| **CORS** | ✅ No issues | ✅ No issues | ✅ No issues |
| **Caching** | ✅ Auto | ✅ Auto | ❌ Manual |
| **Revalidation** | ✅ revalidatePath | ✅ revalidatePath | ❌ Manual |

---

## 🎓 Best Practices

### 1. **Start with Server Components**
Default to Server Components for pages. Only go client-side when needed.

### 2. **Use Server Actions for Mutations**
Forms, create, update, delete → Server Actions with `revalidatePath()`

### 3. **Keep Zustand for Client State**
Auth state, UI state, temporary data → Keep in Zustand

### 4. **Use Proxy for Legacy Code**
Existing client components → Update to use `/api/proxy`

### 5. **Avoid Direct Backend Calls**
Never use `lib/api-client.ts` from new code. Use:
- Server: `lib/api-server.ts`
- Client: `lib/api-client-proxy.ts`

---

## 🚀 Quick Start

### Creating a New Feature

1. **Create Server Action** (`actions/feature-actions.ts`):
```typescript
"use server";
export async function getFeatureData() {
  return await fetchApiServer("/feature");
}
```

2. **Use in Server Component**:
```typescript
export default async function FeaturePage() {
  const data = await getFeatureData();
  return <div>{data}</div>;
}
```

3. **Create Mutation Action**:
```typescript
"use server";
export async function createFeature(data) {
  const result = await fetchApiServer("/feature", {
    method: "POST",
    body: JSON.stringify(data)
  });
  revalidatePath("/feature");
  return result;
}
```

4. **Use in Client Component**:
```typescript
"use client";
export function CreateFeature() {
  return (
    <form action={createFeature}>
      {/* form fields */}
    </form>
  );
}
```

---

## 🔧 Environment Variables

```env
# .env.local
NEXT_PUBLIC_BASE_URL=http://localhost:3001
```

This is used by:
- `lib/api-server.ts` (Server-side)
- `/api/proxy` (Proxy route)

Client never sees this value! 🔒

---

## ❓ FAQ

**Q: Can I still use Zustand?**  
A: Yes! Keep Zustand for client-side state (auth, UI, alerts)

**Q: Do I need to rewrite everything?**  
A: No! Use the proxy for existing code. Migrate gradually.

**Q: What about real-time updates?**  
A: Use Client Components with proxy + polling, or add WebSockets

**Q: How do cookies work?**  
A: Same-origin requests automatically include cookies

**Q: What about TypeScript?**  
A: Fully supported! All API clients are typed.

---

## 📚 Next Steps

1. ✅ API Proxy is set up (`/api/proxy`)
2. ✅ Server Actions created (`actions/`)
3. ⏳ Update services to use proxy
4. ⏳ Convert pages to Server Components
5. ⏳ Update forms to use Server Actions

Start with one feature at a time!

