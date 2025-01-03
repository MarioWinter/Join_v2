/**
 * Loads the task information from the storage and shows the Task Open window
 *
 * @param {int} taskID - transfers the task ID
 */
function loadTaskOpen(taskID) {
	let tasks = addedTasks.filter((t) => t["id"] === taskID);
	document.getElementById("task_overlay_bg").innerHTML = "";
	for (let index = 0; index < tasks.length; index++) {
		let task = tasks[index];
		let title = task["title"];
		let description = task["description"];
		let prio = task["prio"];
		let duedate = formatDueDate(task["duedate"]);
		let category = task["category"];
		let subtasks = task["subtasks"];
		let assigneds = task["assigned"];
		showFrame("task_overlay_bg");
		addOverlayBg("task_overlay_bg");
		loadTask(taskID, title, description, prio, category, subtasks, assigneds, duedate);
		frameSlideIn("task_open_overlay_frame");
	}
}

/**
 * Re-renders the Open Task window after it has been updated by Edit Task
 *
 * @param {int} taskID - transfers the task ID
 */
function renderOpenTask(taskID) {
	let tasks = addedTasks.filter((t) => t["id"] === taskID);
	document.getElementById("task_overlay_bg").innerHTML = "";
	for (let index = 0; index < tasks.length; index++) {
		let [taskID, bucket, title, description, prio, category, subtasks, assigneds, duedate] = getTaskVariables(tasks, index);

		loadTask(taskID, title, description, prio, category, subtasks, assigneds, duedate);
	}
}

/**
 * renders the HTML templates for the Open Task
 *
 * @param {int} taskID - transfers the task ID
 * @param {string} title - contains the task title
 * @param {string} description - contains the task description
 * @param {string} prio - includes the task priority
 * @param {string} category - contains the task category
 * @param {string} subtasks - contains the subtasks
 * @param {string} assigneds - contains all Assigneds contacts per task
 * @param {date} duedate - contains the due date
 */
function loadTask(taskID, title, description, prio, category, subtasks, assigneds, duedate) {
	let categoryColor = loadCategoryColor(category);
	document.getElementById("task_overlay_bg").innerHTML = generateOpenTaskHTML(taskID, title, description, category, categoryColor, duedate);
	loadTaskOpenPrio(prio, "task_open_prio");
	loadAssignedsOpenTask(assigneds, taskID);
	loadSubtasks(subtasks, "task_overlay_subtasks_container", taskID);
}

/**
 * Loads the raw HTML button for the open task priority
 *
 * @param {string} prio - includes the task priority
 * @param {int} taskID - transfers the task ID
 */
function loadTaskOpenPrio(prio, taskID) {
	let taskPrioIcon = document.getElementById(taskID);
	if (prio === "Urgent") {
		taskPrioIcon.innerHTML = `<div>${prio}</div> ${generateUrgentPrioIcon()}`;
	} else if (prio === "Medium") {
		taskPrioIcon.innerHTML = `<div>${prio}</div> ${generateMediumPrioIcon()}`;
	} else if (prio === "Low") {
		taskPrioIcon.innerHTML = `<div>${prio}</div> ${generateLowPrioIcon()}`;
	}
}

/**
 * Loads all Assigneds contacts from the respective open task
 *
 * @param {string} assigneds - contains all Assigneds contacts per task
 * @param {int} taskID - transfers the task ID
 */
function loadAssignedsOpenTask(assigneds, taskID) {
	let assigned = document.getElementById("assigned_to_contacts_task_open");
	assigned.innerHTML = "";
	for (let i = 0; i < assigneds.length; i++) {
		let badgeColor = assigneds[i]["bgcolor"];
		let assignedUserName = assigneds[i]["username"];
		let userBadge = generateBadge(assignedUserName);
		assigned.innerHTML += generateAssigmentHTML(userBadge, badgeColor, assignedUserName, taskID);
	}
}

/**
 * Loads and renders all subtasks of the respective open task
 *
 * @param {string} subtasks - contains the subtask array of the respective task
 * @param {string} elementID - contains the subtask id of the subtask HTML container
 * @param {int} taskID - transfers the task ID
 */
function loadSubtasks(subtasks, elementID, taskID) {
	let subtasksContainer = document.getElementById(elementID);
	subtasksContainer.innerHTML = "";
	if (subtasks.length > 0) {
		for (let i = 0; i < subtasks.length; i++) {
			let subtask = subtasks[i];
			let subdone = subtask["subdone"];
			let subtitle = subtask["subtitle"];
			subtasksContainer.innerHTML += checkSubtask(subdone, subtitle, i, taskID);
		}
	} else {
		clearElement("label_task_open_subtask");
	}
}

/**
 * Checks whether a subtask is ready or not and loads the appropriate HTML template
 *
 * @param {boolean} subdone - contains true or false whether a subtask is finished or not
 * @param {string} subtitle - contains Subtask Title
 * @param {int} subtaskNumber - contains the subtask number
 * @param {int} taskID - transfers the task ID
 * @returns
 */
function checkSubtask(subdone, subtitle, subtaskNumber, taskID) {
	if (subdone) {
		return generateSubtasksCheckedHTML(subtitle, subtaskNumber, taskID);
	} else {
		return generateSubtasksHTML(subtitle, subtaskNumber, taskID);
	}
}

/**
 * Deletes the inner HTML text from the element
 *
 * @param {string} id - contains the relevant id of the HTML element
 */
function clearElement(id) {
	document.getElementById(id).innerHTML = "";
}

/**
 * Asynchronously updates the completion status of a subtask and saves the changes.
 *
 * @async
 * @param {string} elementID - The ID of the checkbox element for the subtask.
 * @param {number} subtaskNumber - The index of the subtask within the task's subtasks array.
 * @param {string} taskID - The ID of the task containing the subtask.
 * @returns {Promise<void>}
 *
 */
async function changeSubtaskConfirmation(elementID, subtaskNumber, taskID) {
	let checkSubtask = document.getElementById(elementID);
	let tasks = addedTasks.filter((t) => t["id"] === taskID);
	let subtask = tasks[0].subtasks[subtaskNumber];
	if (checkSubtask.checked) {
		subtask["subdone"] = true;
	} else if (!checkSubtask.checked) {
		subtask["subdone"] = false;
	}
	let subtasks = tasks[0]["subtasks"];
	await updatedSubtaskToStorage(taskID, createPatchSubtask(subtasks));
}

/**
 * Creates a patch object for updating subtasks.
 *
 * @param {Array<Object>} subtasks - The array of subtask objects to be updated.
 * @returns {Object} An object with a 'subtasks' property containing the provided subtasks array.
 *
 * @description
 * This function creates a simple object structure suitable for a PATCH request
 * to update the subtasks of a task. It wraps the provided subtasks array
 * in an object with a 'subtasks' key.
 *
 */
function createPatchSubtask(subtasks) {
	return {
		subtasks: subtasks,
	};
}
