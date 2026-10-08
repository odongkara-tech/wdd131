const planStorageKey = "temple-trail-visit-plans";
const templeOptions = window.TEMPLE_DIRECTORY.map((temple) => ({
  id: temple.id,
  name: temple.name,
  location: temple.location,
  profile: temple.profile
}));
const visitForm = document.querySelector("#visit-form");
const visitDateInput = document.querySelector("#visit-date");
const templeSelect = document.querySelector("#temple-choice");
const visitPlanList = document.querySelector("#visit-plan-list");
const plansMessage = document.querySelector("#plans-message");
const formStatus = document.querySelector("#form-status");
let visitPlans = [];
let storageUnavailable = false;

function getTodayDate() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60_000;
  return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

function escapeHTML(value) {
  const replacements = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  };

  return `${value}`.replace(/[&<>"']/g, (character) => replacements[character]);
}

function readVisitPlans() {
  try {
    const storedPlans = JSON.parse(localStorage.getItem(planStorageKey) ?? "[]");
    return Array.isArray(storedPlans)
      ? storedPlans.filter((plan) =>
        plan &&
        typeof plan.id === "string" &&
        typeof plan.visitorName === "string" &&
        typeof plan.templeId === "string" &&
        typeof plan.visitDate === "string" &&
        templeOptions.some((temple) => temple.id === plan.templeId)
      )
      : [];
  } catch (error) {
    storageUnavailable = true;
    console.error(`Unable to read visit plans from local storage: ${error}`);
    return [];
  }
}

function populateTempleOptions() {
  templeSelect.innerHTML = `
    <option value="">Select a destination</option>
    ${templeOptions.map((temple) => `
      <option value="${escapeHTML(temple.id)}">${escapeHTML(temple.name)} — ${escapeHTML(temple.location)}</option>
    `).join("")}
  `;
}

function renderVisitPlans() {
  const planCards = visitPlans.map((plan) => {
    const temple = templeOptions.find((option) => option.id === plan.templeId);
    return `
      <article class="visit-plan-card">
        <div>
          <p class="destination-country">${escapeHTML(plan.visitDate)}</p>
          <h3>${escapeHTML(temple.name)}</h3>
          <p>${escapeHTML(plan.visitorName)} · ${escapeHTML(temple.location)} · ${escapeHTML(`${plan.travelers}`)} ${Number(plan.travelers) === 1 ? "traveller" : "travellers"}</p>
          ${plan.notes ? `<p class="plan-notes">${escapeHTML(plan.notes)}</p>` : ""}
          <a class="official-link" href="${escapeHTML(temple.profile)}" target="_blank" rel="noreferrer">Official temple details <span aria-hidden="true">↗</span></a>
        </div>
        <button class="remove-plan" type="button" data-remove-plan="${escapeHTML(plan.id)}" aria-label="Remove visit plan for ${escapeHTML(temple.name)} on ${escapeHTML(plan.visitDate)}">Remove plan</button>
      </article>
    `;
  });

  visitPlanList.innerHTML = planCards.join("");
  plansMessage.textContent = storageUnavailable
    ? "Saved visit plans could not be read or stored in this browser."
    : visitPlans.length
      ? `${visitPlans.length} ${visitPlans.length === 1 ? "plan is" : "plans are"} saved on this device.`
      : "Your saved plans will appear here.";
}

function saveVisitPlans(plansToSave) {
  try {
    localStorage.setItem(planStorageKey, JSON.stringify(plansToSave));
    storageUnavailable = false;
    return true;
  } catch (error) {
    storageUnavailable = true;
    console.error(`Unable to save visit plans to local storage: ${error}`);
    formStatus.textContent = "Your browser could not save this plan. Check browser storage settings and try again.";
    renderVisitPlans();
    return false;
  }
}

function createVisitPlan(formData) {
  const selectedTemple = templeOptions.find((temple) => temple.id === formData.get("temple"));
  if (!selectedTemple) {
    formStatus.textContent = "Choose a temple destination before saving your plan.";
    return;
  }

  const plan = {
    id: `${Date.now()}`,
    visitorName: `${formData.get("visitorName")}`.trim(),
    templeId: selectedTemple.id,
    visitDate: `${formData.get("visitDate")}`,
    travelers: `${formData.get("travelers") || "1"}`,
    notes: `${formData.get("visitNotes")}`.trim()
  };

  const nextPlans = [...visitPlans, plan];
  if (saveVisitPlans(nextPlans)) {
    visitPlans = nextPlans;
    renderVisitPlans();
    visitForm.reset();
    populateTempleOptions();
    visitDateInput.min = getTodayDate();
    formStatus.textContent = `Your visit plan for ${selectedTemple.name} has been saved on this device.`;
  }
}

visitDateInput.min = getTodayDate();
populateTempleOptions();
visitPlans = readVisitPlans();
renderVisitPlans();

visitForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!visitForm.reportValidity()) {
    return;
  }

  createVisitPlan(new FormData(visitForm));
});

visitPlanList.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-plan]");
  if (!removeButton) {
    return;
  }

  const nextPlans = visitPlans.filter((plan) => plan.id !== removeButton.dataset.removePlan);
  if (saveVisitPlans(nextPlans)) {
    visitPlans = nextPlans;
    renderVisitPlans();
    formStatus.textContent = "The visit plan was removed from this device.";
  }
});
