# Yumna Haya Aqilah · ML Portfolio

Next.js (App Router) + Motion. Static export, so it deploys to Vercel or Netlify as-is.

## Run locally
```bash
npm install
npm run dev     # http://localhost:3000
```

## Deploy
**Vercel:** push this folder to a GitHub repo, then Import Project on vercel.com. No settings needed.

**Netlify:** push to GitHub, then Add new site → Import. Build command `npm run build`, publish directory `out`.

## Where to edit
- Project text and numbers: `lib/projects.ts`
- About, stack, contact: `components/Sections.tsx`
- Hero: `components/Hero.tsx`
- Interactive demos: `components/Demos.tsx`
- Colors and layout: `app/globals.css`
- Images: `public/assets/`
