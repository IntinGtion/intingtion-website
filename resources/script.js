document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const toggleBtn = header.querySelector(".nav-toggle");
  const closeBtn  = header.querySelector(".nav-close");
  const mobileNav = document.getElementById("mobileNav");
  const overlay   = header.querySelector(".nav-overlay");

  if (!toggleBtn || !closeBtn || !mobileNav || !overlay) return;

  let lastFocused = null;

  const focusableSelector =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

  function getFocusable() {
    return Array.prototype.slice
      .call(mobileNav.querySelectorAll(focusableSelector))
      .filter((el) => el.offsetParent !== null);
  }

  function openNav() {
    lastFocused = document.activeElement;

    header.classList.add("nav-open");
    document.body.classList.add("nav-open");

    toggleBtn.setAttribute("aria-expanded", "true");
    toggleBtn.setAttribute("aria-label", "Menü schließen");

    overlay.hidden = false;
    mobileNav.hidden = false;

    // Fokus auf erstes fokusierbares Element setzen
    const focusables = getFocusable();
    (focusables[0] || closeBtn).focus();

    document.addEventListener("keydown", onKeyDown);
  }

  function closeNav() {
    header.classList.remove("nav-open");
    document.body.classList.remove("nav-open");

    toggleBtn.setAttribute("aria-expanded", "false");
    toggleBtn.setAttribute("aria-label", "Menü öffnen");

    overlay.hidden = true;
    mobileNav.hidden = true;

    document.removeEventListener("keydown", onKeyDown);

    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    } else {
      toggleBtn.focus();
    }
  }

  function onKeyDown(e) {
    // ESC schließt
    if (e.key === "Escape") {
      e.preventDefault();
      closeNav();
      return;
    }

    // Fokus im Menü halten (Tab-Trap), solange offen
    if (e.key === "Tab" && toggleBtn.getAttribute("aria-expanded") === "true") {
      const focusables = getFocusable();
      if (!focusables.length) return;

      const first = focusables[0];
      const last  = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function isOpen() {
    return toggleBtn.getAttribute("aria-expanded") === "true";
  }

  toggleBtn.addEventListener("click", () => {
    if (isOpen()) closeNav();
    else openNav();
  });

  closeBtn.addEventListener("click", closeNav);
  overlay.addEventListener("click", closeNav);

  // Schließen, wenn man einen Link klickt
  mobileNav.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a) closeNav();
  });
});
