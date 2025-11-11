# Role-Based Access Control (RBAC) Implementation Guide

This document explains how to use the dynamic role-based access control system implemented in this CRM application.

## 📋 Overview

The RBAC system consists of three main layers:

1. **Backend Authorization** - The source of truth for permissions (requires backend implementation)
2. **Frontend Route Guards** - Protects routes from unauthorized access
3. **Dynamic Permissions UI** - Manage permissions through the admin interface

## 🗂 Data Model

### Permissions
Each permission has:
- `id`: Unique identifier
- `key`: String identifier (e.g., `view_users`, `manage_roles`)
- `name`: Human-readable name
- `description`: What the permission allows

### Roles
Roles now include:
- `permissions`: Array of permission keys assigned to the role

### Users
Users now include:
- `permissions`: Flat array of all permission keys from assigned roles

## 🎯 Usage Guide

### 1. Client-Side Permission Checking

#### Using the `useAuth` Hook

```tsx
import { useAuth } from "@/hooks/useAuth";

function MyComponent() {
  const { user, hasPermission, hasAnyPermission } = useAuth();

  if (hasPermission("manage_users")) {
    // Show admin controls
  }

  if (hasAnyPermission(["view_users", "manage_users"])) {
    // Show user list
  }

  return <div>...</div>;
}
```

#### Using the `PermissionGate` Component

```tsx
import { PermissionGate } from "@/components/atoms/PermissionGate";

function MyPage() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* Show only if user has permission */}
      <PermissionGate permission="manage_roles">
        <Link href="/roles">Manage Roles</Link>
      </PermissionGate>

      {/* Show if user has ANY of these permissions */}
      <PermissionGate anyPermissions={["view_users", "manage_users"]}>
        <UsersTable />
      </PermissionGate>

      {/* Show if user has ALL of these permissions */}
      <PermissionGate allPermissions={["view_reports", "export_data"]}>
        <ExportButton />
      </PermissionGate>

      {/* With fallback content */}
      <PermissionGate
        permission="view_analytics"
        fallback={<p>You need analytics permission to view this.</p>}
      >
        <AnalyticsChart />
      </PermissionGate>
    </div>
  );
}
```

### 2. Server-Side Route Protection

#### Protecting a Page Route

```tsx
// app/[locale]/(dashboard)/admin/page.tsx
import { requirePermission } from "@/lib/auth-server";

export default async function AdminPage() {
  // This will redirect to /unauthorized if user lacks permission
  const user = await requirePermission("access_admin");

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.firstName}!</p>
    </div>
  );
}
```

#### Using Higher-Order Functions

```tsx
// app/[locale]/(dashboard)/roles/page.tsx
import { withPermission } from "@/lib/auth-server";
import { RolesPage } from "@/components/pages/RolesPage";

export default withPermission("manage_roles", RolesPage);
```

#### Multiple Permissions

```tsx
import { requireAnyPermission, requireAllPermissions } from "@/lib/auth-server";

// User needs ANY of these permissions
export default async function UsersPage() {
  await requireAnyPermission(["view_users", "manage_users"]);
  return <UsersPageComponent />;
}

// User needs ALL of these permissions
export default async function ReportsPage() {
  await requireAllPermissions(["view_reports", "export_data"]);
  return <ReportsPageComponent />;
}
```

### 3. Dynamic Navigation

The sidebar automatically filters navigation items based on user permissions:

```tsx
// components/organisms/Sidebar.tsx
const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <Icons.Dashboard />,
    permission: "view_dashboard", // Only shown if user has this permission
  },
  {
    name: "Users",
    href: "/users",
    icon: <Icons.Users />,
    permission: "view_users",
  },
  // No permission = always shown
  {
    name: "Help",
    href: "/help",
    icon: <Icons.Help />,
  },
];
```

## 🔧 Managing Permissions

### Admin Interface

1. **Permissions Page** (`/permissions`)
   - Create, update, and delete permissions
   - View all available permissions
   - Requires `manage_permissions` permission

2. **Roles Page** (`/roles`)
   - Assign permissions to roles using the multi-select dropdown
   - Each role can have multiple permissions
   - Requires `manage_roles` permission

### API Integration

The following API endpoints are expected by the frontend:

#### Permissions
- `GET /permissions` - Get all permissions
- `POST /permissions` - Create permission
- `PUT /permissions/:id` - Update permission
- `DELETE /permissions/:id` - Delete permission

#### Role Permissions
- `GET /roles/:id/permissions` - Get role's permissions
- `POST /roles/:id/permissions` - Assign permission to role
- `PUT /roles/:id/permissions` - Update role's permissions (replace all)
- `DELETE /roles/:id/permissions/:permissionId` - Remove permission from role

#### User Profile
- `GET /auth/profile` - Must return user with `permissions` array

Example response:
```json
{
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["Admin", "Manager"],
    "permissions": [
      "view_dashboard",
      "view_users",
      "manage_users",
      "view_companies",
      "manage_companies",
      "manage_roles",
      "manage_permissions"
    ]
  }
}
```

## 📝 Common Permission Keys

Here are suggested permission keys for your CRM:

```typescript
// Master Permission (bypasses all other permission checks)
"full_nav_access"    // Grants access to ALL navigation items and features

// Dashboard
"view_dashboard"

// Users
"view_users"
"manage_users"  // Create, update
"delete_users"
"ban_users"

// Companies
"view_companies"
"manage_companies"  // Create, update
"delete_companies"

// Roles & Permissions
"manage_roles"
"manage_permissions"

// Settings
"view_settings"
"manage_settings"

// Reports
"view_reports"
"export_data"
```

