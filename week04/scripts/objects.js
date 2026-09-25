const aCourse = {
	code: "WDD131",
	title: "Dynamic Web Fundamentals",
	credits: 2,
	sections: [
		{ section: "001", enrolled: 95, instructor: "Roberto Diaz Rodriguez" },
		{ section: "002", enrolled: 80, instructor: "Sarah Gobble" }
	]
};

function setCourseInformation(course) {
	document.querySelector("#courseName").textContent = `${course.code} – ${course.title}`;
}

function renderSections(course) {
	const tbody = document.querySelector("#sections tbody");
	let rows = "";
	for (const section of course.sections) {
		rows += `<tr>
			<td>${section.section}</td>
			<td>${section.enrolled}</td>
			<td>${section.instructor}</td>
		</tr>`;
	}
	tbody.innerHTML = rows;
}

setCourseInformation(aCourse);
renderSections(aCourse);
