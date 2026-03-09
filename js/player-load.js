document.addEventListener("DOMContentLoaded", async () => {
  const playerMount = document.querySelector("#player");

  if (!playerMount) return;

  try {
    const markupResponse = await fetch("./partials/player.html");

    if (!markupResponse.ok) {
      throw new Error(`Failed to load player partial: ${markupResponse.status}`);
    }

    playerMount.innerHTML = await markupResponse.text();

    const dataResponse = await fetch("./data/music-cover.json");

    if (!dataResponse.ok) {
      throw new Error(`Failed to load player data: ${dataResponse.status}`);
    }

    const data = await dataResponse.json();
    const playlists = Array.isArray(data.playlists) ? data.playlists : [];

    if (!playlists.length) {
      throw new Error("Player data is empty.");
    }

    const state = createPlayerState(playlists);

    if (!state.currentTrack) {
      throw new Error("No playable tracks found in player data.");
    }

    wirePlayer(playerMount, state);
  } catch (error) {
    console.error(error);
  }
});

function createPlayerState(playlists) {
  const audio = new Audio();
  const playlistIndex = 0;
  const trackIndex = 0;
  const currentPlaylist = playlists[playlistIndex] ?? null;
  const currentTrack = currentPlaylist?.tracks?.[trackIndex] ?? null;

  return {
    audio,
    playlists,
    playlistIndex,
    trackIndex,
    currentPlaylist,
    currentTrack,
  };
}

function wirePlayer(root, state) {
  const elements = {
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

  const syncTrack = () => {
    state.currentPlaylist = state.playlists[state.playlistIndex] ?? null;
    state.currentTrack = state.currentPlaylist?.tracks?.[state.trackIndex] ?? null;

    if (!state.currentTrack) return;

    state.audio.src = state.currentTrack.audio;
    state.audio.load();

    if (elements.cover) {
      elements.cover.src = state.currentTrack.cover || state.currentPlaylist.cover;
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

    updatePlayButtons(elements, false);
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
    updatePlayButtons(elements, true);
  });

  state.audio.addEventListener("pause", () => {
    updatePlayButtons(elements, false);
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

function updatePlayButtons(elements, isPlaying) {
  if (elements.playIcon) {
    elements.playIcon.className = isPlaying ? "fa-solid fa-pause" : "fa-solid fa-play";
  }

  if (elements.playMobileIcon) {
    elements.playMobileIcon.src = isPlaying
      ? "./assets/icons/Name=Pause Simple, Filled=No.svg"
      : "./assets/icons/Name=Play Simple, Filled=No.svg";
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
