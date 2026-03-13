document.addEventListener("DOMContentLoaded", startHomePage);

const HOME_ROUTES = {
  all: "",
};

async function startHomePage() {
  const quickMixesRoot = document.querySelector("#quick-mixes");
  const madeForYouRoot = document.querySelector("#made-for-you-cards");
  const topMixesRoot = document.querySelector("#top-mixes-cards");
  const podcastCardsRoot = document.querySelector("#podcast-cards");
  const audiobookCardsRoot = document.querySelector("#audiobook-cards");
  const favoriteArtistsRoot = document.querySelector("#favorite-artists-row");

  if (!quickMixesRoot || !madeForYouRoot || !topMixesRoot || !podcastCardsRoot || !audiobookCardsRoot || !favoriteArtistsRoot) {
    return;
  }

  try {
    const response = await fetch("./data/music-cover.json");

    if (!response.ok) {
      throw new Error(`Failed to load home content data: ${response.status}`);
    }

    const data = await response.json();
    const playlistsById = createPlaylistsMap(data.playlists);
    const home = data.home || {};

    renderQuickMixes(quickMixesRoot, home.quickMixes || [], playlistsById);
    renderCardsRow(madeForYouRoot, home.madeForYou || [], playlistsById);
    renderCardsRow(topMixesRoot, home.topMixes || [], playlistsById);
    renderCardsRow(podcastCardsRoot, home.podcasts || [], playlistsById, "./pages/podcast.html");
    renderCardsRow(audiobookCardsRoot, home.audiobooks || [], playlistsById, "./pages/episode.html");
    renderFavoriteArtists(favoriteArtistsRoot, home.favoriteArtists || []);
    setupHomeFilters();
  } catch (error) {
    console.error(error);
  }
}

function createPlaylistsMap(playlists) {
  const map = new Map();

  if (!Array.isArray(playlists)) {
    return map;
  }

  playlists.forEach((playlist) => {
    map.set(playlist.id, playlist);
  });

  return map;
}

function renderQuickMixes(root, items, playlistsById) {
  root.innerHTML = items
    .map((item) => {
      const playlist = playlistsById.get(item.playlistId);

      if (!playlist) {
        return "";
      }

      const title = item.title || playlist.title;
      const subtitle = item.subtitle || playlist.mixSubtitle || playlist.title;
      const cover = item.cover || playlist.cover;

      return `
        <a class="mix-card" href="./pages/playlist.html" aria-label="${escapeHtml(playlist.title)}">
          <img class="mix-cover" src="${escapeAttribute(cover)}" alt="${escapeAttribute(playlist.title)} cover" />
          <div class="mix-text">
            <p class="mix-title">${escapeHtml(title)}</p>
            <p class="mix-sub">${escapeHtml(subtitle)}</p>
          </div>
        </a>
      `;
    })
    .join("");
}

function renderCardsRow(root, ids, playlistsById, href = "./pages/playlist.html") {
  root.innerHTML = ids
    .map((id) => playlistsById.get(id))
    .filter(Boolean)
    .map((playlist) => {
      const stackRgb = hexToRgb(playlist.stackColor);

      return `
        <a class="card" href="${escapeAttribute(href)}" aria-label="${escapeAttribute(playlist.title)}">
          <div class="card-cover-wrap" style="--stack-rgb: ${stackRgb};">
            <img class="card-cover" src="${escapeAttribute(playlist.cover)}" alt="${escapeAttribute(playlist.title)} cover" />
          </div>
          <div class="card-body">
            <strong class="card-title">${escapeHtml(playlist.title)}</strong>
            <span class="card-sub">${escapeHtml(playlist.description || "")}</span>
          </div>
        </a>
      `;
    })
    .join("");
}

function renderFavoriteArtists(root, artists) {
  root.innerHTML = artists
    .map((artist) => `
      <a class="artist-card" href="./pages/artist.html" aria-label="${escapeAttribute(artist.name)}">
        <img class="artist-card__image" src="${escapeAttribute(artist.image)}" alt="${escapeAttribute(artist.name)}" />
      </a>
    `)
    .join("");
}

function setupHomeFilters() {
  const chips = Array.from(document.querySelectorAll(".chip"));
  const sections = getHomeSections();

  if (chips.length === 0 || sections.length === 0) {
    return;
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const filterName = chip.textContent.trim().toLowerCase();

      setActiveChip(chips, chip);
      openHomeFilter(filterName, sections);
    });
  });
}

function getHomeSections() {
  const sections = [
    { element: document.querySelector("#quick-mixes"), category: "music" },
    { element: document.querySelector("#made-for-you-cards")?.closest(".section-wrapper"), category: "music" },
    { element: document.querySelector("#top-mixes-cards")?.closest(".section-wrapper"), category: "music" },
    { element: document.querySelector("#podcast-cards")?.closest(".section-wrapper"), category: "podcasts" },
    { element: document.querySelector("#audiobook-cards")?.closest(".section-wrapper"), category: "audiobooks" },
    { element: document.querySelector("#favorite-artists-row")?.closest(".section-wrapper"), category: "music" },
  ];

  return sections.filter((section) => section.element);
}

function setActiveChip(chips, activeChip) {
  chips.forEach((chip) => {
    chip.classList.remove("chip--active");
  });

  activeChip.classList.add("chip--active");
}

function openHomeFilter(filterName, sections) {
  const route = HOME_ROUTES[filterName];

  if (route) {
    window.location.href = route;
    return;
  }

  if (filterName === "podcasts") {
    showHomeSections(sections, "podcasts");
    return;
  }

  if (filterName === "music") {
    showHomeSections(sections, "music");
    return;
  }

  if (filterName === "audiobooks") {
    showHomeSections(sections, "audiobooks");
    return;
  }

  showHomeSections(sections, "all");
}

function showHomeSections(sections, filterName) {
  sections.forEach((section) => {
    if (filterName === "all") {
      section.element.hidden = false;
      return;
    }

    section.element.hidden = section.category !== filterName;
  });
}

function hexToRgb(hex) {
  const normalized = String(hex || "").replace("#", "");

  if (normalized.length !== 6) {
    return "149, 230, 211";
  }

  const value = Number.parseInt(normalized, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;

  return `${red}, ${green}, ${blue}`;
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
