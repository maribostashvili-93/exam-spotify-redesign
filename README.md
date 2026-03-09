

# 🎧 Spotify Web Player — UI Redesign (Exam Project)

A **mobile-first Spotify Web Player UI clone** built using **semantic HTML**, **modular SCSS architecture**, and **responsive layout techniques**.

This project focuses on creating a scalable front-end structure that follows modern **component-based styling**, **clean architecture**, and **responsive design principles**.

---

# 📌 Project Overview

The goal of this project is to recreate the **Spotify Web Player interface** while implementing a well-structured front-end workflow.

Key development principles used:

* **Mobile-first responsive design**
* **Semantic HTML structure**
* **Modular SCSS architecture**
* **Reusable layout components**
* **Dynamic partial loading**
* **Clean and scalable project structure**

---

# 🧱 Technology Stack

* **HTML5**
* **SCSS (Sass architecture)**
* **CSS3**
* **JavaScript (ES6)**
* **Git / GitHub workflow**

---

# ⚙️ Implemented Features

### Responsive Layout

* Mobile-first layout approach
* Flexible grid and responsive breakpoints

### SCSS Architecture

The project uses a structured **Sass architecture** that separates styles into logical layers.

Folders include:

* `abstracts` → variables, mixins, breakpoints
* `base` → reset styles and typography
* `layout` → main layout components
* `components` → reusable UI elements
* `pages` → page-specific styles
* `themes` → theme switching logic

---

### Header Component System

The header is implemented as a **reusable partial component**.

* `partials/header.html` — header markup
* `js/header-load.js` — dynamically injects the header
* `index.html` — acts as the application shell

This structure allows the header to be reused across multiple pages.

---

### Theme System (Foundation)

The project includes the initial structure for a **theme switcher system**.

Theme variables are stored in:

```
scss/themes/_theme-switcher.scss
```

This provides a base for future **dark/light theme functionality**.

---

# 📂 Project Structure

```text
.
├── assets/           # icons, images, fonts, audio
├── css/              # compiled stylesheets
├── js/               # JavaScript logic
├── partials/         # reusable HTML components
├── scss/
│   ├── abstracts/    # variables, mixins, breakpoints
│   ├── base/         # reset and typography
│   ├── components/   # UI components
│   ├── layout/       # layout structure
│   ├── pages/        # page-specific styles
│   └── themes/       # theme logic
├── index.html
└── README.md
```

---

# 🧩 Sass Development Workflow

### Compile SCSS once

```bash
sass.cmd scss/main.scss css/main.css
```

### Watch for changes

```bash
sass.cmd --watch scss/main.scss css/main.css
```

Important notes:

* Only **one Sass watcher** should run
* `index.html` must link to `css/main.css`
* If PowerShell blocks the command, use `sass.cmd`

---

# 🌐 Local Development

Because the header component uses **fetch()** to load partial HTML files, the project should run on a **local development server**.

Opening the project directly with `file://` may cause fetch errors.

Recommended options:

* VS Code Live Server
* Localhost development server

---

# 🌿 Git Workflow

Feature development is managed using **feature branches**.

Example workflow for theme development:

```bash
git switch -c feature/theme-switcher
```

Commit changes:

```bash
git add .
git commit -m "feat: add theme switcher foundation"
```

Merge into main branch after completion:

```bash
git switch main
git merge feature/theme-switcher
```

---

# 🚧 Current Development Status

The project currently includes:

* Base HTML structure
* Modular SCSS architecture
* Responsive header layout
* Dynamic header loading
* Theme system foundation
* Static assets integration

Additional UI components and pages will be implemented incrementally.

---

# 👩‍💻 Author

**Mariam Bostashvili**
Graphic Designer & Front-End Student

GitHub:
[https://github.com/maribostashvili-93](https://github.com/maribostashvili-93)



