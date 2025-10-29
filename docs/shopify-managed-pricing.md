# Shopify Managed Pricing

Reference: https://shopify.dev/docs/apps/launch/billing/managed-pricing

## What it is
A billing system where you define subscription plans in the Partner Dashboard instead of using code. Shopify handles all the billing automatically.

## Why use it
- No need to write billing code
- Shopify manages recurring charges, trials, and price updates
- Standard option for new public apps

## How it works

### Plan Types

**Public Plans** (up to 4):
- Available to all merchants
- Visible on App Store

**Private Plans** (up to 10):
- Custom plans for specific stores
- Up to 20 authorized stores per plan

### Billing Models Supported
- Free plans
- Monthly subscriptions
- Annual subscriptions
- Hybrid (monthly + yearly options)

## Key Features

**Free Trials:**
- Trials are tracked over 180 days
- Prevents merchants from exploiting trials by reinstalling

**Discounts:**
- Can be issued through Partner Dashboard
- Requires "Manage credits and refunds" permission

**Testing:**
- Development stores get test subscriptions at no charge

**Welcome Links:**
- After plan approval, merchant redirects to your specified URL
- URL includes `charge_id` parameter

## Limitations
- Only supports fixed recurring pricing
- No usage-based or custom billing models
- Cannot create new charges via Billing API after opting in
- Previous API charges continue to work

## Setup Location
Configure plans in: **Shopify Partner Dashboard** → Your App → Pricing
