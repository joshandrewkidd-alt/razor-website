# razorpestcontrol.com.au — marketing site

A single-page, **static** marketing site for Razor Pest Control. No build step, no
framework — just `index.html`, `styles.css`, `script.js` and the brand assets.

```
website/
├─ index.html      # the page
├─ styles.css      # all styling (brand colours + responsive)
├─ script.js       # form handling + reviews + year
├─ favicon.svg     # shield mark favicon
├─ assets/         # logos (from /logo and branding) + og image
└─ README.md
```

## Preview locally

Open `index.html` directly, or serve the folder:

```bash
cd website
python -m http.server 8080
# → http://localhost:8080
```

## Pre-launch checklist (do these before going live)

**1. Wire up the quote form.**
Only **Mobile** is required, so partly-filled quotes still come through (you capture the lead and
chase the rest on callback). Requests are sent in priority order (all set at the top of `script.js`):
- `QUOTE_ENDPOINT` — **the hook into the Razor app.** Set it to the app's API URL and quote
  requests POST straight in as JSON (fields: `mobile, name, address, note`, the structured
  `address_*` fields, plus `source`, `partial`, `submitted_at`).
- `WEB3FORMS_KEY` — fallback free no-backend email ([web3forms.com](https://web3forms.com), enter
  **admin@razorpestcontrol.com.au**).
- Neither set → opens the visitor's own email app pre-addressed to you.

**1b. Google address validation (optional, ready to switch on).**
The Address field is wired for Google Places Autocomplete. Add `GOOGLE_MAPS_API_KEY` at the top of
`script.js` and as-you-type address validation turns on, filling the hidden `address_formatted /
place_id / lat / lng` fields that flow through to the app. Left blank, Address is a plain text field.

**2. Turn on live Google reviews.**
Reviews auto-pull from Google. Set **both** at the top of `script.js`:
`GOOGLE_MAPS_API_KEY` and `GOOGLE_PLACE_ID`. The section then fills with your real Google
reviews + star rating, refreshed on every visit. **Until both are set, the reviews section
hides itself entirely** (nothing fake or sample-looking ever goes live).

- **Place ID:** find yours at https://developers.google.com/maps/documentation/places/web-service/place-id (search your business).
- **API key:** in [Google Cloud Console](https://console.cloud.google.com) create a project, enable
  the **Places API**, make an **API key**, and restrict it to HTTP referrer
  `razorpestcontrol.com.au/*`. (Google's API returns your 5 most-relevant reviews.)
- The same key powers the address validation in step 1b.
- `SHOW_SAMPLE_REVIEWS = true` in `script.js` only previews the layout locally; leave it `false`.

Prefer a no-Google-Cloud option that syncs *all* your reviews? A widget like **Featurable**
(free) or **Elfsight** connects to your Google Business Profile, at the cost of a third-party
script. Ask Josh to swap it in if you'd rather that.

**3. ABN — done.** Footer shows the real ABN `63 706 352 486`.

**4. Confirm the prices and the offer.** The "from" prices ($150 / $130 / $220 / $180 / $195)
and the "$30 off your first treatment" offer are sensible defaults based on your own past jobs
plus the local market. Confirm every "from" price is genuinely available and the offer will be
honoured, then adjust any figure you want to change (in `index.html` pricing cards + the FAQ,
and the per-service prices in `script.js`).

**5. Add your licence number (optional but recommended).** The site states "Licensed QLD Pest
Management Technicians"; add your actual PMT licence number near the credentials block for extra
trust. Only claim memberships (AEPMA, HACCP, etc.) you actually hold.

## Deploy

It's plain static files — host anywhere:

- **Cloudflare Pages / Netlify / SWA** — point at this `website/` folder, no build command.
- **Any web host** — upload the folder contents to the site root.

Then point `razorpestcontrol.com.au` DNS at the host.

## Details baked in
- Business: **Razor Pest Control**, Toowoomba QLD · **0408 763 506** · admin@razorpestcontrol.com.au
- Brand: Charcoal `#1B1E22` · Forest Green `#1F4D3A` · Lime `#A6D936` · Montserrat + Inter
- SEO: title/description, Open Graph tags, `PestControlService` structured data, canonical URL.
