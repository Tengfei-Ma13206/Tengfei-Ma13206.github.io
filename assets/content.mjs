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

function renderHero({ site, profile }) {
  const bilibili = profile.socialProfiles.find(channel => channel.label === "Bilibili");
  return `<section class="hero wrap" id="about" aria-labelledby="name">
    <div class="hero-heading"><span class="native-name" lang="zh-Hans">${html(site.chineseName)}</span>
      <h1 id="name">${html(site.name)}</h1></div>
    <div class="portrait"><img src="${html(site.avatar)}" width="1279" height="1627" alt="${html(site.name)}" fetchpriority="high"></div>
    <div class="hero-copy"><p class="hero-intro">${html(profile.summary)}</p>
      ${profile.biography ? `<p class="bio">${html(profile.biography)}</p>` : ""}</div>
    <div class="hero-actions"><a class="contact-button" href="#connect">Get in touch</a>
      ${link("My Bilibili", bilibili?.url, 'class="text-link"')}</div>
  </section>`;
}

function renderTimeline(entries, papers) {
  return `<ul class="timeline">${entries.map(item => {
    const paper = item.publication && papers.find(p => p.id === item.publication);
    let description = html(item.description);
    if (paper) {
      const title = html(paper.shortTitle || paper.title);
      const publicationLink = `<a href="#${html(paper.id)}">${title}</a>`;
      description = description.includes(title)
        ? description.replace(title, () => publicationLink)
        : `${description} ${publicationLink}`.trim();
    }
    return `<li>
      ${item.logo ? `<div class="org-mark"><img src="${html(item.logo)}" width="44" height="44" loading="lazy" alt=""></div>` : ""}
      <div class="timeline-copy"><h3>${html(item.company || item.school)}${item.localName ? ` <span class="local-name" lang="zh-Hans">${html(item.localName)}</span>` : ""}</h3>
        <p class="role">${html(item.title)}${item.location ? `<span class="place"> · ${html(item.location)}</span>` : ""}</p>
        <span class="date">${html(item.period)}</span>
        ${description ? `<p class="role-note">${description}</p>` : ""}
      </div></li>`;
  }).join("\n")}</ul>`;
}

function renderBackground({ profile, publications }) {
  return `<div class="background wrap">
    <section id="experience" aria-labelledby="experience-title"><h2 id="experience-title">Experience</h2>
      ${renderTimeline(profile.experience || [], publications.items)}</section>
    <section class="education" id="education" aria-labelledby="education-title"><h2 id="education-title">Education</h2>
      ${renderTimeline(profile.education || [], publications.items)}</section>
  </div>`;
}

function demoLink(paper) {
  if (!paper.video) return "";
  return `<a href="${html(paper.video)}" data-film data-title="${html(paper.shortTitle)}" data-credit="${html(paper.credit)}"
    data-project="${html(paper.projectUrl)}" data-poster="${html(paper.poster)}" aria-label="Play ${html(paper.shortTitle)} · ${html(paper.mediaLabel)}">Watch demo</a>`;
}

function renderPapers(items, name, scholarUrl) {
  const entries = items.map(p => `<li${p.id ? ` id="${html(p.id)}"` : ""}>
      <div class="item-meta">${[p.year, p.venue, p.type].filter(Boolean).map(html).join(" · ")}</div>
      <h3>${link(p.title, p.url)}</h3>
      <p class="byline">${authors(p.authors, name)}</p>
      ${p.abstract ? `<p class="item-note">${html(p.abstract)}</p>` : ""}
      ${p.video || p.projectUrl || p.codeUrl || p.weightsUrl ? `<div class="resource-links">${demoLink(p)}${link("Project page", p.projectUrl)}${link("Code", p.codeUrl)}${link("Weights", p.weightsUrl)}</div>` : ""}
    </li>`).join("\n");
  return `<ul class="work-items">${entries}</ul>${link("Google Scholar", scholarUrl, 'class="group-link"')}`;
}

function renderVideos(videos, channels) {
  const channel = channels.find(p => p.label === "Bilibili");
  return `<ul class="work-items">${videos.map(v => `<li>
      <h3>${link(v.title, v.url)}</h3><span class="item-meta" lang="zh-Hans">${html(v.chineseTitle)}</span>
      ${v.description ? `<p class="item-note">${html(v.description)}</p>` : ""}
    </li>`).join("\n")}</ul>${link("马腾飞每天更新 · Bilibili", channel?.url, 'class="group-link" lang="zh-Hans"')}`;
}

function renderProjects(products) {
  return `<ul class="work-items">${products.map(p => `<li><h3>${html(p.name)}</h3>
      <p class="item-note">${html(p.description)}</p><div class="resource-links">${link("Open app", p.url)}${link("Source code", p.repo)}${(p.links || []).map(l => link(l.label, l.url)).join("")}</div></li>`).join("\n")}</ul>`;
}

function workGroup(id, title, count, noun, body) {
  return `<details class="work-group" id="${id}" name="work-groups">
    <summary><span>${title}</span><span class="work-count">${count} ${noun}${count === 1 ? "" : "s"}</span><span class="disclosure-mark" aria-hidden="true"></span></summary>
    <div class="work-body">${body}</div>
  </details>`;
}

function renderWork({ publications, site, profile, videos = [], products = [] }) {
  const papers = publications.items || [];
  return `<section class="work wrap" id="work" aria-labelledby="work-title"><h2 id="work-title">Selected work</h2>
    <div class="work-index">
      ${workGroup("publications", "Publications", papers.length, "paper", renderPapers(papers, site.name, publications.scholarProfileUrl))}
      ${workGroup("videos", "Paper walkthroughs", videos.length, "video", renderVideos(videos, profile.socialProfiles))}
      ${workGroup("products", "Side projects", products.length, "project", renderProjects(products))}
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
    ${renderHero(data)}
    ${renderBackground(data)}
    ${renderWork(data)}
  </main>
  ${renderFooter(data)}`;
}
