# Deploying the site to Crazy Domains

Everything you upload lives in this `website/` folder. The easiest path is to upload the
ready-made **`razor-pest-website.zip`** and extract it on the server.

---

## 0. Before you start — what you need

You need an **active Linux / cPanel hosting plan** attached to `razorpestcontrol.com.au`.

- If you only **registered the domain** with Crazy Domains, you don't have hosting yet —
  add a **Web Hosting** plan first (their cheapest "Starter/Web Hosting" Linux plan is
  plenty for a static site). Domain registration alone can't host files.
- If you already have a hosting plan, make sure the domain is **assigned/linked** to it
  (in the hosting dashboard there's usually an "Add/Assign Domain" or "Primary domain"
  option). The files go to that domain's web root.

---

## 1. Recommended: upload the zip via cPanel File Manager

No extra software needed.

1. Log in at **crazydomains.com.au** → **My Account**.
2. Open your **Web Hosting** product → **Manage** → find the link to **cPanel**
   (may be labelled "cPanel", "Go to cPanel", or "Advanced").
3. In cPanel, under **Files**, open **File Manager**.
4. Go into **`public_html`** — this is your website's root folder (what visitors see at
   `razorpestcontrol.com.au`).
   - If `public_html` already has a default/placeholder page (e.g. `index.html` or a
     "coming soon" file), delete those first so they don't override the new site.
   - If the domain is an **add-on domain**, its root may be a subfolder like
     `public_html/razorpestcontrol.com.au/` instead — upload there.
5. Click **Upload**, choose **`razor-pest-website.zip`**, wait for it to finish, then go
   back to File Manager.
6. Select `razor-pest-website.zip` → click **Extract** → extract into the **current
   folder** (`public_html`).
7. Confirm the result: `index.html`, `styles.css`, `script.js`, `favicon.svg` sit
   **directly in `public_html`**, with an **`assets/`** folder next to them.
   ✅ `public_html/index.html`  ❌ `public_html/website/index.html`
8. Delete the leftover `razor-pest-website.zip` from the server (tidy-up).

Visit **https://razorpestcontrol.com.au** — the site should load.

---

## 2. Alternative: upload by FTP (FileZilla)

If you prefer FTP instead of File Manager:

1. In cPanel → **FTP Accounts**, grab (or create) your FTP login. You'll have:
   - **Host:** `ftp.razorpestcontrol.com.au` (or the server IP shown in cPanel)
   - **Username / Password:** your FTP or cPanel credentials
   - **Port:** `21`
2. Install **FileZilla** (free), connect with those details.
3. On the right (server) side, open **`public_html`**.
4. On the left (your PC), open `C:\claude\razor-pest-control-app\website`.
5. Drag **the contents** — `index.html`, `styles.css`, `script.js`, `favicon.svg`, and
   the **`assets`** folder — into `public_html`. (Upload the *contents*, not the
   `website` folder itself, and skip the `.md` and `.zip` files.)

---

## 3. DNS & SSL

- **DNS:** if the domain is registered **and** hosted at Crazy Domains, linking hosting to
  the domain usually points it automatically. If the site doesn't resolve, check in the
  domain's DNS/nameserver settings that it points at your hosting (Crazy Domains support
  can confirm the right nameservers). Allow up to **24–48 h** for changes to propagate.
- **SSL (https):** in cPanel → **Security → SSL/TLS Status**, run **AutoSSL** (free
  Let's Encrypt) for the domain so it loads on **https**. Most Crazy Domains plans include
  this. Then, ideally, enable "Force HTTPS Redirect" so `http://` visitors are sent to
  `https://`.

---

## 4. Content edits before (or right after) upload

Easiest to edit locally and re-upload, or edit directly in cPanel File Manager (right-click a
file → **Edit**). Full detail is in **README.md → Pre-launch checklist**; the essentials:

1. **Quote form → your inbox** (`script.js`). Get a free access key at **web3forms.com** (enter
   `admin@razorpestcontrol.com.au`), then set `const WEB3FORMS_KEY = "your-key-here";`. Until
   this is set, the form opens the visitor's email app to you instead.
2. **Real reviews** (`script.js`). The reviews are SAMPLES and are labelled "Sample review" on
   the page. Replace the `REVIEWS` array with your genuine Google reviews and set
   `REVIEWS_ARE_REAL = true` (or send Josh your Google Business Place ID for a live feed). Do
   not publish invented reviews as real.
3. **Your real ABN** (`index.html` footer) in place of `ABN 00 000 000 000`.
4. **Confirm the prices + the $30 offer** (`index.html` pricing cards and FAQ, `script.js`
   per-service prices) are what you'll actually charge and honour.

If you edit locally and re-upload: just overwrite the changed file on the server, or re-run the
zip step and re-extract.

---

## 5. Final check

- [ ] `https://razorpestcontrol.com.au` loads with the green padlock (SSL).
- [ ] Logo, hero, services, reviews and footer all show; no broken images.
- [ ] Submit a test quote → it reaches `admin@razorpestcontrol.com.au` (once the
      Web3Forms key is set).
- [ ] Reviews are your real ones, not the samples.

Any trouble with the hosting side (assigning the domain, nameservers, SSL) — Crazy Domains
support/live chat can do those steps for you in a couple of minutes.
