# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Astro-based personal portfolio site for Valeri Ciutac (technical UI/UX designer). Static site, no backend, no CMS — every project case study is a hand-authored `.astro` page composed from a shared library of section components.

## Commands

```sh
npm run dev       # start dev server at localhost:4321 (--host, so it's reachable on LAN too)
npm run build     # production build to ./dist/
npm run preview   # preview the production build locally
npm run astro check   # type-check .astro files (astro/tsconfigs/strict)
```

There is no test suite and no lint script configured — don't invent `npm test` or `npm run lint` invocations. Prettier is configured (`.prettierrc.json`, `prettier-plugin-astro`) for `.astro`/`.ts`/`.css` formatting but is not wired into a script.

## Architecture

**Page composition pattern.** Every page in `src/pages/` imports `src/layouts/Layout.astro` directly and passes `title`/`description` props. Project case studies (`src/pages/projects/*.astro`) all follow the same recipe: `ProjectHeader` (title/focus/stack/hero image), then a sequence of content section components (`ContentWithMedia`, `TwoCards`/`ThreeCards`, `Heading`, `SplitGallery`, `ComparisonSlider`/`BeforeAfterSlider`, etc.), then `Conclusion`, `ContactMe`, and `SeeOtherProjects` (prev/next project links) at the end. When adding a new project page, copy this section order from an existing project like `src/pages/projects/automaton.astro` rather than inventing new structure.

`src/layouts/InnerLayout.astro` and `src/pages/projects/LayoutProject.astro` are dead/unused wrapper experiments (not imported anywhere, and `InnerLayout.astro` has a malformed `<slot>`). Don't build on them without checking they're actually referenced first.

**Theme (light/dark).** `Layout.astro` sets `data-theme` on `<html>` via an inline pre-hydration script (reads `localStorage.theme`, falls back to `prefers-color-scheme`) so there's no flash of wrong theme. `src/styles/global.css` defines the actual colors as CSS custom properties on `:root` and `:root[data-theme="dark"]` (`--background`, `--text`, `--textSub`). Components consume these via Tailwind's arbitrary-value syntax, e.g. `text-(--text)`, `bg-(--background)`.

**Per-project brand colors.** `global.css` defines a `@theme` block with a primary/secondary color pair per project (`--color-bazinga`/`--color-bazinga2`, `--color-dimenso`/`--color-dimenso2`, etc.). These drive the homepage grid (`FolioCard` background + tag-strip background) via `var(--color-x)` — check this block before adding a new project card so the palette stays consistent.

**Homepage project grid art direction.** `FolioCard.astro` doesn't take a single image prop; it builds `background-image` CSS vars from four fixed filenames — `{title}-tall.webp`, `{title}-square.webp`, `{title}-wide.webp`, `{title}-ultrawide.webp` — and swaps between them with container queries (`@container (min-aspect-ratio: ...)`) based on the card's rendered aspect ratio. These four images must exist at the public root (e.g. `public/Bazinga AI-tall.webp`) named to match the card's `title` prop exactly, spaces included.

**Static assets.** `public/` is the web root. Homepage card art-direction images live flat at `public/{Project Title}-{tall|square|wide|ultrawide}.webp`. Per-project detail/body images live under `public/projects/{project-slug}/`. Existing project pages reference these body images with relative paths like `../../projects/automaton/Automaton-header.webp` from `src/pages/projects/*.astro` — follow that existing (relative-path) convention for consistency with the rest of the project pages rather than switching to root-absolute paths.

**Client-side interactivity** (sliders, mobile nav, expandable galleries) is plain inline `<script>` blocks inside the relevant `.astro` component using `document.querySelector`/data-attributes — there's no framework integration (React/Vue/Svelte) installed, and no client-side state library. Keep new interactive components consistent with this vanilla-JS-in-`<script>` pattern.

**Integrations:** `@tailwindcss/vite` (Tailwind v4, config lives in `global.css` via `@theme`, not a `tailwind.config.js`), `astro-integration-lottie` for Lottie animations, `@vercel/analytics/astro` wired into `Layout.astro`'s `<head>`. View Transitions (`astro:transitions`) is imported in `Layout.astro` but currently commented out/disabled.
