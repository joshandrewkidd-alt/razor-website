/* ============================================================
   Razor Pest Control — site behaviour
   1. Services: interactive tiles + detail modal (focus-trapped)
   2. Quote form: validate + submit (Web3Forms, mailto fallback)
   3. Reviews marquee (with honest sample/real handling + pause)
   4. FAQ accordion
   5. Footer year
   ============================================================ */

/* ------------------------------------------------------------
   1) SERVICES  (tiles + modal share this one source)
------------------------------------------------------------ */
const SERVICES = [
  {
    id: "general", icon: "🐜", title: "General Pest",
    tagline: "Our most popular treatment. Ants, cockroaches, spiders and silverfish in one visit.",
    price: "from $150 · 12-month warranty",
    desc: "A full interior and exterior treatment that targets the common household pests in a single visit, backed by a 12-month warranty.",
    covers: ["Ants", "Cockroaches", "Spiders", "Silverfish", "Common crawling pests"],
    included: ["Internal treatment", "External perimeter", "Eaves & web knock-down", "Entry points sealed off", "12-month warranty"],
  },
  {
    id: "termites", icon: "🪵", title: "Termites & Timber",
    tagline: "Inspections, barriers and treatments to protect your biggest asset.",
    price: "inspection from $220",
    desc: "Termites are a leading cause of structural damage to Australian homes, and most building insurance does not cover them. We inspect, report and set up the right protection for your property.",
    covers: ["Subterranean termites", "Active infestations", "Pre-purchase timber pest", "Ongoing protection"],
    included: ["Thorough visual inspection", "Written report with photos", "Treatment & barrier options", "Advice on prevention"],
  },
  {
    id: "cockroaches", icon: "🪳", title: "Cockroaches",
    tagline: "Gel, bait and residual treatments for lasting control.",
    price: "from $150",
    desc: "Cockroaches spread bacteria through kitchens and bathrooms and breed fast. We treat the nests and the runs, not just the ones you can see.",
    covers: ["German cockroaches", "American cockroaches", "Kitchen & bathroom infestations"],
    included: ["Gel & bait application", "Residual surface spray", "Harbourage treatment", "12-month warranty on general pest"],
  },
  {
    id: "ants", icon: "🐜", title: "Ants",
    tagline: "Interior and perimeter treatments that stop trails at the source.",
    price: "from $150 (general treatment)",
    desc: "Ants are relentless in the Toowoomba summer. We treat the trails and the nests so they stop marching through your kitchen.",
    covers: ["Black ants", "Coastal brown ants", "Nuisance ant trails"],
    included: ["Interior treatment", "External perimeter barrier", "Nest treatment where found", "Prevention advice"],
  },
  {
    id: "spiders", icon: "🕷️", title: "Spiders",
    tagline: "Web knock-down and residual barriers around eaves and entries.",
    price: "from $150 (general treatment)",
    desc: "From webbing spiders around the eaves to ground-dwellers near the doors, we knock them down and set up a residual barrier.",
    covers: ["Webbing spiders", "Black house spiders", "Ground-dwelling spiders"],
    included: ["Web knock-down", "Eaves & entry treatment", "Residual barrier", "12-month warranty on general pest"],
  },
  {
    id: "rodents", icon: "🐀", title: "Rodents",
    tagline: "Rats and mice. Safe baiting and entry-point proofing.",
    price: "from $180",
    desc: "Rats and mice chew wiring and contaminate food. We bait safely and help seal the entry points so they do not come back.",
    covers: ["Rats", "Mice", "Roof & subfloor activity"],
    included: ["Tamper-resistant bait stations", "Safe placement around pets & kids", "Entry-point proofing advice", "Follow-up options"],
  },
  {
    id: "wasps", icon: "🐝", title: "Wasps & Bees",
    tagline: "Fast, safe nest removal and treatment.",
    price: "from $195",
    desc: "Wasp and bee nests near doors, play areas or eaves are a real risk. We remove and treat them quickly and safely.",
    covers: ["Paper wasps", "European wasps", "Bee swarms & nests"],
    included: ["Nest location & treatment", "Safe removal", "Advice to prevent return", "Priority for urgent jobs"],
  },
  {
    id: "inspections", icon: "🔍", title: "Inspections",
    tagline: "Pre-purchase and routine pest inspections with clear reports.",
    price: "from $220",
    desc: "Buying, selling or just staying on top of it? A thorough inspection with a plain-English written report and photos.",
    covers: ["Pre-purchase inspections", "Routine pest checks", "Timber pest reports"],
    included: ["Full property inspection", "Written report with photos", "Clear findings & recommendations", "Fast turnaround"],
  },
];

