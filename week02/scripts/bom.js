const input = document.querySelector("#favchap");
const button = document.querySelector("button");
const list = document.querySelector("#list");

button.addEventListener("click", () => {
	const chapter = input.value.trim();
	if (chapter) {
		const listItem = document.createElement("li");
		const deleteButton = document.createElement("button");
		deleteButton.textContent = "❌";
		deleteButton.classList.add("delete");
		deleteButton.type = "button";
		deleteButton.addEventListener("click", () => {
			listItem.remove();
			input.focus();
		});
		listItem.textContent = chapter;
		listItem.appendChild(deleteButton);
		list.appendChild(listItem);
		input.value = "";
		input.focus();
	} else {
		input.focus();
	}
});
