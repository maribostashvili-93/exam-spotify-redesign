document.addEventListener("DOMContentLoaded", async () => {
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
    const playlists = Array.isArray(data.playlists) ? data.playlists : [];
    const home = data.home ?? {};
    const playlistsById = new Map(playlists.map((playlist) => [playlist.id, playlist]));

    renderQuickMixes(quickMixesRoot, home.quickMixes ?? [], playlistsById);
    renderCardsRow(madeForYouRoot, home.madeForYou ?? [], playlistsById);
    renderCardsRow(topMixesRoot, home.topMixes ?? [], playlistsById);
    renderFavoriteArtists(favoriteArtistsRoot, home.favoriteArtists ?? []);
  } catch (error) {
    console.error(error);
  }
});

function renderQuickMixes(root, items, playlistsById) {
  root.innerHTML = items
    .map((item) => {
      const playlist = playlistsById.get(item.playlistId);

      if (!playlist) return "";

      return `
        <a class="mix-card" href="#" aria-label="${escapeHtml(playlist.title)}">
          <img class="mix-cover" src="${escapeAttribute(item.cover || playlist.cover)}" alt="${escapeAttribute(playlist.title)} cover" />
          <div class="mix-text">
            <p class="mix-title">${escapeHtml(item.title || playlist.title)}</p>
            <p class="mix-sub">${escapeHtml(item.subtitle || playlist.mixSubtitle || playlist.title)}</p>
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
        <a class="card" href="#" aria-label="${escapeAttribute(playlist.title)}">
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
    .map(
      (artist) => `
        <a class="artist-card" href="#" aria-label="${escapeAttribute(artist.name)}">
          <img class="artist-card__image" src="${escapeAttribute(artist.image)}" alt="${escapeAttribute(artist.name)}" />
        </a>
      `
    )
    .join("");
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
