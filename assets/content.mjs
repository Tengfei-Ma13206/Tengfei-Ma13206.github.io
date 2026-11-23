function html(value = "") {
  return String(value).replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[ch]);
}

function link(label, url, extra = "") {
  return url ? `<a href="${html(url)}" target="_blank" rel="noopener noreferrer" ${extra}>${html(label)}</a>` : "";
}

function authors(value, name) {
  const list = Array.isArray(value) ? value : (value || "").split(/,\s*/);
  return list.map(person => person === name || person === "T Ma"
    ? `<strong>${html(name)}</strong>` : html(person)).join(", ");
}

function mediaLink(paper, body, className, poster = paper.poster) {
  return `<a class="${className}" href="${html(paper.video)}"
    data-film data-title="${html(paper.shortTitle)}" data-credit="${html(paper.credit)}"
    data-project="${html(paper.projectUrl)}" data-poster="${html(poster)}"
    aria-label="Play ${html(paper.shortTitle)} · ${html(paper.mediaLabel)}">${body}</a>`;
}

const playIcon = '<span class="play-icon" aria-hidden="true"></span>';

function renderHero({ site, profile, hero }, papers) {
  const film = papers.find(p => p.id === hero.publication);
  const credit = `${playIcon}<span><b>${html(hero.caption)}</b><small>${html(hero.captionDetail)}</small></span>`;
  return `<section class="hero" id="about" aria-labelledby="name">
    <div class="hero-photo"><img src="${html(hero.poster)}" width="1280" height="720" alt="${html(hero.alt)}" fetchpriority="high"></div>
    <div class="hero-inner wrap">
      <div class="identity">
        <div class="signature"><img src="${html(site.avatar)}" width="48" height="48" alt=""><span lang="zh-Hans">${html(site.chineseName)}</span></div>
        <h1 id="name">${html(site.name)}</h1>
        <p class="hero-intro">${html(profile.summary)}</p>
        <div class="hero-actions"><a class="button light" href="#publications">Explore research</a><a class="hero-contact" href="#connect">Get in touch</a></div>
      </div>
      ${film ? mediaLink(film, credit, "hero-watch", hero.poster) : ""}
    </div>
  </section>`;
}

function feature(p, name) {
  const media = `<img src="${html(p.poster)}" width="768" height="432" loading="lazy" alt="${html(p.mediaDescription)}">
    <span class="media-control">${playIcon}<span>${html(p.mediaLabel)}</span></span>`;
  const displayTitle = p.title.startsWith(p.shortTitle + ": ") ? p.title.slice(p.shortTitle.length + 2) : p.title;
  return `<article class="feature" id="${html(p.id)}">
    ${mediaLink(p, media, "feature-media " + html(p.id))}
    <div class="feature-meta"><span>${html(p.venue)}</span><span>${html(p.year)} · ${html(p.type)}</span></div>
    <h3>${html(p.shortTitle)}</h3>
    <p class="feature-title">${html(displayTitle)}</p>
    <p class="feature-abstract">${html(p.abstract)}</p>
    <details class="authors"><summary>Authors</summary><p>${authors(p.authors, name)}</p></details>
    <div class="resource-links">${link("Paper", p.url)}${link("Project", p.projectUrl)}${link("Code", p.codeUrl)}${link("Weights", p.weightsUrl)}</div>
  </article>`;
}

function renderResearch({ publications, site }) {
  const items = publications.items || [];
  const featured = items.filter(p => p.video && p.poster);
  const archive = items.filter(p => !featured.includes(p));
  return `<section class="section wrap research" id="publications" aria-labelledby="research-title">
    <div class="section-head"><h2 id="research-title">Selected publications</h2>
      ${link("Google Scholar", publications.scholarProfileUrl, 'class="text-link"')}</div>
    <div class="features">${featured.map(p => feature(p, site.name)).join("\n")}</div>
    <div class="archive">${archive.map(p => `<article class="archive-item">
      <div class="year">${html(p.year)}</div><div>
        <div class="journal">${html(p.venue)}</div><h3>${link(p.title, p.url)}</h3>
        <p class="byline">${authors(p.authors, site.name)}</p>
        ${p.abstract ? `<p class="archive-description">${html(p.abstract)}</p>` : ""}
        ${p.codeUrl ? `<div class="resource-links">${link("Simulation code", p.codeUrl)}</div>` : ""}
      </div></article>`).join("\n")}</div>
  </section>`;
}

