# exam-spotify-redesign

Mobile-first Spotify Web Player UI clone built with semantic HTML, SCSS architecture, and responsive layout.

## Current Progress

The project currently includes:

- Base HTML entry file in `index.html`
- SCSS architecture with `abstracts`, `base`, `layout`, `components`, `pages`, and `themes`
- Global design tokens in `scss/abstracts/_variables.scss`
- Reusable mixins and breakpoint utilities in `scss/abstracts/`
- Reset styles and font setup in `scss/base/`
- Header partial structure in `partials/header.html`
- Dynamic header injection with `js/header-load.js`
- Responsive header styling in `scss/layout/_header.scss`
- Theme variables and theme toggle foundation in `scss/themes/_theme-switcher.scss`
- Compiled stylesheet output in `css/main.css`
- Static assets for icons, images, fonts, and audio in `assets/`

## Project Structure

```text
.
├── assets/
├── css/
├── js/
├── partials/
├── scss/
│   ├── abstracts/
│   ├── base/
│   ├── components/
│   ├── layout/
│   ├── pages/
│   └── themes/
├── index.html
└── README.md
```

## Sass Workflow

Compile once:

```powershell
sass.cmd scss/main.scss css/main.css
```

Watch for changes:

```powershell
sass.cmd --watch scss/main.scss css/main.css
```

Important:

- Use one Sass watcher only
- Keep `index.html` linked to `css/main.css`
- If PowerShell blocks `sass`, use `sass.cmd`

## Header Setup

The header is loaded as a reusable partial:

- `partials/header.html` contains header markup
- `js/header-load.js` injects the partial into `#header`
- `index.html` acts as the app shell and mount point

For local development, run the project through a local server because `fetch()` may fail on `file://`.

## Theme Branch Workflow

If you want to move theme-related work into a separate branch, use:

```powershell
git switch -c feature/theme-switcher
```

If you already have uncommitted changes and want to keep them in that new branch, switch now before committing.

Recommended flow:

```powershell
git switch -c feature/theme-switcher
git add scss/themes/_theme-switcher.scss scss/layout/_header.scss scss/abstracts/_breakpoints.scss css/main.css css/main.css.map
git commit -m "feat: add theme switcher foundation"
```

If you want only theme changes in that branch and other edits should stay on `main`, first stash everything, then restore only the files you want:

```powershell
git stash
git switch -c feature/theme-switcher
git stash pop
```

After finishing the branch:

```powershell
git switch main
git merge feature/theme-switcher
```

## Notes

- `css/style.css` and `css/style.css.map` may change if a second Sass watcher is running
- Prefer `css/main.css` as the single compiled output
- Some page-level partials are still scaffolds and can be implemented incrementally
