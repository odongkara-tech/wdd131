document.querySelectorAll("img[loading='lazy']").forEach((image) => {
	const markLoaded = () => image.classList.add("is-loaded");

	if (image.complete && image.naturalWidth > 0) {
		markLoaded();
	} else {
		image.addEventListener("load", markLoaded, { once: true });
	}
});

const modifiedDate = new Date(document.lastModified);
const lastModifiedElement = document.querySelector("#last-modified");

if (lastModifiedElement && !Number.isNaN(modifiedDate.getTime())) {
	lastModifiedElement.dateTime = modifiedDate.toISOString();
	lastModifiedElement.textContent = modifiedDate.toLocaleString();
}