const grid = document.getElementById("service-grid");
if (grid) {
  SERVICES.forEach((s) => {
    const tile = document.createElement("button");
    tile.className = "service";
    tile.type = "button";
    tile.setAttribute("aria-haspopup", "dialog");
    tile.dataset.id = s.id;
    tile.innerHTML =
      `<span class="s-ico" aria-hidden="true">${s.icon}</span>` +
      `<h3>${s.title}</h3>` +
      `<p>${s.tagline}</p>` +
      `<span class="more">See details</span>`;
    tile.addEventListener("click", () => openModal(s.id));
    grid.appendChild(tile);
  });
}

// ---- modal ----
const overlay = document.getElementById("service-modal");
const mIco = document.getElementById("modal-ico");
const mTitle = document.getElementById("modal-title");
const mPrice = document.getElementById("modal-price");
const mDesc = document.getElementById("modal-desc");
const mCover = document.getElementById("modal-cover");
const mIncluded = document.getElementById("modal-included");
const mClose = document.getElementById("modal-close");
let lastFocused = null;

function openModal(id) {
  const s = SERVICES.find((x) => x.id === id);
  if (!s || !overlay) return;
  lastFocused = document.activeElement;
  mIco.textContent = s.icon;
  mTitle.textContent = s.title;
  mPrice.textContent = s.price;
  mDesc.textContent = s.desc;
  mCover.innerHTML = s.covers.map((c) => `<li>${c}</li>`).join("");
  mIncluded.innerHTML = s.included.map((c) => `<li>${c}</li>`).join("");
  overlay.hidden = false;
  document.body.classList.add("modal-open");
  mClose.focus();
}

function closeModal() {
  if (!overlay) return;
  overlay.hidden = true;
  document.body.classList.remove("modal-open");
  if (lastFocused) lastFocused.focus();
}

