/**
 * this function initializes task addition process by loading necessary data and setting up the interface
 */
async function initAddTask() {
	await includeHTML();
	await loadContacts();
	await loadAddedTasksFromStorage();
	loadCurrentUser();
	loadUserBadge();
	getDateToday();
	changePrioColor("Medium");
	initUserSelectField("et_contact_overlay");
	checkIfSendingIsPossible();
}

/**
 * this function changes the prio color and styling based on the selected prio
 * resets the styling of all containers and applies selected styling to choosen priority container
 * @param {string} prio - selected prio level urgent medium and low
 */
function changePrioColor(prio) {
	resetContainers();
	let container = document.getElementById(`${prio}_container`);
	let img = document.getElementById(`${prio}_img`);
	container.classList.add("selected");
	let color = determinePrioBackgroundColor(prio);
	container.style.backgroundColor = color;
	container.style.color = "white";
	img.src = `./assets/img/${prio}-white.svg`;
}

/**
 * this function sets the prio background styling to default state
 * @param {html element} container - container element for prio
 * @param {html img element} img - image element associated with the prio
 * @param {string} prio - prio level urgent medium and low
 */
function settingPrioBackground(container, img, prio) {
	container.style.backgroundColor = "white";
	container.style.color = "#2a3647";
	img.src = "./assets/img/" + prio + ".svg";
}

/**
 * this function determines and returns background color based on the priolevel
 * @param {string} prio - priolevel urgent medium low
 * @returns {string} - corressponding background color
 */
function determinePrioBackgroundColor(prio) {
	let color;
	if (prio === "Urgent") {
		color = "#ff3d00";
	} else if (prio === "Medium") {
		color = "#ffa800";
	} else if (prio === "Low") {
		color = "#7ae229";
	}
	return color;
}

/**
 * this function resets background color text color image source of prio containers
 */
function resetContainers() {
	let containers = document.getElementsByClassName("status-definition-container");
	for (let i = 0; i < containers.length; i++) {
		let container = containers[i];
		container.style.backgroundColor = "white";
		container.style.color = "#2a3647";
		let img = container.getElementsByClassName("prio-images")[0];
		img.src = "./assets/img/" + container.id.replace("_container", "") + ".svg";
		container.classList.remove("selected");
	}
}

/**
 * this function initializes user select field with user badges in the specified container
 * @param {string} containerID - the id of the container where user badges will be displayed
 */
function initUserSelectField(containerID) {
	let contactsContainer = document.getElementById(containerID);
	for (let i = 0; i < contacts.length; i++) {
		let userName = contacts[i]["username"];
		let userBadge = generateBadge(userName);
		let badgeColor = contacts[i]["bgcolor"];
		if (assignedID.includes(userName)) {
			contactsContainer.innerHTML += generateTaskAssigmentContactsHTML(userName, badgeColor, userBadge, i);
		} else {
			contactsContainer.innerHTML += generateTaskAssigmentContactsHTML(userName, badgeColor, userBadge, i);
		}
	}
}

/**
 * Adds or removes an elected contact based on checkbox status.
 *
 * @param {string} id - ID of the checkbox element.
 * @param {number} i - Index of the user in the contacts array.
 * @param {string[]} assignedID - Array containing IDs of newly assigned contacts.
 * @param {string} containerID - ID of the container element to display selected contacts.
 */
function addElectedContact(id, i, assignedID, containerID) {
	let checkAssigned = document.getElementById(id);
	let contactID = contacts[i]["id"];
	let deleteID = assignedID.indexOf(contactID);
	if (checkAssigned.checked) {
		assignedID.push(contactID);
	} else if (!checkAssigned.checked) {
		assignedID.splice(deleteID, 1);
	}
	showSelectedContacts(assignedID, containerID);
}

/**
 * Displays selected contacts in a designated container.
 *
 * @param {string[]} assignedID - Array containing the IDs of newly assigned contacts.
 * @param {string} containerID - ID of the container element to display selected contacts.
 */
function showSelectedContacts(assignedID, containerID) {
	let selectedContacts = document.getElementById(containerID);
	selectedContacts.innerHTML = "";
	for (let i = 0; i < assignedID.length; i++) {
		let contactID = assignedID[i];
		let contactIndex = contacts.findIndex((contact) => contact.id === contactID);
		if (contactIndex !== -1) {
			let badgeColor = contacts[contactIndex]["bgcolor"];
			let contactName = contacts[contactIndex]["username"];
			let userBadge = generateBadge(contactName);
			let selectedContactHTML = generateSelectedContactHTML(contactName, badgeColor, userBadge, i);
			selectedContacts.innerHTML += selectedContactHTML;
		}
	}
}

