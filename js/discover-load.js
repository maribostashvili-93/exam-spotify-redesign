const DEFAULT_DISCOVER_DATA = {
  filters: ["Music", "EDM", "Indie", "Pop", "Rock", "Alt Rock", "Country", "R&B", "Hip-Hop", "Podcast", "Audiobooks"],
  activeFilter: "Music",
  reels: [
    {
      playlistId: "pl-03",
      title: "The Strokes",
      artist: "Poster Pick",
      year: "2000s",
      songs: "Indie rock",
      duration: "3 min",
      likes: "540K",
      chips: ["Indie", "Rock"],
      tintColor: "#7E2519",
      reelImage: "../assets/img/strok.jpg",
      cover: "../assets/img/strok.jpg",
    },
    {
      playlistId: "pl-12",
      title: "TED Talk",
      artist: "Ideas Worth Sharing",
      year: "Talks",
      songs: "Podcast",
      duration: "18 min",
      likes: "720K",
      chips: ["Podcast", "Talks"],
      tintColor: "#5B0B0B",
      reelImage: "../assets/img/Ted Talk.jpg",
      cover: "../assets/img/Ted Talk.jpg",
    },
    {
      playlistId: "pl-13",
      title: "The Beatles Poster",
      artist: "Classic Collection",
      year: "1960s",
      duration: "2 min",
      likes: "680K",
      chips: ["Classic", "Rock"],
      tintColor: "#1F364E",
      reelImage: "../assets/img/The Beatles Poster.jpg",
      cover: "../assets/img/The Beatles Poster.jpg",
    },
    {
      playlistId: "pl-14",
      title: "ABBA",
      artist: "Poster Pick",
      year: "70s Pop",
      songs: "Pop classic",
      duration: "3 min",
      likes: "610K",
      chips: ["Pop", "Classic"],
      tintColor: "#8D5F44",
      reelImage: "../assets/img/Без названия (90).jpg",
      cover: "../assets/img/Без названия (90).jpg",
    },
    {
      playlistId: "pl-04",
      title: "Abbey Road",
      artist: "The Beatles",
      year: "1969",
      songs: "Rock classic",
      duration: "2 min",
      likes: "650K",
      chips: ["Classic", "Rock"],
      tintColor: "#314B3E",
      reelImage: "../assets/img/Без названия (91).jpg",
      cover: "../assets/img/Без названия (91).jpg",
    },
    {
      playlistId: "pl-17b",
      title: "Billie Eilish",
      artist: "Poster Pick",
      year: "Alt Pop",
      songs: "Modern pop",
      duration: "3 min",
      likes: "770K",
      chips: ["Pop", "Alt"],
      tintColor: "#6A6B30",
      reelImage: "../assets/img/Billie Eilish poster.jpg",
      cover: "../assets/img/Billie Eilish poster.jpg",
    },
  ],
};

document.addEventListener("DOMContentLoaded", startDiscoverPage);

async function startDiscoverPage() {
  const roots = getDiscoverRoots();

  if (!roots) {
    return;
  }

  const { discover, playlistsById } = await loadDiscoverData();

  const state = {
    roots,
    playlistsById,
    filters: discover.filters,
    reels: discover.reels,
    activeFilter: discover.activeFilter,
  };

  renderDiscoverPage(state);
  bindDiscoverTabs(state);
}

function getDiscoverRoots() {
  const tabsRoot = document.querySelector("#discover-tabs");
  const feedRoot = document.querySelector("#discover-feed");

  if (!tabsRoot || !feedRoot) {
    return null;
  }

  return { tabsRoot, feedRoot };
}

async function loadDiscoverData() {
  try {
    const response = await fetch("../data/music-cover.json");

    if (!response.ok) {
      throw new Error(`Failed to load discover content data: ${response.status}`);
    }

    const data = await response.json();

    return {
      discover: normalizeDiscoverData(data.discover),
      playlistsById: createPlaylistsMap(data.playlists),
    };
  } catch (error) {
    console.error(error);

    return {
      discover: normalizeDiscoverData(DEFAULT_DISCOVER_DATA),
      playlistsById: new Map(),
    };
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

function normalizeDiscoverData(discover) {
  const source = discover || DEFAULT_DISCOVER_DATA;
  const filters = getDiscoverFilters(source);
  const activeFilter = source.activeFilter || DEFAULT_DISCOVER_DATA.activeFilter;
  const reels = sortReels(source.reels);

  return {
    filters,
    activeFilter,
    reels: reels.map(normalizeReel),
  };
}

function getDiscoverFilters(source) {
  if (Array.isArray(source.filters)) {
    return source.filters;
  }

  return DEFAULT_DISCOVER_DATA.filters;
}

function bindDiscoverTabs(state) {
  state.roots.tabsRoot.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) {
      return;
    }

    const filter = button.dataset.filter;

    if (!filter || filter === state.activeFilter) {
      return;
    }

    state.activeFilter = filter;
    renderDiscoverPage(state);
  });
}

function renderDiscoverPage(state) {
  const filteredReels = getFilteredReels(state.reels, state.activeFilter);

  renderTabs(state.roots.tabsRoot, state.filters, state.activeFilter);
  renderFeed(state.roots.feedRoot, filteredReels, state.playlistsById);
}

