document.addEventListener("DOMContentLoaded", loadPlayer);

async function loadPlayer() {
  const playerMount = document.querySelector("#player");

  if (!playerMount) {
    return;
  }

  try {
    const assetBase = getPlayerAssetBase();
    await renderPlayerMarkup(playerMount, assetBase);
    const playlists = await loadPlayerData(assetBase);
    const state = createPlayerState(playlists);

    if (!state.currentTrack) {
      throw new Error("No playable tracks found in player data.");
    }

    wirePlayer(playerMount, state, assetBase);
  } catch (error) {
    console.error(error);
  }
}

function getPlayerAssetBase() {
  if (window.location.pathname.includes("/pages/")) {
    return "../";
  }

  return "./";
}

async function renderPlayerMarkup(playerMount, assetBase) {
  const response = await fetch(`${assetBase}partials/player.html`);

  if (!response.ok) {
    throw new Error(`Failed to load player partial: ${response.status}`);
  }

  playerMount.innerHTML = await response.text();
  normalizePlayerMarkup(playerMount, assetBase);
}

async function loadPlayerData(assetBase) {
  const response = await fetch(`${assetBase}data/music-cover.json`);

  if (!response.ok) {
    throw new Error(`Failed to load player data: ${response.status}`);
  }

  const data = await response.json();
  const playlists = Array.isArray(data.playlists) ? data.playlists : [];

  if (!playlists.length) {
    throw new Error("Player data is empty.");
  }

  return playlists;
}

function createPlayerState(playlists) {
  const audio = new Audio();
  const playerRoot = document.querySelector("#player");
  const playlistId = playerRoot?.dataset.playerPlaylist || "";
  const requestedTrackIndex = Number.parseInt(playerRoot?.dataset.playerTrack || "0", 10);
  const requestedPlaylistIndex = playlists.findIndex((playlist) => playlist.id === playlistId);
  const playlistIndex = requestedPlaylistIndex >= 0 ? requestedPlaylistIndex : 0;
  const trackIndex = Number.isInteger(requestedTrackIndex) && requestedTrackIndex >= 0 ? requestedTrackIndex : 0;
  const currentPlaylist = playlists[playlistIndex] ?? null;
  const currentTrack = currentPlaylist?.tracks?.[trackIndex] ?? null;

  return {
    audio,
    playlists,
    playlistIndex,
    trackIndex,
    currentPlaylist,
    currentTrack,
    coverOverride: playerRoot?.dataset.playerCover || "",
  };
}

function wirePlayer(root, state, assetBase) {
  const elements = getPlayerElements(root);

  const syncTrack = () => {
    state.currentPlaylist = state.playlists[state.playlistIndex] ?? null;
    state.currentTrack = state.currentPlaylist?.tracks?.[state.trackIndex] ?? null;

    if (!state.currentTrack) return;

    state.audio.src = resolveAssetPath(state.currentTrack.audio, assetBase);
    state.audio.load();

    if (elements.cover) {
      elements.cover.src = resolveAssetPath(
        state.coverOverride || state.currentTrack.cover || state.currentPlaylist.cover,
        assetBase
      );
      elements.cover.alt = `${state.currentTrack.title} cover`;
    }

    if (elements.title) {
      elements.title.textContent = state.currentTrack.title || "-";
    }

    if (elements.artist) {
      elements.artist.textContent = state.currentTrack.artist || "-";
    }

    if (elements.album) {
      elements.album.textContent =
        state.currentTrack.album || state.currentPlaylist.title || "-";
    }

    if (elements.currentTime) {
      elements.currentTime.textContent = "0:00";
    }

    if (elements.duration) {
      elements.duration.textContent = "-";
    }

    if (elements.track) {
      elements.track.value = "0";
      elements.track.max = "100";
    }

    updatePlayButtons(elements, false, assetBase);
  };

  const playCurrent = async () => {
    try {
      await state.audio.play();
    } catch (error) {
      console.error("Audio playback failed:", error);
    }
  };

  const togglePlay = async () => {
    if (state.audio.paused) {
      await playCurrent();
      return;
    }

    state.audio.pause();
  };

  const stepTrack = async (direction) => {
    const tracks = state.currentPlaylist?.tracks ?? [];

    if (!tracks.length) return;

    state.trackIndex =
      (state.trackIndex + direction + tracks.length) % tracks.length;

    syncTrack();
    await playCurrent();
  };

  elements.play?.addEventListener("click", togglePlay);
  elements.playMobile?.addEventListener("click", togglePlay);
  elements.prev?.addEventListener("click", () => {
    void stepTrack(-1);
  });
  elements.next?.addEventListener("click", () => {
    void stepTrack(1);
  });

  elements.track?.addEventListener("input", (event) => {
    if (!state.audio.duration) return;

    const value = Number(event.currentTarget.value);
    state.audio.currentTime = (value / 100) * state.audio.duration;
  });

  state.audio.addEventListener("play", () => {
    updatePlayButtons(elements, true, assetBase);
  });

  state.audio.addEventListener("pause", () => {
    updatePlayButtons(elements, false, assetBase);
  });

  state.audio.addEventListener("loadedmetadata", () => {
    if (elements.duration) {
      elements.duration.textContent = formatTime(state.audio.duration);
    }
  });

  state.audio.addEventListener("timeupdate", () => {
    if (elements.currentTime) {
      elements.currentTime.textContent = formatTime(state.audio.currentTime);
    }

    if (elements.track && state.audio.duration) {
      elements.track.value = String(
        Math.round((state.audio.currentTime / state.audio.duration) * 100)
      );
    }
  });

  state.audio.addEventListener("ended", () => {
    void stepTrack(1);
  });

  syncTrack();
}

function getPlayerElements(root) {
  return {
    cover: root.querySelector("#player-cover"),
    title: root.querySelector("#player-title"),
    artist: root.querySelector("#player-artist"),
    album: root.querySelector("#player-album"),
    currentTime: root.querySelector("#player-current-time"),
    duration: root.querySelector("#player-duration"),
    track: root.querySelector("#player-track"),
    play: root.querySelector("#player-play"),
    playMobile: root.querySelector("#player-play-mobile"),
    playIcon: root.querySelector("#player-play-icon"),
    playMobileIcon: root.querySelector("#player-play-mobile-icon"),
    prev: root.querySelector("#player-prev"),
    next: root.querySelector("#player-next"),
  };
}

function updatePlayButtons(elements, isPlaying, assetBase) {
  if (elements.playIcon) {
    elements.playIcon.className = isPlaying ? "fa-solid fa-pause" : "fa-solid fa-play";
  }

  if (elements.playMobileIcon) {
    elements.playMobileIcon.src = isPlaying
      ? resolveAssetPath("./assets/icons/Name=Pause Simple, Filled=No.svg", assetBase)
      : resolveAssetPath("./assets/icons/Name=Play Simple, Filled=No.svg", assetBase);
  }

  if (elements.play) {
    elements.play.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
  }

  if (elements.playMobile) {
    elements.playMobile.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
  }
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "-";

  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);

  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

function normalizePlayerMarkup(root, assetBase) {
  root.querySelectorAll("[src]").forEach((element) => {
    const source = element.getAttribute("src");

    if (!source) return;

    element.setAttribute("src", resolveAssetPath(source, assetBase));
  });
}

function resolveAssetPath(path, assetBase) {
  if (typeof path !== "string") return path;

  if (path.startsWith("./")) {
    return `${assetBase}${path.slice(2)}`;
  }

  return path;
}
