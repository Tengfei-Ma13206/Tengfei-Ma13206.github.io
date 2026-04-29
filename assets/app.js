const CONFIG_PATH = "data/site.json";

const el = {
  brandName: document.querySelector("#brand-name"),
  brandDomain: document.querySelector("#brand-domain"),
  heroName: document.querySelector("#hero-name"),
  heroRole: document.querySelector("#hero-role"),
  heroSummary: document.querySelector("#hero-summary"),
  heroFacts: document.querySelector("#hero-facts"),
  heroActions: document.querySelector("#hero-actions"),
  heroAvatar: document.querySelector("#hero-avatar"),
  heroHighlights: document.querySelector("#hero-highlights"),
  profileLinks: document.querySelector("#profile-links"),
  educationList: document.querySelector("#education-list"),
  experienceList: document.querySelector("#experience-list"),
  profilesIntro: document.querySelector("#profiles-intro"),
  productsGrid: document.querySelector("#products-grid"),
  publicationsIntro: document.querySelector("#publications-intro"),
  scholarBanner: document.querySelector("#scholar-banner"),
  publicationsList: document.querySelector("#publications-list"),
  footerNote: document.querySelector("#footer-note"),
};

boot();

async function boot() {
  try {
    const response = await fetch(CONFIG_PATH, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Unable to load ${CONFIG_PATH}`);
    }

    const config = await response.json();
    renderSite(config);
  } catch (error) {
    renderFatalState(error);
  }
}

function renderSite(config) {
  const {
    site = {},
    profile = {},
    products = [],
    publications = {},
  } = config;

  document.title = site.title || site.name || "Personal Website";
  el.brandName.textContent = site.name || "Your Name";
  el.brandDomain.textContent = site.domain || window.location.hostname;
  el.footerNote.textContent = site.footerNote || "";
  el.footerNote.parentElement.hidden = !site.footerNote;

  renderHero(site, profile, publications);
  renderTimeline(
    el.educationList,
    profile.education,
    "Add your education history in data/site.json."
  );
  renderTimeline(
    el.experienceList,
    profile.experience,
    "Add your work experience in data/site.json."
  );
  renderProducts(products);
  renderPublications(publications);
}

function renderHero(site, profile, publications) {
  const primaryFacts = [
    profile.location,
    profile.base,
    profile.email,
    profile.availability,
  ].filter(Boolean);

  const heroLinks = [
    site.resumeUrl
      ? { label: "Resume", url: site.resumeUrl, variant: "primary" }
      : null,
    publications.scholarProfileUrl
      ? { label: "Google Scholar", url: publications.scholarProfileUrl, variant: "secondary" }
      : null,
    profile.primaryContactUrl
      ? { label: "Primary Contact", url: profile.primaryContactUrl, variant: "secondary" }
      : null,
  ].filter(Boolean);

  el.heroName.textContent = site.name || "Your Name";
  el.heroRole.textContent = site.role || "";
  el.heroRole.hidden = !site.role;
  el.heroSummary.textContent =
    profile.summary ||
    "Add a concise profile summary in data/site.json to introduce your background and current focus.";

  el.heroFacts.innerHTML = primaryFacts.length
    ? primaryFacts.map((item) => `<span class="fact-pill">${escapeHtml(item)}</span>`).join("")
    : "";
  el.heroFacts.hidden = !primaryFacts.length;

  el.heroActions.innerHTML = heroLinks.length
    ? heroLinks
        .map(
          (item) =>
            `<a class="button-link ${item.variant}" href="${escapeAttribute(item.url)}" target="_blank" rel="noreferrer">${escapeHtml(item.label)} <span aria-hidden="true">↗</span></a>`
        )
        .join("")
    : "";
  el.heroActions.hidden = !heroLinks.length;

  renderAvatar(site);
  renderHighlights(profile.highlights);
  renderProfileChannels(profile);
}

function renderAvatar(site) {
  const initials = getInitials(site.name || "Your Name");

  if (site.avatar) {
    el.heroAvatar.innerHTML = `<img src="${escapeAttribute(site.avatar)}" alt="${escapeAttribute(
      site.name || "Profile portrait"
    )}" />`;
    return;
  }

  el.heroAvatar.innerHTML = `<div class="avatar-fallback">${escapeHtml(initials)}</div>`;
}

