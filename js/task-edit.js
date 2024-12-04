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
 * Updates a task with the specified properties using the values from the edit form.
 *
 * @async
 * @param {Object} task - The task object to be updated.
 * @returns {Promise<void>}
 *
 * @description
 * This function performs the following steps:
 * 1. Creates a new object 'changedTasks' with updated task properties:
 *    - Updates title, description, assigned IDs, due date, and priority.
 *    - Retains the original subtasks and other unchanged properties.
 *
 */
async function updateTask(task) {
	changedTasks = {
		title: title_input_ed_task.value,
		description: description_ed_task.value,
		assigned_id: assignedID,
		duedate: calendar_edit_task.value,
		prio: task["prio"],
		subtasks: task["subtasks"],
	};
}

/**
 * Initializes the edit view for a task.
 * This function performs the following steps:
 *  1. Set the content of the task overlay background using generateEditTaskHTML.
 *  2. Load all contacts for contact on the assigned-to section of the edit task.
 *  3. Load assigned contacts on the edit task.
 *  4. Set today's date for the calendar in the edit task.
 *  5. Load priority information on the edit task.
 *  6. Load subtasks for the edit task.
 *
 * @param {string} id - The ID of the task.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} prio - The priority of the task.
 * @param {Array} assigneds - An array of assigned contacts for the task.
 * @param {string} duedate - The due date of the task.
 * @returns {void}
 *
 */
function initEditTask(id, title, description, prio, assigneds, duedate) {
	document.getElementById("task_overlay_bg").innerHTML = generateEditTaskHTML(id, title, description, duedate);
	assignedID = filterContactIDForAssignedTo(assigneds);
	loadAllUsersForContactOnAssignedTo(assignedID, "et_contact_overlay", id);
	loadAssignedOnEditTask(assignedID, "et_selected_contacts");
	setTodayDateForCalendar("calendar_edit_task");
	loadPrioOnEditTask(prio);
	loadSubtasksEditTask("subtask_lists", id);
}

/**
 * Extracts contact IDs from an array of assigned contacts.
 *
 * @param {Array<Object>} assigneds - An array of assigned contact objects.
 * @returns {Array<string>} An array of contact IDs.
 *
 * @description
 * This function performs the following steps:
 * 1. Initializes an empty array to store contact IDs.
 * 2. Iterates through the array of assigned contacts.
 * 3. For each contact object, extracts the 'id' property and adds it to the contactIDs array.
 * 4. Returns the array of contact IDs.
 */
function filterContactIDForAssignedTo(assigneds) {
	let contactIDs = [];
	assigneds.forEach((contact) => {
		contactIDs.push(contact.id);
	});
	return contactIDs;
}

/**
 * Extracts the names of assigned contacts from an array of contact objects.
 *
 * @param {Array<Object>} assigneds - An array of assigned contact objects.
 * @returns {Array<string>} An array containing the names of the assigned contacts.
 *
 * @description
 * This function iterates through the array of assigned contacts and extracts
 * the name of each contact. It creates a new array that contains only the names.
 */
function filterContactNameForAssignedTo(assigneds) {
	let contactName = [];
	assigneds.forEach((contact) => {
		contactName.push(contact.name);
	});
	return contactName;
}

/**
 * Updates the open task with the specified ID and refreshes the task display.
 *
 * @async
 * @param {string} taskID - The ID of the open task to be updated.
 * @returns {Promise<void>} A promise that resolves when the task is updated and the display is refreshed.
 */