if (overlay) {
  mClose.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
  document.getElementById("modal-cta").addEventListener("click", closeModal);

  // keyboard: Escape closes, Tab is trapped inside the dialog
  document.addEventListener("keydown", (e) => {
    if (overlay.hidden) return;
    if (e.key === "Escape") { closeModal(); return; }
    if (e.key !== "Tab") return;
    const focusable = overlay.querySelectorAll('button, [href], input, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}

/* ------------------------------------------------------------
   2) QUOTE FORM
   ------------------------------------------------------------
   Only MOBILE is required, so partly-filled quotes still come
   through (capture the lead, chase the rest on callback).

   Where requests go, in priority order:
     1. QUOTE_ENDPOINT  — the Razor app API (POST JSON). This is the
        hook into the app: set it and requests go straight in.
     2. WEB3FORMS_KEY   — free no-backend email (web3forms.com).
     3. mailto fallback — opens the visitor's email app to us.

   GOOGLE_MAPS_API_KEY switches on Google address autocomplete /
   validation on the Address field (see initAddressAutocomplete at
   the bottom). Left blank, Address is a plain text field.
------------------------------------------------------------ */
const QUOTE_ENDPOINT      = "";  // <-- Razor app API URL to POST quote requests to
const WEB3FORMS_KEY       = "";  // <-- fallback: Web3Forms access key
const GOOGLE_MAPS_API_KEY = "";  // <-- enables Google address validation AND live reviews
const GOOGLE_PLACE_ID     = "";  // <-- your Google Business Place ID (with the key) to auto-pull live reviews
const CONTACT_EMAIL       = "admin@razorpestcontrol.com.au";

const form = document.getElementById("quote-form");
const statusEl = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");

function setStatus(msg, kind) {
  statusEl.hidden = false;
  statusEl.textContent = msg;
  statusEl.className = "form-status " + (kind || "");
}

function markField(input, ok) {
  const field = input.closest(".field");
  if (!field) return;
  field.classList.toggle("invalid", !ok);
  input.setAttribute("aria-invalid", ok ? "false" : "true");
  let err = field.querySelector(".err");
  if (!ok) {
    if (!err) {
      err = document.createElement("p");
      err.className = "err";
      err.id = input.id + "-err";
      field.appendChild(err);
    }
    err.textContent = input.dataset.err || "This field is required";
    input.setAttribute("aria-describedby", err.id);
  } else if (err) {
    input.removeAttribute("aria-describedby");
    err.remove();
  }
}

function validate() {
  // Mobile is the ONLY required field — partial quotes are welcome.
  const mobile = form.mobile;
  const digits = mobile.value.replace(/[^\d+]/g, "");
  const mobileOk = /^(?:\+?61|0)4\d{8}$/.test(digits);
  mobile.dataset.err = "Enter a mobile so we can get back to you (e.g. 0412 345 678)";
  markField(mobile, mobileOk);
  // Name and address are optional; never block on them.
  markField(form.name, true);
  markField(form.address, true);
  return mobileOk;
}

// Build the payload sent to the app / email. Structured address fields are
// filled by Google validation when enabled, and flow straight through.
function collectQuote() {
  const val = (id) => (document.getElementById(id)?.value || "").trim();
  const name = form.name.value.trim();
  const address = form.address.value.trim();
  return {
    mobile: form.mobile.value.trim(),
    name,
    address,
    note: form.note.value.trim(),
    address_formatted: val("address_formatted"),
    address_place_id: val("address_place_id"),
    address_lat: val("address_lat"),
    address_lng: val("address_lng"),
    source: "razorpestcontrol.com.au",
    partial: !(name && address),           // flag so the app can see partly-filled quotes
    submitted_at: new Date().toISOString(),
  };
}

async function sendQuote(data) {
  // 1) Razor app API
  if (QUOTE_ENDPOINT) {
    const res = await fetch(QUOTE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("app endpoint " + res.status);
    return "app";
  }
  // 2) Web3Forms
  if (WEB3FORMS_KEY) {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: "New quote request: razorpestcontrol.com.au",
        from_name: "Razor Pest Control website",
        mobile: data.mobile,
        name: data.name || "(not given)",
        address: data.address_formatted || data.address || "(not given)",
        note: data.note || "(none)",
        partial: data.partial ? "yes" : "no",
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || "Submission failed");
    return "web3forms";
  }
  // 3) mailto fallback (navigates away to the visitor's email app)
  const body =
    `Mobile: ${data.mobile}\n` +
    `Name: ${data.name || "(not given)"}\n` +
    `Address: ${data.address_formatted || data.address || "(not given)"}\n` +
    `Note: ${data.note || "(none)"}\n`;
  window.location.href =
    `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Quote request")}` +
    `&body=${encodeURIComponent(body)}`;
  return "mailto";
}

if (form) {
  // only mobile needs live re-validation after a failed submit
  form.mobile.addEventListener("input", () => {
    if (form.mobile.closest(".field").classList.contains("invalid")) validate();
  });

  // if the user edits the address by hand, drop any Google-validated data so
  // we never send a stale place_id for a different typed address
  form.address.addEventListener("input", () => {
    ["address_formatted", "address_place_id", "address_lat", "address_lng"]
      .forEach((id) => { const el = document.getElementById(id); if (el) el.value = ""; });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) { setStatus("Please add a mobile number so we can call you back.", "bad"); return; }

    const data = collectQuote();
    submitBtn.disabled = true;
    const original = submitBtn.textContent;
    submitBtn.textContent = "Sending…";

    try {
      const via = await sendQuote(data);
      const first = data.name ? " " + data.name.split(" ")[0] : "";
      setStatus("Thanks" + first + "! Your request is in. We'll be in touch shortly.", "ok");
      if (via !== "mailto") form.reset();
    } catch (err) {
      setStatus("Sorry, something went wrong. Please call us on 0408 763 506.", "bad");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = original;
    }
  });
}

/* ------------------------------------------------------------
   3) REVIEWS
   ------------------------------------------------------------
   Reviews are pulled LIVE from Google when configured: set
   GOOGLE_MAPS_API_KEY + GOOGLE_PLACE_ID (top of this file) and the
   section auto-fills with your real Google reviews and star rating,
   refreshed on every visit (the fetch runs in section 6).

   Until that is configured, the whole section stays HIDDEN, so no
   fake or sample reviews ever go live. Flip SHOW_SAMPLE_REVIEWS to
   true ONLY to preview the layout locally with the placeholder data.
------------------------------------------------------------ */
const SHOW_SAMPLE_REVIEWS = false;

const SAMPLE_REVIEWS = [
  { name: "Sarah M.",   date: "2 weeks ago",  stars: 5, color: "#1F4D3A", text: "Booked a quote online Sunday night and Razor were out by Wednesday. Sorted our cockroach problem completely. Friendly, on time and great value." },
  { name: "Dave R.",    date: "1 month ago",  stars: 5, color: "#A6D936", text: "Had them do a termite inspection before buying our place. Thorough report, explained everything clearly. Would 100% recommend to anyone in Toowoomba." },
  { name: "Kylie T.",   date: "3 weeks ago",  stars: 5, color: "#1B1E22", text: "Ants were driving us mad every summer. One treatment and they're gone. Local, professional and easy to deal with." },
  { name: "Mark H.",    date: "2 months ago", stars: 5, color: "#2f6b4f", text: "Fast response for a wasp nest by the kids' trampoline. Handled it safely and cleaned up after. Top blokes." },
];

const GOOGLE_G = `<svg viewBox="0 0 48 48" width="22" height="22" aria-hidden="true"><path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-2.7-.4-3.9H24v7.1h12.1c-.2 1.8-1.6 4.6-4.5 6.4l6.9 5.3c4.1-3.8 6.6-9.4 6.6-14.9z"/><path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-6.9-5.3c-1.9 1.3-4.4 2.2-7.6 2.2-5.8 0-10.7-3.9-12.5-9.2l-7.1 5.5C8 40.6 15.4 46 24 46z"/><path fill="#FBBC05" d="M11.5 28.4c-.5-1.4-.7-2.9-.7-4.4s.3-3 .7-4.4l-7.1-5.5C2.9 17 2 20.4 2 24s.9 7 2.4 9.9l7.1-5.5z"/><path fill="#EA4335" d="M24 10.4c3.2 0 5.4 1.4 6.7 2.6l6.1-6C33.1 3.4 28.3 1 24 1 15.4 1 8 6.4 4.4 14.1l7.1 5.5C13.3 14.3 18.2 10.4 24 10.4z"/></svg>`;

const reviewsSection = document.getElementById("reviews");
const track = document.getElementById("review-track");

function starRow(n) { return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n); }

function reviewCard(r, isReal) {
  const el = document.createElement("article");
  el.className = "review-card";
  const avatar = r.photo
    ? `<img class="rc-avatar" src="${r.photo}" alt="" referrerpolicy="no-referrer" />`
    : `<div class="rc-avatar" style="background:${r.color || "#1F4D3A"}">${(r.name || "?").charAt(0)}</div>`;
  const brand = isReal ? GOOGLE_G : "";
  const foot = isReal ? "Posted on Google" : "Sample review";
  el.innerHTML = `
    <div class="rc-head">
      ${avatar}
      <div class="rc-meta">
        <div class="rc-name">${r.name || ""}</div>
        <div class="rc-date">${r.date || ""}</div>
      </div>
      ${brand}
    </div>
    <div class="rc-stars" aria-label="${r.stars} out of 5 stars">${starRow(r.stars)}</div>
    <p class="rc-body">${r.text || ""}</p>
    <div class="rc-foot">${foot}</div>
  `;
  return el;
}

function hideReviews() {
  if (reviewsSection) reviewsSection.hidden = true;
  const navLink = document.querySelector('.nav a[href="#reviews"]');
  if (navLink) navLink.style.display = "none";
}

function renderReviews(list, isReal) {
  if (!track) return;
  if (!list || !list.length) { hideReviews(); return; }
  if (reviewsSection) reviewsSection.hidden = false;
  track.innerHTML = "";
  const cards = list.map((r) => reviewCard(r, isReal));
  cards.forEach((c) => track.appendChild(c));
  cards.forEach((c) => track.appendChild(c.cloneNode(true))); // duplicate for seamless loop

  const lead = document.getElementById("reviews-lead");
  if (lead && !isReal) {
    lead.innerHTML = "Sample layout preview only. <strong>These are not real reviews.</strong>";
    lead.classList.add("is-sample");
  }

  // pause / play control (WCAG 2.2.2 — let people stop moving content)
  const pauseBtn = document.getElementById("review-pause");
  if (pauseBtn) {
    pauseBtn.onclick = () => {
      const paused = track.style.animationPlayState === "paused";
      track.style.animationPlayState = paused ? "running" : "paused";
      pauseBtn.textContent = paused ? "Pause" : "Play";
      pauseBtn.setAttribute("aria-pressed", paused ? "false" : "true");
    };
  }
}

// Decide what to show on load.
if (GOOGLE_MAPS_API_KEY && GOOGLE_PLACE_ID) {
  if (reviewsSection) reviewsSection.hidden = true;   // revealed by the live fetch (section 6)
} else if (SHOW_SAMPLE_REVIEWS) {
  renderReviews(SAMPLE_REVIEWS, false);
} else {
  hideReviews();                                      // nothing real to show yet
}

/* ------------------------------------------------------------
   4) FAQ accordion
------------------------------------------------------------ */
document.querySelectorAll(".acc-item").forEach((item) => {
  const q = item.querySelector(".acc-q");
  const a = item.querySelector(".acc-a");
  q.addEventListener("click", () => {
    const open = item.classList.toggle("open");
    q.setAttribute("aria-expanded", open ? "true" : "false");
    a.setAttribute("aria-hidden", open ? "false" : "true");
    a.style.maxHeight = open ? a.scrollHeight + "px" : null;
  });
});

/* ------------------------------------------------------------
   5) Footer year
------------------------------------------------------------ */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ------------------------------------------------------------
   6) Google integration  (address validation + live reviews)
   ------------------------------------------------------------
   Loads the Google Maps JS API once GOOGLE_MAPS_API_KEY is set,
   then powers two things:
     - address autocomplete / validation on the Address field
     - live Google reviews (also needs GOOGLE_PLACE_ID)
   Nothing loads until the key is set.
------------------------------------------------------------ */
window.initGoogleServices = function () {
  initAddressAutocomplete();
  fetchGoogleReviews();
};

function initAddressAutocomplete() {
  if (!window.google || !google.maps || !google.maps.places || !google.maps.places.Autocomplete) return;
  const input = document.getElementById("address");
  if (!input) return;
  const ac = new google.maps.places.Autocomplete(input, {
    componentRestrictions: { country: "au" },
    fields: ["formatted_address", "geometry", "place_id"],
    types: ["address"],
  });
  ac.addListener("place_changed", () => {
    const p = ac.getPlace() || {};
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ""; };
    set("address_formatted", p.formatted_address);
    set("address_place_id", p.place_id);
    if (p.geometry && p.geometry.location) {
      set("address_lat", p.geometry.location.lat());
      set("address_lng", p.geometry.location.lng());
    }
    if (p.formatted_address) input.value = p.formatted_address;
  });
}

