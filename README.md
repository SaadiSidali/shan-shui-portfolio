# Sidali Saadi — portfolio

A buildless personal portfolio. Serve `dist/` with any static HTTP server. No dependencies or build step are required.

The landscape uses Lingdong Huang’s original [shan-shui-inf](https://github.com/LingDong-/shan-shui-inf), distributed under the MIT license in `dist/landscape/LICENSE`. A dedicated Web Worker generates 8,192 world units ahead, sends only nearby tiles as SVG blobs, and discards old terrain. Each tile is rasterized once into an ImageBitmap and cached; the viewport canvas draws only visible tiles at the browser’s animation rate. Travel is 54 screen pixels per second. Each load uses a fresh seed from `crypto.getRandomValues`. Pause controls, reduced motion, hidden-tab pauses, and resizing are supported.

Content comes from the supplied 2026 résumé, previous public portfolio, and recent project context. Catering Hub shows its fully loaded Feedwell profile. StoresDZ features a collage of all seven actual theme screenshots and describes its purpose as scaling commerce. Independent Work is a logo-only marquee linking to DZSTA, Oranaise, Coolroom Hire SA, iPhone Prix Algérie, Enfes, and AI Mobile. It supports pause, hover, keyboard focus, and reduced motion. Company logos come from official websites and Piassa’s publisher listing; see `ASSETS.md`. The résumé is available at `dist/resume.pdf`.

## Deployment

GitHub Pages publishes `dist/` whenever `main` changes. There is no build step.

- Website: https://saadisidali.github.io/shan-shui-portfolio/
- Source: https://github.com/SaadiSidali/shan-shui-portfolio
