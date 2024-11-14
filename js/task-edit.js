/**
 * Loads the edit view for a specific task.
 * *This function performs the following steps:
 *  1. Filter tasks based on the provided TaskID.
 *  2. Clear the content of the task overlay background.
 *  3. Iterate through the filtered tasks.
 *  4. Extract task variables using the getTaskVariables function.
 *  5. Initialize the task editing view using the initEditTask function.
 *
 * @param {string} TaskID - The ID of the task to edit.
 * @returns {void}
 * @throws {Error} Throws an error if the provided TaskID is not valid.
 *
 */
function loadTaskEdit(TaskID) {
	let tasks = addedTasks.filter((t) => t["id"] === TaskID);
	document.getElementById("task_overlay_bg").innerHTML = "";

	for (let index = 0; index < tasks.length; index++) {
		let [id, bucket, title, description, prio, category, subtasks, assigneds, duedate, rawDuedate] = getTaskVariables(tasks, index);
		initEditTask(id, title, description, prio, assigneds, rawDuedate);
	}
}

/**
 * Initializes the edit view for a task.
 * This function performs the following steps:
 *  1. Set the content of the task overlay background using generateEditTaskHTML.
 *  2. Load all users for contact on the assigned-to section of the edit task.
 *  3. Load assigned users on the edit task.
 *  4. Set today's date for the calendar in the edit task.
 *  5. Load priority information on the edit task.
 *  6. Load subtasks for the edit task.
 *
 * @param {string} id - The ID of the task.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} prio - The priority of the task.
 * @param {Array} assigneds - An array of assigned users for the task.
 * @param {string} duedate - The due date of the task.
 * @returns {void}
 *
 */
function initEditTask(id, title, description, prio, assigneds, duedate) {
	document.getElementById("task_overlay_bg").innerHTML = generateEditTaskHTML(id, title, description, duedate);
	loadAllUsersForContactOnAssignedTo(assigneds, "et_contact_overlay", id);
	loadAssignedOnEditTask(assigneds, "et_selected_contacts");
	setTodayDateForCalendar("calendar_edit_task");
	loadPrioOnEditTask(prio);
	loadSubtasksEditTask("subtask_lists", id);
}

/**
 * Updates the open task with the specified ID.
 * This function performs the following steps:
 *  1. Update the title of the open task.
 *  2. Update the description of the open task.
 *  3. Update the due date of the open task.
 *  4. Update the priority of the open task.
 *  5. Render the updated open task.
 *
 * @param {string} taskID - The ID of the open task to be updated.
 * @returns {void}
 */
function updateOpenTask(taskID) {
	updateOpenTaskTitle(taskID);
	updateOpenTaskDesc(taskID);
	updateOpenTaskDueDate(taskID);
	updateTaskPriority(taskID);
	renderOpenTask(taskID);
}

/**
 * Updates the title of the open task with the specified ID.
 * 1. Get the title value from the input field.
 * 2. Update the title of the open task with the obtained value.
 *
 * @param {string} taskID - The ID of the open task to be updated.
 * @returns {void}
 */
function updateOpenTaskTitle(taskID) {
	let titleValue = document.getElementById("title_input_ed_task").value;
	addedTasks[taskID]["title"] = titleValue;
}

/**
 * Updates the description of the open task with the specified ID.
 * This function performs the following steps:
 * 1. Get the description value from the input field.
 * 2. Update the description of the open task with the obtained value.
 *
 * @param {string} taskID - The ID of the open task to be updated.
 * @returns {void} - No return value.
 *
 */
function updateOpenTaskDesc(taskID) {
	let descValue = document.getElementById("description_ed_task").value;
	addedTasks[taskID]["description"] = descValue;
}

/**
 * Updates the due date of the open task with the specified ID.
 * This function performs the following steps:
 * 1. Get the due date value from the calendar input.
 * 2. Update the due date of the open task with the obtained value.
 *
 * @param {string} taskID - The ID of the open task to be updated.
 * @returns {void} - No return value.
 *
 */
function updateOpenTaskDueDate(taskID) {
	let dueDateValue = document.getElementById("calendar_edit_task").value;
	addedTasks[taskID]["duedate"] = dueDateValue;
}

