const DEFAULT_SEARCH_DATA = {
  placeholder: "What do you want to play?",
  recentSearches: [
    {
      title: "Daft Punk",
      type: "artist",
      image: "../assets/img/daftpunk-scaled.jpg",
    },
    {
      title: "Lana Del Rey",
      type: "artist",
      image: "../assets/img/Без названия (98).jpg",
    },
    {
      title: "Nirvana",
      subtitle: "Nevermind",
      type: "album",
      image: "../assets/img/10_27_93, Kalamazoo, WI.jpg",
    },
  ],
  browseCategories: [
    {
      title: "Made For You",
      image: "../assets/img/image-13.png",
      accentClass: "search-browse-tile--blue",
      tags: ["mix", "playlist", "daily"],
    },
    {
      title: "New Releases",
      image: "../assets/img/image-13-1.png",
      accentClass: "search-browse-tile--orange",
      tags: ["albums", "fresh", "latest"],
    },
    {
      title: "Spotify Classics",
      image: "../assets/img/image-13-2.png",
      accentClass: "search-browse-tile--navy",
      tags: ["classic", "vintage", "hits"],
    },
    {
      title: "Charts",
      image: "../assets/img/image-13-3.png",
      accentClass: "search-browse-tile--purple",
      tags: ["top", "viral", "popular"],
    },
    {
      title: "Trending",
      image: "../assets/img/image-13-4.png",
      accentClass: "search-browse-tile--pink",
      tags: ["viral", "top", "hot"],
    },
    {
      title: "Discover",
      image: "../assets/img/image-13-5.png",
      accentClass: "search-browse-tile--lilac",
      tags: ["new", "explore", "find"],
    },
    {
      title: "Spotify Singles",
      image: "../assets/img/image-13-6.png",
      accentClass: "search-browse-tile--gray",
      tags: ["single", "exclusive", "spotify"],
    },
    {
      title: "Decades",
      image: "../assets/img/image-13-7.png",
      accentClass: "search-browse-tile--orange",
      tags: ["80s", "90s", "2000s"],
    },
  ],
  genreCategories: [
    {
      title: "Pop",
      image: "../assets/img/image-13-8.png",
      accentClass: "search-browse-tile--green",
      tags: ["genre", "mainstream"],
    },
    {
      title: "Country",
      image: "../assets/img/image-13-9.png",
      accentClass: "search-browse-tile--orange-red",
      tags: ["genre", "americana"],
    },
    {
      title: "Hip-Hop",
      image: "../assets/img/image-13-10.png",
      accentClass: "search-browse-tile--mauve",
      tags: ["genre", "rap"],
    },
    {
      title: "Rock",
      image: "../assets/img/image-13-11.png",
      accentClass: "search-browse-tile--teal",
      tags: ["genre", "band"],
    },
    {
      title: "Indie",
      image: "../assets/img/image-13-12.png",
      accentClass: "search-browse-tile--red",
      tags: ["genre", "alternative"],
    },
    {
      title: "Punk",
      image: "../assets/img/image-13-13.png",
      accentClass: "search-browse-tile--cobalt",
      tags: ["genre", "fast"],
    },
    {
      title: "Metal",
      image: "../assets/img/image-13-14.png",
      accentClass: "search-browse-tile--crimson",
      tags: ["genre", "heavy"],
    },
    {
      title: "Instrumental",
      image: "../assets/img/image-2.png",
      accentClass: "search-browse-tile--slate",
      tags: ["genre", "ambient", "score"],
    },
  ],
};

document.addEventListener("DOMContentLoaded", startSearchPage);
document.addEventListener("header:loaded", startSearchPage);

const TILE_ACCENT_MAP = {
  "search-browse-tile--blue": "search-tile--blue",
  "search-browse-tile--orange": "search-tile--orange",
  "search-browse-tile--navy": "search-tile--blue",
  "search-browse-tile--purple": "search-tile--purple",
  "search-browse-tile--pink": "search-tile--pink",
  "search-browse-tile--lilac": "search-tile--lilac",
  "search-browse-tile--gray": "search-tile--gray",
  "search-browse-tile--green": "search-tile--blue",
  "search-browse-tile--orange-red": "search-tile--orange",
  "search-browse-tile--mauve": "search-tile--purple",
  "search-browse-tile--teal": "search-tile--blue",
  "search-browse-tile--red": "search-tile--pink",
  "search-browse-tile--cobalt": "search-tile--blue",
  "search-browse-tile--crimson": "search-tile--pink",
  "search-browse-tile--slate": "search-tile--gray",
};

