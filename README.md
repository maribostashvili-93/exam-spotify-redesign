# Spotify Web Player Redesign

A front-end exam project focused on rebuilding key Spotify Web Player flows with a scalable, component-oriented structure. The implementation uses semantic HTML, modular SCSS, and vanilla JavaScript, with reusable partials and JSON-driven rendering to keep the UI easier to extend and maintain.

## Project Goal

The goal of this project was not only to recreate Spotify-inspired screens visually, but to build them with a development workflow that reflects real front-end practice:

- start from a clean reusable structure
- separate layout, components, pages, and theme styles
- work in dedicated feature branches
- merge finished features back into `main`
- replace static markup with shared data where possible

## Development Process

I began by setting up the base project structure:

- initial HTML shell
- Sass architecture with `abstracts`, `base`, `layout`, `components`, `pages`, and `themes`
- shared design tokens, breakpoints, and reset styles
- asset organization for icons, images, audio, and fonts

After the initial scaffold, the project evolved feature by feature instead of building everything in one branch. This made it easier to test changes, isolate UI work, and keep the codebase organized during the exam process.

## Branch Workflow

The project was developed through dedicated branches and then merged into `main`.

### `feature/theme-switcher`

This branch covered the first major UI architecture improvements:

- reusable header partial
- dynamic header injection
- responsive header behavior
- mobile and desktop theme switcher support
- theme-aware styling refinements

Why this mattered:
The header was used across multiple screens, so moving it into a partial reduced duplication and made later page expansion much easier.

### `feature/player`

This branch focused on the bottom playback experience:

- reusable player partial
- JSON-driven player content
- play, pause, next, previous, progress, and time updates
- responsive mobile and desktop player layouts

Why this mattered:
The player introduced shared application state and made the redesign feel closer to a real product rather than a static page.

### `main`

After merging feature branches, development continued on `main` with broader page integration and content rendering:

- data-driven home page sections
- discover page feed loader
- discover responsive layout fixes
- search page integration and search filtering behavior
- responsive tuning for cards, filters, artists, and player spacing

## Features Implemented

### Application Shell

- `index.html` works as the main shell
- shared sections are injected through reusable partials
- layout supports both mobile and desktop navigation patterns

### Header System

- header markup lives in `partials/header.html`
- loaded dynamically with `js/header-load.js`
- separate desktop and mobile action layouts
- theme toggle support
- active and hover icon state handling

### Sidebar Navigation

- desktop library sidebar
- mobile bottom navigation
- breakpoint-based visibility switching
- hover and active states for navigation icons

### Home Page

- quick mixes section
- made-for-you cards
- top mixes row
- favorite artists row
- sections rendered from `data/music-cover.json` via `js/home-load.js`

### Discover Page

- filter tabs
- reel-style content feed
- JSON-driven cards and metadata
- responsive discover page layout via `js/discover-load.js`

### Search Page

- recent searches
- browse categories
- genre categories
- live filtering based on search input
- empty-state support and synchronized mobile/desktop inputs

### Bottom Player

- player markup stored in `partials/player.html`
- loaded with `js/player-load.js`
- track cover, title, artist, and playlist fallback logic
- playback controls and progress updates
- compact mobile and expanded desktop layout

## Problems Solved During Development

This project was also an exercise in solving common front-end architecture problems.

### 1. Repeated markup across pages

Problem:
Shared UI such as the header and player would have been duplicated across multiple HTML files.

Solution:
I moved those sections into reusable partials and loaded them with JavaScript. This reduced repetition and made updates much safer.

### 2. Static content becoming hard to maintain

Problem:
Hardcoding every card, mix, and search tile directly in HTML would make future changes slow and error-prone.

Solution:
I introduced JSON-driven rendering for the home, discover, search, and player content so that UI sections could be updated from structured data.

### 3. Mobile and desktop layouts conflicting with each other

Problem:
Spotify-style layouts have very different navigation and spacing needs across breakpoints, especially with a fixed bottom player.

Solution:
I separated layout responsibilities in SCSS, added responsive visibility rules, and refined spacing so that content would not collide with the player or navigation elements.

### 4. Theme support across reusable components

Problem:
Theme changes can become inconsistent when styles are scattered across page files.

Solution:
I centralized theme-related styling in the Sass structure and adjusted header interactions so the switcher worked consistently in both desktop and mobile contexts.

## Tech Stack

- HTML5
- SCSS / Sass
- CSS3
- Vanilla JavaScript (ES6)
- Git / GitHub

## Project Structure

```text
.
|-- assets/        # icons, images, fonts, audio
|-- css/           # compiled CSS
|-- data/          # shared JSON content
|-- js/            # partial loaders and page rendering scripts
|-- pages/         # additional page templates
|-- partials/      # reusable HTML fragments
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

## Run Locally

Compile Sass once:

```powershell
sass.cmd scss/main.scss css/main.css
```

Watch Sass changes:

```powershell
sass.cmd --watch scss/main.scss css/main.css
```

Important:
Because the project loads partials and JSON with `fetch()`, opening the files directly with `file://` may break the app. It should be served from a local development server.

## Current Status

The project currently includes:

- reusable header and player partials
- responsive desktop and mobile navigation
- theme-aware interface styling
- data-driven home, discover, and search content
- responsive page-specific SCSS architecture
- bottom playback bar with working controls

The next step would be expanding shared data usage further and connecting more page templates to interactive behavior.

## Author

Mariam Bostashvili  
Front-End Student

GitHub: [maribostashvili-93](https://github.com/maribostashvili-93)
