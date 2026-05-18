const SCROLL_THRESHOLD = 50;
const BACK_TO_TOP_THRESHOLD = 600;
const TYPE_SPEED_MS = 80;
const ERASE_SPEED_MS = 30;
const HOLD_BEFORE_ERASE_MS = 1100;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

function onScroll(handler) {
  let ticking = false;
  const tick = () => {
    handler(window.scrollY);
    ticking = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(tick);
    },
    { passive: true }
  );
  handler(window.scrollY);
}

function initScrollState() {
  const nav = $(".nav");
  const back = $(".back-to-top");
  let navOn = null;
  let backOn = null;

  onScroll((y) => {
    const shouldNav = y > SCROLL_THRESHOLD;
    const shouldBack = y > BACK_TO_TOP_THRESHOLD;
    if (nav && shouldNav !== navOn) {
      nav.classList.toggle("nav--scrolled", shouldNav);
      navOn = shouldNav;
    }
    if (back && shouldBack !== backOn) {
      back.classList.toggle("is-visible", shouldBack);
      backOn = shouldBack;
    }
  });
}

function initMobileMenu() {
  const toggle = $(".nav__toggle");
  const list = $(".nav__list");
  if (!toggle || !list) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    list.classList.toggle("is-open", open);
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  list.addEventListener("click", (event) => {
    if (event.target.closest(".nav__link")) setOpen(false);
  });
}

function initActiveSection() {
  const links = $$(".nav__link[href^='#']");
  const sections = links
    .map((link) => document.getElementById(link.getAttribute("href").slice(1)))
    .filter(Boolean);
  if (!sections.length) return;

  const markActive = (id) => {
    links.forEach((link) => {
      const active = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (visible) markActive(visible.target.id);
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTyper(target, phrases) {
  if (prefersReducedMotion) {
    target.textContent = phrases[0];
    return;
  }
  for (let i = 0; ; i = (i + 1) % phrases.length) {
    const phrase = phrases[i];
    for (let c = 1; c <= phrase.length; c++) {
      target.textContent = phrase.slice(0, c);
      await sleep(TYPE_SPEED_MS);
    }
    await sleep(HOLD_BEFORE_ERASE_MS);
    for (let c = phrase.length; c >= 0; c--) {
      target.textContent = phrase.slice(0, c);
      await sleep(ERASE_SPEED_MS);
    }
  }
}

function initTyper() {
  const target = $("[data-typer]");
  if (!target) return;
  const phrases = target.dataset.typer
    .split("|")
    .map((p) => p.trim())
    .filter(Boolean);
  if (phrases.length) runTyper(target, phrases);
}

function initSkillBars() {
  const bars = $$(".skill__fill");
  if (!bars.length) return;
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.setProperty(
          "--level",
          `${entry.target.dataset.level}%`
        );
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.3 }
  );
  bars.forEach((bar) => observer.observe(bar));
}

function initFooterYear() {
  const el = $("[data-year]");
  if (el) el.textContent = String(new Date().getFullYear());
}

initScrollState();
initMobileMenu();
initActiveSection();
initTyper();
initSkillBars();
initFooterYear();
