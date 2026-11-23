const content = document.querySelector("#site-content");
const menu = document.querySelector(".mobile-nav");
const film = document.querySelector("#film");
const video = film.querySelector("video");
let filmTrigger;

function revealWork(hash, scroll = false) {
  const target = hash && document.getElementById(hash.slice(1));
  const group = target && target.closest(".work-group");
  if (!group || group.open) return;
  group.open = true;
  if (scroll) target.scrollIntoView({ block: "start", behavior: "instant" });
}

async function refreshContent() {
  try {
    const response = await fetch("data/site.json", { cache: "no-cache" });
    if (!response.ok) return;
    const source = await response.text();
    if (globalThis.crypto?.subtle) {
      const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(source));
      const fingerprint = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
      if (content.dataset.source === fingerprint) return;
    }
    const data = JSON.parse(source);
    const { renderPortfolio } = await import("./content.mjs");
    content.innerHTML = renderPortfolio(data);
    revealWork(location.hash, true);
    document.title = data.site.title;
    document.querySelector(".wordmark").textContent = data.site.domain;
  } catch (error) {
    // The published HTML remains available offline or if the content request fails.
    console.warn("Could not refresh the portfolio data.", error);
  }
}

document.addEventListener("click", event => {
  if (menu.open && (event.target.closest("nav a") || !menu.contains(event.target))) menu.open = false;
  if (event.defaultPrevented || event.ctrlKey || event.shiftKey || event.altKey || event.metaKey || event.button !== 0) return;
  const internalLink = event.target.closest('a[href^="#"]');
  if (internalLink) revealWork(internalLink.hash);
  const trigger = event.target.closest("a[data-film]");
  if (!trigger || typeof film.showModal !== "function") return;
  event.preventDefault();
  filmTrigger = trigger;
  const { title, credit, project, poster } = trigger.dataset;
  document.querySelector("#film-title").textContent = title;
  document.querySelector("#film-credit").textContent = credit;
  document.querySelector("#film-project").href = project;
  video.setAttribute("aria-label", trigger.getAttribute("aria-label").replace(/^Play /, ""));
  video.poster = poster;
  video.src = trigger.href;
  film.showModal();
  video.play().catch(() => { /* Native controls remain usable when playback requires a second gesture. */ });
});
window.addEventListener("hashchange", () => revealWork(location.hash, true));

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && menu.open) {
    menu.open = false;
    menu.querySelector("summary").focus();
  }
});
film.addEventListener("click", event => {
  if (event.target !== film) return;
  const rect = film.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right ||
      event.clientY < rect.top || event.clientY > rect.bottom) film.close();
});
film.addEventListener("close", () => {
  video.pause();
  video.removeAttribute("src");
  video.load();
  filmTrigger?.focus({ preventScroll: true });
});
revealWork(location.hash, true);
refreshContent();