const CATEGORY_ROUTE_MAP = {
  podcast: "podcast.html",
  audiobook: "episode.html",
  pop: "discover.html",
  rock: "discover.html",
  indie: "discover.html",
  "hip-hop": "discover.html",
  country: "discover.html",
  metal: "discover.html",
  punk: "discover.html",
  instrumental: "discover.html",
  "made for you": "discover.html",
  "new releases": "discover.html",
  classics: "discover.html",
  charts: "discover.html",
  trending: "discover.html",
  discover: "discover.html",
  singles: "discover.html",
  decades: "discover.html",
};

const CATEGORY_IMAGE_MAP = {
  "made for you": "../assets/img/image-13.png",
  "new releases": "../assets/img/image-13-1.png",
  "spotify classics": "../assets/img/image-13-2.png",
  charts: "../assets/img/image-13-3.png",
  trending: "../assets/img/image-13-4.png",
  discover: "../assets/img/image-13-5.png",
  "spotify singles": "../assets/img/image-13-6.png",
  decades: "../assets/img/image-13-7.png",
  pop: "../assets/img/image-13-8.png",
  country: "../assets/img/image-13-9.png",
  "hip-hop": "../assets/img/image-13-10.png",
  rock: "../assets/img/image-13-11.png",
  indie: "../assets/img/image-13-12.png",
  punk: "../assets/img/image-13-13.png",
  metal: "../assets/img/image-13-14.png",
  instrumental: "../assets/img/image-2.png",
};

const RECENT_IMAGE_MAP = {
  "daft punk": "../assets/img/daftpunk-scaled.jpg",
  "lana del rey": "../assets/img/Без названия (98).jpg",
  nirvana: "../assets/img/10_27_93, Kalamazoo, WI.jpg",
};

const searchState = {
  data: null,
  query: "",
};

const SEARCH_DATA_URL = "../data/music-cover.json";

async function startSearchPage() {
  if (!document.querySelector(".page-search")) {
    return;
  }

  const roots = getSearchRoots();

  if (!roots) {
    return;
  }

  if (!searchState.data) {
    searchState.data = await loadSearchData();
  }

  applyPlaceholder(roots.inputs, searchState.data.placeholder);
  syncInputs(roots.inputs, searchState.query);
  renderSearchPage(searchState.data, searchState.query, roots);
  bindRecentCardNavigation(roots.recentGrid);
  bindSearchInputs(roots.inputs, roots.buttons, searchState.data, roots, (nextQuery) => {
    searchState.query = nextQuery;
  });
  bindCarouselArrows();
}

function getSearchRoots() {
  const mobileGrid = document.querySelector("#search-mobile-grid");
  const recentGrid = document.querySelector("#search-recent-grid");
  const browseRow = document.querySelector("#search-browse-row");
  const genreRow = document.querySelector("#search-genre-row");
  const emptyState = document.querySelector("#search-empty-state");
  const inputs = Array.from(document.querySelectorAll("[data-search-input]"));
  const buttons = Array.from(document.querySelectorAll("[data-search-button]"));

  if (!mobileGrid || !recentGrid || !browseRow || !genreRow || inputs.length === 0) {
    return null;
  }

  return {
    mobileGrid,
    recentGrid,
    browseRow,
    genreRow,
    emptyState,
    recentSection: recentGrid.closest(".search-desktop-section"),
    browseSection: browseRow.closest(".search-desktop-section"),
    genreSection: genreRow.closest(".search-desktop-section"),
    inputs,
    buttons,
  };
}

async function loadSearchData() {
  try {
    const response = await fetch(SEARCH_DATA_URL);

    if (!response.ok) {
      throw new Error(`Failed to load search content data: ${response.status}`);
    }

    const data = await response.json();
    return normalizeSearchData(data.search);
  } catch (error) {
    console.error(error);
    return normalizeSearchData(DEFAULT_SEARCH_DATA);
  }
}

function normalizeSearchData(search) {
  const source = search || DEFAULT_SEARCH_DATA;

  return {
    placeholder: source.placeholder || DEFAULT_SEARCH_DATA.placeholder,
    recentSearches: normalizeRecentSearches(source.recentSearches),
    browseCategories: normalizeCategories(source.browseCategories, DEFAULT_SEARCH_DATA.browseCategories),
    genreCategories: normalizeCategories(source.genreCategories, DEFAULT_SEARCH_DATA.genreCategories),
  };
}

