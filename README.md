# Spotify Web Player Redesign

A mobile-first Spotify Web Player UI redesign built with semantic HTML, modular SCSS, and vanilla JavaScript. The project focuses on reusable partial-based layout composition, responsive navigation patterns, and a scalable front-end structure suitable for continued feature development.

## Overview

This project recreates key parts of the Spotify Web Player experience with a component-oriented front-end architecture. The current implementation includes a responsive header, desktop and mobile sidebar navigation, theme switching support, reusable HTML partials, and a bottom playback bar powered by JSON-driven track data.

## Tech Stack

- HTML5
- SCSS / Sass
- CSS3
- Vanilla JavaScript (ES6)
- Git / GitHub

## Implemented Features

### Application Shell

- `index.html` acts as the main application shell
- reusable UI sections are mounted into the shell through partial loading
- layout supports both mobile and desktop navigation patterns

### Header System

- reusable header markup stored in `partials/header.html`
- dynamically injected with `js/header-load.js`
- responsive desktop and mobile header layouts
- theme toggle support for both mobile and desktop header actions
- hover and active icon state handling with filled icon variants

### Sidebar Navigation

- desktop library sidebar
- mobile bottom navigation sidebar
- responsive visibility switching by breakpoint
- active and hover states for supported icons
- fallback visual hover treatment for items without filled icon assets

### Bottom Player

- reusable player markup stored in `partials/player.html`
- dynamically injected with `js/player-load.js`
- JSON-driven player data from `data/music-cover.json`
- track title, artist, cover, and playlist-based album fallback
- play, pause, previous, next, progress, and time update behavior
- responsive compact mobile player and expanded desktop player layout

### SCSS Architecture

The styling layer is organized into clear Sass modules:

- `abstracts` for variables, mixins, and breakpoints
- `base` for reset rules and typography
- `layout` for app shell, header, sidebar, and layout primitives
- `components` for reusable UI sections such as cards and bottom player
- `pages` for page-level styling
- `themes` for theme tokens and switching logic

## Project Structure

```text
.
├── assets/        # icons, images, fonts, audio
├── css/           # compiled CSS output
├── data/          # JSON data sources
├── js/            # partial loaders and interaction logic
├── pages/         # page entry files
├── partials/      # reusable HTML fragments
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

Notes:

- run only one Sass watcher at a time
- keep `index.html` linked to `css/main.css`
- avoid committing duplicate watcher output such as `css/style.css` unless intentionally used

## Local Development

This project should be run on a local server because partials are loaded with `fetch()`.

Recommended options:

- VS Code Live Server
- any local static development server

Direct `file://` execution may prevent partial and JSON loading.

## Git Workflow

Feature work is handled through dedicated branches.

Example:

```powershell
git switch -c feature/player
```

Typical commit style:

```text
feat: add bottom player layout and styles
feat: add player data and loading logic
build: compile player styles
```

Merge back into `main` after the feature is complete:

```powershell
git switch main
git merge feature/player
```

## Current Status

The project currently includes:

- responsive header system
- desktop and mobile sidebar navigation
- theme-aware interface styling
- bottom playback player with JSON-backed content
- modular Sass architecture
- partial-based UI composition

The next stage is extending page content and connecting more UI sections to shared data and interactions.

## Author

Mariam Bostashvili  
Front-End Student

GitHub: [maribostashvili-93](https://github.com/maribostashvili-93)
