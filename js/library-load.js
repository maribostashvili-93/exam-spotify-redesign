document.addEventListener("DOMContentLoaded", startLibraryPage);

async function startLibraryPage() {
  const roots = getLibraryRoots();

  if (!roots) {
    return;
  }

  try {
    const response = await fetch("../data/music-cover.json");

    if (!response.ok) {
      throw new Error(`Failed to load library content data: ${response.status}`);
    }

    const data = await response.json();
    const playlistsById = createPlaylistsMap(data.playlists);
    const home = data.home || {};
    const state = {
      roots,
      playlistsById,
      sections: {
        madeForYou: home.madeForYou || [],
        topMixes: home.topMixes || [],
        podcasts: home.podcasts || [],
        audiobooks: home.audiobooks || [],
      },
      view: "grid",
      sort: "recent",
      sortDirection: "desc",
    };

    renderLibraryPage(state);
    bindLibraryControls(state);
  } catch (error) {
    console.error(error);
  }
}

function getLibraryRoots() {
  const madeForYou = document.querySelector("#library-made-for-you");
  const topMixes = document.querySelector("#library-top-mixes");
  const podcasts = document.querySelector("#library-podcasts");
  const audiobooks = document.querySelector("#library-audiobooks");
  const listView = document.querySelector(".library-desktop-list");
  const listBody = document.querySelector("#library-desktop-list-body");
  const gridSections = document.querySelector(".library-desktop-sections");
  const viewButtons = Array.from(document.querySelectorAll("[data-library-view]"));
  const sortButton = document.querySelector("[data-library-sort]");
  const sortLabel = document.querySelector("[data-library-sort-label]");
  const columnSortButtons = Array.from(document.querySelectorAll("[data-library-column-sort]"));

  if (
    !madeForYou ||
    !topMixes ||
    !podcasts ||
    !audiobooks ||
    !listView ||
    !listBody ||
    !gridSections ||
    viewButtons.length < 2 ||
    !sortButton ||
    !sortLabel ||
    columnSortButtons.length < 4
  ) {
    return null;
  }

  return {
    madeForYou,
    topMixes,
    podcasts,
    audiobooks,
    listView,
    listBody,
    gridSections,
    viewButtons,
    sortButton,
    sortLabel,
    columnSortButtons,
  };
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

function bindLibraryControls(state) {
  state.roots.viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.libraryView || "grid";
      renderLibraryPage(state);
    });
  });

  state.roots.sortButton.addEventListener("click", () => {
    setLibrarySort(state, "recent");
  });

  state.roots.columnSortButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setLibrarySort(state, button.dataset.libraryColumnSort || "recent");
    });
  });
}

function renderLibraryPage(state) {
  renderLibraryDesktopCards(state.roots.madeForYou, state.sections.madeForYou, state.playlistsById, "playlist.html");
  renderLibraryDesktopCards(state.roots.topMixes, state.sections.topMixes, state.playlistsById, "playlist.html");
  renderLibraryDesktopCards(state.roots.podcasts, state.sections.podcasts, state.playlistsById, "podcast.html");
  renderLibraryDesktopCards(state.roots.audiobooks, state.sections.audiobooks, state.playlistsById, "episode.html");
  renderLibraryList(state);
  updateLibraryUi(state);
}

function renderLibraryDesktopCards(root, ids, playlistsById, href) {
  root.innerHTML = ids
    .map((id) => {
      const playlist = playlistsById.get(id);

      if (!playlist) {
        return "";
      }

      return renderLibraryCard(playlist, href);
    })
    .filter(Boolean)
    .join("");
}

function renderLibraryList(state) {
  const items = [
    ...buildListItems(state.sections.madeForYou, state.playlistsById, "playlist.html"),
    ...buildListItems(state.sections.topMixes, state.playlistsById, "playlist.html"),
    ...buildListItems(state.sections.podcasts, state.playlistsById, "podcast.html"),
    ...buildListItems(state.sections.audiobooks, state.playlistsById, "episode.html"),
  ];

  const sortedItems = sortLibraryItems(items, state.sort, state.sortDirection);

  state.roots.listBody.innerHTML = sortedItems
    .map((item, index) => renderLibraryListRow(item, index + 1))
    .join("");
}

function buildListItems(ids, playlistsById, href) {
  return ids
    .map((id, index) => {
      const playlist = playlistsById.get(id);

      if (!playlist) {
        return null;
      }

      const firstTrack = Array.isArray(playlist.tracks) ? playlist.tracks[0] : null;

      return {
        order: index,
        href,
        title: playlist.title,
        artist: firstTrack?.artist || playlist.mixSubtitle || "Spotify",
        album: firstTrack?.album || playlist.category || "",
        duration: getLibraryDuration(playlist, index),
        durationSeconds: parseDurationToSeconds(getLibraryDuration(playlist, index)),
        cover: resolveLibraryAssetPath(playlist.cover),
      };
    })
    .filter(Boolean);
}