function getFilteredReels(reels, activeFilter) {
  if (!Array.isArray(reels)) {
    return [];
  }

  if (activeFilter === "Music") {
    return reels.filter((reel) => !hasCategory(reel, ["Podcast", "Audiobooks"]));
  }

  return reels.filter((reel) => hasCategory(reel, [activeFilter]));
}

function hasCategory(reel, names) {
  const reelChips = Array.isArray(reel.chips) ? reel.chips : [];

  return reelChips.some((chip) => names.includes(chip));
}

function sortReels(reels) {
  const safeReels = Array.isArray(reels) ? [...reels] : [...DEFAULT_DISCOVER_DATA.reels];

  safeReels.sort((first, second) => {
    if (first.playlistId === "pl-16") {
      return -1;
    }

    if (second.playlistId === "pl-16") {
      return 1;
    }

    return 0;
  });

  return safeReels;
}

function normalizeReel(reel) {
  return {
    ...reel,
    chips: Array.isArray(reel.chips) ? reel.chips : [],
    reelImage: resolveAssetPath(reel.reelImage || reel.surfaceImage || ""),
    cover: resolveAssetPath(reel.cover || ""),
    tintColor: reel.tintColor || "",
  };
}

function renderTabs(root, filters, activeFilter) {
  root.innerHTML = filters
    .map((filter) => renderTab(filter, activeFilter))
    .join("");
}

function renderTab(filter, activeFilter) {
  const activeClass = filter === activeFilter ? "is-active" : "";

  return `
    <button type="button" class="${activeClass}" data-filter="${escapeAttribute(filter)}">
      ${escapeHtml(filter)}
    </button>
  `;
}

function renderFeed(root, reels, playlistsById) {
  root.innerHTML = reels.map((reel, index) => renderReel(reel, playlistsById, index)).join("");
}

function renderReel(reel, playlistsById, index) {
  const playlist = playlistsById.get(reel.playlistId) || {};
  const firstTrack = getFirstTrack(playlist);
  const content = getReelContent(reel, playlist, firstTrack);

  return `
    <article class="discover-reel" data-reel-index="${index}" style="--discover-tint-rgb: ${hexToRgb(content.tintColor)};">
      <div class="discover-reel__media" style="--discover-reel-image: url('${escapeAttribute(content.reelImage)}');">
        <div class="discover-reel__surface"></div>
        <div class="discover-reel__frame"></div>
        <img
          class="discover-reel__poster"
          src="${escapeAttribute(content.reelImage)}"
          alt="${escapeAttribute(content.title)} reel"
        />
        <div class="discover-reel__progress" aria-hidden="true">
          <span class="is-active"></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div class="discover-reel__side">
        <div class="discover-reel__track">
          <img src="${escapeAttribute(content.cover)}" alt="${escapeAttribute(content.title)}" />
          <div class="discover-reel__content">
            <h3>${escapeHtml(content.title)}</h3>
            <p>${escapeHtml(content.meta)}</p>
            <aside class="discover-reel__actions" aria-label="Actions">
              <button type="button" aria-label="Play">
                <img src="../assets/icons/play-green.svg" alt="" />
              </button>
              <button type="button" aria-label="Save">
                <img src="../assets/icons/Name=Save, Filled=No.svg" alt="" />
              </button>
              <span>${escapeHtml(content.likes)}</span>
              <button type="button" aria-label="Add to playlist">
                <img src="../assets/icons/Name=Add to Playlist, Filled=No.svg" alt="" />
              </button>
              <button type="button" aria-label="Share">
                <img src="../assets/icons/Name=Share, Filled=No.svg" alt="" />
              </button>
              <button type="button" aria-label="More">
                <img src="../assets/icons/Name=More, Filled=No.svg" alt="" />
              </button>
            </aside>
            <div class="discover-reel__chips">
              ${reel.chips.map((chip) => `<span>${escapeHtml(chip)}</span>`).join("")}
            </div>
          </div>
        </div>
      </div>
    </article>
  `;
}

function getReelContent(reel, playlist, firstTrack) {
  const title = reel.title || firstTrack.title || playlist.title || "";
  const artist = reel.artist || firstTrack.artist || playlist.mixSubtitle || "";

  return {
    title,
    cover: reel.cover || resolveAssetPath(playlist.cover || ""),
    reelImage: reel.reelImage || resolveAssetPath(playlist.cover || ""),
    likes: reel.likes || "500K",
    tintColor: reel.tintColor || playlist.stackColor || "#1E4E49",
    meta: buildMetaText(artist, reel.year, reel.songs, reel.duration),
  };
}

function getFirstTrack(playlist) {
  if (!Array.isArray(playlist.tracks) || playlist.tracks.length === 0) {
    return {};
  }

  return playlist.tracks[0];
}

function buildMetaText(artist, year, songs, duration) {
  const parts = [];

  if (artist) {
    parts.push(`By ${artist}`);
  }

  if (year) {
    parts.push(year);
  }

  if (songs) {
    parts.push(songs);
  }

  if (duration) {
    parts.push(duration);
  }

  return parts.join(" - ");
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

function resolveAssetPath(value) {
  const stringValue = String(value ?? "");

  if (stringValue.startsWith("../")) {
    return stringValue;
  }

  return stringValue.replace(/^\.\//, "../");
}

function hexToRgb(hex) {
  const normalized = String(hex || "").replace("#", "");

  if (normalized.length !== 6) {
    return "30, 78, 73";
  }

  const value = Number.parseInt(normalized, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;

  return `${red}, ${green}, ${blue}`;
}
