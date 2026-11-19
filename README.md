# Evolura Technologies website, version 2

A mature company site with an interactive 3D hero (particle form that morphs between shapes). Static files, no build step.

| File | Purpose |
|---|---|
| `site.config.js` | Every text, service, credential, office, colour. Edit only this for content changes |
| `index.html`, `privacy.html` | Page structure, SEO title and description |
| `assets/styles.css`, `assets/app.js`, `assets/privacy.js` | Design and engine |
| `assets/hero3d.js` | The 3D hero, bundled with three.js r187 (MIT). Nothing to install |
| `assets/lenis.js` | Smooth scrolling, Lenis 1.3.27 (MIT). Nothing to install |
| `src/hero3d.source.js` | Readable source of the 3D hero, for developers |
| `_headers`, `.htaccess` | Security headers for Cloudflare Pages / Netlify, or cPanel |

## Content rule
The site describes what Evolura does and how it works. Add client names, logos, statistics or case studies only when they are real.

## Before going live (TODO in site.config.js)
1. Real email, phone, WhatsApp and LinkedIn in `contact`.
2. Offices in `offices` (the footer shows a remote-delivery note until then).
3. Keep `replyPromise` only if you can meet it.
4. Company facts in `about.facts` (founded, headquarters, team); empty ones stay hidden.
5. Web3Forms key so the form sends directly.

## Run locally
Open this folder in VS Code and use Live Server on `index.html`.

## Rebuild the 3D hero (developers only)
`npm i three@0.187.0 esbuild` then `npx esbuild src/hero3d.source.js --bundle --minify --format=iife --outfile=assets/hero3d.js`.
