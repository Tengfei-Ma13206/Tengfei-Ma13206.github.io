# Personal Website

A GitHub Pages-ready personal site for `tengfei-ma13206.github.io`.

## How to customize

1. Edit `data/site.json`.
2. Replace the sample text, links, publications, and product entries with your real content.
3. If you want a portrait, add an image URL to `site.avatar`.

## GitHub Pages deployment

1. Push this repository to GitHub.
2. Open **Settings → Pages**.
3. Set the source to **Deploy from a branch**.
4. Choose your main branch and the repository root (`/`).
5. Save, then wait for GitHub Pages to publish the site.

## Notes

- The site is fully static: `index.html`, `assets/styles.css`, `assets/app.js`, and `data/site.json`.
- Publications are read from JSON for reliability on GitHub Pages. Direct browser-side scraping from Google Scholar is not dependable because of CORS and the lack of an official client-side API.
