# Spotify Web Player Redesign

This project is a front-end redesign of the Spotify Web Player. I built it as an exam project using HTML, SCSS, and vanilla JavaScript.

My goal was not only to copy the visual style of Spotify, but also to organize the project in a clean and reusable way. I wanted the code to be easy to manage, easy to expand, and understandable during presentation.

## Project Idea

The main idea of this project was to recreate a Spotify-like music platform with responsive pages, reusable UI parts, and dynamic content.

Instead of building everything as static HTML, I tried to structure the project more like a real front-end application. For example:

- shared sections are reused across pages
- content is loaded from JSON where possible
- styles are separated into logical SCSS folders
- pages work for both mobile and desktop layouts

## What I Focused On

During this project I mainly focused on these things:

- responsive design
- reusable layout structure
- cleaner SCSS architecture
- dynamic rendering with JavaScript
- simple but scalable project organization

## Development Process

I started by creating the main structure of the project:

- main HTML shell
- SCSS folders for abstracts, base, layout, components, pages, and themes
- assets folder for icons, images, fonts, and audio
- JavaScript files for loading shared parts and page content

After that, I continued step by step and built the project page by page.

First, I worked on the shared layout and navigation. Then I added the header, sidebar, theme switcher, and bottom player. After that, I connected more pages such as discover, search, library, artist, album, playlist, podcast, song, profile, and settings-related pages.

## Branch Workflow

I used separate branches during development and then merged them into `main`.

### `feature/theme-switcher`

In this branch I worked on:

- reusable header structure
- theme switcher
- responsive header behavior
- mobile and desktop theme support

### `feature/player`

In this branch I worked on:

- bottom player partial
- player data connection
- playback controls
- player layout for mobile and desktop

### `main`

After merging the feature branches, I continued working in `main` and added:

- more pages
- search functionality
- discover page feed
- navigation fixes
- responsive improvements
- shared data rendering

## Features

### Shared Layout

- `index.html` is used as the main shell
- reusable parts are loaded into the layout
- the design supports both desktop and mobile views

### Header

- header is stored in `partials/header.html`
- loaded dynamically with JavaScript
- desktop and mobile versions are supported
- theme switcher is included
- active navigation state is handled

### Sidebar Navigation

- desktop sidebar is shown on large screens
- mobile bottom navigation is shown on small screens
- navigation icons support hover and active states

### Home Page

- quick mixes
- made-for-you section
- top mixes
- favorite artists
- sections are rendered from JSON data

### Discover Page

- filter tabs
- reel-style discover cards
- dynamic content rendering
- responsive layout for mobile and desktop

### Search Page

- recent searches
- browse categories
- genre section
- search filtering
- desktop header search integration

### Player

- reusable bottom player
- JSON-driven content
- play and pause controls
- next and previous buttons
- progress and time updates
- responsive mobile and desktop layout

### Additional Pages

I also created and connected these pages:

- album
- song
- playlist
- podcast
- episode
- artist
- library
- profile
- notifications
- friends
- settings
- camera

## Problems I Solved

### Repeated Code

At the beginning, some sections could easily become repeated across many pages, especially the header and player.

To solve this, I moved them into partial files and loaded them with JavaScript. This made the project cleaner and easier to update.

### Static Content

If every card and every section stayed hardcoded in HTML, it would become difficult to manage.

To improve this, I used JSON data for several sections like home, discover, search, and player.

### Responsive Layout Issues

Because the project has different desktop and mobile navigation systems, spacing and layout could easily break.

I fixed this by organizing SCSS carefully and adjusting layouts by breakpoint.

### Project Structure

As the project grew, it was important not to keep everything in one file.

That is why I separated:

- reusable styles
- page styles
- shared components
- layout styles
- JavaScript logic by page

This made the project easier to read and easier to explain.

## Tech Stack

- HTML5
- SCSS / Sass
- CSS3
- Vanilla JavaScript
- Git / GitHub

## Project Structure

```text
.
|-- assets/
|-- css/
|-- data/
|-- js/
|-- pages/
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



## Current Result

At this stage, the project includes:

- reusable header and player
- responsive desktop and mobile navigation
- theme-aware styling
- dynamic home, discover, and search sections
- multiple connected pages
- organized SCSS architecture
- working bottom player interactions

## Author

Mariam Bostashvili  
Front-End Student

GitHub: [maribostashvili-93](https://github.com/maribostashvili-93)
