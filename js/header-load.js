document.addEventListener("DOMContentLoaded", loadHeader);

const PAGE_ROUTES = {
  home: "index.html",
  discover: "discover.html",
  search: "search.html",
  library: "library.html",
  profile: "profile.html",
  notifications: "notifications.html",
  friends: "friends.html",
  settings: "settings.html",
  camera: "camera.html",
  playlist: "playlist.html",
  album: "album.html",
  artist: "artist.html",
  podcast: "podcast.html",
  song: "song.html",
  episode: "episode.html",
};

const LABEL_ROUTE_MAP = {
  home: "home",
  discover: "discover",
  search: "search",
  "my library": "library",
  library: "library",
  me: "profile",
  profile: "profile",
  notifications: "notifications",
  friends: "friends",
  settings: "settings",
  pins: "playlist",
  playlists: "playlist",
  "playlists by spotify": "playlist",
  "liked songs": "song",
  saves: "album",
  albums: "album",
  folders: "library",
  podcasts: "podcast",
  audiobooks: "episode",
  artists: "artist",
};

async function loadHeader() {
  const isNestedPage = checkIfNestedPage();
  const routes = getAppRoutes(isNestedPage);
  const headerRoot = document.getElementById("header");

  if (headerRoot) {
    await renderHeader(headerRoot, isNestedPage, routes);
  }

  normalizePageLinks(routes);
  setActiveHeaderItem(headerRoot);
  setActiveMobileNavItem();
}

async function renderHeader(headerRoot, isNestedPage, routes) {
  const headerPath = getHeaderPath(isNestedPage);

  try {
    const response = await fetch(headerPath);

    if (!response.ok) {
      throw new Error(`Header load failed: ${response.status}`);
    }

    headerRoot.innerHTML = await response.text();
    updateHeaderSources(headerRoot, isNestedPage);
    updateHeaderLinks(headerRoot, routes);
    document.dispatchEvent(new CustomEvent("header:loaded"));
  } catch (error) {
    console.error(error);
    headerRoot.innerHTML = "<p>Header could not be loaded.</p>";
  }
}

function checkIfNestedPage() {
  return window.location.pathname.includes("/pages/");
}

function getHeaderPath(isNestedPage) {
  return isNestedPage ? "../partials/header.html" : "./partials/header.html";
}

function getAppRoutes(isNestedPage) {
  const pagePrefix = isNestedPage ? "" : "pages/";
  const routes = {};

  Object.entries(PAGE_ROUTES).forEach(([key, value]) => {
    if (key === "home") {
      routes[key] = isNestedPage ? `../${value}` : value;
      return;
    }

    routes[key] = `${pagePrefix}${value}`;
  });

  return routes;
}

function updateHeaderSources(root, isNestedPage) {
  const prefix = isNestedPage ? "../" : "./";
  const elements = root.querySelectorAll("[src]");

  elements.forEach((element) => {
    const source = element.getAttribute("src");

    if (!source || !source.startsWith("./")) {
      return;
    }

    element.setAttribute("src", `${prefix}${source.slice(2)}`);
  });
}

function updateHeaderLinks(root, routes) {
  root.querySelectorAll("[href]").forEach((element) => {
    const href = element.getAttribute("href");
    const routeKey = getHeaderRouteKey(href);

    if (!href || !routeKey) {
      return;
    }

    element.setAttribute("href", routes[routeKey]);
    element.removeAttribute("aria-disabled");
  });

  root.querySelectorAll(".top-header-action").forEach((link) => {
    const label = link.getAttribute("aria-label");
    const routeKey = label ? label.toLowerCase() : "";

    if (!routes[routeKey]) {
      return;
    }

    link.setAttribute("href", routes[routeKey]);
    link.removeAttribute("aria-disabled");
  });

  root.querySelectorAll('a[aria-label="Camera"]').forEach((link) => {
    link.setAttribute("href", routes.camera);
  });
}

