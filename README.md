# Freecomers site

Static site: the landing page, the "Tell Festy your story" intake, and the dashboard prototype.
No build step. Fonts, GSAP and Lenis are all self-hosted in `assets/`, so nothing depends on a CDN.

## Deploy to Vercel

**Option A: Git (recommended)**
1. Push this folder to a GitHub repo.
2. In Vercel, choose Add New, then Project, and import the repo.
3. Framework preset: **Other**. Leave the build command and output directory empty.
4. Deploy.

**Option B: CLI**
```
npm i -g vercel
vercel          # preview URL
vercel --prod   # production
```

## Run locally
```
npx serve . -l 3000
```
Open http://localhost:3000. Paths are absolute (`/assets/...`), so opening `index.html`
straight from disk won't load the fonts or scripts. Use a local server.

## Routes
| URL | View |
| --- | --- |
| `/` | Landing page |
| `/start` | Intake flow (Act I through the finale) |
| `/dashboard` | Dashboard prototype |

`vercel.json` rewrites `/start` and `/dashboard` to `index.html`. The page picks the view from
the URL, and the browser back button moves between views.

## Where things live
- `index.html`: all markup (landing, intake, dashboard)
- `assets/css/styles.css`: design tokens, type scale, every section
- `assets/js/app.js`: animations, page transition, intake flow, dashboard logic.
  Festival data, the five "How it works" cards, the four "won't do" panels and the FAQ are plain
  arrays at the top (`FEST`, `STEPS`, `SLIDES`, `FAQ`). Edit copy there.
- `assets/vendor/`: GSAP 3.13 (ScrollTrigger, SplitText, CustomEase) and Lenis 1.3.15

## Before going live
- **Font licences.** Universo, Mosvita and The Patience come from the ABCS site build. Check that
  their webfont licences cover this domain, or swap the files in `assets/fonts/` (keep the names).
  Fraunces is under the SIL Open Font License (`FRAUNCES-OFL.txt`).
- **Images.** The laurel tiles are drawn in code (`laurelSVG` in `app.js`). To use real stills,
  replace the `[data-tile]` elements with `<img>` tags.
- **Prototype parts.** Account creation, Google sign-in and Festy's chat replies run in the browser
  only. Connect them to your backend when ready. Festy's canned answers are in `reply()`.
