const DEFAULT_DISCOVER_DATA = {
  filters: [
    "Music",
    "EDM",
    "Indie",
    "Pop",
    "Rock",
    "Alt Rock",
    "Country",
    "R&B",
    "Hip-Hop",
    "Podcast",
    "Audiobooks",
  ],
  activeFilter: "Music",
  reels: [
    {
      playlistId: "pl-16",
      title: "Get Lucky",
      artist: "Daft Punk",
      year: "2023",
      duration: "6:05",
      likes: "500K",
      chips: ["Rock", "Alt Rock"],
      tintColor: "#5A220D",
      reelImage: "../assets/img/reel-image2.png",
      cover: "../assets/img/thumbnail/image 7.png",
    },
    {
      playlistId: "pl-01",
      title: "Linkin Park Mix",
      artist: "Spotify",
      year: "2013",
      songs: "22 songs",
      duration: "1 hr 14 min",
      likes: "500K",
      chips: ["Rock", "Alt Rock"],
      tintColor: "#1E4E49",
      reelImage: "../assets/img/reel-image.png",
      cover: "../assets/img/thumbnail/image 10.png",
    },
    {
      playlistId: "pl-04",
      title: "Rock Mix",
      artist: "Spotify",
      year: "2024",
      duration: "42 min",
      likes: "500K",
      chips: ["Rock", "Classic"],
      tintColor: "#243B4D",
      reelImage: "../assets/img/reel-image3.png",
      cover: "../assets/img/thumbnail/image 13.png",
    },
  ],
};

document.addEventListener("DOMContentLoaded", async () => {
  const tabsRoot = document.querySelector("#discover-tabs");
  const feedRoot = document.querySelector("#discover-feed");

  if (!tabsRoot || !feedRoot) {
    return;
  }

  let discover = DEFAULT_DISCOVER_DATA;
  let playlistsById = new Map();

  try {
    const response = await fetch("../data/music-cover.json");

    if (!response.ok) {
      throw new Error(`Failed to load discover content data: ${response.status}`);
    }

    const data = await response.json();
    discover = normalizeDiscover(data.discover ?? DEFAULT_DISCOVER_DATA);

    const playlists = Array.isArray(data.playlists) ? data.playlists : [];
    playlistsById = new Map(playlists.map((playlist) => [playlist.id, playlist]));
  } catch (error) {
    console.error(error);
    discover = normalizeDiscover(DEFAULT_DISCOVER_DATA);
  }

  renderTabs(tabsRoot, discover.filters ?? [], discover.activeFilter ?? "");
  renderFeed(feedRoot, discover.reels ?? [], playlistsById);
});

function normalizeDiscover(discover) {
  const reels = Array.isArray(discover.reels) ? [...discover.reels] : [];
  const sortedReels = reels.sort(
    (left, right) => Number(left.playlistId !== "pl-16") - Number(right.playlistId !== "pl-16")
  );

  return {
    ...DEFAULT_DISCOVER_DATA,
    ...discover,
    reels: sortedReels.map((reel) => ({
      ...reel,
      reelImage: resolveAssetPath(reel.reelImage || reel.surfaceImage || ""),
      cover: resolveAssetPath(reel.cover || ""),
      tintColor: reel.tintColor || "",
    })),
  };
}

function renderTabs(root, filters, activeFilter) {
  root.innerHTML = filters
    .map(
      (filter) => `
        <button type="button" class="${filter === activeFilter ? "is-active" : ""}">
          ${escapeHtml(filter)}
        </button>
      `
    )
    .join("");
}

function renderFeed(root, reels, playlistsById) {
  root.innerHTML = reels.map((reel, index) => renderReel(reel, playlistsById, index)).join("");
}

function renderReel(reel, playlistsById, index) {
  const playlist = playlistsById.get(reel.playlistId) ?? {};
  const chips = Array.isArray(reel.chips) ? reel.chips : [];
  const title = reel.title || playlist.tracks?.[0]?.title || playlist.title || "";
  const artist = reel.artist || playlist.tracks?.[0]?.artist || playlist.mixSubtitle || "";
  const year = reel.year || "";
  const songs = reel.songs || "";
  const duration = reel.duration || "";
  const cover = reel.cover || resolveAssetPath(playlist.cover || "");
  const reelImage = reel.reelImage || resolveAssetPath(playlist.cover || "");
  const likes = reel.likes || "500K";
  const tintColor = reel.tintColor || playlist.stackColor || "#1E4E49";
  const meta = [`By ${artist}`, year, songs, duration].filter(Boolean).join(" • ");

  return `
    <article class="discover-reel" data-reel-index="${index}" style="--discover-tint-rgb: ${hexToRgb(tintColor)};">
      <div class="discover-reel__media" style="--discover-reel-image: url('${escapeAttribute(reelImage)}');">
        <div class="discover-reel__surface"></div>
        <div class="discover-reel__frame"></div>
        <img
          class="discover-reel__poster"
          src="${escapeAttribute(reelImage)}"
          alt="${escapeAttribute(title)} reel"
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
          <img src="${escapeAttribute(cover)}" alt="${escapeAttribute(title)}" />
          <div class="discover-reel__content">
            <h3>${escapeHtml(title)}</h3>
            <p>${escapeHtml(meta)}</p>
            <aside class="discover-reel__actions" aria-label="Actions">
              <button type="button" aria-label="Play">
                <img src="../assets/icons/play-green.svg" alt="" />
              </button>
              <button type="button" aria-label="Save">
                <img src="../assets/icons/Name=Save, Filled=No.svg" alt="" />
              </button>
              <span>${escapeHtml(likes)}</span>
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
              ${chips.map((chip) => `<span>${escapeHtml(chip)}</span>`).join("")}
            </div>
          </div>
        </div>
      </div>
    </article>
  `;
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