function getHeaderRouteKey(href) {
  const routeMap = {
    "index.html": "home",
    "discover.html": "discover",
    "search.html": "search",
    "library.html": "library",
    "profile.html": "profile",
    "notifications.html": "notifications",
    "friends.html": "friends",
    "settings.html": "settings",
  };

  return routeMap[href] || "";
}

function normalizePageLinks(routes) {
  normalizeLinksByLabel(".sidebar-head-link", ".sidebar-text", routes);
  normalizeLinksByLabel(".sidebar-link", ".sidebar-text", routes);
  normalizeLinksByLabel(".mobile-nav-link", ".mobile-nav-text", routes);
  normalizeLinksByLabel(".mobile-burger-link", "span:last-child", routes);
  normalizeLinksByLabel(".mobile-burger-sublink", "span:last-child", routes);
  normalizeLinksByLabel(".library-item__link", ".library-item__title", routes);
}

function normalizeLinksByLabel(linkSelector, textSelector, routes) {
  document.querySelectorAll(linkSelector).forEach((link) => {
    const textElement = link.querySelector(textSelector);
    const label = textElement ? textElement.textContent.trim() : link.textContent.trim();
    const route = getRouteFromLabel(label, routes);

    if (!route) {
      return;
    }

    link.setAttribute("href", route);
  });
}

function getRouteFromLabel(label, routes) {
  const normalizedLabel = String(label || "").trim().toLowerCase();
  const routeKey = LABEL_ROUTE_MAP[normalizedLabel];

  return routeKey ? routes[routeKey] : "";
}

function setActiveHeaderItem(root) {
  if (!root) {
    return;
  }

  const topItems = root.querySelectorAll(".top-header-item");

  topItems.forEach((item) => {
    item.classList.remove("top-header-item--active");
  });

  const activeSelector = getActiveHeaderSelector();
  const activeItem = root.querySelector(activeSelector);

  if (activeItem) {
    activeItem.classList.add("top-header-item--active");
  }
}

function getActiveHeaderSelector() {
  const currentPage = getCurrentPageKey();

  if (currentPage === "discover") {
    return '.top-header-item[href$="discover.html"]';
  }

  if (currentPage === "search") {
    return '.top-header-item[href$="search.html"]';
  }

  return '.top-header-item[href$="index.html"]';
}

function setActiveMobileNavItem() {
  const currentPage = getCurrentPageKey();
  const mobileItems = document.querySelectorAll(".mobile-nav-item");
  const pageMap = {
    home: "home",
    discover: "discover",
    search: "search",
    library: "library",
    me: "profile",
  };

  mobileItems.forEach((item) => {
    item.classList.remove("mobile-nav-item-active");
  });

  mobileItems.forEach((item) => {
    const link = item.querySelector(".mobile-nav-link");
    const text = link?.querySelector(".mobile-nav-text")?.textContent.trim().toLowerCase();

    if (!text) {
      return;
    }

    if (pageMap[text] === currentPage) {
      item.classList.add("mobile-nav-item-active");
    }
  });
}

function getCurrentPageKey() {
  const body = document.body;

  if (body.classList.contains("page-discover")) return "discover";
  if (body.classList.contains("page-search")) return "search";
  if (body.classList.contains("page-library")) return "library";
  if (body.classList.contains("page-profile")) return "profile";
  if (body.classList.contains("page-notifications")) return "notifications";
  if (body.classList.contains("page-friends")) return "friends";
  if (body.classList.contains("page-settings")) return "settings";
  if (body.classList.contains("page-playlist")) return "playlist";
  if (body.classList.contains("page-album")) return "album";
  if (body.classList.contains("page-artist")) return "artist";
  if (body.classList.contains("page-podcast")) return "podcast";
  if (body.classList.contains("page-song")) return "song";
  if (body.classList.contains("page-episode")) return "episode";

  return "home";
}
