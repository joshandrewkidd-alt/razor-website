/* Shared behaviour for interior (service / location) pages: FAQ accordion + footer year. */
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