function renderHighlights(highlights = []) {
  if (!Array.isArray(highlights) || !highlights.length) {
    el.heroHighlights.hidden = true;
    el.heroHighlights.innerHTML = "";
    return;
  }

  el.heroHighlights.hidden = false;
  el.heroHighlights.innerHTML = `
    <h3>At a glance</h3>
    <div class="mini-list">
      ${highlights.map((item) => `<div>• ${escapeHtml(item)}</div>`).join("")}
    </div>
  `;
}

function renderTimeline(container, items = [], emptyMessage) {
  if (!Array.isArray(items) || !items.length) {
    container.innerHTML = `<div class="empty-state">${escapeHtml(emptyMessage)}</div>`;
    return;
  }

  container.innerHTML = items
    .map(
      (item) => `
        <article class="timeline-item">
          <div class="timeline-top">
            <div>
              <h3>${escapeHtml(item.title || item.degree || item.role || "Untitled entry")}</h3>
              <div class="timeline-subtitle">${escapeHtml(
                [item.organization, item.school, item.company, item.location].filter(Boolean).join(" · ")
              )}</div>
            </div>
            ${item.period ? `<span class="meta-chip">${escapeHtml(item.period)}</span>` : ""}
          </div>
          ${renderBodyCopy(item.description, item.highlights)}
        </article>
      `
    )
    .join("");
}

function renderProfileChannels(profile = {}) {
  const links = Array.isArray(profile.socialProfiles) ? profile.socialProfiles : [];
  const intro = profile.platformAliasNote || "";
  el.profilesIntro.textContent = intro;
  el.profilesIntro.hidden = !intro;

  if (!Array.isArray(links) || !links.length) {
    el.profileLinks.innerHTML = `<div class="empty-state">Add social links in data/site.json.</div>`;
    return;
  }

  el.profileLinks.innerHTML = links
    .filter((item) => item.url)
    .map(
      (item) => `
        <a class="profile-link-chip" href="${escapeAttribute(item.url)}" target="_blank" rel="noreferrer">
          <span class="profile-link-label">${escapeHtml(item.label || "Link")}</span>
          <span aria-hidden="true">↗</span>
        </a>
      `
    )
    .join("");
}

function renderProducts(products = []) {
  if (!Array.isArray(products) || !products.length) {
    el.productsGrid.innerHTML = `<div class="empty-state">Add products in data/site.json.</div>`;
    return;
  }

  el.productsGrid.innerHTML = products
    .map(
      (item) => `
        <article class="product-card">
          <div class="card-top">
            <div>
              <h3>${escapeHtml(item.name || "Untitled product")}</h3>
              <div class="timeline-subtitle">${escapeHtml(item.tagline || "")}</div>
            </div>
            ${item.status ? `<span class="meta-chip">${escapeHtml(item.status)}</span>` : ""}
          </div>
          ${renderBodyCopy(item.description, item.highlights)}
          <div class="card-footer">
            ${item.url ? `<a class="inline-link" href="${escapeAttribute(item.url)}" target="_blank" rel="noreferrer">Visit product <span aria-hidden="true">↗</span></a>` : ""}
            ${item.repo ? `<a class="inline-link" href="${escapeAttribute(item.repo)}" target="_blank" rel="noreferrer">Source code <span aria-hidden="true">↗</span></a>` : ""}
          </div>
        </article>
      `
    )
    .join("");
}