function renderTimeline(entries, papers) {
  return `<ul class="timeline">${entries.map(item => {
    const paper = item.publication && papers.find(p => p.id === item.publication);
    return `<li>
      ${item.logo ? `<div class="org-mark"><img src="${html(item.logo)}" width="46" height="46" loading="lazy" alt=""></div>` : ""}
      <div class="timeline-copy"><div class="org-row"><h3>${html(item.company || item.school)}${item.localName ? ` <span class="local-name" lang="zh-Hans">${html(item.localName)}</span>` : ""}</h3><span class="date">${html(item.period)}</span></div>
      <div class="role">${html(item.title)}${item.location ? `<span class="place"> · ${html(item.location)}</span>` : ""}</div>
      ${item.description ? `<p>${html(item.description)}</p>` : ""}
      ${paper ? `<a class="output-link" href="#${html(paper.id)}">Publication · ${html(paper.shortTitle)}</a>` : ""}
      </div></li>`;
  }).join("\n")}</ul>`;
}

function renderExperience({ profile, publications }) {
  return `<section class="career" id="experience" aria-labelledby="experience-title"><div class="wrap">
    <div class="career-block"><h2 id="experience-title">Experience</h2>${renderTimeline(profile.experience || [], publications.items)}</div>
    <div class="career-block education"><h2>Education</h2>${renderTimeline(profile.education || [], publications.items)}</div>
  </div></section>`;
}

function renderVideos({ videos = [], profile }) {
  const channel = profile.socialProfiles.find(p => p.label === "Bilibili");
  return `<section class="videos" id="videos" aria-labelledby="videos-title"><div class="wrap video-layout">
    <div class="video-intro"><h2 id="videos-title">Paper<br class="wide-break"> walkthroughs</h2>
    <p>I share Chinese-language videos on the ideas and code behind robotics papers.</p>
    ${link("马腾飞每天更新 · Bilibili", channel?.url, 'class="channel-link" lang="zh-Hans"')}</div>
    <div class="video-list">${videos.map(v => `<a class="video-entry" href="${html(v.url)}" target="_blank" rel="noopener noreferrer">
      <span><span class="video-topic">${html(v.topic)}</span><strong>${html(v.title)}</strong><span class="video-cn" lang="zh-Hans">${html(v.chineseTitle)}</span><span class="video-description">${html(v.description)}</span></span>
      ${playIcon}</a>`).join("\n")}</div>
  </div></section>`;
}

function renderProjects({ products = [] }) {
  return `<section class="section wrap projects" id="products" aria-labelledby="projects-title">
    <h2 id="projects-title">Projects</h2><div class="project-list">
    ${products.map(p => `<article><div class="journal">${html(p.tagline)}</div><h3>${html(p.name)}</h3>
    <p>${html(p.description)}</p><div class="resource-links">${link("Open app", p.url)}${link("Source code", p.repo)}${(p.links || []).map(l => link(l.label, l.url)).join("")}</div></article>`).join("\n")}
    </div></section>`;
}

function renderFooter({ profile, site }) {
  const channels = profile.socialProfiles || [];
  const definedGroups = [...new Set(channels.map(p => p.group || "Other channels"))];
  const groupOrder = ["Research & work", ...definedGroups.filter(group => group !== "Research & work")]
    .filter(group => definedGroups.includes(group));
  return `<footer class="contact" id="connect" aria-labelledby="connect-title"><div class="wrap">
    <div class="contact-top"><div><h2 id="connect-title">Get in touch</h2><p>${html(profile.contactNote)}</p></div>
    <div class="contact-address"><a href="mailto:${html(profile.email)}">${html(profile.email)}</a><span>ENS · ${html(profile.ens)}</span></div></div>
    <p class="alias">${html(profile.platformAliasNote)}</p><div class="channel-grid">${groupOrder.map(group => `<div><h3>${html(group)}</h3>
      <ul>${channels.filter(p => (p.group || "Other channels") === group).map(p => `<li>${p.url ? link(p.label, p.url) : `<span>${html(p.label)}</span><small lang="zh-Hans">${html(p.handle)}</small>`}</li>`).join("")}</ul></div>`).join("\n")}</div>
    <div class="colophon"><a href="#top">${html(site.domain)}</a><a href="#top">Back to top</a></div>
  </div></footer>`;
}

export function renderPortfolio(data) {
  return `<main id="main" tabindex="-1">
    ${renderHero(data, data.publications.items)}
    ${renderResearch(data)}
    ${renderExperience(data)}
    ${renderVideos(data)}
    ${renderProjects(data)}
  </main>
  ${renderFooter(data)}`;
}
