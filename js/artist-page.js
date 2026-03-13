document.addEventListener("DOMContentLoaded", initArtistPage);

function initArtistPage() {
  if (!document.querySelector(".page-artist")) {
    return;
  }

  bindArtistTabs();
  bindArtistLikes();
}

function bindArtistTabs() {
  const tabs = Array.from(document.querySelectorAll("[data-artist-tab]"));
  const panels = Array.from(document.querySelectorAll("[data-artist-panel]"));

  if (tabs.length === 0 || panels.length === 0) {
    return;
  }

  const activateArtistTab = (target) => {
    const activeTab = tabs.some((tab) => tab.dataset.artistTab === target) ? target : "home";

    tabs.forEach((item) => {
      const isActive = item.dataset.artistTab === activeTab;
      item.classList.toggle("artist-tabs__link--active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.artistPanel === activeTab;
      panel.hidden = !isActive;
      panel.classList.toggle("artist-tab-panel--active", isActive);
    });
  };

  tabs.forEach((tab) => {
    if (tab.dataset.bound === "true") {
      return;
    }

    tab.addEventListener("click", () => {
      activateArtistTab(tab.dataset.artistTab);
    });

    tab.dataset.bound = "true";
  });

  activateArtistTab("home");
}

function bindArtistLikes() {
  document.querySelectorAll(".artist-top-row__like").forEach((button) => {
    if (button.dataset.likeBound === "true") {
      return;
    }

    button.addEventListener("click", () => {
      const isPressed = button.getAttribute("aria-pressed") === "true";
      button.setAttribute("aria-pressed", String(!isPressed));
    });

    button.dataset.likeBound = "true";
  });
}
