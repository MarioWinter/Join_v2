let addedTasks = [];
let storageTasks = [];
let filteredTasks = [];

/**
 * Asynchronously initializes the board by performing the following actions:
 * - Loads added tasks using the loadAddedTasksFromStorage function.
 * - Loads users using the loadUsers function.
 * - Loads the board using the loadBoard function.
 * - Loads the current user using the loadCurrentUser function.
 * - Loads the user badge using the loadUserBadge function.
 *
 * @returns {Promise<void>} - A promise that resolves when the board is initialized.
 */
async function initBoard() {
	await loadAddedTasksFromStorage();
	await loadUsers();
	loadBoard();
	loadCurrentUser();
	loadUserBadge();
}

/**
 * hidden function to clear Added Tasks Remote Storage from any information
 */
async function clearAddedTasksRemoteSTRG() {
	addedTasks = [];
	await setItem("addedTasks", JSON.stringify(addedTasks));
}

/**
 * Asynchronously loads added tasks from storage.
 *
 * @returns {Promise<void>} - A promise that resolves when added tasks are loaded.
 */
async function loadAddedTasksFromStorage() {
	try {
		addedTasks = JSON.parse(await getItem("addedTasks"));
	} catch (e) {
		console.error("Loading Added Tasks error:", e);
	}
}

/**
 * Loads the board by iterating through each bucket, updating the board, and loading the "No Tasks" label.
 *
 * @returns {void}
 */
function loadBoard() {
	for (let i = 0; i < buckets.length; i++) {
		let bucket = buckets[i];
		updateBoard(bucket);
		loadNoTasksLabel(bucket);
	}
}

/**
 * Updates the board for a specific bucket by iterating through tasks and loading cards for each task.
 * - Load a card for the task using the loadCard function.
 *
 * @param {string} currentBucket - The current bucket being updated.
 * @returns {void}
 */
function updateBoard(currentBucket) {
	let tasks = getTasksPerBucket(currentBucket);
	for (let index = 0; index < tasks.length; index++) {
		let [id, bucket, title, description, prio, category, subtasks, assigneds, duedate, rawDuedate] = getTaskVariables(tasks, index);
		loadCard(id, bucket, title, description, prio, category, subtasks, assigneds);
	}
}

/**
 * Retrieves tasks for a specific bucket based on the current bucket and filtered tasks.
 * - Clear the inner HTML of the current bucket element.
 * @param {string} currentBucket - The current bucket for which tasks are retrieved.
 * @returns {Array} - An array of tasks for the specified bucket.
 */
function getTasksPerBucket(currentBucket) {
	let tasks = [];
	if (filteredTasks.length == 0) {
		tasks = addedTasks.filter((t) => t["bucket"] == currentBucket);
	} else {
		tasks = filteredTasks.filter((t) => t["bucket"] == currentBucket);
	}
	document.getElementById(currentBucket).innerHTML = "";
	return tasks;
}

/**
 * Extracts task variables from the specified tasks array at the given index.
 *
 * @param {Array} tasks - The array of tasks from which variables are extracted.
 * @param {number} index - The index of the task in the array.
 * @returns {Array} - An array containing task variables in the order:
 *   [id, bucket, title, description, prio, category, subtasks, assigneds, duedate, rawDuedate].
 */
function getTaskVariables(tasks, index) {
	let task = tasks[index];
	let id = task["id"];
	let bucket = task["bucket"];
	let title = task["title"];
	let description = task["description"];
	let prio = task["prio"];
	let category = task["category"];
	let subtasks = task["subtask"];
	let assigneds = task["assigned"];
	let duedate = formatDueDate(task["duedate"]);
	let rawDuedate = task["duedate"];
	return [id, bucket, title, description, prio, category, subtasks, assigneds, duedate, rawDuedate];
}

/**
 * Loads a card into the specified bucket with task details.
 * - Load the category color using the loadCategoryColor function.
 * - Load subtask progress using the loadSubtaskProgressBar function.
 * - Load assigned individuals using the loadAssigneds function.
 * - Load assigned individuals using the loadAssigneds function.
 *
 * @param {string} id - The ID of the task.
 * @param {string} bucket - The bucket where the card is loaded.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} prio - The priority of the task.
 * @param {string} category - The category of the task.
 * @param {Array} subtasks - An array of subtasks for the task.
 * @param {Array} assigneds - An array of assigned individuals for the task.
 * @returns {void}
 */