### 🔑 Master Permission: `full_nav_access`

The `full_nav_access` permission is a special "super permission" that:
- **Bypasses all permission checks** throughout the application
- **Shows all navigation items** in the sidebar
- **Grants access to all protected components** when using `PermissionGate`
- **Allows access to all protected routes** on the server side

**Use cases:**
- Super admin accounts
- Development/testing accounts
- Full system access for specific users

**Example:**
```tsx
// User with full_nav_access can see this even without manage_roles permission
<PermissionGate permission="manage_roles">
  <RolesButton />
</PermissionGate>
```

## 🔐 Security Best Practices

### ✅ DO

1. **Always validate permissions on the backend** - Frontend checks are for UX only
2. **Use granular permissions** - `view_users` and `edit_users` instead of just `users`
3. **Check permissions at the route level** - Prevent unauthorized page access
4. **Cache permissions** - React Query caches them automatically (5 min stale time)
5. **Use snake_case** - Permission keys should be lowercase with underscores

### ❌ DON'T

1. **Don't rely on frontend checks for security** - They can be bypassed
2. **Don't hardcode role names** - Use permission keys instead
3. **Don't expose admin routes** - Even if hidden, they can be accessed directly
4. **Don't forget to protect API routes** - Both pages and APIs need protection

## 🚀 Implementation Checklist

### Backend Requirements

- [ ] Implement permission management endpoints
- [ ] Add permissions table to database
- [ ] Add role_permissions junction table
- [ ] Update user profile endpoint to include permissions
- [ ] Add permission checks to all protected API routes
- [ ] Seed initial permissions data

### Frontend Setup

- [x] Permission types and interfaces
- [x] Permission service API client
- [x] usePermissions hooks
- [x] useAuth hook with permission checking
- [x] PermissionGate component
- [x] Server-side auth helpers
- [x] RoleForm with permission selection
- [x] PermissionsPage for admin
- [x] Dynamic sidebar navigation
- [x] Unauthorized page
- [x] i18n translations

### Testing

- [ ] Test permission checks on protected routes
- [ ] Test PermissionGate component rendering
- [ ] Test role-permission assignment
- [ ] Test permission inheritance (user gets permissions from all roles)
- [ ] Test unauthorized access handling

## 🐛 Troubleshooting

### Permissions not working?

1. Check that backend returns `permissions` in user profile
2. Verify permission keys match exactly (case-sensitive)
3. Check browser console for auth errors
4. Clear auth cache: `localStorage.clear()` and reload

### Navigation items not showing?

1. Verify user has required permission
2. Check permission key spelling in Sidebar
3. Ensure user object has `permissions` array

### Routes still accessible?

- Add server-side protection using `requirePermission()`
- Frontend protection is only for UX, not security

## 📚 File Structure

```
├── services/
│   └── permissions/
│       ├── types.ts              # Permission type definitions
│       ├── api.ts                # Permission API client
│       └── index.ts
├── hooks/
│   ├── usePermissions.ts         # React Query hooks for permissions
│   └── useAuth.ts                # Auth hook with permission helpers
├── components/
│   ├── atoms/
│   │   ├── PermissionGate.tsx    # Conditional render component
│   │   └── MultiSelect.tsx       # Multi-select for permissions
│   ├── organisms/
│   │   ├── RoleForm.tsx          # Role form with permissions
│   │   ├── PermissionForm.tsx    # Permission management form
│   │   └── Sidebar.tsx           # Dynamic navigation
│   └── pages/
│       ├── RolesPage.tsx
│       └── PermissionsPage.tsx
├── lib/
│   └── auth-server.ts            # Server-side auth helpers
├── app/
│   └── [locale]/(dashboard)/
│       ├── permissions/page.tsx
│       └── unauthorized/page.tsx
└── types/
    └── user.ts                   # User type with permissions
```

## 🎓 Examples

### Example 1: Conditional Button

```tsx
import { PermissionGate } from "@/components/atoms/PermissionGate";

<PermissionGate permission="delete_users">
  <Button onClick={handleDelete} variant="destructive">
    Delete User
  </Button>
</PermissionGate>
```

### Example 2: Protected Page with Custom Redirect

```tsx
import { redirect } from "next/navigation";
import { getCurrentUserServer, hasPermission } from "@/lib/auth-server";

export default async function SettingsPage() {
  const user = await getCurrentUserServer();

  if (!user) {
    redirect("/login");
  }

  if (!hasPermission(user, "manage_settings")) {
    redirect("/dashboard");
  }

  return <SettingsPageContent />;
}
```

### Example 3: Role-Based Component

```tsx
import { useAuth } from "@/hooks/useAuth";

function UserActions({ userId }: { userId: number }) {
  const { hasPermission } = useAuth();

  return (
    <div>
      {hasPermission("edit_users") && (
        <Button onClick={() => handleEdit(userId)}>Edit</Button>
      )}
      {hasPermission("delete_users") && (
        <Button onClick={() => handleDelete(userId)} variant="destructive">
          Delete
        </Button>
      )}
      {hasPermission("ban_users") && (
        <Button onClick={() => handleBan(userId)}>Ban</Button>
      )}
    </div>
  );
}
```

## 🔄 Migration Guide

If you have existing roles without permissions:

1. Create default permissions in the database
2. Assign appropriate permissions to existing roles
3. Update user profile endpoint to return permissions
4. Test with a single role before rolling out
5. Gradually add permission checks to protected routes

## 📞 Support

For questions or issues:
1. Check this documentation
2. Review the implementation files
3. Test with browser dev tools (check user object)
4. Verify backend API responses

