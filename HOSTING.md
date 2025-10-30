# Hosting Guide - Render Deployment

Complete guide for deploying this Shopify app to Render.com.

## Quick Overview

- **Platform**: Render.com (Docker deployment)
- **Database**: Neon PostgreSQL
- **Auto-deploy**: Enabled on `main` branch push

## Prerequisites

- Render account: https://render.com
- GitHub repository connected
- Neon Database setup with connection strings
- Shopify app credentials

## Deployment Steps

### 1. Create Web Service on Render

1. Dashboard: https://dashboard.render.com → **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Runtime**: Docker
   - **Branch**: `main`
   - **Instance Type**: Free/Starter

### 2. Set Environment Variables

**Shopify Credentials** (get via `shopify app env show`):
```
SHOPIFY_API_KEY=<from-cli>
SHOPIFY_API_SECRET=<from-cli>
SCOPES=write_products
```

**App Configuration**:
```
NODE_ENV=production
PORT=3000
SHOPIFY_APP_URL=https://your-app.onrender.com
```

**Database** (from Neon Dashboard):
```
DATABASE_URL=<neon-pooled-connection-string>
DIRECT_URL=<neon-direct-connection-string>
```

Click **Create Web Service** - Render will build and deploy automatically.

### 3. Update Shopify Configuration

Edit `shopify.app.toml`:
```toml
application_url = "https://your-app.onrender.com"

[auth]
redirect_urls = [
    "https://your-app.onrender.com/auth/callback",
    "https://your-app.onrender.com/auth/shopify/callback",
    "https://your-app.onrender.com/api/auth/callback"
]
```

Deploy to Shopify:
```bash
shopify app deploy
```

### 4. Install on Development Store

1. Shopify Partners → Apps → Select your app
2. **Test your app** → Choose dev store → **Install**

## Important Configuration

### Neon Database WebSocket Fix

Already configured in `app/db.server.js`:
```javascript
import ws from "ws";
import { neonConfig } from "@neondatabase/serverless";

neonConfig.webSocketConstructor = ws;
```

The `ws` package is required in `package.json` dependencies.

### Docker Deployment

The `Dockerfile` runs:
1. `npm ci --omit=dev` - Install dependencies
2. `npm run build` - Build app
3. `npm run docker-start` - Setup DB and start server

Command: `prisma generate && prisma migrate deploy && npm run start`

## Troubleshooting

### WebSocket Connection Error
```
Error: All attempts to open a WebSocket to connect to the database failed
```
**Fix**: Ensure `ws` package is installed and configured (see above).

### 502 Bad Gateway
- App must bind to `0.0.0.0:3000`
- Check Render logs for startup errors
- Verify all environment variables are set

### Free Tier Cold Starts
Services spin down after 15 min inactivity. First request may take 30-60s.

### Checking Logs
Render Dashboard → Your Service → **Logs**

## Redeployment

Push to GitHub triggers automatic rebuild:
```bash
git push origin main
```

Manual deploy: Render Dashboard → **Manual Deploy** → **Deploy latest commit**

## Documentation

- [Render Shopify App Guide](https://render.com/docs/deploy-shopify-app)
- [Render Troubleshooting](https://render.com/docs/troubleshooting-deploys)
- [Neon WebSocket Config](https://github.com/neondatabase/serverless/blob/main/CONFIG.md#websocketconstructor-typeof-websocket--undefined)
- [Shopify Deployment Docs](https://shopify.dev/docs/apps/launch/deployment/deploy-to-hosting-service)

## Updating Environment Variables

Render Dashboard → Service → **Environment** → Update → **Save Changes** (triggers redeploy)

## Custom Domain (Optional)

1. Render Dashboard → Settings → **Custom Domain**
2. Add domain and configure DNS
3. Update `shopify.app.toml` with new domain
4. Run `shopify app deploy`