/**
 * Updates the priority of the task with the specified ID.
 * This function performs the following steps:
 * 1. Check if a global priority button ID is set.
 * 2. If set, retrieve the priority value from the corresponding element.
 * 3. Update the priority of the task with the obtained value.
 *
 * @param {string} taskID - The ID of the task to update its priority.
 * @returns {void} - No return value.
 */
function updateTaskPriority(taskID) {
	let prio = "";
	if (globalPrioButtonID !== "") {
		prio = document.getElementById(globalPrioButtonID).value;
	}
	addedTasks[taskID]["prio"] = prio;
}

/**
 * Loads the priority settings on the edit task interface.
 * This function performs the following steps:
 * 1. Check the provided priority value.
 * 2. If the priority is "Urgent," set the corresponding button as active and update its color.
 * 3. If the priority is "Medium," set the corresponding button as active and update its color.
 * 4. If the priority is "Low," set the corresponding button as active and update its color.
 *
 * @param {string} prio - The priority value to be loaded.
 * @returns {void} - No return value.
 */
function loadPrioOnEditTask(prio) {
	if (prio === "Urgent") {
		isActive = true;
		changePrioBtnColor("urgent-btn", false);
	} else if (prio === "Medium") {
		isActive = true;
		changePrioBtnColor("medium-btn", false);
	} else if (prio === "Low") {
		isActive = true;
		changePrioBtnColor("low-btn", false);
	}
}

/**
 * Toggles the visibility of the contact overlay.
 *
 * This function toggles the visibility of the contact overlay based on the current state.
 * If the contact overlay is open, it hides the container and shows the selected contacts.
 * If the contact overlay is closed, it shows the container and hides the selected contacts.
 * Additionally, it adjusts the visibility of specific elements related to the contact overlay.
 *
 * @param {string} containerID - The ID of the contact container element.
 * @param {string} selectedContactsID - The ID of the selected contacts element.
 * @returns {void} - No return value.
 *
 */
let isCantactOpen = true;
function openContactOverlay(containerID, selectedContactsID) {
	if (isCantactOpen) {
		show(containerID);
		hide(selectedContactsID);
		hide("select-contacts_down");
		show("select-contacts_up");
		isCantactOpen = false;
	}
}

function closeContactOverlay(containerID, selectedContactsID) {
	if (!isCantactOpen) {
		hide(containerID);
		show(selectedContactsID);
		show("select-contacts_down");
		hide("select-contacts_up");
		isCantactOpen = true;
	}
}

/**
 * Loads all users for contact assignment on the edit task interface.
 *
 * @param {Array<string>} assigneds - An array of assigned user names.
 * @param {string} containerID - The ID of the container to display the assigned users.
 * @param {string} ID - The ID of the task.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Get the container element by ID.
 * 2. Iterate through the users array.
 * 3. For each user, generate a badge with the user's name and badge color.
 * 4. If the user is assigned to the task, generate and append the HTML for a checked badge.
 * 5. If the user is not assigned to the task, generate and append the HTML for an unchecked badge.
 */
function loadAllUsersForContactOnAssignedTo(assigneds, containerID, ID) {
	let contactsContainer = document.getElementById(containerID);
	for (let i = 0; i < users.length; i++) {
		let userName = users[i]["name"];
		let userBadge = generateUserBadge(userName);
		let badgeColor = users[i]["bgcolor"];
		if (assigneds.includes(userName)) {
			contactsContainer.innerHTML += generateEditTaskAssigmentContactsCheckedHTML(badgeColor, userBadge, userName, i, ID);
		} else {
			contactsContainer.innerHTML += generateEditTaskAssigmentContactsHTML(badgeColor, userBadge, userName, i, ID);
		}
	}
}

/**
 * Adds a contact to the list of assigned persons or removes them from it.
 *
 * @param {string} id - The ID of the checkbox element.
 * @param {number} i - The index of the user in the users array.
 * @param {number} j - The index of the task in the addedTasks array.
 *
 * @description
 * This function performs the following steps:
 * 1. Checks the status of the checkbox with the given ID.
 * 2. Determines which assigned array to use based on whether newTask is empty.
 * 3. Adds the username to the assigned array if the checkbox is checked.
 * 4. Removes the username from the assigned array if the checkbox is unchecked.
 * 5. Updates the display of assigned contacts.
 */
