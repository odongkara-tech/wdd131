const destinations = [
  {
    id: "accra",
    name: "Accra Ghana Temple",
    city: "Accra",
    country: "Ghana",
    region: "West Africa",
    image: "images/temples/accra-ghana-temple.jpg",
    imageAlt: "Exterior of the Accra Ghana Temple",
    imageWidth: 800,
    imageHeight: 400,
    officialUrl: "https://www.churchofjesuschrist.org/temples/details/accra-ghana-temple?lang=eng",
    description: "Find the temple's current address, schedule, and visitor information on its official listing."
  },
  {
    id: "aba",
    name: "Aba Nigeria Temple",
    city: "Aba",
    country: "Nigeria",
    region: "West Africa",
    image: "images/temples/aba-nigeria-temple.jpg",
    imageAlt: "Exterior of the Aba Nigeria Temple",
    imageWidth: 800,
    imageHeight: 500,
    officialUrl: "https://www.churchofjesuschrist.org/temples/details/aba-nigeria-temple?lang=eng",
    description: "Explore the official temple listing for its current address, schedule, and visitor information."
  },
  {
    id: "johannesburg",
    name: "Johannesburg South Africa Temple",
    city: "Johannesburg",
    country: "South Africa",
    region: "Southern Africa",
    image: "images/temples/johannesburg-south-africa-temple.jpg",
    imageAlt: "Exterior of the Johannesburg South Africa Temple",
    imageWidth: 800,
    imageHeight: 500,
    officialUrl: "https://www.churchofjesuschrist.org/temples/details/johannesburg-south-africa-temple?lang=eng",
    description: "Check the official temple listing for its current address, schedule, and visitor information."
  }
];

const savedStorageKey = "temple-trail-saved-destinations";
const destinationGrid = document.querySelector("#destination-grid");
const savedList = document.querySelector("#saved-list");
const savedMessage = document.querySelector("#saved-message");
let storageUnavailable = false;
let savedDestinationIds = [];

function readSavedDestinations() {
  try {
    const savedIds = JSON.parse(localStorage.getItem(savedStorageKey) ?? "[]");
    return Array.isArray(savedIds)
      ? savedIds.filter((id) => destinations.some((destination) => destination.id === id))
      : [];
  } catch (error) {
    storageUnavailable = true;
    console.error(`Unable to read saved destinations from local storage: ${error}`);
    return [];
  }
}

function renderDestinations(savedIds) {
  destinationGrid.innerHTML = destinations.map((destination) => {
    const isSaved = savedIds.includes(destination.id);
    return `
      <article class="destination-card">
        <div class="destination-art">
          <a
            class="destination-photo-link"
            href="${destination.officialUrl}"
            target="_blank"
            rel="noreferrer"
            aria-label="View official information for the ${destination.name}"
          >
            <img
              class="destination-photo"
              src="${destination.image}"
              alt="${destination.imageAlt}"
              width="${destination.imageWidth}"
              height="${destination.imageHeight}"
              loading="lazy"
              decoding="async"
            >
          </a>
          <span class="art-tag">${destination.region}</span>
          <button
            class="save-button"
            type="button"
            data-save-id="${destination.id}"
            aria-label="${isSaved ? "Remove" : "Save"} ${destination.name} ${isSaved ? "from" : "to"} saved places"
            aria-pressed="${isSaved}"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-4-6 4z"></path></svg>
          </button>
        </div>
        <div class="destination-info">
          <p class="destination-country">${destination.city}, ${destination.country}</p>
          <h3>${destination.name}</h3>
          <p>${destination.description}</p>
          <a class="official-link" href="${destination.officialUrl}" target="_blank" rel="noreferrer">
            Official temple details <span aria-hidden="true">↗</span>
          </a>
        </div>
      </article>
    `;
  }).join("");
}

function renderSavedPlaces(savedIds) {
  const savedDestinations = destinations.filter((destination) => savedIds.includes(destination.id));
  const countLabels = document.querySelectorAll(".saved-count");

  countLabels.forEach((label) => {
    label.textContent = `${savedDestinations.length}`;
  });
  savedList.innerHTML = savedDestinations.map((destination) => `
    <li>${destination.name} · ${destination.country}</li>
  `).join("");
  savedMessage.textContent = storageUnavailable
    ? "Your browser could not save this list. Saved places may not be available after you leave this page."
    : savedDestinations.length
      ? `${savedDestinations.length} ${savedDestinations.length === 1 ? "place is" : "places are"} on your shortlist.`
      : "Save a destination to start your list.";
}

function saveDestinations(savedIds) {
  try {
    localStorage.setItem(savedStorageKey, JSON.stringify(savedIds));
  } catch (error) {
    storageUnavailable = true;
    console.error(`Unable to save destinations to local storage: ${error}`);
  }
}

function toggleSavedDestination(destinationId) {
  savedDestinationIds = savedDestinationIds.includes(destinationId)
    ? savedDestinationIds.filter((id) => id !== destinationId)
    : [...savedDestinationIds, destinationId];

  saveDestinations(savedDestinationIds);
  renderDestinations(savedDestinationIds);
  renderSavedPlaces(savedDestinationIds);
}

destinationGrid.addEventListener("click", (event) => {
  const saveButton = event.target.closest("[data-save-id]");
  if (saveButton) {
    toggleSavedDestination(saveButton.dataset.saveId);
  }
});

savedDestinationIds = readSavedDestinations();
renderDestinations(savedDestinationIds);
renderSavedPlaces(savedDestinationIds);
