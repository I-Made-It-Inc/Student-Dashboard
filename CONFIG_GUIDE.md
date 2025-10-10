# Configuration Guide

This guide explains how to configure the IMI Student Dashboard for different environments and when adding backend integrations.

## Configuration File Location

All configuration is centralized in: **`js/config.js`**

## Quick Start

### 1. Azure Active Directory / MSAL Setup

When you're ready to add Microsoft authentication:

```javascript
// In js/config.js, update the MSAL section:
MSAL: {
    clientId: 'YOUR_CLIENT_ID', // From Azure AD App Registration
    authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID',
    redirectUri: window.location.origin,
    scopes: ['User.Read', 'openid', 'profile'],
},
```

**How to get these values:**
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Create a new registration or select existing one
4. **Client ID**: Found on the "Overview" page
5. **Tenant ID**: Also on the "Overview" page
6. Add redirect URI in "Authentication" section

### 2. API Backend Setup

When connecting to Azure SQL via API:

```javascript
// In js/config.js, update the API section:
API: {
    baseUrl: 'https://your-function-app.azurewebsites.net/api',
    // OR for local development:
    // baseUrl: 'http://localhost:7071/api',

    timeout: 30000,
    // ... endpoints remain the same
},
```

### 3. Enable Backend Features

When your backend is ready:

```javascript
// In js/config.js, update feature flags:
FEATURES: {
    enableMSAL: true,        // Enable Microsoft authentication
    enableBackend: true,     // Use real API calls
    useMockData: false,      // Stop using mock data
    enableAnalytics: true,   // Enable session tracking
},
```

## API Endpoints

The config includes pre-defined endpoint paths. Update `API.baseUrl` to point to your backend:

```javascript
endpoints: {
    students: {
        me: '/students/me',              // GET student profile
        profile: '/students/me/profile', // PUT update profile
        // ...
    },
    blueprints: {
        list: '/blueprints',             // GET all blueprints
        submit: '/blueprints',           // POST new blueprint
        // ...
    },
    // ... more categories
}
```

## Using Endpoints in Code

Helper function to build full URLs:

```javascript
// Get endpoint URL
const url = window.IMI.getEndpoint('students', 'me');
// Returns: "https://your-api.com/api/students/me"

// Get endpoint with parameters
const url = window.IMI.getEndpoint('companies', 'get', { id: '123' });
// Returns: "https://your-api.com/api/companies/123"
```

## Environment-Specific Configuration

### Development (localhost)
```javascript
API: {
    baseUrl: 'http://localhost:7071/api',  // Local Azure Functions
    // ...
},
FEATURES: {
    enableMSAL: false,      // Test without login
    useMockData: true,      // Use mock data
},
DEBUG: {
    logApiCalls: true,      // See all API calls in console
    logStateChanges: true,  // See state changes
}
```

### Production (GitHub Pages / Azure Static Web Apps)
```javascript
API: {
    baseUrl: 'https://your-function-app.azurewebsites.net/api',
    // ...
},
FEATURES: {
    enableMSAL: true,       // Require login
    enableBackend: true,    // Use real backend
    useMockData: false,     // No mock data
},
DEBUG: {
    logApiCalls: false,     // Disable debug logs
}
```

## Gamification Settings

Customize XP points and tier thresholds:

```javascript
GAMIFICATION: {
    xpPerBlueprint: 100,           // XP for each Blueprint submission
    connectorBonus: 25,            // Bonus for peer connections
    featuredInsightBonus: 50,      // Bonus for featured insights
    blueSparkDuration: 7 * 24 * 60 * 60 * 1000, // 7 days

    tiers: {
        bronze: 0,
        silver: 2500,
        gold: 5000,
        platinum: 10000,
    },
},
```

## Brand Colors

Update brand colors if needed:

```javascript
COLORS: {
    blue: '#042847',      // Primary brand color
    yellow: '#ffd502',    // Secondary/accent color
    darkGray: '#231f20',  // Text color
    // ...
},
```

## Accessing Configuration

In any JavaScript file:

```javascript
// Access config values
const clientId = window.IMI.config.MSAL.clientId;
const apiBase = window.IMI.config.API.baseUrl;
const xpPerBlueprint = window.IMI.config.GAMIFICATION.xpPerBlueprint;

// Check feature flags
if (window.IMI.config.FEATURES.enableMSAL) {
    // Initialize MSAL
}

if (window.IMI.config.FEATURES.useMockData) {
    // Return mock data
} else {
    // Call real API
}
```

## Security Notes

⚠️ **Never commit sensitive data to git:**
- Client secrets (use server-side only)
- Connection strings
- API keys

✅ **Safe to commit:**
- Client ID (public identifier)
- Tenant ID (public identifier)
- API endpoint URLs
- Feature flags

## Next Steps

After configuring:

1. **Test configuration loads:**
   - Open browser console
   - Check for: `IMI Configuration loaded: { ... }`

2. **Verify endpoints:**
   ```javascript
   console.log(window.IMI.config.API.endpoints);
   ```

3. **Test feature flags:**
   ```javascript
   console.log(window.IMI.config.FEATURES);
   ```

4. **Build and deploy:**
   ```bash
   npm run build
   ```

## Troubleshooting

**Config not loading?**
- Check browser console for errors
- Ensure `js/config.js` is loaded before other scripts
- Verify `index-template.html` includes: `<script src="js/config.js"></script>`

**MSAL errors?**
- Verify Client ID and Tenant ID are correct
- Check redirect URI is registered in Azure AD
- Ensure app registration has correct API permissions

**API calls failing?**
- Check `API.baseUrl` is correct
- Verify CORS is enabled on your API
- Check network tab in browser DevTools