function loadCard(id, bucket, title, description, prio, category, subtasks, assigneds) {
	let categoryColor = loadCategoryColor(category);
	document.getElementById(bucket).innerHTML += generateCardHTML(id, title, description, category, categoryColor);
	loadSubtaskProgressBar(subtasks, id);

	addAssignedsBadgesToCard(assigneds, id);
	loadCardPrioIcon(prio, id);
}

/**
 * Loads a "No Tasks" label into the specified bucket if the bucket has no tasks.
 * - Check if the inner HTML of the bucket is empty.
 * - Format the bucket name for the label using the formatNoTaskLabelString function.
 * - Load the "No Tasks" label HTML into the inner HTML of the specified bucket.
 *
 * @param {string} bucket - The bucket to check for tasks and where the label is loaded.
 * @returns {void}
 */
function loadNoTasksLabel(bucket) {
	let taskColumn = document.getElementById(bucket);
	if (taskColumn.innerHTML === "") {
		let formatBucket = formatNoTaskLabelString(bucket);
		taskColumn.innerHTML = generateNoTaskHTML(formatBucket);
	}
}

/**
 * Loads subtask progress into the specified task's subtasks container.
 * - Check if there are any subtasks.
 * - Count the number of completed subtasks using the loadSubtaskAreDone function.
 * - Load the subtask progress HTML into the specified task's subtasks container.
 *
 * @param {Array} subtasks - An array of subtasks for the task.
 * @param {string} id - The ID of the task.
 * @returns {void}
 */
function loadSubtaskProgressBar(subtasks, id) {
	let allSubtask = subtasks.length;
	let done = loadSubtaskAreDone(subtasks);
	if (allSubtask > 0) {
		document.getElementById(`subtasks_container_${id}`).innerHTML = generateSubtaskProgressHTML(allSubtask, done);
	}
}

/**
 * Loads assigned individuals' badges into the specified task's assigneds container.
 *  - Extract variables using the getVariableForAssignedsUserBadge function.
 *  - Check if the current index is within the addLimit.
 *  - Add the assigned badge using the renderAssignedBadge function.
 *  - Add a limit badge using the renderAssignedBadgeWithLimit function.
 *
 * @param {Array} assigneds - An array of assigned individuals for the task.
 * @param {string} id - The ID of the task.
 * @returns {void}
 */
function addAssignedsBadgesToCard(assigneds, id) {
	for (let i = 0; i < assigneds.length; i++) {
		let [badgeColor, userBadge, assignedLimit, addLimit] = getVariableForAssignedsUserBadge(assigneds, i);
		if (i <= addLimit) {
			renderAssignedBadge(userBadge, badgeColor, id);
		} else if (i == assignedLimit && assigneds.length > 6) {
			renderAssignedBadgeWithLimit(id, assigneds, assignedLimit);
		}
	}
}

/**
 * Retrieves variables for assigned individuals' badges based on the specified array and index.
 * - Get the badge color using the getUserColor function.
 * - Get the assigned user name from the array.
 * - Generate the user badge using the generateUserBadge function.
 * - Calculate the assignedLimit (last index) and addLimit for conditions.
 *
 * @param {Array} assigneds - An array of assigned individuals for the task.
 * @param {number} i - The index of the assigned individual in the array.
 * @returns {Array} - An array containing variables in the order: [badgeColor, userBadge, assignedLimit, addLimit].
 */
function getVariableForAssignedsUserBadge(assigneds, i) {
	let badgeColor = getUserColor(assigneds, i);
	let assignedUserName = assigneds[i];
	let userBadge = generateUserBadge(assignedUserName);
	let assignedLimit = assigneds.length - 1;
	let addLimit = 5;
	return [badgeColor, userBadge, assignedLimit, addLimit];
}

/**
 * Adds an assigned badge to the specified task's assignment container.
 * - Append the assigned badge HTML to the assignment container of the specified task.
 *
 * @param {string} userBadge - The HTML content of the assigned individual's badge.
 * @param {string} badgeColor - The color of the assigned individual's badge.
 * @param {string} id - The ID of the task.
 * @returns {void}
 */
function renderAssignedBadge(userBadge, badgeColor, id) {
	document.getElementById(`task_assignment_container_${id}`).innerHTML += generateAssignedBadgeHTML(userBadge, badgeColor);
}

/**
 * Adds a limit badge to the specified task's assignment container indicating additional assigned individuals.
 * - Calculate the limit based on the difference between assigned individuals and the visible limit.
 * - Append the limit badge HTML to the assignment container of the specified task.
 *
 * @param {string} id - The ID of the task.
 * @param {Array} assigneds - An array of assigned individuals for the task.
 * @returns {void}
 */
