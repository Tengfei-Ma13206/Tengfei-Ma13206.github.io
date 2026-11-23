# Tengfei Ma · Personal Website

The source for [tengfeima.com](https://tengfeima.com/), served by GitHub Pages.

## How to customize

1. Edit `data/site.json` for publications, internships, education, videos, projects and contact details.
2. Use a publication’s `id` in an experience entry to link that internship to its paper.
3. Run `node scripts/prerender.mjs` to refresh the initial HTML, then commit the JSON and HTML together. The browser also reads the JSON so data-only edits still appear.
4. To check the published HTML against the current data, run `node scripts/prerender.mjs --check`.

## GitHub Pages deployment

1. Push this repository to GitHub.
2. Open **Settings → Pages**.
3. Set the source to **Deploy from a branch**.
4. Choose your main branch and the repository root (`/`).
5. Save, then wait for GitHub Pages to publish the site.

## Sources

The [PrimeSim](https://qyrotech.github.io/PrimeSim-website/) team provides the three-view model rollout. The [PRIME W0](https://lucasjinreal.github.io/PRIME-W0/) team provides the real-robot cloth-folding footage. The page uses short local excerpts and stills from these demonstrations.

The institution marks come from [PrimeBot](https://www.primebot.com/), [Lumos Robotics](https://www.lumosbot.tech/), [SenseTime](https://www.sensetime.com/), [MiniMax](https://www.minimax.io/), [Lalamove](https://www.lalamove.com/), [CUHK](https://www.cuhk.edu.hk/) and [CUHK-Shenzhen](https://www.cuhk.edu.cn/). Inter is distributed under the [SIL Open Font License](assets/fonts/OFL.txt).