async function fetchGoogleReviews() {
  if (!GOOGLE_PLACE_ID || !window.google || !google.maps || !google.maps.places) return;
  const setRating = (rating, count) => {
    const lead = document.getElementById("reviews-lead");
    if (lead && rating) lead.textContent =
      `Rated ${Number(rating).toFixed(1)} on Google from ${count || ""} reviews`.replace(" from  reviews", "");
  };
  try {
    if (google.maps.places.Place) {                       // current Places API
      const place = new google.maps.places.Place({ id: GOOGLE_PLACE_ID });
      await place.fetchFields({ fields: ["reviews", "rating", "userRatingCount"] });
      const list = (place.reviews || []).map((rv) => ({
        name: (rv.authorAttribution && rv.authorAttribution.displayName) || "Google user",
        photo: (rv.authorAttribution && rv.authorAttribution.photoURI) || "",
        date: rv.relativePublishTimeDescription || "",
        stars: Math.round(rv.rating || 5),
        text: (rv.text && rv.text.text) || (typeof rv.text === "string" ? rv.text : ""),
      }));
      if (!list.length) { hideReviews(); return; }
      renderReviews(list, true);
      setRating(place.rating, place.userRatingCount);
    } else if (google.maps.places.PlacesService) {        // legacy fallback
      const svc = new google.maps.places.PlacesService(document.createElement("div"));
      svc.getDetails({ placeId: GOOGLE_PLACE_ID, fields: ["reviews", "rating", "user_ratings_total"] }, (place, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !place || !place.reviews || !place.reviews.length) { hideReviews(); return; }
        const list = place.reviews.map((rv) => ({
          name: rv.author_name, photo: rv.profile_photo_url, date: rv.relative_time_description,
          stars: Math.round(rv.rating || 5), text: rv.text,
        }));
        renderReviews(list, true);
        setRating(place.rating, place.user_ratings_total);
      });
    }
  } catch (e) {
    hideReviews();
  }
}

if (GOOGLE_MAPS_API_KEY) {
  const s = document.createElement("script");
  s.src = "https://maps.googleapis.com/maps/api/js?key=" + encodeURIComponent(GOOGLE_MAPS_API_KEY) +
          "&libraries=places&loading=async&callback=initGoogleServices";
  s.async = true; s.defer = true;
  document.head.appendChild(s);
}