function sortLibraryItems(items, sort, direction) {
  const list = [...items];
  const factor = direction === "desc" ? -1 : 1;

  if (sort === "album") {
    list.sort((first, second) => first.album.localeCompare(second.album) * factor);
    return list;
  }

  if (sort === "duration") {
    list.sort((first, second) => (first.durationSeconds - second.durationSeconds) * factor);
    return list;
  }

  if (sort === "title") {
    list.sort((first, second) => first.title.localeCompare(second.title) * factor);
    return list;
  }

  list.sort((first, second) => (first.order - second.order) * -1);
  return list;
}

function renderLibraryListRow(item, index) {
  return `
    <a href="${escapeAttribute(item.href)}" class="library-desktop-row" aria-label="${escapeAttribute(item.title)}">
      <span class="library-desktop-row__index">${index}</span>
      <img class="library-desktop-row__cover" src="${escapeAttribute(item.cover)}" alt="${escapeAttribute(item.title)} cover" />
      <div class="library-desktop-row__title">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.artist)}</p>
      </div>
      <span class="library-desktop-row__album">${escapeHtml(item.album)}</span>
      <span class="library-desktop-row__duration">${escapeHtml(item.duration)}</span>
      <button class="library-desktop-row__like" type="button" aria-label="Like ${escapeAttribute(item.title)}">
        <img src="../assets/icons/Name=Like, Filled=Yes.svg" alt="" />
      </button>
    </a>
  `;
}

function updateLibraryUi(state) {
  const isGrid = state.view === "grid";

  state.roots.gridSections.hidden = !isGrid;
  state.roots.listView.hidden = isGrid;
  state.roots.sortLabel.textContent = getLibrarySortLabel(state.sort);

  state.roots.viewButtons.forEach((button) => {
    const isActive = button.dataset.libraryView === state.view;
    button.classList.toggle("library-desktop-icon-btn--active", isActive);
  });

  state.roots.columnSortButtons.forEach((button) => {
    const sortKey = button.dataset.libraryColumnSort || "recent";
    const isActive = sortKey === state.sort;
    const indicator = button.querySelector(".library-desktop-list__sort-indicator");

    button.classList.toggle("library-desktop-list__sort--active", isActive);

    if (indicator) {
      indicator.textContent = isActive ? (state.sortDirection === "asc" ? "↑" : "↓") : "";
    }
  });
}

function renderLibraryCard(playlist, href) {
  const stackRgb = hexToRgb(playlist.stackColor);
  const title = playlist.title;
  const description = playlist.description || "";
  const cover = resolveLibraryAssetPath(playlist.cover);

  return `
    <a href="${escapeAttribute(href)}" class="card library-card" aria-label="${escapeAttribute(title)}">
      <span class="card__pin">
        <img src="../assets/icons/Name=Pin, Filled=Yes.svg" alt="" />
      </span>
      <div class="card-cover-wrap" style="--stack-rgb: ${stackRgb};">
        <img class="card-cover" src="${escapeAttribute(cover)}" alt="${escapeAttribute(title)} cover" />
      </div>
      <div class="card-body">
        <strong class="card-title">${escapeHtml(title)}</strong>
        <span class="card-sub">${escapeHtml(description)}</span>
      </div>
    </a>
  `;
}

function getLibraryDuration(playlist, index) {
  const durations = ["4:35", "5:37", "3:53", "2:33", "5:20", "3:49", "4:35", "6:09"];
  return durations[index % durations.length];
}

function setLibrarySort(state, nextSort) {
  if (state.sort === nextSort) {
    if (nextSort === "recent") {
      state.sortDirection = "desc";
    } else {
      state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
    }
  } else {
    state.sort = nextSort;
    state.sortDirection = nextSort === "recent" ? "desc" : "asc";
  }

  renderLibraryPage(state);
}

function getLibrarySortLabel(sort) {
  if (sort === "album") {
    return "Album";
  }

  if (sort === "duration") {
    return "Duration";
  }

  if (sort === "title") {
    return "Title";
  }

  return "Recent";
}

function parseDurationToSeconds(value) {
  const [minutes, seconds] = String(value || "0:00")
    .split(":")
    .map((part) => Number.parseInt(part, 10) || 0);

  return minutes * 60 + seconds;
}

function resolveLibraryAssetPath(path) {
  const value = String(path || "");

  if (value.startsWith("./")) {
    return `../${value.slice(2)}`;
  }

  return value;
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
