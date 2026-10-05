const input = document.querySelector("#favchap");
const button = document.querySelector("main button");
const list = document.querySelector("#list");
const storageKey = "favoriteBomChapters";

let chaptersArray = getChapterList() || [];

function displayList(item) {
	const listItem = document.createElement("li");
	const deleteButton = document.createElement("button");
	deleteButton.textContent = "❌";
	deleteButton.classList.add("delete");
	deleteButton.type = "button";
	deleteButton.setAttribute("aria-label", `Delete ${item}`);
	deleteButton.addEventListener("click", () => {
		deleteChapter(listItem.textContent);
		listItem.remove();
		input.focus();
	});

	listItem.textContent = item;
	listItem.append(deleteButton);
	list.append(listItem);
}

function setChapterList() {
	localStorage.setItem(storageKey, JSON.stringify(chaptersArray));
}

function getChapterList() {
	return JSON.parse(localStorage.getItem(storageKey));
}

function deleteChapter(chapter) {
	chapter = chapter.slice(0, chapter.length - 1);
	chaptersArray = chaptersArray.filter((item) => item !== chapter);
	setChapterList();
}

button.addEventListener("click", () => {
	if (input.value !== "") {
		displayList(input.value);
		chaptersArray.push(input.value);
		setChapterList();
		input.value = "";
		input.focus();
	}
});

input.addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		event.preventDefault();
		button.click();
	}
});

chaptersArray.forEach((chapter) => {
	displayList(chapter);
});
