# exam-spotify-redesign

Mobile-first Spotify Web Player UI clone built with semantic HTML, modular partials, and SCSS architecture.

## Overview

This project focuses on building a responsive Spotify-style interface with:

- semantic HTML
- reusable SCSS structure
- modular UI sections
- responsive header behavior
- light/dark theme switching

## Current Features

### Base App Shell

- `index.html` is the main entry point
- the app uses a shared shell layout
- the header is injected dynamically into the page

### SCSS Architecture

The stylesheet structure is organized into:

- `scss/abstracts` for variables, mixins, and breakpoints
- `scss/base` for reset styles and fonts
- `scss/layout` for app-level layout sections
- `scss/components` for reusable interface parts
- `scss/pages` for page-specific styling
- `scss/themes` for theme logic and tokens

### Reusable Header

- header markup lives in `partials/header.html`
- `js/header-load.js` loads the partial into `#header`
- `scss/layout/_header.scss` contains responsive desktop and mobile header styles

### Theme Switcher

- theme tokens are defined in `scss/themes/_theme-switcher.scss`
- both mobile and desktop headers use the same `#theme-toggle` logic
- the app supports dark and light theme variable switching

### Icon States

- header icons support default and filled versions
- filled icons appear on pressed state where matching assets exist

### Assets

All static resources are stored in `assets/`, including:

- icons
- images
- fonts
- audio

## Project Structure

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

## Sass Workflow

Compile once:

```powershell
sass.cmd scss/main.scss css/main.css
```

Watch for changes:

```powershell
sass.cmd --watch scss/main.scss css/main.css
```

Guidelines:

- use only one Sass watcher at a time
- keep `index.html` linked to `css/main.css`
- if PowerShell blocks `sass`, use `sass.cmd`
- avoid using `css/style.css` as a second compiled target unless intentionally needed

## Local Development

Because the project loads `partials/header.html` through `fetch()`, run it on a local server.

Using `file://` directly may prevent partial loading in the browser.

## Git Workflow

Create a feature branch:

```powershell
git switch -c feature/theme-switcher
```

Example commit flow for theme work:

```powershell
git add scss/abstracts/_breakpoints.scss
git add scss/layout/_header.scss
git add scss/themes/_theme-switcher.scss
git add partials/header.html
git add index.html
git add css/main.css css/main.css.map
git commit -m "feat: add responsive header theme switcher"
```

Merge back into main:

```powershell
git switch main
git merge feature/theme-switcher
```

## Notes

- some page-level SCSS files are still scaffolds
- several icons do not yet have a filled asset pair
- `css/style.css` changes usually mean a second Sass watcher is running
