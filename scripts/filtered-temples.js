const menuButton = document.querySelector("#menu");
const navigation = document.querySelector("nav");

menuButton.addEventListener("click", () => {
	navigation.classList.toggle("open");
});

const temples = [
	{
		templeName: "Aba Nigeria",
		location: "Aba, Nigeria",
		dedicated: "2005, August, 7",
		area: 11500,
		imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/aba-nigeria/400x250/aba-nigeria-temple-lds-273999-wallpaper.jpg"
	},
	{
		templeName: "Manti Utah",
		location: "Manti, Utah, United States",
		dedicated: "1888, May, 21",
		area: 74792,
		imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/manti-utah/400x250/manti-temple-768192-wallpaper.jpg"
	},
	{
		templeName: "Payson Utah",
		location: "Payson, Utah, United States",
		dedicated: "2015, June, 7",
		area: 96630,
		imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/payson-utah/400x225/payson-utah-temple-exterior-1416671-wallpaper.jpg"
	},
	{
		templeName: "Yigo Guam",
		location: "Yigo, Guam",
		dedicated: "2020, May, 2",
		area: 6861,
		imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/yigo-guam/400x250/yigo_guam_temple_2.jpg"
	},
	{
		templeName: "Washington D.C.",
		location: "Kensington, Maryland, United States",
		dedicated: "1974, November, 19",
		area: 156558,
		imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/washington-dc/400x250/washington_dc_temple-exterior-2.jpeg"
	},
	{
		templeName: "Lima Perú",
		location: "Lima, Perú",
		dedicated: "1986, January, 10",
		area: 9600,
		imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/lima-peru/400x250/lima-peru-temple-evening-1075606-wallpaper.jpg"
	},
	{
		templeName: "Mexico City Mexico",
		location: "Mexico City, Mexico",
		dedicated: "1983, December, 2",
		area: 116642,
		imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/mexico-city-mexico/400x250/mexico-city-temple-exterior-1518361-wallpaper.jpg"
	},
	{
		templeName: "Johannesburg South Africa",
		location: "Johannesburg, South Africa",
		dedicated: "1985, August, 24",
		area: 19184,
		imageUrl: "images/temples/optimized3/johannesburg-temple.jpg"
	},
	{
		templeName: "Accra Ghana",
		location: "Accra, Ghana",
		dedicated: "2004, January, 11",
		area: 17500,
		imageUrl: "images/temples/optimized3/accra-temple.jpg"
	},
	{
		templeName: "Manila Philippines",
		location: "Quezon City, Metro Manila, Philippines",
		dedicated: "1984, September, 25",
		area: 26683,
		imageUrl: "images/temples/optimized3/manila-temple.jpg"
	}
];

function formatDedicationDate(dateString) {
	const [year, month, day] = dateString.split(", ");
	return new Date(`${month} ${day}, ${year}`).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	});
}

function renderTemples(templeList) {
	const album = document.querySelector("#temple-album");
	album.innerHTML = templeList.map((temple) => `
		<article class="temple-card">
			<img src="${temple.imageUrl}" alt="${temple.templeName}" width="400" height="250" loading="lazy">
			<div class="temple-card__details">
				<h2>${temple.templeName}</h2>
				<p><strong>Location:</strong> ${temple.location}</p>
				<p><strong>Dedicated:</strong> ${formatDedicationDate(temple.dedicated)}</p>
				<p><strong>Area:</strong> ${temple.area.toLocaleString()} square feet</p>
			</div>
		</article>
	`).join("");
}

function filterTemples(filter) {
	if (filter === "old") {
		return temples.filter((temple) => Number(temple.dedicated.split(",")[0]) < 1900);
	}
	if (filter === "new") {
		return temples.filter((temple) => Number(temple.dedicated.split(",")[0]) > 2000);
	}
	if (filter === "large") {
		return temples.filter((temple) => temple.area > 90000);
	}
	if (filter === "small") {
		return temples.filter((temple) => temple.area < 10000);
	}
	return temples;
}

navigation.addEventListener("click", (event) => {
	const link = event.target.closest("a");
	if (!link) return;

	event.preventDefault();
	renderTemples(filterTemples(link.hash.slice(1)));
	navigation.classList.remove("open");
});

renderTemples(temples);
