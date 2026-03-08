document.addEventListener("DOMContentLoaded", async () => {
  const headerRoot = document.getElementById("header");

  if (!headerRoot) return;

  try {
    const response = await fetch("./partials/header.html");

    if (!response.ok) {
      throw new Error(`Header load failed: ${response.status}`);
    }

    headerRoot.innerHTML = await response.text();
  } catch (error) {
    console.error(error);
    headerRoot.innerHTML = "<p>Header could not be loaded.</p>";
  }
});
