const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const yearLabel = document.querySelector("#current-year");

function setNavigationOpen(isOpen) {
  menuToggle.setAttribute("aria-expanded", `${isOpen}`);
  navigation.classList.toggle("is-open", isOpen);
}

function updateSavedCount() {
  const savedCountLabels = document.querySelectorAll(".saved-count");

  try {
    const savedIds = JSON.parse(localStorage.getItem("temple-trail-saved-destinations") ?? "[]");
    const savedCount = Array.isArray(savedIds) ? savedIds.length : 0;
    savedCountLabels.forEach((label) => {
      label.textContent = `${savedCount}`;
    });
  } catch (error) {
    console.error(`Unable to read saved destinations for navigation: ${error}`);
  }
}

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    setNavigationOpen(!isExpanded);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setNavigationOpen(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 680) {
      setNavigationOpen(false);
    }
  });
}

if (yearLabel) {
  yearLabel.textContent = `${new Date().getFullYear()}`;
}

updateSavedCount();
