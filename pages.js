/* Shared behaviour for interior (service / location) pages: FAQ accordion + footer year. */

/* Live pricing — filled from the app's Website Editor via /site/pricing.json.
   Every element tagged data-price="key" is updated; defaults below are the fallback. */
const API_BASE = "https://razor-pest-control-app.onrender.com";
const PRICING = { general: 245, unit: 155, termiteInspection: 225, rodent: 125, wasp: 215, firstOff: 30 };

function fillPriceHooks() {
  document.querySelectorAll("[data-price]").forEach((el) => {
    const key = el.dataset.price;
    if (key && key in PRICING) el.textContent = PRICING[key];
  });
}

async function loadPricing() {
  fillPriceHooks();
  try {
    const res = await fetch(API_BASE + "/site/pricing.json", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    Object.keys(PRICING).forEach((k) => { if (typeof data[k] === "number") PRICING[k] = data[k]; });
    fillPriceHooks();
  } catch (e) { /* keep the defaults above */ }
}
loadPricing();

/** Record a website lead in the app's "Website Enquiries" tab (best-effort; the email is the fallback). */
function postEnquiryToApp(data) {
  const message = [data.note, data.address ? "Address: " + data.address : null]
    .filter(Boolean).join("\n") || null;
  fetch(API_BASE + "/enquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: data.name, phone: data.mobile || null, message: message, source: "Website" }),
  }).catch(() => { /* the Web3Forms email still notifies us */ });
}

document.querySelectorAll(".acc-item").forEach((item) => {
  const q = item.querySelector(".acc-q");
  const a = item.querySelector(".acc-a");
  if (!q || !a) return;
  q.addEventListener("click", () => {
    const open = item.classList.toggle("open");
    q.setAttribute("aria-expanded", open ? "true" : "false");
    a.setAttribute("aria-hidden", open ? "false" : "true");
    a.style.maxHeight = open ? a.scrollHeight + "px" : null;
  });
});

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* Quote form (used on /quote/). Mirrors the homepage form: name + address + mobile required. */
const WEB3FORMS_KEY = "6dedaa4c-9ac4-4917-bab8-ff5895fe08b1";
const CONTACT_EMAIL = "admin@razorpestcontrol.com.au";
const qForm = document.getElementById("quote-form");
if (qForm) {
  const statusEl = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");
  const setStatus = (msg, kind) => { statusEl.hidden = false; statusEl.textContent = msg; statusEl.className = "form-status " + (kind || ""); };
  const mark = (input, ok) => {
    const field = input.closest(".field"); if (!field) return;
    field.classList.toggle("invalid", !ok);
    input.setAttribute("aria-invalid", ok ? "false" : "true");
    let err = field.querySelector(".err");
    if (!ok) { if (!err) { err = document.createElement("p"); err.className = "err"; err.id = input.id + "-err"; field.appendChild(err); } err.textContent = input.dataset.err || "Required"; input.setAttribute("aria-describedby", err.id); }
    else if (err) { input.removeAttribute("aria-describedby"); err.remove(); }
  };
  const validate = () => {
    let ok = true;
    const nameOk = qForm.name.value.trim().length >= 2; qForm.name.dataset.err = "Please enter your name"; mark(qForm.name, nameOk); ok = ok && nameOk;
    const addrOk = qForm.address.value.trim().length >= 4; qForm.address.dataset.err = "Please enter your address"; mark(qForm.address, addrOk); ok = ok && addrOk;
    const digits = qForm.mobile.value.replace(/[^\d+]/g, ""); const mobileOk = /^(?:\+?61|0)4\d{8}$/.test(digits);
    qForm.mobile.dataset.err = "Enter a valid mobile (e.g. 0412 345 678)"; mark(qForm.mobile, mobileOk); ok = ok && mobileOk;
    return ok;
  };
  ["name", "address", "mobile"].forEach((n) => qForm[n].addEventListener("input", () => { if (qForm[n].closest(".field").classList.contains("invalid")) validate(); }));
  qForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) { setStatus("Please check the highlighted fields.", "bad"); return; }
    const data = { name: qForm.name.value.trim(), address: qForm.address.value.trim(), mobile: qForm.mobile.value.trim(), note: qForm.note.value.trim() };
    submitBtn.disabled = true; const original = submitBtn.textContent; submitBtn.textContent = "Sending…";
    postEnquiryToApp(data); // land the lead in the app regardless of the email path
    try {
      if (WEB3FORMS_KEY) {
        const res = await fetch("https://api.web3forms.com/submit", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ access_key: WEB3FORMS_KEY, subject: "New quote request: razorpestcontrol.com.au", from_name: "Razor Pest Control website", name: data.name, address: data.address, mobile: data.mobile, note: data.note || "(none)" }) });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message || "Submission failed");
        setStatus("Thanks " + data.name.split(" ")[0] + "! Your request is in. We'll be in touch shortly.", "ok"); qForm.reset();
        if (typeof gtag === "function") gtag("event", "conversion", { send_to: "AW-18346114707/7e-cCJGvkNccEJP9jaxE" });
      } else {
        const body = `Name: ${data.name}\nAddress: ${data.address}\nMobile: ${data.mobile}\nNote: ${data.note || "(none)"}\n`;
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Quote request from " + data.name)}&body=${encodeURIComponent(body)}`;
        setStatus("Opening your email app to send the request to us…", "ok");
      }
    } catch (err) { setStatus("Sorry, something went wrong. Please call us on 0408 763 506.", "bad"); }
    finally { submitBtn.disabled = false; submitBtn.textContent = original; }
  });
}
