# razorpestcontrol.com.au — marketing site

A **static, multi-page** marketing site for Razor Pest Control. No build step, no
framework — plain HTML/CSS/JS you can edit directly.

```
website/
├─ index.html                        # homepage (the "pest control Toowoomba" page)
├─ 404.html                          # branded not-found page (needs ErrorDocument, see DEPLOY)
├─ styles.css                        # all styling (brand colours + responsive + interior pages)
├─ script.js                         # HOMEPAGE ONLY: tiles/modals, reviews marquee, form, pricing
├─ pages.js                          # INTERIOR PAGES ONLY: accordion, form, pricing, reviews merge
├─ favicon.svg                       # shield mark favicon
├─ sitemap.xml / robots.txt          # SEO
├─ google658067926d573c8c.html       # Google Search Console verification — do not delete
├─ assets/                           # optimised logos, og-image.jpg, apple-touch-icon, fonts/
└─ <slug>/index.html                 # 11 interior pages:
   about, ant-control, cockroach-control, commercial-pest-control, quote,
   residential-pest-control, reviews, rodent-control, spider-control,
   termite-inspections-toowoomba, termite-treatment-toowoomba
```

## Preview locally

```bash
cd website
python -m http.server 8080
# → http://localhost:8080
```

(Serve it — don't open `index.html` directly — because interior pages use root-relative
paths like `/styles.css`.)

## How things work (current, live behaviour)

- **Quote form** (homepage + `/quote/`): **name + address + mobile all required**.
  Submits via **Web3Forms** (key already set in both JS files) to
  admin@razorpestcontrol.com.au, with a mailto fallback, and also POSTs the lead
  (best-effort) to the Razor app at `API_BASE /enquiries` so it lands in the app's
  Website Enquiries tab. A Google Ads conversion fires once on success.
- **Prices**: baked-in fallbacks live in the `PRICING` object in **both** `script.js` and
  `pages.js` — general **$245**, units **$155**, termite inspection **$225**, rodent
  **$125**, wasp **$215**, plus the **$30** first-treatment offer. On load, the site
  fetches live overrides from the app (`API_BASE /site/pricing.json`) and fills every
  `data-price="key"` element. **When a price changes:** update it in the app's Website
  Editor (instant, site-wide) and keep the two `PRICING` fallbacks + any hardcoded
  numbers in page meta descriptions/JSON-LD in sync.
- **Reviews**: 5 real Google reviews are hardcoded (`REVIEWS_ARE_REAL = true`), merged
  with any extra reviews the office publishes from the app (`/site/reviews.json`).
- **Fonts**: Montserrat + Inter are **self-hosted** in `assets/fonts/` and preloaded.
  Don't add Google Fonts tags back.
- **Google tag** (`AW-18346114707`) loads standard/async on page view on every page —
  needed for Google Ads verification and conversion attribution. Don't defer it.

## Business facts baked in (keep consistent everywhere)

- **Razor Pest Control**, 47 Drummond St, Rangeville QLD 4350 · since **2012**
- **1300 536 168** / **0408 763 506** · admin@razorpestcontrol.com.au
- **ABN 43 104 725 215 · PMT 1003984313 · QBCC 15343231**
- Hours: **Mon–Sat 9am–5pm**, Sunday closed
- Brand: Charcoal `#1B1E22` · Forest `#1F4D3A` · Lime `#A6D936` · Montserrat + Inter
- Copy stays ACCC-safe: no "guaranteed", "100% safe" or forever-style claims.

## Deploy

See **DEPLOY-crazy-domains.md**. Short version: rebuild `razor-pest-website.zip`, upload
to cPanel, extract into `public_html`. The zip is a **snapshot** — regenerate it after
every source edit.
