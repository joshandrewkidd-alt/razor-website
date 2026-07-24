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
    price: "from $245 · 12-month warranty",
    desc: "A full interior and exterior treatment that targets the common household pests in a single visit, backed by a 12-month warranty.",
    covers: ["Ants", "Cockroaches", "Spiders", "Silverfish", "Common crawling pests"],
    included: ["Internal treatment", "External perimeter", "Eaves & web knock-down", "Entry points sealed off", "12-month warranty"],
  },
  {
    id: "termites", icon: "🪵", title: "Termites & Timber",
    tagline: "Inspections, barriers and treatments to protect your biggest asset.",
    price: "inspection from $225",
    desc: "Termites are a leading cause of structural damage to Australian homes, and most building insurance does not cover them. We inspect, report and set up the right protection for your property.",
    covers: ["Subterranean termites", "Active infestations", "Pre-purchase timber pest", "Ongoing protection"],
    included: ["Thorough visual inspection", "Written report with photos", "Treatment & barrier options", "Advice on prevention"],
  },
  {
    id: "cockroaches", icon: "🪳", title: "Cockroaches",
    tagline: "Gel, bait and residual treatments for lasting control.",
    price: "from $245",
    desc: "Cockroaches spread bacteria through kitchens and bathrooms and breed fast. We treat the nests and the runs, not just the ones you can see.",
    covers: ["German cockroaches", "American cockroaches", "Kitchen & bathroom infestations"],
    included: ["Gel & bait application", "Residual surface spray", "Harbourage treatment", "12-month warranty on general pest"],
  },
  {
    id: "ants", icon: "🐜", title: "Ants",
    tagline: "Interior and perimeter treatments that stop trails at the source.",
    price: "from $245 (general treatment)",
    desc: "Ants are relentless in the Toowoomba summer. We treat the trails and the nests so they stop marching through your kitchen.",
    covers: ["Black ants", "Coastal brown ants", "Nuisance ant trails"],
    included: ["Interior treatment", "External perimeter barrier", "Nest treatment where found", "Prevention advice"],
  },
  {
    id: "spiders", icon: "🕷️", title: "Spiders",
    tagline: "Web knock-down and residual barriers around eaves and entries.",
    price: "from $245 (general treatment)",
    desc: "From webbing spiders around the eaves to ground-dwellers near the doors, we knock them down and set up a residual barrier.",
    covers: ["Webbing spiders", "Black house spiders", "Ground-dwelling spiders"],
    included: ["Web knock-down", "Eaves & entry treatment", "Residual barrier", "12-month warranty on general pest"],
  },
  {
    id: "rodents", icon: "🐀", title: "Rodents",
    tagline: "Rats and mice. Safe baiting and entry-point proofing.",
    price: "from $125",
    desc: "Rats and mice chew wiring and contaminate food. We bait safely and help seal the entry points so they do not come back.",
    covers: ["Rats", "Mice", "Roof & subfloor activity"],
    included: ["Tamper-resistant bait stations", "Safe placement around pets & kids", "Entry-point proofing advice", "Follow-up options"],
  },
  {
    id: "wasps", icon: "🐝", title: "Wasps & Bees",
    tagline: "Fast, safe nest removal and treatment.",
    price: "from $215",
    desc: "Wasp and bee nests near doors, play areas or eaves are a real risk. We remove and treat them quickly and safely.",
    covers: ["Paper wasps", "European wasps", "Bee swarms & nests"],
    included: ["Nest location & treatment", "Safe removal", "Advice to prevent return", "Priority for urgent jobs"],
  },
  {
    id: "inspections", icon: "🔍", title: "Inspections",
    tagline: "Pre-purchase and routine pest inspections with clear reports.",
    price: "from $225",
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
  mPrice.style.display = "";
  document.getElementById("modal-col-2").style.display = "";
  document.getElementById("modal-cover-h").textContent = "What it covers";
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
   1b) COMMERCIAL SECTORS (homepage business tiles + detail modal, no pricing)