function normalizeRecentSearches(items) {
  const list = Array.isArray(items) ? items : DEFAULT_SEARCH_DATA.recentSearches;

  return list.map((item) => createRecentSearchItem(item));
}

function normalizeCategories(items, fallbackItems) {
  const list = Array.isArray(items) ? items : fallbackItems;

  return list.map((item) => createCategoryItem(item));
}

function createRecentSearchItem(item) {
  const title = item.title || "";

  return {
    title,
    subtitle: item.subtitle || "",
    type: item.type === "artist" ? "artist" : "album",
    image: getRecentImage(title, item.image || ""),
  };
}

function createCategoryItem(item) {
  const title = item.title || "";

  return {
    title,
    image: getCategoryImage(title, item.image || ""),
    accentClass: item.accentClass || "search-browse-tile--blue",
    tags: Array.isArray(item.tags) ? item.tags : [],
  };
}

function applyPlaceholder(inputs, placeholder) {
  inputs.forEach((input) => {
    input.placeholder = placeholder || DEFAULT_SEARCH_DATA.placeholder;
  });
}

function bindSearchInputs(inputs, buttons, searchData, roots, setQuery) {
  inputs.forEach((input) => {
    if (input.dataset.searchBound === "true") {
      return;
    }

    input.addEventListener("input", (event) => {
      const nextQuery = String(event.target.value || "");

      setQuery(nextQuery);
      syncInputs(inputs, nextQuery, event.target);
      renderSearchPage(searchData, nextQuery, roots);
    });

    input.dataset.searchBound = "true";
  });

  buttons.forEach((button, index) => {
    if (button.dataset.searchBound === "true") {
      return;
    }

    button.addEventListener("click", () => {
      focusSearchInput(inputs, index);
    });

    button.dataset.searchBound = "true";
  });
}

function focusSearchInput(inputs, index) {
  const input = inputs[index] || inputs[0];

  if (input) {
    input.focus();
  }
}

function bindRecentCardNavigation(recentGrid) {
  if (recentGrid.dataset.searchBound === "true") {
    return;
  }

  recentGrid.addEventListener("click", (event) => {
    const closeButton = event.target.closest(".search-recent-card__close");

    if (closeButton) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    const card = event.target.closest(".search-recent-card[data-route]");

    if (!card) {
      return;
    }

    window.location.href = card.dataset.route;
  });

  recentGrid.dataset.searchBound = "true";
}

function bindCarouselArrows() {
  document.querySelectorAll(".search-carousel-heading").forEach((heading) => {
    if (heading.dataset.searchBound === "true") {
      return;
    }

    const row = heading.nextElementSibling;
    const buttons = heading.querySelectorAll(".search-carousel-heading__arrow");

    if (!row || buttons.length < 2) {
      return;
    }

    buttons[0].addEventListener("click", () => {
      row.scrollBy({ left: -220, behavior: "smooth" });
    });

    buttons[1].addEventListener("click", () => {
      row.scrollBy({ left: 220, behavior: "smooth" });
    });

    heading.dataset.searchBound = "true";
  });
}

function syncInputs(inputs, value, sourceInput) {
  inputs.forEach((input) => {
    if (input !== sourceInput) {
      input.value = value;
    }
  });
}

function renderSearchPage(searchData, query, roots) {
  const normalizedQuery = query.trim().toLowerCase();
  const filteredData = getFilteredSearchData(searchData, normalizedQuery);

  roots.mobileGrid.innerHTML = renderMobileTiles(filteredData.browse, filteredData.genres);
  roots.recentGrid.innerHTML = renderRecentCards(filteredData.recent);
  roots.browseRow.innerHTML = renderDesktopTiles(filteredData.browse);
  roots.genreRow.innerHTML = renderDesktopTiles(filteredData.genres);

  updateSections(roots, filteredData.recent, filteredData.browse, filteredData.genres, normalizedQuery);
}

function getFilteredSearchData(searchData, query) {
  return {
    recent: filterRecentSearches(searchData.recentSearches, query),
    browse: filterCategories(searchData.browseCategories, query),
    genres: filterCategories(searchData.genreCategories, query),
  };
}

function filterRecentSearches(items, query) {
  if (!query) {
    return items;
  }

  return items.filter((item) => {
    const haystack = `${item.title} ${item.subtitle} ${item.type}`.toLowerCase();
    return haystack.includes(query);
  });
}

