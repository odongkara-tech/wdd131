const temples = [...window.TEMPLE_DIRECTORY].sort((first, second) =>
  first.name.localeCompare(second.name)
);
const templeGrid = document.querySelector("#temple-grid");
const templeSearch = document.querySelector("#temple-search");
const templeStatus = document.querySelector("#temple-status");
const directoryResults = document.querySelector("#directory-results");
const templeTotal = document.querySelector("#temple-total");
const loadMoreButton = document.querySelector("#load-more-temples");
const templesPerPage = 24;
let visibleTempleCount = templesPerPage;

function escapeTempleText(value) {
  const escapedCharacters = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  };

  return `${value}`.replace(/[&<>"']/g, (character) => escapedCharacters[character]);
}

function normalizeSearchText(value) {
  return `${value}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}

function getFilteredTemples() {
  const query = normalizeSearchText(templeSearch.value.trim());
  const selectedStatus = templeStatus.value;

  return temples.filter((temple) => {
    const matchesQuery = normalizeSearchText(`${temple.name} ${temple.location}`).includes(query);
    const matchesStatus = selectedStatus === "all" || temple.status === selectedStatus;
    return matchesQuery && matchesStatus;
  });
}

function makeTemplePhoto(temple) {
  const isAnnounced = temple.status === "Announced";
  const isRepresentativePhoto = temple.status === "Dedicated" && !temple.image;
  const photoSource = isRepresentativePhoto
    ? "images/temples/accra-ghana-temple.jpg"
    : temple.image;
  const photoAlt = isRepresentativePhoto
    ? `Representative photo of the Accra Ghana Temple; this is not a photo of the ${temple.name}.`
    : temple.imageAlt;

  if (isAnnounced || !photoSource) {
    const unavailableMessage = isAnnounced
      ? "Photo not shown for announced temples"
      : "Official exterior photo unavailable";
    return `
      <div class="temple-no-photo" role="img" aria-label="${isAnnounced
        ? `No photo is shown for announced temple ${escapeTempleText(temple.name)}`
        : `No official exterior photo is available for ${escapeTempleText(temple.name)}`}">
        <span class="temple-no-photo-mark" aria-hidden="true">TTG</span>
        <span>${unavailableMessage}</span>
      </div>
    `;
  }

  return `
    <a
      class="temple-photo-link"
      href="${escapeTempleText(temple.profile)}"
      target="_blank"
      rel="noreferrer"
      aria-label="${isRepresentativePhoto
        ? `Open official profile for ${escapeTempleText(temple.name)}; the displayed photo is a representative image of the Accra Ghana Temple`
        : `Open official profile for ${escapeTempleText(temple.name)}`}"
    >
      <img
        class="temple-directory-photo"
        src="${escapeTempleText(photoSource)}"
        alt="${escapeTempleText(photoAlt)}"
        width="800"
        height="500"
        loading="lazy"
        decoding="async"
      >
      ${isRepresentativePhoto ? `<span class="representative-photo-label" aria-hidden="true">Representative temple photo</span>` : ""}
    </a>
  `;
}

function renderTempleCards(filteredTemples) {
  const visibleTemples = filteredTemples.slice(0, visibleTempleCount);
  templeGrid.innerHTML = visibleTemples.map((temple) => `
    <article class="destination-card temple-directory-card">
      <div class="temple-directory-image">
        ${makeTemplePhoto(temple)}
        <span class="temple-status">${escapeTempleText(temple.status)}</span>
      </div>
      <div class="destination-info">
        <p class="destination-country">${escapeTempleText(temple.location)}</p>
        <h3>${escapeTempleText(temple.name)}</h3>
        <a class="official-link" href="${escapeTempleText(temple.profile)}" target="_blank" rel="noreferrer">
          Official temple details <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  `).join("");

  templeGrid.querySelectorAll(".temple-directory-photo").forEach((photo) => {
    photo.addEventListener("error", () => {
      const fallback = document.createElement("div");
      fallback.className = "temple-no-photo";
      fallback.setAttribute("role", "img");
      fallback.setAttribute("aria-label", `Official photo could not be loaded for ${photo.alt}`);
      fallback.innerHTML = `<span class="temple-no-photo-mark" aria-hidden="true">TTG</span><span>Photo unavailable</span>`;
      photo.replaceWith(fallback);
    }, { once: true });
  });

  directoryResults.textContent = filteredTemples.length
    ? `Showing ${visibleTemples.length} of ${filteredTemples.length} matching temples.`
    : "No temples match those search filters. Try a different name, location, or status.";
  loadMoreButton.hidden = visibleTempleCount >= filteredTemples.length;
}

function updateTempleDirectory() {
  visibleTempleCount = templesPerPage;
  renderTempleCards(getFilteredTemples());
}

templeTotal.textContent = `${temples.length} temples`;
updateTempleDirectory();

templeSearch.addEventListener("input", updateTempleDirectory);
templeStatus.addEventListener("change", updateTempleDirectory);
loadMoreButton.addEventListener("click", () => {
  visibleTempleCount += templesPerPage;
  renderTempleCards(getFilteredTemples());
});