------------------------------------------------------------ */
const SECTORS = [
  {
    id: "real-estate", icon: "🏘️", title: "Real estate & property",
    why: "For agencies and property managers, a pest issue can hold up a settlement, spark a bond dispute or land in your reviews. We give you fast, documented service you can rely on and drop straight into a file.",
    jobs: ["End-of-lease and bond treatments", "Routine treatments across rental portfolios", "Pre-settlement and pre-purchase checks", "Photographed written reports for tenancy records", "Fast turnaround when a deal is on the clock"],
  },
  {
    id: "schools", icon: "🏫", title: "Schools & childcare",
    why: "Schools and childcare centres are held to a high standard, and everything has to be safe around kids. We work to a program, not a panic call, with low-tox products and the paperwork your compliance needs.",
    jobs: ["After-hours and school-holiday treatments", "Low-toxicity, child-safe products", "Ongoing integrated pest management programs", "Rodent and cockroach control in kitchens and grounds", "Documentation for audits and compliance"],
  },
  {
    id: "motels", icon: "🏨", title: "Motels & hospitality",
    why: "In accommodation, one pest sighting can become a bad review. We keep it discreet and proactive so your guests never see the problem and your rooms stay bookable.",
    jobs: ["Discreet scheduled room and common-area treatments", "Bed bug inspections and treatments", "Cockroach and ant control in kitchens and bars", "Rodent proofing and baiting", "Reporting for your records"],
  },
  {
    id: "cafes", icon: "☕", title: "Cafes, restaurants & food",
    why: "Food businesses live and die on their hygiene reputation and their audits. We keep pests out and keep the evidence, so a health inspection is never a worry.",
    jobs: ["Food-safe treatments around prep and storage areas", "Cockroach and rodent control", "Pest sighting register and service reports", "HACCP-aligned documentation", "Flexible timing around service hours"],
  },
  {
    id: "strata", icon: "🏢", title: "Body corporate & strata",
    why: "Strata pest issues sit across the line between common property and individual lots, which makes them fiddly. We coordinate access, treat the common areas and report clearly back to the committee.",
    jobs: ["Common-property treatment programs", "Coordinated access across multiple units", "Rodent, cockroach and spider control", "Clear reporting for committee meetings", "Advice on the common-property vs lot-owner split"],
  },
  {
    id: "rural", icon: "🐄", title: "Rural & acreage",
    why: "Sheds, barns and rural homes bring their own pest pressure, rodents especially. We treat larger and harder-to-reach properties right across the Downs.",
    jobs: ["Rodent baiting and proofing for sheds and barns", "General pest treatments for rural homes", "Spider and wasp control around outbuildings", "Advice on keeping pests out of stored feed and grain", "Service across the wider Darling Downs"],
  },
];

function openSectorModal(id) {
  const s = SECTORS.find((x) => x.id === id);
  if (!s || !overlay) return;
  lastFocused = document.activeElement;
  mIco.textContent = s.icon;
  mTitle.textContent = s.title;
  mPrice.textContent = "";
  mPrice.style.display = "none";
  mDesc.textContent = s.why;
  document.getElementById("modal-cover-h").textContent = "What we do";
  mCover.innerHTML = s.jobs.map((j) => `<li>${j}</li>`).join("");
  document.getElementById("modal-col-2").style.display = "none";
  overlay.hidden = false;
  document.body.classList.add("modal-open");
  mClose.focus();
}

document.querySelectorAll(".sector[data-sector]").forEach((btn) => {
  btn.addEventListener("click", () => openSectorModal(btn.dataset.sector));
});

/* ------------------------------------------------------------
   2) QUOTE FORM
   ------------------------------------------------------------
   Works with ZERO backend via Web3Forms (free):
     1. Go to https://web3forms.com  →  enter admin@razorpestcontrol.com.au
     2. Copy the "Access Key" they email you
     3. Paste it below as WEB3FORMS_KEY
   Until a key is set, the form falls back to opening the
   visitor's email app pre-addressed to you (mailto).
------------------------------------------------------------ */
const WEB3FORMS_KEY = "6dedaa4c-9ac4-4917-bab8-ff5895fe08b1";  // Web3Forms access key → emails to admin@razorpestcontrol.com.au
const CONTACT_EMAIL = "admin@razorpestcontrol.com.au";

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
  let ok = true;
  const name = form.name, address = form.address, mobile = form.mobile;

  const nameOk = name.value.trim().length >= 2;
  name.dataset.err = "Please enter your name";
  markField(name, nameOk); ok = ok && nameOk;

  const addrOk = address.value.trim().length >= 4;
  address.dataset.err = "Please enter your address";
  markField(address, addrOk); ok = ok && addrOk;

  const digits = mobile.value.replace(/[^\d+]/g, "");
  const mobileOk = /^(?:\+?61|0)4\d{8}$/.test(digits);
  mobile.dataset.err = "Enter a valid mobile (e.g. 0412 345 678)";
  markField(mobile, mobileOk); ok = ok && mobileOk;

  return ok;
}

