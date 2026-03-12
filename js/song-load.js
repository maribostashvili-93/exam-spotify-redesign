document.addEventListener("DOMContentLoaded", loadSongPage);

function loadSongPage() {
  const page = document.querySelector(".page-song");

  if (!page) {
    return;
  }

  const audio = createSongAudio();
  const elements = getSongElements();

  bindSongPlayButtons(audio, elements);
  bindSongProgress(audio, elements);
  bindSongViews(elements);
  bindSongQueue(elements.queueItems);
  bindSongAudioEvents(audio, elements);
  resetSongUI(elements);
}

function createSongAudio() {
  const isNestedPage = window.location.pathname.includes("/pages/");
  const assetBase = isNestedPage ? "../" : "./";

  return new Audio(`${assetBase}assets/song/Daft_Punk_-_Get_Lucky_(TheMP3.Info).mp3`);
}

function getSongElements() {
  return {
    playButton: document.querySelector("#song-play"),
    playButtonDesktop: document.querySelector("#song-play-desktop"),
    playIcon: document.querySelector("#song-play-icon"),
    playIconDesktop: document.querySelector("#song-play-desktop-icon"),
    progress: document.querySelector("#song-progress"),
    currentTime: document.querySelector("#song-current-time"),
    duration: document.querySelector("#song-duration"),
    viewButtons: Array.from(document.querySelectorAll("[data-song-view]")),
    panels: Array.from(document.querySelectorAll("[data-song-panel]")),
    queueItems: Array.from(document.querySelectorAll("[data-queue-item]")),
  };
}

function bindSongPlayButtons(audio, elements) {
  elements.playButton?.addEventListener("click", () => {
    void toggleSongPlayback(audio);
  });

  elements.playButtonDesktop?.addEventListener("click", () => {
    void toggleSongPlayback(audio);
  });
}

async function toggleSongPlayback(audio) {
  if (audio.paused) {
    try {
      await audio.play();
    } catch (error) {
      console.error("Audio playback failed:", error);
    }

    return;
  }

  audio.pause();
}

function bindSongProgress(audio, elements) {
  elements.progress?.addEventListener("input", (event) => {
    if (!audio.duration) {
      return;
    }

    const value = Number(event.currentTarget.value);
    audio.currentTime = (value / 100) * audio.duration;
  });
}

function bindSongViews(elements) {
  elements.viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.songView;

      if (!view) {
        return;
      }

      setActiveSongView(view, elements);
    });
  });
}

function setActiveSongView(view, elements) {
  elements.panels.forEach((panel) => {
    const isActive = panel.dataset.songPanel === view;
    panel.hidden = !isActive;
    panel.classList.toggle("song-mobile-view--active", isActive);
  });

  elements.viewButtons.forEach((button) => {
    const isActive = button.dataset.songView === view;
    button.classList.toggle("song-toolbar__button--active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function bindSongQueue(queueItems) {
  queueItems.forEach((item) => {
    const actionButton = item.querySelector("[data-queue-action]");
    const removeButton = item.querySelector("[data-queue-remove]");

    actionButton?.addEventListener("click", () => {
      const isOpen = item.classList.toggle("song-mobile-queue__item--actions");

      if (removeButton) {
        removeButton.hidden = !isOpen;
      }
    });

    removeButton?.addEventListener("click", () => {
      item.remove();
    });
  });
}

function bindSongAudioEvents(audio, elements) {
  audio.addEventListener("loadedmetadata", () => {
    if (elements.duration) {
      elements.duration.textContent = formatSongTime(audio.duration);
    }
  });

  audio.addEventListener("timeupdate", () => {
    if (elements.currentTime) {
      elements.currentTime.textContent = formatSongTime(audio.currentTime);
    }

    if (elements.progress && audio.duration) {
      elements.progress.value = String(Math.round((audio.currentTime / audio.duration) * 100));
    }
  });

  audio.addEventListener("play", () => {
    updateSongPlayState(true, elements);
  });

  audio.addEventListener("pause", () => {
    updateSongPlayState(false, elements);
  });

  audio.addEventListener("ended", () => {
    audio.currentTime = 0;

    if (elements.progress) {
      elements.progress.value = "0";
    }

    updateSongPlayState(false, elements);
  });
}

function updateSongPlayState(isPlaying, elements) {
  if (elements.playIcon) {
    elements.playIcon.className = isPlaying ? "fa-solid fa-pause" : "fa-solid fa-play";
  }

  if (elements.playIconDesktop) {
    elements.playIconDesktop.className = isPlaying ? "fa-solid fa-pause" : "fa-solid fa-play";
  }

  if (elements.playButton) {
    elements.playButton.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
  }

  if (elements.playButtonDesktop) {
    elements.playButtonDesktop.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
  }
}

function resetSongUI(elements) {
  if (elements.currentTime) {
    elements.currentTime.textContent = "0:00";
  }

  if (elements.duration) {
    elements.duration.textContent = "0:00";
  }

  updateSongPlayState(false, elements);
  setActiveSongView("cover", elements);
}

function formatSongTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);

  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}
