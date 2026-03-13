# Spotify Web Player Redesign

This project is a front-end redesign of the Spotify Web Player that I built as a study and exam project using `HTML`, `SCSS`, and `Vanilla JavaScript`.

From the beginning, my goal was not only to recreate Spotify visually. I wanted to build the project in a way that felt structured, reusable, and understandable from a real front-end development perspective.

That means the project was not just about making pages look good. It was also about:

- building a clean layout system
- organizing styles properly
- reusing shared UI parts
- loading content dynamically where it made sense
- thinking about mobile and desktop as two different layout problems

This README explains the project the way I would explain it myself during a presentation: how I started thinking about it, what architecture I chose, what challenges I had, why I used specific technologies, and what I learned during the process.

## How I Started Thinking About the Project

When I started the project, the first thing I realized was that a Spotify-like interface is not just one page. It is a system made of:

- a shared layout
- navigation
- multiple connected pages
- repeated cards, sections, toolbars, and filters
- very different mobile and desktop behaviors

Because of that, I decided early that I did not want to build it as a group of unrelated static HTML files where everything would be repeated manually. A better approach was to treat it more like a small front-end application with:

- a shared header
- a shared sidebar
- a shared bottom player
- page-specific content
- reusable SCSS structure
- JavaScript loaders for repeated parts

## Main Goals

While building the project, I had a few clear technical goals:

1. Build one stable layout system that could work across all pages.
2. Treat mobile and desktop layouts separately instead of just shrinking one version.
3. Make UI elements reusable wherever possible.
4. Reduce hardcoded content and use JSON-driven rendering where it actually helped.
5. Keep the code organized so the project could grow without turning messy.

## How I Thought About the Architecture

I structured the project in layers.

### 1. HTML Layer

At the HTML level, the main idea was that every page should follow the same shell:

- `#header`
- `.sidebar`
- `.mobile-sidebar`
- `.main`
- `#player`

So every page shares the same base structure, and only the page-specific content changes.

This helped me in two ways:

- it kept the visual structure consistent
- it reduced repeated markup

### 2. SCSS Layer

I organized SCSS by responsibility:

- `abstracts/`  
  variables, mixins, and shared design tokens

- `base/`  
  reset, fonts, and base rules

- `layout/`  
  app shell, header, sidebar, and shared layout behavior

- `components/`  
  buttons, cards, card rows, filters, sections, bottom player, and other reusable UI pieces

- `pages/`  
  page-specific styling and behavior

- `themes/`  
  theme switching related styles

This separation became very important as the project grew. A single large stylesheet would have become difficult to maintain very quickly.

### 3. JavaScript Layer

I used JavaScript only where it actually had a clear purpose:

- loading shared partials
- rendering content from JSON
- handling player logic
- handling header logic
- rendering dynamic content on pages like Home, Discover, Search, and Library
- managing side panel state

I intentionally kept the project in `Vanilla JS` because I wanted to show architecture and organization without depending on a framework.

## How I Built the HTML Structure

In HTML, my main rule was semantics plus a predictable structure.

Most pages follow this kind of layout:

```html
<body class="page-name">
  <div class="app container">
    <div id="header"></div>
    <aside class="sidebar"></aside>
    <aside class="mobile-sidebar"></aside>
    <main class="main page-main">
      <!-- page specific content -->
    </main>
    <div id="player"></div>
  </div>
</body>
```

This structure works well because:

- shared areas stay consistent
- page content is isolated
- CSS grid and flex layouts are easier to control
- JavaScript loaders have clear mount points

## What I Did in Sass

In Sass, my main task was to reduce repeated styling and manage layout behavior through breakpoints.

I created:

- variables for spacing, sizing, colors, and player/header/sidebar dimensions
- mixins for reusable responsive patterns
- component-level styles for cards, buttons, filters, sections, and the player
- page-level overrides for specific screens
- separate desktop and mobile layout behavior

The most important parts were:

- keeping the card system consistent
- splitting player behavior between mobile and desktop
- stabilizing header/sidebar/main spacing
- making page-specific overrides without breaking shared components

## Why I Used JavaScript

I did not use JavaScript just to say the project was interactive. I used it only where it solved real problems.

### Shared Partials

The `header` and `player` appear on many pages. Moving them into partials and loading them with JavaScript was much cleaner than copying the same markup everywhere.

### Dynamic Content