function addContactAsAssigned(id, i, j) {
	let checkAssigned = document.getElementById(id);
	let assigned = [];
	let userName = users[i]["name"];
	let deleteName = assigned.indexOf(userName);
	isNewTaskEmpty(newTask) ? (assigned = addedTasks[j]["assigned"]) : (assigned = newTask["assigned"]);

	if (checkAssigned.checked) {
		assigned.push(userName);
	} else if (!checkAssigned.checked) {
		assigned.splice(deleteName, 1);
	}
	loadAssignedOnEditTask(assigned, "et_selected_contacts");
}

/**
 * Loads the assigned contacts on the edit task interface.
 *
 * @param {string[]} assigneds - The array of assigned contact names.
 * @param {string} containerID - The ID of the container element.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Get the container element by ID.
 * 2. Clear the container's inner HTML.
 * 3. Iterate through the assigned contacts array.
 *    a. Get the badge color for the current assigned contact.
 *    b. Get the assigned contact's name.
 *    c. Generate the user badge HTML using the generateUserBadge function.
 *    d. Append the generated assignment badge HTML to the container.
 */
function loadAssignedOnEditTask(assigneds, containerID) {
	let selectetContactsContainer = document.getElementById(containerID);
	selectetContactsContainer.innerHTML = "";
	for (let i = 0; i < assigneds.length; i++) {
		let badgeColor = getUserColor(assigneds, i);
		let assignedName = assigneds[i];
		let userBadge = generateUserBadge(assignedName);
		selectetContactsContainer.innerHTML += generateAssigmentBadgeEditTaskHTML(userBadge, badgeColor, i);
	}
}

/**
 * Filters and displays users based on the search term in the "Assigned To" section of the edit task interface.
 *
 * @param {string} inputID - The ID of the input element for the search term.
 * @param {string} searchContainerID - The ID of the container element for displaying search results.
 * @param {string} id - The ID of the task being edited.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Get the search term from the input element by ID.
 * 2. Get the assigned contacts for the current task by ID.
 * 3. Convert the search term to lowercase.
 * 4. Get the container element for displaying search results by ID.
 * 5. Clear the container's inner HTML.
 * 6. If the search term is empty, load all users for the "Assigned To" section using loadAllUsersForContactOnAssignedTo.
 * 7. If the search term is not empty, filter and display contacts based on the search term using getContect.
 */
function filterUserOnAssignedTo(inputID, searchContainerID, id) {
	let searchTerm = document.getElementById(inputID).value;
	let assigneds = [];
	isNewTaskEmpty(newTask) ? (assigneds = addedTasks[id]["assigned"]) : (assigneds = newTask["assigned"]);
	searchTerm = searchTerm.toLowerCase();
	let contactsContainer = document.getElementById(searchContainerID);
	contactsContainer.innerHTML = "";
	if (searchTerm == "") {
		loadAllUsersForContactOnAssignedTo(assigneds, searchContainerID, id);
	} else {
		renderFilterdUsersOnAssignedTo(assigneds, searchTerm, id, contactsContainer);
	}
}

/**
 * Renders filtered users based on the search term in the "Assigned To" section of the edit task interface.
 *
 * @param {string[]} assigneds - An array of assigned contacts for the current task.
 * @param {string} searchTerm - The search term used for filtering contacts.
 * @param {string} id - The ID of the task being edited.
 * @param {HTMLElement} contactsContainer - The container element for displaying filtered users.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Iterate through the users array.
 * 2. Get the name of each user from the users array.
 * 3. Check if the user's name (converted to lowercase) includes the search term (converted to lowercase).
 * 4. If the condition is met, generate the user badge, get the badge color, and update the container's inner HTML.
 * 5. If the user is already assigned, use generateEditTaskAssigmentContactsCheckedHTML; otherwise, use generateEditTaskAssigmentContactsHTML.
 */
