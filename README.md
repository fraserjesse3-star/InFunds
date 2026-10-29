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


## Funding data notes

The initial Waikato seed list was checked against official funder pages on 29 October 2026. The app is still a client-side pilot: it does not automatically refresh grant data or provide shared accounts/database storage. Each listing includes an official source link and eligibility notes; users must verify current details before applying. The matching score is indicative and is not an eligibility decision.


## Supabase connection (pilot)

This version reads public funding records from the Supabase `funding_opportunities` table and related `funders` table. Configure the Vite environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (use the project's publishable/anon key only; never use a service-role or secret key in frontend variables). Add both variables to the local `.env` file for local development and to Vercel Project Settings → Environment Variables for the deployed site, then redeploy.

The current public funding tables have read-only policies for anonymous/authenticated users. Adding a grant through the UI remains browser-local until a secured admin workflow is built. Saved grants and application status are also still stored in the current browser, not synced across devices or users. Do not store confidential club data in this pilot.
