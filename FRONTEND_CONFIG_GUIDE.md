# Frontend Configuration Guide

## ✅ Configuration Checklist

### 1. Environment Variables

Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3001
```

### 2. API Client Configuration ✅ DONE

- ✅ Added `credentials: 'include'` to all fetch requests
- ✅ Removed Authorization headers (using HttpOnly cookies)
- ✅ Set correct base URL with fallback
- ✅ Added configuration debugging

### 3. CORS Requirements

Your backend should have these CORS settings:

```javascript
// Backend CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

### 4. Cookie Configuration

Backend should set cookies with:

```javascript
// Backend cookie settings
res.cookie("access_token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none",
  domain:
    process.env.NODE_ENV === "production" ? "yourdomain.com" : "localhost",
  path: "/",
  maxAge: 15 * 60 * 1000, // 15 minutes
});
```

## 🐛 Troubleshooting

### Check Browser Console

Look for these errors:

- CORS errors
- Cookie blocking warnings
- Network failures

### Debug Configuration

The app automatically logs configuration in development:

```javascript
// Check console for:
🔧 API Configuration Debug: {
  baseUrl: "http://localhost:3001",
  nodeEnv: "development",
  envVariable: "http://localhost:3001",
  hasCredentials: "include"
}
```

### Common Issues

1. **Cookies not persisting after refresh**

   - Backend needs `domain` attribute in cookie settings
   - Check `SameSite=None` requires `Secure=true` in production

2. **CORS errors**

   - Backend CORS origin must match frontend URL exactly
   - Check `credentials: true` in backend CORS config

3. **401 Unauthorized errors**
   - Check if cookies are being sent (Network tab > Headers)
   - Verify backend cookie parsing

### Testing Checklist

- [ ] Login sets cookies in browser
- [ ] Cookies persist after page refresh
- [ ] Protected routes redirect when not authenticated
- [ ] Logout clears cookies
- [ ] Token refresh works automatically
- [ ] No CORS errors in console

## 📋 Current Status

✅ **Frontend Requirements Completed:**

- ✅ `credentials: 'include'` in all fetch requests
- ✅ Correct API base URL configuration
- ✅ HttpOnly cookie support (no client-side cookie access)
- ✅ Middleware for route protection
- ✅ Automatic token refresh handling
- ✅ Configuration debugging tools

🔧 **Backend Requirements (check with your backend team):**

- Cookie domain attribute setting
- CORS configuration for your frontend URL
- Proper cookie security settings
- Debug endpoint for troubleshooting
