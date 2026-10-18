# Sidali Saadi | Portfolio

A React 19 and TypeScript portfolio built with Vite. The existing layout, content, brand assets, and landscape behavior are preserved.

## Development

Use Node.js 22.12 or newer.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite, including `/shan-shui-portfolio/`.

```sh
npm run build
npm run preview
```

The build type-checks the app and generates `dist/`. Generated output is ignored by Git.

## Source

- `src/components/`: page sections, project disclosures, logo showcase, and landscape controls.
- `src/data/portfolio.ts`: employers, experience, independent projects, themes, and skills.
- `src/hooks/useMotionControl.ts`: shared reduced-motion preference and user pause state.
- `src/landscape/renderer.ts`: canvas sizing, smooth travel, visible tile drawing, bitmap cleanup, and lifecycle disposal.
- `src/landscape/landscape.worker.ts`: seeded generation, buffered terrain, and message validation, with shared message types.
- `public/`: original images, résumé, and the licensed landscape generator.

React owns the canvas and controls. Terrain generation stays in a dedicated worker. The worker generates 8,192 world units ahead; the renderer caches rasterized tiles and draws only visible terrain at 54 screen pixels per second. Each mount uses a fresh cryptographic seed. Unmounting cancels the animation, terminates the worker, releases bitmaps, and removes listeners.

Lingdong Huang’s [shan-shui-inf](https://github.com/LingDong-/shan-shui-inf) generator retains its MIT license in `public/landscape/LICENSE`. Company marks belong to their owners; see [ASSETS.md](ASSETS.md).

## Browser checks

With the production preview running in another terminal:

```sh
npx playwright install chromium
npm run test:e2e
```

The checks cover project links and disclosures, original-color hover across both marquee copies, keyboard navigation, mobile logo placement, reduced motion, worker generation, scrolling speed, bitmap release, and résumé delivery. `PLAYWRIGHT_BASE_URL` can target a different preview; `PLAYWRIGHT_CHANNEL=msedge` uses installed Edge.

## Deployment

GitHub Actions installs locked dependencies, type-checks, builds, and runs the browser checks before publishing `dist/` to GitHub Pages on pushes to `main`.

- Website: https://saadisidali.github.io/shan-shui-portfolio/
- Source: https://github.com/SaadiSidali/shan-shui-portfolio

This project is separate from the existing `saadisidali.github.io` portfolio.
