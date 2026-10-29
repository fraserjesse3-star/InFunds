# InFunds demo

A responsive React + Vite demo for tracking community sport funding opportunities.

## What's included
- Search and filter the grant list
- Overview dashboard, saved grants, and tracked applications
- Add a grant form
- Grant detail panel with eligibility notes and official source links
- Browser `localStorage` persistence
- Responsive desktop and mobile layouts

## Important demo limitations
- This is a demo, not a production funding service.
- Grant listings are starter examples. Always verify dates, eligibility, amounts and application links with the funder.
- Data is saved in the current browser only. It is not shared between users or devices.
- No user accounts, shared database, live feed or automatic grant-page refresh is connected.
- Google Fonts requires an internet connection; the app otherwise uses system fallbacks.

## Run locally
Requires Node.js 20 or later.

```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Deploy to Vercel
1. Create a GitHub repository named `infunds`.
2. Upload the contents of this project folder to the repository root (do not upload the ZIP itself).
3. Sign in at https://vercel.com and choose **Add New → Project**.
4. Import the `infunds` GitHub repository.
5. Vercel should detect Vite automatically. Use:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
6. Choose **Deploy**. When the build succeeds, Vercel will provide a shareable `vercel.app` URL.

## Reset the demo data
In the browser's developer console, run:
```js
localStorage.removeItem('infunds-grants-v1')
location.reload()
```
