# Deploying the site to Crazy Domains

Everything you upload lives in this `website/` folder. The easiest path is to upload
**`razor-pest-website.zip`** and extract it on the server.

> **The zip is a snapshot, not a live view of this folder.** Regenerate it after every
> source edit (PowerShell `System.IO.Compression` step — ask Claude or see the repo
> history; don't use `Compress-Archive`, it breaks subfolder paths on Linux hosts).
>
> **Before uploading:** bump `<lastmod>` in `sitemap.xml` for every page you changed.

---

## 0. Before you start — what you need

You need an **active Linux / cPanel hosting plan** attached to `razorpestcontrol.com.au`.

- If you only **registered the domain**, add a **Web Hosting** plan first (the cheapest
  Linux plan is plenty for a static site).
- Make sure the domain is **assigned/linked** to the hosting plan.

---

## 1. Recommended: upload the zip via cPanel File Manager

1. Log in at **crazydomains.com.au** → **My Account**.
2. Open your **Web Hosting** product → **Manage** → **cPanel**.
3. In cPanel, under **Files**, open **File Manager** → go into **`public_html`**.
4. Click **Upload**, choose **`razor-pest-website.zip`**, wait, then back to File Manager.
5. Select the zip → **Extract** → into the **current folder** (`public_html`).
6. Confirm the result — all of this sits **directly in `public_html`**:
   `index.html`, `404.html`, `styles.css`, `script.js`, `pages.js`, `favicon.svg`,
   `sitemap.xml`, `robots.txt`, `google658067926d573c8c.html`, the `assets/` folder,
   and the **11 page folders** (`about/`, `quote/`, `reviews/` and the 8 service pages).
   ✅ `public_html/index.html`  ❌ `public_html/website/index.html`
7. Delete the leftover `razor-pest-website.zip` from the server (tidy-up).

Visit **https://razorpestcontrol.com.au** — the site should load, and
`https://razorpestcontrol.com.au/quote/` should too.

---

## 2. Alternative: upload by FTP (FileZilla)

1. cPanel → **FTP Accounts** for credentials (host `ftp.razorpestcontrol.com.au`, port 21).
2. Server side: open **`public_html`**. Local side: `C:\claude\razor-pest-control-app\website`.
3. Drag **everything in `website/` EXCEPT** `.git`, `.gitignore`, the `.md` files and the
   `.zip` — that means `index.html`, `404.html`, `styles.css`, `script.js`, `pages.js`,
   `favicon.svg`, `sitemap.xml`, `robots.txt`, `google658067926d573c8c.html`, `assets/`,
   and **all 11 page folders**. Upload the *contents*, not the `website` folder itself.

---

## 3. Server config (.htaccess in public_html)

The `.htaccess` lives **on the server only** (not in this repo). It should contain the
cache/expires rules, the woff2 type, **and the custom 404**:

```apache
ErrorDocument 404 /404.html
```

Add that line if it's missing — without it, visitors on a bad URL get the ugly Apache
default instead of the branded `404.html` this folder ships.

---

## 4. DNS & SSL

- **DNS:** hosting + domain both at Crazy Domains usually links automatically; allow
  24–48 h for changes. Support/live chat can confirm nameservers.
- **SSL:** cPanel → **Security → SSL/TLS Status** → run **AutoSSL**, then enable
  "Force HTTPS Redirect".

---

## 5. Final check after upload

- [ ] `https://razorpestcontrol.com.au` loads with the padlock; interior pages load
      (e.g. `/quote/`, `/termite-inspections-toowoomba/`).
- [ ] A made-up URL (e.g. `/nope/`) shows the branded 404 page.
- [ ] Logo, tiles, reviews and footer all show; no broken images.
- [ ] Submit a test quote → email arrives at admin@razorpestcontrol.com.au AND the lead
      appears in the app's Website Enquiries tab.
- [ ] Prices shown match the app's Website Editor ($245 general / $225 termite
      inspection / $125 rodent / $30 first-treatment offer).