function renderPublications(publications = {}) {
  const items = Array.isArray(publications.items) ? [...publications.items] : [];
  items.sort((a, b) => Number(b.year || 0) - Number(a.year || 0));

  el.publicationsIntro.textContent =
    publications.intro ||
    "This section is structured for Google Scholar-aligned publication data and is currently backed by JSON for reliable GitHub Pages deployment.";

  el.scholarBanner.innerHTML = `
    <div>
      <h3>Google Scholar-ready data</h3>
      <p class="micro-copy">${
        escapeHtml(
          publications.sourceNote ||
            "Direct browser-side scraping from Google Scholar is unreliable on GitHub Pages, so this site reads publication entries from JSON while preserving a scholar profile link for future automation."
        )
      }</p>
    </div>
    ${
      publications.scholarProfileUrl
        ? `<a class="button-link secondary" href="${escapeAttribute(publications.scholarProfileUrl)}" target="_blank" rel="noreferrer">Open Google Scholar <span aria-hidden="true">↗</span></a>`
        : ""
    }
  `;

  if (!items.length) {
    el.publicationsList.innerHTML = `<div class="empty-state">Add publications in data/site.json.</div>`;
    return;
  }

  el.publicationsList.innerHTML = items
    .map(
      (item) => `
        <article class="publication-card">
          <div class="publication-top">
            <div>
              <h3>${escapeHtml(item.title || "Untitled publication")}</h3>
              <div class="timeline-subtitle">${escapeHtml(
                [item.authors, item.venue].filter(Boolean).join(" · ")
              )}</div>
            </div>
            <div class="tag-row">
              ${item.year ? `<span class="tag">${escapeHtml(String(item.year))}</span>` : ""}
              ${typeof item.citations === "number" ? `<span class="tag">${escapeHtml(`${item.citations} citations`)}</span>` : ""}
              ${item.type ? `<span class="tag">${escapeHtml(item.type)}</span>` : ""}
            </div>
          </div>
          ${item.abstract ? `<p class="publication-meta">${escapeHtml(item.abstract)}</p>` : ""}
          <div class="publication-links">
            ${item.url ? `<a href="${escapeAttribute(item.url)}" target="_blank" rel="noreferrer">Publication</a>` : ""}
            ${item.pdfUrl ? `<a href="${escapeAttribute(item.pdfUrl)}" target="_blank" rel="noreferrer">PDF</a>` : ""}
            ${item.codeUrl ? `<a href="${escapeAttribute(item.codeUrl)}" target="_blank" rel="noreferrer">Code</a>` : ""}
          </div>
        </article>
      `
    )
    .join("");
}

function renderBodyCopy(description, highlights) {
  const descriptionHtml = description
    ? `<p class="timeline-copy">${escapeHtml(description)}</p>`
    : "";
  const listHtml =
    Array.isArray(highlights) && highlights.length
      ? `<div class="timeline-copy"><ul>${highlights
          .map((item) => `<li>${escapeHtml(item)}</li>`)
          .join("")}</ul></div>`
      : "";
  return `${descriptionHtml}${listHtml}`;
}

function renderFatalState(error) {
  console.error(error);
  document.body.innerHTML = `
    <main style="width:min(calc(100% - 32px), 960px);margin:48px auto;font-family:Inter,system-ui,sans-serif;">
      <div style="padding:24px;border-radius:24px;background:#fff;border:1px solid rgba(0,0,0,0.08);box-shadow:0 20px 60px rgba(0,0,0,0.06);">
        <p style="text-transform:uppercase;letter-spacing:0.16em;color:#8c6f44;font-size:12px;font-weight:700;">Configuration error</p>
        <h1 style="font-family:Fraunces,Georgia,serif;margin:0 0 12px;">The site could not load its JSON content.</h1>
        <p style="color:#5f6675;line-height:1.8;">Check that <code>${escapeHtml(CONFIG_PATH)}</code> exists and contains valid JSON.</p>
      </div>
    </main>
  `;
}

function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
