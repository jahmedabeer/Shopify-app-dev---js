# Create Page and Route

## Steps to Create a New Page

1. Navigate to `app/routes/` folder
2. Create a file with prefix: `app.filename.jsx`
   - Example: `app.products.jsx`
   - Example: `app.settings.jsx`

## Basic Page Structure

```javascript
export default function PageName() {
  return (
    <s-page heading="Page Title">
      <s-section heading="Section Title">
        <s-paragraph>
          Your content here
        </s-paragraph>
      </s-section>
    </s-page>
  );
}
```

## Extra Notes
- File naming determines the route path
- Use `app.` prefix for app-scoped routes
- Access URL pattern: `https://admin.shopify.com/store/jakdevstore/apps/first-app-dev-js/app/pagename`