/**
 * this function sets minimum date of today and adds input event listener for changing text color based on user input
 */
function getDateToday() {
	let today = new Date().toISOString().split("T")[0];
	let dateField = document.getElementById("date_field");
	dateField.setAttribute("min", today);
	dateField.addEventListener("input", function () {
		if (dateField.value) {
			dateField.style.color = "black";
		} else {
			dateField.style.color = "lightgrey";
		}
	});
}

/**
 * this function changes visibility of subtask icons hides normal subtask icon and displays three subtask icons
 */
function changingSubtaskIcons() {
	let inputField = document.getElementById("add_new_subtask_field");
	document.getElementById("normal_subtask_icon").classList.add("d-none");
	document.getElementById("three_subtask_icons").classList.remove("d-none");
	inputField.focus();
	inputField.select();
}

/**
 * this function closes subtask icons by making normal subtask icon visible and hiding the three subtask icons
 * and clears content of input field associated with subtasks
 */
function closeSubtaskIcons() {
	document.getElementById("normal_subtask_icon").classList.remove("d-none");
	document.getElementById("three_subtask_icons").classList.add("d-none");
	let input = document.getElementById("add_new_subtask_field");
	input.value = "";
}

/**
 * Handles subtask creation and display actions.
 * This function manages the subtask workflow by changing subtask input icons and displaying new subtasks.
 * It doesn't return any value.
 *
 * @returns {void}
 */
function handleSubtaskActions() {
	changingSubtaskIcons();
	displaySubtasks();
}

/**
 * this function shows subtasks by obtaining trimmed value from the input field for adding new subtask
 * if the value is not empty adds a new subtask with specified subtitle and the status "subdone" to the addedSubtasks array
 * then rendering added subtask and clear input field
 */
function displaySubtasks() {
	let subtask = document.getElementById("add_new_subtask_field").value.trim();
	if (subtask !== "") {
		addedSubtasks.push({ subdone: false, subtitle: subtask });
		renderAddedSubtasks();
		subtask.value = "";
	}
}

/**
 * this fnuction renders added subtasks by populating the subtask display container with html for each subtask in theadded subtask array
 * logs each subtask to console
 */
function renderAddedSubtasks() {
	let subtaskContainer = document.getElementById("subtask_display_container");
	subtaskContainer.innerHTML = "";
	for (let i = 0; i < addedSubtasks.length; i++) {
		let subtask = addedSubtasks[i].subtitle;
		subtaskContainer.innerHTML += createSubtaskHTML(subtask, i);
	}
	subtaskContainer.classList.remove("d-none");
	closeSubtaskIcons();
}

/**
 * this function saving edited content of subtask and updates the display
 * @param {number} index - index of subtask in added subtask array
 */
function saveEditedSubtask(index) {
	let inputField = document.getElementById(`input_${index}`);
	let subtask = inputField.value.trim();
	if (subtask !== "") {
		addedSubtasks[index].subtitle = subtask;
		renderAddedSubtasks();
	}
	makeReadonly(`input_${index}`);
}

/**
 * Initiates editing of a subtask by adjusting icons and focusing on the input field.
 *
 * @param {number} index - The index of the subtask in the addedSubtasks array.
 * @throws {Error} Throws an error if the input field or icons cannot be found.
 *
 */
function editAddedSubtask(index) {
	moveIconsForEditing(index);
	document.getElementById(`subtask_icons_1_${index}`).classList.add("d-none");
	document.getElementById(`check_dark_save_${index}`).classList.remove("d-none");
	let inputField = document.getElementById(`input_${index}`);
	makeEditable(`input_${index}`);
	inputField.focus();
}

/**
 * this function moves icons in the subtask container for editing
 * @param {number} index - index of the subtask in added subtaak array
 */
function moveIconsForEditing(index) {
	let editIcon = document.getElementById(`subtask_icons_1_${index}`);
	let deleteIcon = document.getElementById(`subtask_icons_3_${index}`);
	let saveIcon = document.getElementById(`check_dark_save_${index}`);
	let vectorLine = document.getElementById(`subtask_icons_2_${index}`);
	let container = editIcon.parentElement;
	container.insertBefore(saveIcon, editIcon);
	container.insertBefore(vectorLine, editIcon);
	container.insertBefore(deleteIcon, editIcon);
}

/**
 * this function deletes added subtasks from added subtasks array. renders the updated list
 * @param {string} subtask - subtask to be deleted
 */
