# Subscription-Based Theme Extension Access Control

This document explains how the app restricts theme extension access based on merchant subscription status.

## How It Works

The solution uses **app-data metafields** combined with **conditional Liquid rendering** to control extension visibility:

1. **App-Data Metafield**: Stores subscription status at the app installation level
2. **Automatic Updates**: Metafield updates whenever subscription status changes
3. **Liquid Conditional**: Theme extension checks metafield before rendering
4. **Schema Restriction**: `available_if` attribute hides block in theme editor when no subscription

## Implementation Details

### 1. App-Data Metafield

- **Owner**: `AppInstallation` object
- **Namespace**: `subscription`
- **Key**: `has_active_plan`
- **Type**: `boolean`
- **Value**: `true` when merchant has active subscription, `false` otherwise

### 2. Backend Updates

The metafield is automatically updated in two places:

#### A. Billing Page Loader (`app/routes/app.billing.jsx`)
Every time the merchant visits the billing page, the app checks their subscription status and updates the metafield:

```javascript
const { hasActivePayment } = await billing.check();
await updateSubscriptionMetafield(admin, hasActivePayment);
```

#### B. Subscription Cancellation (`app/routes/app.billing.jsx`)
When a merchant cancels their subscription:

```javascript
await billing.cancel({ ... });
await updateSubscriptionMetafield(admin, false);
```

### 3. Theme Extension Liquid

The theme extension block uses two layers of protection:

#### Layer 1: Runtime Conditional (Liquid)
```liquid
{% if app.metafields.subscription.has_active_plan == true %}
  <!-- Extension content -->
{% else %}
  <!-- Optional upgrade message -->
{% endif %}
```

#### Layer 2: Editor Visibility (Schema)
```json
{
  "available_if": "{{ app.metafields.subscription.has_active_plan }}"
}
```

This hides the block from the theme editor's block picker when there's no subscription.

## Testing Instructions

### Test 1: With Active Subscription

1. Navigate to your app's billing page in the Shopify admin
2. If you don't have a subscription, subscribe to a plan
3. Visit your store's theme editor
4. The extension block should be visible in the block picker
5. Add the block to a section
6. Preview the storefront - the extension should render normally

### Test 2: Without Active Subscription

1. Navigate to your app's billing page
2. Cancel your subscription
3. Visit your store's theme editor
4. The extension block should be hidden from the block picker (or show as unavailable)
5. If you already added the block, preview the storefront
6. The extension should either:
   - Not render at all
   - Show the upgrade message (if you kept the `{% else %}` block)

### Test 3: Status Updates

1. Cancel subscription
2. Visit storefront - extension should be hidden
3. Re-subscribe to a plan
4. Visit app billing page (this triggers metafield update)
5. Visit storefront - extension should now appear

## Important Notes

### Metafield Update Timing

The metafield updates when:
- Merchant visits `/app/billing` page
- Merchant cancels subscription via the app

For real-time updates, consider using webhooks:
- `APP_SUBSCRIPTIONS_UPDATE` webhook to catch subscription changes
- Update metafield immediately when webhook fires

### Accessing App Metafields in Liquid

App-data metafields are accessed via the special `app` object:

```liquid
{{ app.metafields.NAMESPACE.KEY }}
```

Example:
```liquid
{{ app.metafields.subscription.has_active_plan }}
```

### Security Considerations

- App-data metafields are **not visible** to merchants in the admin
- They can **only be modified** by your app
- Other apps **cannot access** your app-data metafields
- Merchants **cannot edit** these values directly

### Alternative: Complete Block Hiding

If you want to completely hide the block (no upgrade message), remove the `{% else %}` section:

```liquid
{% if app.metafields.subscription.has_active_plan == true %}
  <!-- Extension content only -->
{% endif %}
```

## Webhook Setup (Optional but Recommended)

For real-time subscription status updates, add webhook handling:

### 1. Register Webhook

Add to your app configuration or register via Admin API:

```javascript
{
  topic: "APP_SUBSCRIPTIONS_UPDATE",
  address: "https://your-app.com/webhooks/subscription-update"
}
```

### 2. Handle Webhook

Create route `app/webhooks/subscription-update.jsx`:

```javascript
import { authenticate } from "../shopify.server";
import { updateSubscriptionMetafield } from "../utils/subscription-metafield.server";

export const action = async ({ request }) => {
  const { admin, payload } = await authenticate.webhook(request);

  // Check if subscription is active
  const hasActiveSubscription = payload.app_subscription.status === "ACTIVE";

  // Update metafield
  await updateSubscriptionMetafield(admin, hasActiveSubscription);

  return new Response(null, { status: 200 });
};
```

This ensures immediate updates without requiring merchant to visit billing page.

## References

- [App-Data Metafields Documentation](https://shopify.dev/docs/apps/build/custom-data/metafields/use-app-data-metafields)
- [Conditional App Blocks](https://shopify.dev/docs/apps/build/online-store/theme-app-extensions/configuration#conditional-app-blocks)
- [Liquid App Object](https://shopify.dev/docs/api/liquid/objects/app)
- [Managed Pricing & Billing](https://shopify.dev/docs/apps/launch/billing/managed-pricing)