For Home, Discover, Search, Library, and the Player, I used JSON as a content source. That allowed me to:

- keep HTML lighter
- update content more easily
- reuse rendering logic across sections

### UI State

For example, header side panels such as `Friends`, `Notifications`, and `Settings` needed:

- toggle state management
- one-open-at-a-time behavior
- `Escape` key close behavior
- main content shrink behavior

Without JavaScript, that would have been harder to maintain and much less flexible.

## Challenges I Had During the Project

### 1. Building a Reusable Layout

The biggest early challenge was that desktop and mobile are really two different UX systems.

For example:

- desktop uses a left sidebar
- mobile uses bottom navigation
- desktop header has a very different structure
- mobile player is a compact bar, while desktop player is a full dock

To make that work consistently, I had to rethink spacing, containers, and shared layout behavior several times.

### 2. Repeated Markup

If I had written the header, player, cards, and repeated sections manually on every page, the project would have become difficult to manage very quickly.

That is why I pushed shared parts into reusable structures as early as possible.

### 3. Project Growth

The project quickly stopped being only `index.html`. It grew into a multi-page interface with:

- artist
- album
- playlist
- library
- song
- podcast
- episode
- profile
- discover
- search

At that point, the challenge became consistency. Naming, layout rules, and reusable patterns had to stay clear.

### 4. Responsive Details

A big challenge was not just making things visible, but making them feel correct:

- padding
- gaps
- bottom player safe spacing
- fixed and sticky elements working together
- overlay panels
- horizontal card row behavior

### 5. UI State Collisions

When I added desktop side panels to the header, I needed to manage:

- only one panel being open at a time
- hiding them fully on mobile
- shrinking the main content correctly
- keeping the header stable

That turned into a small state-management problem inside a simple layout system.

## Why I Used Branches

Branching was important because I was building the project step by step, and I wanted changes to stay logically separated.

Branches helped me:

- work on one feature at a time
- experiment more safely
- keep merge history cleaner
- avoid mixing unrelated changes together

Some topics naturally made sense as separate work areas:

- theme switcher
- player
- page redesigns
- shared layout improvements

This also helped me understand that even in front-end projects, branch discipline makes the work easier to manage.

## Why Commits Mattered

I treated commits as a way to document development decisions, not just save progress.

A good commit helps me:

- understand exactly what changed
- isolate problems faster
- track progress clearly
- explain the development process during presentation

This project reminded me that commits should describe intent, not just file updates.

## What I Learned

This project taught me several important things.

### Layout Thinking

UI building is not only about placing elements on a page. First, I need to understand:

- which parts are shared
- which parts belong only to one page
- which behaviors should change at different breakpoints

### Sass Architecture

I learned that Sass is most useful when it supports structure, not when it is just used for heavy nesting.

### Vanilla JS Organization

Even without a framework, it is possible to build a clean structure using:

- partial loading
- state sync
- renderer functions
- reusable helper logic

### Responsive Debugging

Many of the small bugs came from responsive layout behavior. That improved my understanding of:

- layout debugging
- fixed and sticky elements
- spacing systems
- visual hierarchy

### Component Reuse

When cards, sections, and panels appear in more than one place, reusable thinking saves a lot of time and keeps the project much cleaner.

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

## Tech Stack

- HTML5
- SCSS / Sass
- CSS3
- Vanilla JavaScript
- Git / GitHub

## What Is Currently Implemented

At this stage, the project includes:

- a responsive app shell
- desktop and mobile header/navigation
- sidebar and bottom navigation
- a reusable bottom player
- JSON-driven sections
- home / discover / search / library / artist / album / playlist / song / podcast / episode pages
- header side panels (`Friends`, `Notifications`, `Settings`)
- page-specific desktop and mobile behavior

## What I Would Improve Next

If I continued the project further, my next steps would be:

- replacing mock content with more realistic content
- expanding player interactions
- improving accessibility
- automating build workflow more clearly
- separating some render logic into even cleaner modules

## Final Reflection

This project was important for me because it required me to work on several things at the same time:

- UI thinking
- architecture planning
- responsive layout building
- Sass organization
- JavaScript state logic
- Git workflow

The most important part is that I did not treat this as a set of isolated pages. I tried to build it as a system with structure, logic, and room to grow.

## Author

Mariam Bostashvili  
Front-End Student

GitHub: [maribostashvili-93](https://github.com/maribostashvili-93)
