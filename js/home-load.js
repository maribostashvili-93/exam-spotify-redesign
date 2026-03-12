document.addEventListener("DOMContentLoaded", startHomePage);

const HOME_ROUTES = {
  all: "",
  music: "./pages/song.html",
  podcasts: "./pages/podcast.html",
  audiobooks: "./pages/podcast.html",
};

async function startHomePage() {
  const quickMixesRoot = document.querySelector("#quick-mixes");
  const madeForYouRoot = document.querySelector("#made-for-you-cards");
  const topMixesRoot = document.querySelector("#top-mixes-cards");
  const favoriteArtistsRoot = document.querySelector("#favorite-artists-row");

  if (!quickMixesRoot || !madeForYouRoot || !topMixesRoot || !favoriteArtistsRoot) {
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

function renderCardsRow(root, ids, playlistsById) {
  root.innerHTML = ids
    .map((id) => playlistsById.get(id))
    .filter(Boolean)
    .map((playlist) => {
      const stackRgb = hexToRgb(playlist.stackColor);

      return `
        <a class="card" href="./pages/playlist.html" aria-label="${escapeAttribute(playlist.title)}">
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
    document.querySelector("#quick-mixes"),
    document.querySelector("#made-for-you-cards")?.closest(".section-wrapper"),
    document.querySelector("#top-mixes-cards")?.closest(".section-wrapper"),
    document.querySelector("#favorite-artists-row")?.closest(".section-wrapper"),
  ];

  return sections.filter(Boolean);
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

  showHomeSections(sections);
}

function showHomeSections(sections) {
  sections.forEach((section) => {
    section.hidden = false;
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
