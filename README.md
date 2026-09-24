# 🎂 Shravani's 23rd Birthday Website

A tiny interactive love letter: intro → hero → letter → photo gallery → memory timeline → "a few things that make you… you" → friendship note (+ heart button) → 23 wishes → gift → final celebration.

React + Vite + Tailwind CSS 3 + Framer Motion + Lucide + canvas-confetti. No backend — deploys as a static site.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs to /dist
npm run preview    # test the production build
```

## Make it hers (5 minutes)

### 1. Add photos
Drop 10–20 photos into **`src/assets/photos/`** (jpg, png, webp all work).
Then open **`src/data/birthdayData.js`** and set the file names:

```js
photos: [
  { image: 'photo1.jpg', caption: 'That smile ❤️' },
  ...
]
```

Just the file name — no path. Any name that doesn't exist yet shows a soft "add photo1.jpg" placeholder, so nothing ever breaks.
Tip: resize photos to ~1200px wide first so the page loads fast on her phone.

### 2. Edit the words
Everything personal is in `src/data/birthdayData.js`: the letter, captions, timeline memories (add/remove items freely, each has an optional `date`), the "why you're special" cards, friendship note, all 23 wishes, and the final message.

### 3. Add music (optional)
Put a file in **`src/assets/music/`** (e.g. `birthday-song.mp3`). It never autoplays — she taps the button. No file = the button hides itself.

## Deploy (free, static)
- **Netlify Drop**: run `npm run build`, drag the `dist` folder to https://app.netlify.com/drop
- **Vercel / Cloudflare Pages / GitHub Pages**: build command `npm run build`, output directory `dist`.

## Notes
- Fonts (Cormorant Garamond, Caveat, DM Sans) load from Google Fonts; system fallbacks are used if offline.
- Respects `prefers-reduced-motion` (confetti, floating hearts and cursor sparkles switch off).
- Cursor sparkles only appear on desktop with a mouse — never on touch devices.