function filterCategories(items, query) {
  if (!query) {
    return items;
  }

  return items.filter((item) => {
    const haystack = [item.title, ...item.tags].join(" ").toLowerCase();
    return haystack.includes(query);
  });
}

function renderMobileTiles(browseItems, genreItems) {
  const allItems = [...browseItems, ...genreItems];

  return allItems
    .map((item) => renderMobileTile(item))
    .join("");
}

function renderDesktopTiles(items) {
  return items
    .map((item) => renderDesktopTile(item))
    .join("");
}

function renderMobileTile(item) {
  const href = getCategoryRoute(item.title);

  return `
    <a class="search-tile ${escapeAttribute(mapTileAccent(item.accentClass))}" href="${escapeAttribute(href)}">
      <span class="search-tile__title">${escapeHtml(item.title)}</span>
      <img class="search-tile__art" src="${escapeAttribute(item.image)}" alt="${escapeAttribute(item.title)}" />
    </a>
  `;
}

function renderDesktopTile(item) {
  const href = getCategoryRoute(item.title);

  return `
    <a class="search-browse-tile ${escapeAttribute(item.accentClass)}" href="${escapeAttribute(href)}">
      <span class="search-browse-tile__title">${escapeHtml(item.title)}</span>
      <img class="search-browse-tile__art" src="${escapeAttribute(item.image)}" alt="${escapeAttribute(item.title)}" />
    </a>
  `;
}

function renderRecentCards(items) {
  return items
    .map((item) => {
      const artistClass = item.type === "artist" ? "search-recent-card__media--artist" : "";
      const subtitle = item.subtitle
        ? `<span class="search-recent-card__meta">${escapeHtml(item.subtitle)}</span>`
        : "";
      const href = item.type === "artist" ? "artist.html" : "album.html";

      return `
        <article class="search-recent-card" data-route="${escapeAttribute(href)}">
          <div class="search-recent-card__media ${artistClass}">
            <img src="${escapeAttribute(item.image)}" alt="${escapeAttribute(item.title)}" />
            <button class="search-recent-card__close" type="button" aria-label="Remove ${escapeAttribute(item.title)} search">
              <img src="../assets/icons/Name=Close, Filled=No.svg" alt="" />
            </button>
          </div>
          <span class="search-recent-card__title">${escapeHtml(item.title)}</span>
          ${subtitle}
        </article>
      `;
    })
    .join("");
}

function updateSections(roots, filteredRecent, filteredBrowse, filteredGenres, query) {
  toggleSection(roots.recentSection, filteredRecent.length > 0);
  toggleSection(roots.browseSection, filteredBrowse.length > 0);
  toggleSection(roots.genreSection, filteredGenres.length > 0);

  const hasResults = filteredRecent.length + filteredBrowse.length + filteredGenres.length > 0;

  if (roots.emptyState) {
    roots.emptyState.hidden = hasResults;
  }
}

function toggleSection(section, isVisible) {
  if (!section) {
    return;
  }

  section.hidden = !isVisible;
}

function mapTileAccent(accentClass) {
  return TILE_ACCENT_MAP[accentClass] || "search-tile--blue";
}

function getCategoryRoute(title) {
  const label = String(title || "").trim().toLowerCase();

  for (const [key, route] of Object.entries(CATEGORY_ROUTE_MAP)) {
    if (label.includes(key)) {
      return route;
    }
  }

  return "search.html";
}

function getRecentImage(title, fallbackImage) {
  const key = String(title || "").trim().toLowerCase();
  const image = RECENT_IMAGE_MAP[key] || fallbackImage;

  return formatAssetPath(image);
}

function getCategoryImage(title, fallbackImage) {
  const key = String(title || "").trim().toLowerCase();
  const image = CATEGORY_IMAGE_MAP[key] || fallbackImage;

  return formatAssetPath(image);
}

function resolveAssetPath(value) {
  const stringValue = String(value ?? "");

  if (!stringValue) {
    return "";
  }

  const normalized = stringValue.replaceAll("\\", "/").trim();

  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }

  if (normalized.startsWith("../")) {
    return normalized;
  }

  if (normalized.startsWith("./")) {
    return normalized.replace(/^\.\//, "../");
  }

  if (normalized.startsWith("/")) {
    return `..${normalized}`;
  }

  return `../${normalized}`;
}

function formatAssetPath(value) {
  return resolveAssetPath(value);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll('"', "&quot;");
}
