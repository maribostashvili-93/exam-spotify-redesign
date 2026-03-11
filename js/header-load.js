document.addEventListener("DOMContentLoaded", async () => {
  const headerRoot = document.getElementById("header");

  if (!headerRoot) return;

  try {
    const isNestedPage = window.location.pathname.includes("/pages/");
    const partialBase = isNestedPage ? "../" : "./";
    const response = await fetch(`${partialBase}partials/header.html`);

    if (!response.ok) {
      throw new Error(`Header load failed: ${response.status}`);
    }

    headerRoot.innerHTML = await response.text();
    normalizeHeaderLinks(headerRoot, isNestedPage);
    setActiveHeaderItem(headerRoot);
  } catch (error) {
    console.error(error);
    headerRoot.innerHTML = "<p>Header could not be loaded.</p>";
  }
});

function normalizeHeaderLinks(root, isNestedPage) {
  const routes = isNestedPage
    ? {
        "index.html": "../index.html",
        "discover.html": "discover.html",
        "search.html": "search.html",
        "library.html": "library.html",
        "profile.html": "profile.html",
        "notifications.html": "notifications.html",
        "friends.html": "friends.html",
        "settings.html": "settings.html",
      }
    : {
        "index.html": "index.html",
        "discover.html": "pages/discover.html",
        "search.html": "pages/search.html",
        "library.html": "pages/library.html",
        "profile.html": "pages/profile.html",
        "notifications.html": "pages/notifications.html",
        "friends.html": "pages/friends.html",
        "settings.html": "pages/settings.html",
      };

  root.querySelectorAll("[src]").forEach((element) => {
    const source = element.getAttribute("src");

    if (!source) return;

    if (source.startsWith("./")) {
      element.setAttribute("src", `${isNestedPage ? "../" : "./"}${source.slice(2)}`);
    }
  });

  root.querySelectorAll("[href]").forEach((element) => {
    const href = element.getAttribute("href");

    if (!href) return;

    if (routes[href]) {
      element.setAttribute("href", routes[href]);
      element.removeAttribute("aria-disabled");
    }
  });
}

function setActiveHeaderItem(root) {
  const isDiscoverPage = document.body.classList.contains("page-discover");
  const topItems = root.querySelectorAll(".top-header-item");

  topItems.forEach((item) => item.classList.remove("top-header-item--active"));

  const activeSelector = isDiscoverPage
    ? '.top-header-item[href$="discover.html"]'
    : '.top-header-item[href$="index.html"]';
  const activeItem = root.querySelector(activeSelector);

  activeItem?.classList.add("top-header-item--active");
}
