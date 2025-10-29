# Loader Function

## What it does
Loads data before a route component renders. The data is available to the component.

## Why we use it
To fetch data on the server side before showing the page to the user.

## Important Note
`console.log()` inside the loader will show in the **terminal** (not browser console) because loaders run on the server.

## Code

```javascript
export const loader = async ({ request }) => {
    return null;
}
```

Reference: https://reactrouter.com/start/framework/data-loading