function renderAssignedBadgeWithLimit(id, assigneds) {
	let limit = assigneds.length - 6;
	document.getElementById(`task_assignment_container_${id}`).innerHTML += `<div class="assigned-limit">+${limit}</div>`;
}

/**
 * Loads a priority icon into the specified task's priority icon container based on the priority level.
 * - Get the task priority icon container element.
 * - Check the priority level and set the inner HTML accordingly.
 *
 * @param {string} prio - The priority level of the task.
 * @param {string} id - The ID of the task.
 * @returns {void}
 */
function loadCardPrioIcon(prio, id) {
	let taskPrioIcon = document.getElementById(`task_prio_img_${id}`);
	if (prio === "Urgent") {
		taskPrioIcon.innerHTML = generateUrgentPrioIcon();
	} else if (prio === "Medium") {
		taskPrioIcon.innerHTML = generateMediumPrioIcon();
	} else if (prio === "Low") {
		taskPrioIcon.innerHTML = generateLowPrioIcon();
	}
}

/**
 * Counts the number of completed subtasks in the specified array.
 *  - Iterate through subtasks and increment 'doneSubtask' for each completed subtask.
 *
 * @param {Array} subtasks - An array of subtasks for the task.
 * @returns {number} - The number of completed subtasks.
 */
function loadSubtaskAreDone(subtasks) {
	let doneSubtask = 0;
	for (let i = 0; i < subtasks.length; i++) {
		let subtask = subtasks[i];
		if (subtask.subdone) {
			doneSubtask++;
		}
	}
	return doneSubtask;
}

/**
 * Retrieves the color associated with the specified category.
 *
 * @param {string} category - The category for which to retrieve the color.
 * @returns {string} - The color associated with the category.
 */
function loadCategoryColor(category) {
	if (category === "Technical Task") {
		return "#1fd7c1";
	} else if (category === "User Story") {
		return "#0038FF";
	}
}

/**
 * Displays the element with the specified ID by removing the "d-none" class.
 *
 * @param {string} id - The ID of the element to display.
 * @returns {void}
 */
function show(id) {
	document.getElementById(id).classList.remove("d-none");
}

/**
 * Hides the element with the specified ID by adding the "d-none" class.
 *
 * @param {string} id - The ID of the element to hide.
 * @returns {void}
 */
function hide(id) {
	document.getElementById(id).classList.add("d-none");
}
/**
 * Displays a frame by performing the following actions:
 * - Adds a fixed background to the main container using the addFixedBackround function.
 * - Adds an overlay background using the addOverlayBg function.
 * - Displays the element with the specified ID using the show function.
 *
 * @param {string} id - The ID of the frame to display.
 * @returns {void}
 */
function showFrame(id) {
	hide("sub_menu");
	addFixedBackround("main_container_board");
	addOverlayBg(id);
	show(id);
}

/**
 * Asynchronously deletes a task by performing the following actions:
 * - Filters out the task with the specified ID from the addedTasks array.
 * - Updates the addedTasks array with the filtered tasks.
 * - Hides the task open overlay frame using the hideTaskOpen function.
 * - Reloads the board using the loadBoard function.
 *
 * @param {string} TaskID - The ID of the task to delete.
 * @returns {Promise<void>} - A promise that resolves when the task is deleted and the board is reloaded.
 */
async function deleteTask(TaskID) {
	let updatedAddedTasks = addedTasks.filter((task) => task.id !== TaskID);
	addedTasks = updatedAddedTasks;
	updateTaskID();
	hideTaskOpen("task_open_overlay_frame");
	loadBoard();
}

/**
 * Updates the task IDs in the addedTasks array.
 *
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Iterate through the addedTasks array.
 * 2. For each task, update its ID to match its index in the array.
 */
function updateTaskID() {
	for (let i = 0; i < addedTasks.length; i++) {
		let task = addedTasks[i];
		task["id"] = i;
	}
}

/**
 * returns the completed subtasks as a percentage
 *
 * @param {int} allSubtask - All stubtasks of a task
 * @param {*} done  - all completed subtasks of a task
 * @returns
 */
function generatePercentInWidth(allSubtask, done) {
	let percentInWidth = (done / allSubtask) * 100;
	return percentInWidth;
}

/**
 * Formats a string for the "No Tasks" label by capitalizing the first letter and replacing dashes with spaces.
 *
 * @param {string} str - The string to format.
 * @returns {string} - The formatted string.
 *
 * Steps:
 * 1. Capitalize the first letter of the string.
 * 2. Replace dashes with spaces in the formatted string.
 */