function renderFilterdUsersOnAssignedTo(assigneds, searchTerm, id, contactsContainer) {
	for (let i = 0; i < users.length; i++) {
		let userName = users[i]["name"];
		if (userName.toLowerCase().includes(searchTerm)) {
			let userBadge = generateUserBadge(userName);
			let badgeColor = users[i]["bgcolor"];
			if (assigneds.includes(userName)) {
				contactsContainer.innerHTML += generateEditTaskAssigmentContactsCheckedHTML(badgeColor, userBadge, userName, i, id);
			} else {
				contactsContainer.innerHTML += generateEditTaskAssigmentContactsHTML(badgeColor, userBadge, userName, i, id);
			}
		}
	}
}

/**
 * Displays the subtask input and hides the "Add Subtask" button.
 *
 * @param {string} addSubtaskID - The ID of the "Add Subtask" button to be hidden.
 * @param {string} checkSubtaskID - The ID of the subtask input or checkbox to be displayed.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Hides the "Add Subtask" button using the hide function.
 * 2. Displays the subtask input or checkbox using the show function.
 */
function showSubtaskInput(addSubtaskID, checkSubtaskID) {
	hide(addSubtaskID);
	show(checkSubtaskID);
}

/**
 * Cancels the addition of a subtask, hides the subtask input or checkbox, and shows the "Add Subtask" button.
 *
 * @param {string} addSubtaskID - The ID of the "Add Subtask" button to be displayed.
 * @param {string} checkSubtaskID - The ID of the subtask input or checkbox to be hidden.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Displays the "Add Subtask" button using the show function.
 * 2. Hides the subtask input or checkbox using the hide function.
 * 3. Resets the value of the subtask input to an empty string.
 */
function cancelAddSubtask(addSubtaskID, checkSubtaskID) {
	show(addSubtaskID);
	hide(checkSubtaskID);
	document.getElementById("subtask_input").value = "";
}

/**
 * Loads the subtasks for a given task ID.
 *
 * @param {number} taskID - The ID of the task to load subtasks for.
 * @returns {Array} - An array of subtasks for the specified task.
 *
 * @description
 * This function performs the following steps:
 * 1. Checks if the newTask object is empty using the isNewTaskEmpty function.
 * 2. If newTask is empty:
 *    a. Filters the addedTasks array to find the task with the matching taskID.
 *    b. Iterates through the filtered tasks (should be only one).
 *    c. Returns the subtask array of the matching task.
 * 3. If newTask is not empty:
 *    a. Returns the subtask array from the newTask object.
 */
function loadSubtask(taskID) {
	let tasks = [];
	if (isNewTaskEmpty(newTask)) {
		tasks = addedTasks.filter((t) => t["id"] === taskID);
		for (let index = 0; index < tasks.length; index++) {
			let task = tasks[index];
			let subtask = task["subtask"];
			return subtask;
		}
	} else {
		return newTask["subtask"];
	}
}

/**
 * Loads and renders the subtasks of a task on the edit task interface.
 *
 * @param {string} subtaskListID - The ID of the HTML container for the subtask list.
 * @param {number} ID - The ID of the task for which subtasks are to be loaded.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Retrieves the subtasks of the specified task using the loadSubtask function.
 * 2. Clears the content of the specified subtask container.
 * 3. Iterates through the subtasks and generates HTML for each subtask using the generateSubtaskListItemHTML function.
 * 4. Appends the generated HTML to the subtask container.
 */
function loadSubtasksEditTask(subtaskListID, ID) {
	let subtaskContainer = document.getElementById(subtaskListID);
	subtaskContainer.innerHTML = "";
	let subtask = loadSubtask(ID);
	for (let i = 0; i < subtask.length; i++) {
		let subtitle = subtask[i]["subtitle"];
		subtaskContainer.innerHTML += generateSubtaskListItemHTML(subtitle, i, ID, "subtask_listitem_", "subtask_edit_container", "subtask_edit_input", "subtask_lists");
	}
}