if (form) {
  ["name", "address", "mobile"].forEach((n) => {
    form[n].addEventListener("input", () => {
      if (form[n].closest(".field").classList.contains("invalid")) validate();
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) { setStatus("Please check the highlighted fields.", "bad"); return; }

    const data = {
      name: form.name.value.trim(),
      address: form.address.value.trim(),
      mobile: form.mobile.value.trim(),
      note: form.note.value.trim(),
    };

    submitBtn.disabled = true;
    const original = submitBtn.textContent;
    submitBtn.textContent = "Sending…";

    try {
      if (WEB3FORMS_KEY) {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: "New quote request: razorpestcontrol.com.au",
            from_name: "Razor Pest Control website",
            name: data.name, address: data.address, mobile: data.mobile, note: data.note || "(none)",
          }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message || "Submission failed");
        setStatus("Thanks " + data.name.split(" ")[0] + "! Your request is in. We'll be in touch shortly.", "ok");
        form.reset();
      } else {
        const body = `Name: ${data.name}\nAddress: ${data.address}\nMobile: ${data.mobile}\nNote: ${data.note || "(none)"}\n`;
        window.location.href =
          `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Quote request from " + data.name)}` +
          `&body=${encodeURIComponent(body)}`;
        setStatus("Opening your email app to send the request to us…", "ok");
      }
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
   IMPORTANT — read before launch:
   The entries below are SAMPLE reviews so you can see the design.
   While REVIEWS_ARE_REAL is false, each card is clearly labelled
   "Sample review" and no Google branding is shown, so nothing on
   the page pretends to be a genuine Google review.

   TO GO LIVE with real reviews:
     1. Replace the REVIEWS array with your genuine Google reviews
        (real names, dates and wording), then
     2. Set REVIEWS_ARE_REAL = true.
   Or send Josh your Google Business "Place ID" to wire up a live
   Google feed instead. Never present invented reviews as real —
   it breaches Australian Consumer Law.
------------------------------------------------------------ */
const REVIEWS_ARE_REAL = true;

// Genuine customer reviews (from our Google listing). Transcribed verbatim — do not edit wording.
const REVIEWS = [
  { name: "Juliet Laila", date: "a year ago",   stars: 5, color: "#1F4D3A", text: "Trevor was lovely to speak to and answered all my questions about pest control and termite treatments. I spoke to him a month before my house settlement and he even dropped by the property to do a check as well. I contacted him again when I got the date of settlement and he was able to organise the treatment to be completed within such short notice. Thank you for the wonderful service!" },
  { name: "Tim Adair",    date: "a year ago",   stars: 5, color: "#A6D936", text: "Fantastic service. Needed a last minute job done for end of lease. Trevor is very polite, punctual and professional. Highly recommend." },
  { name: "Kara Gordon",  date: "4 years ago",  stars: 5, color: "#1B1E22", text: "had razors come to get rid of the fleas and im very pleased with them and will definitely use them in the future i would highly recommend if you are after someone affordable and who takes care of their customers as he likes to do a follow through after aswell" },
  { name: "Maria Gane",   date: "a year ago",   stars: 5, color: "#2f6b4f", text: "Stellar service, polite, knowledgeable, prompt and thorough. I recommend Razor Pest Control for any pest concerns." },
  { name: "Angel Sims",   date: "2 years ago", stars: 5, color: "#8dbf22", text: "Communicated easily, great response time, showed up exactly on appointment time and spray tech was very lovely." },
];

const GOOGLE_G = `<svg viewBox="0 0 48 48" width="22" height="22" aria-hidden="true"><path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-2.7-.4-3.9H24v7.1h12.1c-.2 1.8-1.6 4.6-4.5 6.4l6.9 5.3c4.1-3.8 6.6-9.4 6.6-14.9z"/><path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-6.9-5.3c-1.9 1.3-4.4 2.2-7.6 2.2-5.8 0-10.7-3.9-12.5-9.2l-7.1 5.5C8 40.6 15.4 46 24 46z"/><path fill="#FBBC05" d="M11.5 28.4c-.5-1.4-.7-2.9-.7-4.4s.3-3 .7-4.4l-7.1-5.5C2.9 17 2 20.4 2 24s.9 7 2.4 9.9l7.1-5.5z"/><path fill="#EA4335" d="M24 10.4c3.2 0 5.4 1.4 6.7 2.6l6.1-6C33.1 3.4 28.3 1 24 1 15.4 1 8 6.4 4.4 14.1l7.1 5.5C13.3 14.3 18.2 10.4 24 10.4z"/></svg>`;

function starRow(n) { return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n); }

function reviewCard(r) {
  const el = document.createElement("article");
  el.className = "review-card";
  const brand = "";
  const foot = REVIEWS_ARE_REAL ? "Customer review" : "Sample review";
  el.innerHTML = `
    <div class="rc-head">
      <div class="rc-avatar" style="background:${r.color}">${r.name.charAt(0)}</div>
      <div class="rc-meta">
        <div class="rc-name">${r.name}</div>
        <div class="rc-date">${r.date}</div>
      </div>
      ${brand}
    </div>
    <div class="rc-stars" aria-label="${r.stars} out of 5 stars">${starRow(r.stars)}</div>
    <p class="rc-body">${r.text}</p>
    <div class="rc-foot">${foot}</div>
  `;
  return el;
}

const track = document.getElementById("review-track");
if (track) {
  const cards = REVIEWS.map(reviewCard);
  cards.forEach((c) => track.appendChild(c));
  cards.forEach((c) => track.appendChild(c.cloneNode(true))); // duplicate for seamless loop

  // honest labelling of the section when using sample data
  const lead = document.getElementById("reviews-lead");
  if (lead && !REVIEWS_ARE_REAL) {
    lead.innerHTML = "Sample reviews shown below so you can see the layout. " +
      "<strong>Replace these with your real Google reviews before launch.</strong>";
    lead.classList.add("is-sample");
  } else if (lead) {
    lead.textContent = "Real feedback from homes and businesses we've helped.";
  }

  // pause / play control (WCAG 2.2.2 — let people stop moving content)
  const pauseBtn = document.getElementById("review-pause");
  if (pauseBtn) {
    pauseBtn.addEventListener("click", () => {
      const paused = track.style.animationPlayState === "paused";
      track.style.animationPlayState = paused ? "running" : "paused";
      pauseBtn.textContent = paused ? "Pause" : "Play";
      pauseBtn.setAttribute("aria-pressed", paused ? "false" : "true");
    });
  }
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
   6) Pre-fill the quote note when a specific service's
      "Get a quote" is clicked (pricing cards + service modal)
------------------------------------------------------------ */
(function () {
  const note = document.getElementById("note");
  if (!note) return;
  const PREFIX = 'Hi, I\'m interested in your service for ';
  let lastAuto = ""; // only overwrite an untouched auto-message, never the visitor's own text

  function prefillFor(service) {
    if (!service) return;
    const msg = `${PREFIX}"${service}".`;
    if (note.value.trim() === "" || note.value === lastAuto) {
      note.value = msg;
      lastAuto = msg;
    }
  }

  // Pricing cards: use the card's heading as the service name
  document.querySelectorAll('.price-card a[href="#quote"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      const h = btn.closest(".price-card")?.querySelector("h3");
      if (h) prefillFor(h.textContent.trim());
    });
  });

  // Service detail modal: use the currently-shown service title
  const modalCta = document.getElementById("modal-cta");
  const modalTitle = document.getElementById("modal-title");
  if (modalCta && modalTitle) {
    modalCta.addEventListener("click", () => prefillFor(modalTitle.textContent.trim()));
  }
})();