async function updateOpenTask(taskID) {
	let task = filterTask(taskID);
	updateTaskPriority(task);
	updateTask(task);
	await updatedAddedTaskToStorage(changedTasks, taskID);
	await loadAddedTasksFromStorage();
	renderOpenTask(taskID);
	assignedID = [];
	changedTasks = [];
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
function updateTaskPriority(task) {
	let prio = "";
	if (globalPrioButtonID !== "") {
		prio = document.getElementById(globalPrioButtonID).value;
	}
	task.prio = prio;
}

/**
 * Filters a task from the list of added tasks based on the task ID.
 *
 * @param {number} taskID - The ID of the task to filter.
 * @returns {object|null} The filtered task or null if no task with the given ID is found.
 */
function filterTask(taskID) {
	let task = addedTasks.filter((t) => t["id"] === taskID);
	return task[0];
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

/**
 * Closes the contact overlay and updates the UI accordingly.
 *
 * @param {string} containerID - The ID of the contact overlay container to be hidden.
 * @param {string} selectedContactsID - The ID of the selected contacts container to be shown.
 * @returns {void}
 *
 */
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
 * Loads all contacts for contact assignment on the edit task interface.
 *
 * @param {Array<Object>} assigneds - An array of assigned contact IDs.
 * @param {string} containerID - The ID of the container to display the contacts.
 * @param {string} ID - The ID of the task.
 * @returns {void}
 *
 * @description
 * This function performs the following steps:
 * 1. Gets the container element by ID.
 * 2. Iterates through the contacts array.
 * 3. For each contact:
 *    a. Retrieves the contact's name, ID, and badge color.
 *    b. Generates a badge with the contact's name.
 *    c. If there are assigned contacts (assigneds is not 0):
 *       - Checks if the current contact is assigned to the task.
 *       - If assigned, generates and appends HTML for a checked contact.
 *    d. If there are no assigned contacts:
 *       - Generates and appends HTML for an unchecked contact.
 * 4. Appends the generated HTML to the container.
 */
function loadAllUsersForContactOnAssignedTo(assigneds, containerID, ID = 0) {
	let contactsContainer = document.getElementById(containerID);
	for (let i = 0; i < contacts.length; i++) {
		let contactName = contacts[i]["name"];
		let contactID = contacts[i]["id"];
		let userBadge = generateBadge(contactName);
		let badgeColor = contacts[i]["bgcolor"];
		if (assigneds.includes(contactID)) {
			contactsContainer.innerHTML += generateEditTaskAssigmentContactsCheckedHTML(badgeColor, userBadge, contactName, i, ID);
		} else {
			contactsContainer.innerHTML += generateEditTaskAssigmentContactsHTML(badgeColor, userBadge, contactName, i, ID);
		}
	}
}

/**
 * Adds or removes a contact from the assigned list for a task.
 *
 * @param {string} id - The ID of the checkbox element.
 * @param {number} i - The index of the contact in the contacts array.
 * @param {Array<string>} assignedID - Array of assigned contact IDs.
 * @param {string} taskID - The ID of the task being edited.
 * @param {string} containerID - The ID of the container element to update.
 * @returns {void}
 *
 * @description
 * This function performs the following steps:
 * 1. Retrieves the checkbox element and contact information.
 * 2. Determines the correct assigned array based on whether it's a new or existing task.
 * 3. If the checkbox is checked, adds the contact to the assigned lists.
 * 4. If the checkbox is unchecked, removes the contact from the assigned lists.
 * 5. Updates the UI to reflect the changes in assigned contacts.
 * 6. Resets the assignedID array.
 *
 * @global
 * @var {Array<Object>} contacts - Array of all contacts.
 * @var {Object} newTask - Object representing a new task being created.
 * @var {Array<Object>} addedTasks - Array of all existing tasks.
 *
 * @see loadAssignedOnEditTask
 * @see isNewTaskEmpty
 */
function addContactAsAssigned(id, i, assignedID, taskID, containerID) {
	let checkAssigned = document.getElementById(id);
	let contactID = contacts[i]["id"];
	let contact = contacts[i];
	let assigned = [];
	let deleteID = assignedID.indexOf(contactID);
	assigned = addedTasks.filter((task) => task.id === taskID)[0]?.assigned || [];
	//isNewTaskEmpty(newTask) ? (assigned = addedTasks.filter((task) => task.id === taskID)[0]?.assigned || []) : (assigned = newTask["assigned"]);
	if (checkAssigned.checked) {
		assignedID.push(contactID);
		assigned.push(contact);
	} else if (!checkAssigned.checked) {
		assignedID.splice(deleteID, 1);
		assigned.splice(deleteID, 1);
	}
	loadAssignedOnEditTask(assignedID, containerID);
	assignedID = [];
}

/**
 * Loads the assigned contacts on the edit task interface.
 *
 * @param {string[]} assigned - The array of assigned contact IDs.
 * @param {string} containerID - The ID of the container element.
 * @returns {void}
 *
 * @description
 * This function performs the following steps:
 * 1. Gets the container element by ID.
 * 2. Clears the container's inner HTML.
 * 3. Iterates through the assigned contact IDs array.
 *    a. Finds the corresponding contact in the contacts array.
 *    b. If found, retrieves the badge color and contact name.
 *    c. Generates the user badge HTML using the generateBadge function.
 *    d. Generates and appends the assignment badge HTML to the container.
 */
function loadAssignedOnEditTask(assigned, containerID) {
	let selectetContactsContainer = document.getElementById(containerID);
	selectetContactsContainer.innerHTML = "";
	for (let i = 0; i < assigned.length; i++) {
		let contactID = assigned[i];
		let contactIndex = contacts.findIndex((contact) => contact.id === contactID);
		if (contactIndex !== -1) {
			let badgeColor = contacts[contactIndex]["bgcolor"];
			let contactName = contacts[contactIndex]["name"];
			let userBadge = generateBadge(contactName);
			selectetContactsContainer.innerHTML += generateAssigmentBadgeEditTaskHTML(userBadge, badgeColor, i);
		}
	}
}

/**
 * Filters and displays contacts based on the search term in the "Assigned To" section of the edit task interface.
 *
 * @param {string} inputID - The ID of the input element for the search term.
 * @param {string} searchContainerID - The ID of the container element for displaying search results.
 * @param {number} taskID - The ID of the task being edited.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Retrieves the search term from the input element by ID.
 * 2. Gets the assigned contacts for the current task by ID.
 * 3. Converts the search term to lowercase.
 * 4. Retrieves the container element for displaying search results by ID.
 * 5. Clears the container's inner HTML.
 * 6. If the search term is empty, loads all contacts for the "Assigned To" section using `loadAllUsersForContactOnAssignedTo`.
 * 7. If the search term is not empty, filters and displays contacts based on the search term using `renderFilterdUsersOnAssignedTo`.
 */
function filterUserOnAssignedTo(inputID, searchContainerID, taskID) {
	let searchTerm = document.getElementById(inputID).value;
	let assigneds = useExistingTaskOrCreateNew(taskID);
	let contactsContainer = document.getElementById(searchContainerID);
	searchTerm = searchTerm.toLowerCase();
	contactsContainer.innerHTML = "";
	assignedID = checkAssignedIDAndFilter(assigneds, taskID);
	assigneds = filterContactNameForAssignedTo(assigneds);
	if (searchTerm == "") {
		loadAllUsersForContactOnAssignedTo(assignedID, searchContainerID, taskID);
	} else {
		renderFilterdUsersOnAssignedTo(assignedID, searchTerm, taskID, contactsContainer);
	}
}

/**
 * Checks the assigned IDs and filters them based on the task ID.
 *
 * @param {Array} assigneds - The array of assigned IDs to filter.
 * @param {number} taskID - The ID of the task to check against.
 * @returns {Array} The filtered or original array of assigned IDs.
 */
function checkAssignedIDAndFilter(assigneds, taskID) {
	if (taskID === -1 && assignedID.length > 0) {
		return assignedID;
	} else {
		return filterContactIDForAssignedTo(assigneds);
	}
}

/**
 * Retrieves the assigned IDs for a task. If the task ID is valid, it returns the assigned IDs of the existing task; otherwise, it returns an empty array.
 *
 * @param {number} taskID - The ID of the task to retrieve assigned IDs for.
 * @returns {Array} An array of assigned IDs.
 */
function useExistingTaskOrCreateNew(taskID) {
	let assigneds = [];
	if (taskID != -1) assigneds = addedTasks.filter((task) => task.id === taskID)[0]?.assigned || [];
	return assigneds;
}

/**
 * Renders filtered contacts based on the search term in the "Assigned To" section of the edit task interface.
 *
 * @param {string[]} assigneds - An array of assigned contacts for the current task.
 * @param {string} searchTerm - The search term used for filtering contacts.
 * @param {string} id - The ID of the task being edited.
 * @param {HTMLElement} contactsContainer - The container element for displaying filtered contacts.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Iterate through the contacts array.
 * 2. Get the name of each user from the contacts array.
 * 3. Check if the user's name (converted to lowercase) includes the search term (converted to lowercase).
 * 4. If the condition is met, generate the user badge, get the badge color, and update the container's inner HTML.
 * 5. If the user is already assigned, use generateEditTaskAssigmentContactsCheckedHTML; otherwise, use generateEditTaskAssigmentContactsHTML.
 */
function renderFilterdUsersOnAssignedTo(assignedID, searchTerm, id, contactsContainer) {
	for (let i = 0; i < contacts.length; i++) {
		let contactName = contacts[i]["name"];
		if (contactName.toLowerCase().includes(searchTerm)) {
			let badge = generateBadge(contactName);
			let badgeColor = contacts[i]["bgcolor"];
			let contactID = contacts[i]["id"];
			if (assignedID.includes(contactID)) {
				contactsContainer.innerHTML += generateEditTaskAssigmentContactsCheckedHTML(badgeColor, badge, contactName, i, id);
			} else {
				contactsContainer.innerHTML += generateEditTaskAssigmentContactsHTML(badgeColor, badge, contactName, i, id);
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
			let subtask = task["subtasks"];
			return subtask;
		}
	} else {
		return newTask["subtasks"];
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
		subtaskContainer.innerHTML += generateSubtaskListItemHTML(
			subtitle,
			i,
			ID,
			"subtask_listitem_",
			"subtask_edit_container",
			"subtask_edit_input",
			"subtask_lists"
		);
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
