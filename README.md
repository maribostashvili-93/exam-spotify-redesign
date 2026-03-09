# exam-spotify-redesign

Responsive Spotify Web Player redesign built with semantic HTML, modular partials, and SCSS architecture.

## Tech Stack

- HTML5
- SCSS
- JavaScript
- Font Awesome

## Implemented So Far

- mobile-first project structure
- modular SCSS folders: `abstracts`, `base`, `layout`, `components`, `pages`, `themes`
- reusable header partial in `partials/header.html`
- dynamic header injection with `js/header-load.js`
- responsive header styles for mobile and desktop
- shared theme switcher logic for mobile and desktop
- dark/light theme tokens in `scss/themes/_theme-switcher.scss`
- pressed-state filled icons where matching assets exist

## Main Files

- `index.html` - main app shell
- `partials/header.html` - reusable header markup
- `js/header-load.js` - header partial loader
- `scss/main.scss` - SCSS entry file
- `scss/layout/_header.scss` - responsive header styles
- `scss/themes/_theme-switcher.scss` - theme token system

## Folder Structure

```text
.
|-- assets/
|-- css/
|-- js/
|-- partials/
|-- scss/
|   |-- abstracts/
|   |-- base/
|   |-- components/
|   |-- layout/
|   |-- pages/
|   `-- themes/
|-- index.html
`-- README.md
```

## Run Sass

Compile once:

```powershell
sass.cmd scss/main.scss css/main.css
```

Watch mode:

```powershell
sass.cmd --watch scss/main.scss css/main.css
```

## Development Notes

- use only one Sass watcher
- keep `index.html` connected to `css/main.css`
- if PowerShell blocks `sass`, use `sass.cmd`
- `css/style.css` usually means a second watcher is running
- `fetch()` for partials requires a local server, not `file://`

## Git Workflow

Create a feature branch:

```powershell
git switch -c feature/theme-switcher
```

Example theme commit:

```powershell
git add scss/abstracts/_breakpoints.scss
git add scss/layout/_header.scss
git add scss/themes/_theme-switcher.scss
git add partials/header.html
git add index.html
git add css/main.css css/main.css.map
git commit -m "feat: add responsive header theme switcher"
```

## Current Status

- header and theme switcher are implemented
- some page-level SCSS files are still scaffolds
- some icons still do not have matching filled asset versions
