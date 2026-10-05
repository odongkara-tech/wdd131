const params = new URLSearchParams(window.location.search);
const product = products.find((item) => item.id === params.get("product"));
const rating = params.get("rating");
const installDate = params.get("installDate");
const hasSubmission = product && ["1", "2", "3", "4", "5"].includes(rating) && installDate;

const confirmationTitle = document.querySelector("#confirmationTitle");
const confirmationMessage = document.querySelector("#confirmationMessage");
const reviewCount = document.querySelector("#reviewCount");
const reviewDetails = document.querySelector("#reviewDetails");

if (hasSubmission) {
	const countKey = "productReviewCount";
	const previousCount = Number(localStorage.getItem(countKey)) || 0;
	const updatedCount = previousCount + 1;
	localStorage.setItem(countKey, updatedCount);
	reviewCount.textContent = updatedCount;

	const details = [
		["Product", product.name],
		["Rating", `${rating} out of 5`],
		["Installed", installDate]
	];
	const features = params.getAll("features");
	const writtenReview = params.get("writtenReview");
	const userName = params.get("userName");

	if (features.length > 0) {
		details.push(["Useful features", features.join(", ")]);
	}

	if (writtenReview) {
		details.push(["Your review", writtenReview]);
	}

	if (userName) {
		details.push(["Name", userName]);
	}

	details.forEach(([term, description]) => {
		const dt = document.createElement("dt");
		const dd = document.createElement("dd");
		dt.textContent = term;
		dd.textContent = description;
		reviewDetails.append(dt, dd);
	});
} else {
	confirmationTitle.textContent = "No review submitted";
	confirmationMessage.textContent = "Please complete the required fields on the review form before submitting.";
	reviewCount.textContent = localStorage.getItem("productReviewCount") || "0";
}
