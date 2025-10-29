# React Router v7 - Routing & Loaders

## File Structure

### Root File (root.jsx)
Provides the HTML structure for the entire app. This is the top-level component that wraps all your routes.

**What it does:**
- Loads the HTML shell (`<html>`, `<head>`, `<body>`)
- Contains `<Outlet />` where all route components render (https://reactrouter.com/api/components/Outlet#outlet)
- Loads global styles, fonts, and metadata
- Handles scripts and scroll restoration

**Key components in root.jsx:**
- `<Meta />` - Loads meta tags (title, description, etc.)
- `<Links />` - Loads CSS and stylesheets
- `<Outlet />` - Where child routes render (most important!)
- `<ScrollRestoration />` - Remembers scroll position on navigation
- `<Scripts />` - Loads JavaScript for the app

**Flow:**
```
root.jsx (HTML shell)
  └── <Outlet />
       └── Your route components render here
           (app.shop-details.jsx, app.extra.jsx, etc.)
```

**Why it's important:**
Every page in your app loads through root.jsx. It runs once and stays consistent while the `<Outlet />` swaps different page components as you navigate.

### AppProvider (Shopify App Wrapper)
Wraps your app to make it work inside Shopify Admin.

**What it does:**
- Connects your app to Shopify (authentication)
- Makes Polaris components work
- Enables App Bridge features (navigation, modals, etc.)

**Key props:**
- `apiKey` - Your app's Client ID from Shopify Partner Dashboard
- `embedded` (or `isEmbeddedApp`) - App runs inside Shopify admin (default: `true`)

**Example:**
```javascript
<AppProvider embedded apiKey={apiKey}>
  <s-app-nav>
    <s-link href="/app">Home</s-link>
  </s-app-nav>
  <Outlet />
</AppProvider>
```

**Flow:**
```
AppProvider (Shopify wrapper)
  └── s-app-nav (Navigation)
  └── Outlet (Page content)
```

## File Based Routing

The file structure in your `app/routes` folder automatically creates routes (URLs). No manual configuration needed.

**How it works:**

File name = URL path

```
app/routes/
  app.jsx              → /app
  app.shop-details.jsx → /app/shop-details
  app.extra.jsx        → /app/extra
```

**Example:**
- **File:** `app/routes/app.shop-details.jsx`
- **URL:** `yourapp.com/app/shop-details`

**Nested routes:**

The dot (`.`) creates nesting:

```
app.jsx                → /app (parent)
app.shop-details.jsx   → /app/shop-details (child of app)
app.extra.jsx          → /app/extra (child of app)
```

**Why it's useful:**
- No manual route config - just create a file
- File name matches the URL
- All routes organized in one folder

**Traditional vs File-Based:**

Traditional:
```javascript
<Routes>
  <Route path="/app" element={<App />} />
  <Route path="/app/shop-details" element={<ShopDetails />} />
</Routes>
```

File-based:
```
// Just create files
app/routes/app.jsx
app/routes/app.shop-details.jsx
```