function formatNoTaskLabelString(str) {
	str = str.charAt(0).toUpperCase() + str.slice(1);
	let formattedStr = str.replace("-", " ");
	return formattedStr;
}

/**
 * Converts the date to the correct format
 * @param {string} dueDate - Contains the date from the DueDate specification
 * @returns
 */
function formatDueDate(dueDate) {
	if (dueDate.includes("-")) {
		let dateParts = dueDate.split("-");
		let duedate = dateParts[2] + "/" + dateParts[1] + "/" + dateParts[0];
		return duedate;
	}
	return dueDate;
}

/**
 * Asynchronously clears the remote storage by resetting the 'users' array and updating the storage.
 *
 * Steps:
 * 1. Reset the 'users' array.
 * 2. Update the 'users' array in the storage using the setItem function.
 *
 * @returns {Promise<void>} - A promise that resolves when the remote storage is cleared.
 */
async function clearRemoteStorage() {
	users = [];
	await setItem("users", JSON.stringify(users));
}

/**
 * Searches for tasks based on the entered search term and updates the board accordingly.
 *
 * Steps:
 * 1. Retrieve the search term from the 'find_task' input field.
 * 2. Clear the board using the clearBoard function.
 * 3. Filter tasks based on whether their title contains the search term (case-insensitive).
 * 4. Update the 'filteredTasks' array with the filtered tasks.
 * 5. Reload the board using the loadBoard function.
 * 6. Display an error note if no tasks are found using the errorNoteSearchTask function.
 *
 * @returns {void}
 */
function searchTask() {
	let searchTerm = find_task.value;
	clearBoard();
	filteredTasks = addedTasks.filter(
		(t) => t["title"].toLowerCase().includes(searchTerm.toLowerCase()) || t["description"].toLowerCase().includes(searchTerm.toLowerCase())
	);
	loadBoard();
	errorNoteSearchTask("no_task_found");
}

/**
 * Searches for tasks on mobile devices based on the entered search term and updates the board accordingly.
 *
 * Steps:
 * 1. Retrieve the search term from the 'find_task_mobile' input field.
 * 2. Clear the board using the clearBoard function.
 * 3. Filter tasks based on whether their title contains the search term (case-insensitive).
 * 4. Update the 'filteredTasks' array with the filtered tasks.
 * 5. Reload the board using the loadBoard function.
 * 6. Display an error note if no tasks are found using the errorNoteSearchTask function.
 *
 * @returns {void}
 */
function searchTaskMobile() {
	let searchTerm = find_task_mobile.value;
	clearBoard();
	filteredTasks = addedTasks.filter(
		(t) => t["title"].toLowerCase().includes(searchTerm.toLowerCase()) || t["description"].toLowerCase().includes(searchTerm.toLowerCase())
	);
	loadBoard();
	errorNoteSearchTask("no_task_found_mobile");
}

/**
 * Displays an error note for the search task if no tasks are found.
 *
 * Steps:
 * 1. Check if the 'filteredTasks' array is empty.
 * 2. If empty, display the error note with the specified ID.
 *
 * @param {string} searchID - The ID of the error note element.
 * @returns {void}
 */
function errorNoteSearchTask(searchID) {
	if (filteredTasks.length == 0) {
		document.getElementById(searchID).style.display = "block";
	}
}

/**
 * Clears the board by emptying the inner HTML of each bucket element.
 *
 * Steps:
 * 1. Iterate through each bucket.
 * 2. Empty the inner HTML of the bucket element.
 *
 * @returns {void}
 */
function clearBoard() {
	for (let i = 0; i < buckets.length; i++) {
		let bucket = buckets[i];
		document.getElementById(bucket).innerHTML = "";
	}
}

/**
 * Closes the filter and clears the search-related elements if the search term is empty.
 *
 * Steps:
 * 1. Retrieve the search term from the 'find_task' input field and convert it to lowercase.
 * 2. Check if the search term is empty.
 * 3. If empty, hide the "No Tasks Found" error note, reset the 'filteredTasks' array, and reload the board.
 *
 * @returns {void}
 */
function closeFilter() {
	let searchTerm = find_task.value;
	searchTerm = searchTerm.toLowerCase();
	if (searchTerm.length == 0) {
		document.getElementById("no_task_found").style.display = "none";
		filteredTasks = [];
		loadBoard();
	}
}

/**
 * Prevents event propagation to avoid undesired event forwarding.
 *
 * @param {Event} event - The event object.
 * @returns {void}
 */
function doNotForward(event) {
	event.stopPropagation();
}