function deleteAddedSubtask(subtask) {
	let index = addedSubtasks.indexOf(subtask);
	if (index == -1 || index !== -1) {
		addedSubtasks.splice(index, 1);
		renderAddedSubtasks();
	}
}

/**
 * this function clear all fields resets containers and clears subtasks. returning to default state
 */
function clearAllFields() {
	clearContainerLeft();
	resetContainers();
	clearContainerRight();
	closeSubtaskIcons();
	document.getElementById("subtask_display_container").innerHTML = "";
	addedSubtasks = [];
	changePrioColor("Medium");
}

/**
 * this function clear fields from left container. title description and selected contacts
 */
function clearContainerLeft() {
	document.getElementById("enter_title_field").value = "";
	document.getElementById("enter_description_field").value = "";
	document.getElementById("et_select_contacts_search").value = "";
	clearSelectedContacts();
}

/**
 * this function is clearing selected contacts by resetting assignedID array and updating the display
 */
function clearSelectedContacts() {
	assignedID = [];
	showSelectedContacts(assignedID, "et_selected_contacts");
}

/**
 * this function is clearing the contents of right container. date field category selection and subtask input field
 */
function clearContainerRight() {
	let dateField = document.getElementById("date_field");
	document.getElementById("date_field").value = "";
	dateField.style.color = "lightgrey";
	document.getElementById("select_category_field").selectedIndex = 0;
	document.getElementById("add_new_subtask_field").value = "";
}

/**
 * this function checks if necessary inputs "title date and category" are filled in to enable or disable. creates task button accordingly
 */
function checkIfSendingIsPossible() {
	let createTaskButton = document.getElementById("create_task_button");
	let titleField = document.getElementById("enter_title_field");
	let dateField = document.getElementById("date_field");
	let categoryField = document.getElementById("select_category_field");
	function checkInputs() {
		if (titleField.value.trim().length > 0 && dateField.value.trim().length > 0 && categoryField.value.trim().length > 0) {
			createTaskButton.disabled = false;
		} else {
			createTaskButton.disabled = true;
		}
	}
	titleField.addEventListener("input", checkInputs);
	dateField.addEventListener("input", checkInputs);
	categoryField.addEventListener("input", checkInputs);
}

/**
 * this function retrieves selected prio from the prio container
 * @returns {string} - selected prio. urgent medium and low
 */
function getSelectedPriority() {
	let priorityContainers = document.getElementsByClassName("status-definition-container");
	for (let i = 0; i < priorityContainers.length; i++) {
		if (priorityContainers[i].classList.contains("selected")) {
			return priorityContainers[i].id.replace("_container", "");
		}
	}
}

/**
 * Adds a new task to a specified bucket and performs related actions.
 *
 * @param {string} [bucket="to-do"] - The bucket to which the task should be added. Defaults to "to-do".
 * @returns {void}
 */
function addTask(bucket = "to-do") {
	createTask(bucket);
	createTaskMessage();
	forwardingToBoard();
}

/**
 * Creates a new task, assigns a priority, and stores it in the JSON data.
 *
 * @async
 * @param {string} [bucket] - The bucket to which the task should be added.
 * @returns {Promise<void>}
 */
async function createTask(bucket) {
	let selectedPriority = getSelectedPriority();
	let newTasks = {
		bucket: bucket,
		title: enter_title_field.value,
		description: enter_description_field.value,
		assigned_id: assignedID,
		duedate: date_field.value,
		prio: selectedPriority,
		category: select_category_field.value,
		subtasks: addedSubtasks,
	};
	saveNewTaskToStorage(newTasks);
}

/**
 * Redirects the user to the board page after a delay of 1 second.
 *
 * @async
 * @returns {void}
 */
function forwardingToBoard() {
	setTimeout(() => {
		window.location.href = "board.html";
	}, 1000);
}

/**
 * Makes an input field editable by removing the 'readonly' attribute.
 *
 * @param {string} inputId - The ID of the input element to make editable.
 * @throws {Error} Throws an error if the element with the given ID is not found.
 */
function makeEditable(inputId) {
	document.getElementById(inputId).removeAttribute("readonly");
}

/**
 * Makes an input field read-only by setting the 'readonly' attribute.
 *
 * @param {string} inputId - The ID of the input element to make read-only.
 * @throws {Error} Throws an error if the element with the given ID is not found.
 *
 */
function makeReadonly(inputId) {
	document.getElementById(inputId).setAttribute("readonly", "readonly");
}
