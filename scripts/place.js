const currentYear = document.querySelector("#current-year");
const lastModified = document.querySelector("#last-modified");

currentYear.textContent = new Date().getFullYear();

const modifiedDate = new Date(document.lastModified);
if (!Number.isNaN(modifiedDate.getTime())) {
	lastModified.dateTime = modifiedDate.toISOString();
	lastModified.textContent = new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	}).format(modifiedDate);
}

const temperature = 28;
const windSpeed = 12;
const windChill = document.querySelector("#wind-chill");

function calculateWindChill(temperature, windSpeed) {
	return 13.12 + 0.6215 * temperature - 11.37 * windSpeed ** 0.16 + 0.3965 * temperature * windSpeed ** 0.16;
}

if (temperature <= 10 && windSpeed > 4.8) {
	const chill = calculateWindChill(temperature, windSpeed);
	windChill.textContent = `${chill.toFixed(1)} °C`;
} else {
	windChill.textContent = "N/A";
}