/**
 * Adds a new subtask to a task and updates the rendered subtasks on the edit task interface.
 *
 * @param {number} taskID - The ID of the task to which the subtask is added.
 * @param {string} subtaskListItemID - The ID of the HTML container for the subtask list item.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Retrieves the current subtasks of the specified task using the loadSubtask function.
 * 2. Checks if the subtask input value is empty. If empty, no action is taken.
 * 3. If the subtask input value is not empty, adds a new subtask to the subtasks array.
 * 4. Cancels the subtask addition using the cancelAddSubtask function.
 * 5. Reloads and renders the updated subtasks on the edit task interface using the loadSubtasksEditTask function.
 */
function addSubtask(taskID, subtaskListItemID) {
	let subtask = loadSubtask(taskID);
	if (subtask_input.value == "") {
	} else {
		subtask.push({
			subdone: false,
			subtitle: subtask_input.value,
		});
		cancelAddSubtask("add_subtask", "check_subtask_icons");
		loadSubtasksEditTask(subtaskListItemID, taskID);
	}
}

/**
 * Deletes a subtask from a task and updates the rendered subtasks on the edit task interface.
 *
 * @param {number} taskID - The ID of the task from which the subtask is deleted.
 * @param {number} subTaskID - The ID of the subtask to be deleted.
 * @param {string} subtaskListItemID - The ID of the HTML container for the subtask list item.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Retrieves the current subtasks of the specified task using the loadSubtask function.
 * 2. Deletes the specified subtask from the subtasks array based on its ID.
 * 3. Reloads and renders the updated subtasks on the edit task interface using the loadSubtasksEditTask function.
 */
function deleteSubtask(taskID, subTaskID, subtaskListItemID) {
	let subTask = loadSubtask(taskID);
	subTask.splice(subTaskID, 1);
	loadSubtasksEditTask(subtaskListItemID, taskID);
}

/**
 * Shows the subtask edit input frame and hides the subtask list item.
 *
 * @param {string} subtaskListItemID - The ID of the HTML container for the subtask list item.
 * @param {string} subtaskEditFrameID - The ID of the HTML container for the subtask edit input frame.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Hides the subtask list item using the hide function.
 * 2. Shows the subtask edit input frame using the show function.
 */

function showSubtaskEditInputFrame(subtaskListItemID, subtaskEditFrameID) {
	hide(subtaskListItemID);
	show(subtaskEditFrameID);
}

/**
 * Closes the subtask edit input frame and shows the subtask list item.
 *
 * @param {string} subtaskListItemID - The ID of the HTML container for the subtask list item.
 * @param {string} subtaskEditFrameID - The ID of the HTML container for the subtask edit input frame.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Hides the subtask edit input frame using the hide function.
 * 2. Shows the subtask list item using the show function.
 */
function closeSubtaskEditInputFrame(subtaskListItemID, subtaskEditFrameID) {
	hide(subtaskEditFrameID);
	show(subtaskListItemID);
}

/**
 * Updates a subtask's title and hides the subtask edit input frame.
 *
 * @param {string} taskID - The ID of the task associated with the subtask.
 * @param {string} subtaskListItemID - The ID of the HTML container for the subtask list item.
 * @param {string} subtaskEditInputID - The ID of the HTML input element for editing the subtask.
 * @param {number} subtaskID - The ID of the subtask to update.
 * @param {string} subtaskEditFrameID - The ID of the HTML container for the subtask edit input frame.
 * @param {string} subtaskList - The ID of the HTML container for the subtask list.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Loads the subtask associated with the provided task ID.
 * 2. Updates the title and subdone status of the specified subtask.
 * 3. Closes the subtask edit input frame using the closeSubtaskEditInputFrame function.
 * 4. Reloads the subtasks for the task using the loadSubtasksEditTask function.
 */
function updateSubtask(taskID, subtaskListItemID, subtaskEditInputID, subtaskID, subtaskEditFrameID, subtaskList) {
	let subtask = loadSubtask(taskID);
	let subtaskEditInput = document.getElementById(subtaskEditInputID).value;
	if (subtaskEditInput.length !== 0) {
		subtask[subtaskID]["subtitle"] = subtaskEditInput;
		subtask[subtaskID]["subdone"] = false;
		closeSubtaskEditInputFrame(subtaskListItemID, subtaskEditFrameID);
		loadSubtasksEditTask(subtaskList, taskID);
	}
}
