let isClicked = false;
let fillColor = "";
let isActive = false;
let newTask = {};

/**
 * Changes the color of the priority button and updates the global priority button ID.
 *
 * @param {string} prioButtonID - The ID of the priority button to change the color.
 * @param {boolean} isClicked - A flag indicating whether the button is clicked.
 * @param {number} taskID - The ID of the task associated with the priority button.
 * @param {string} prio - The priority value associated with the button.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. If the button is not clicked (initial state), sets the color and updates the global priority button ID.
 * 2. If the button is clicked, updates the global priority button ID.
 * 3. Checks if the button is active and has the same ID as the global priority button.
 *    - If true, resets the button color.
 *    - If false, sets the color and updates the global priority button ID.
 */
function changePrioBtnColor(prioButtonID, isClicked, taskID, prio) {
	if (!isClicked) {
		setButtonColor(prioButtonID);
		globalPrioButtonID = prioButtonID;
	} else {
		setGlobalPrioButtonID(prioButtonID);
		if (isActive && prioButtonID == globalPrioButtonID) {
			resetButtonColor();
		} else {
			setButtonColor(prioButtonID);
			globalPrioButtonID = prioButtonID;
		}
	}
}

/**
 * Resets the priority button color and related flags and variables.
 *
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Clears the priority button color using the clearPrioButtonColor function.
 * 2. Sets the isActive flag to false.
 * 3. Sets the isClicked flag to false.
 * 4. Sets the globalPrioButtonID to an empty string.
 */
function resetButtonColor() {
	clearPrioButtonColor();
	isActive = false;
	isClicked = false;
	globalPrioButtonID = "";
}

/**
 * Sets the color for the specified priority button.
 *
 * @param {string} prioButtonID - The ID of the priority button to set the color for.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Clears the priority button color using the clearPrioButtonColor function.
 * 2. Constructs the SVG IDs for the priority button.
 * 3. Retrieves the SVG paths using the constructed IDs.
 * 4. Gets the fill color from one of the SVG paths.
 * 5. Changes the color of both SVG paths using the changeSVGPathColor function.
 * 6. Changes the color classes of the priority button using the changeColorClasses function.
 */
function setButtonColor(prioButtonID) {
	clearPrioButtonColor();
	let proSVG1 = prioButtonID + "-svg1";
	let proSVG2 = prioButtonID + "-svg2";
	let path1 = document.getElementById(proSVG1);
	let path2 = document.getElementById(proSVG2);
	fillColor = path1.getAttribute("fill");
	let button = document.getElementById(prioButtonID);
	changeSVGPathColor(path1);
	changeSVGPathColor(path2);
	changeColorClasses(button, prioButtonID);
}

/**
 * Sets the global priority button ID if it is currently empty.
 *
 * @param {string} prioButtonID - The ID of the priority button to set as the global ID.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Checks if the global priority button ID is currently empty.
 * 2. If empty, sets the global priority button ID to the provided prioButtonID.
 */
function setGlobalPrioButtonID(prioButtonID) {
	if (globalPrioButtonID == "") {
		globalPrioButtonID = prioButtonID;
	}
}

/**
 * Changes the color of an SVG path based on the current fill color.
 *
 * @param {Element} path - The SVG path element to change the color of.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Checks the current fill color of the SVG path.
 * 2. If the fill color is "white," sets the fill color to the stored fillColor and activates the element.
 * 3. If the fill color is not "white," sets the fill color to "white" and deactivates the element.
 */
function changeSVGPathColor(path) {
	if (fillColor == "white") {
		path.setAttribute("fill", fillColor);
		isActive = true;
	} else {
		path.setAttribute("fill", "white");
		isActive = false;
	}
}

/**
 * Changes the color classes of a button based on the current state and priority.
 *
 * @param {Element} button - The button element to change the color classes of.
 * @param {string} prioButtonID - The ID of the priority button.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Checks if the button is clicked or the fill color is not "white".
 * 2. If true, sets the button text color to white and updates the background color based on the priority.
 * 3. If false, resets the button background and text color to default values.
 */
function changeColorClasses(button, prioButtonID) {
	if (isClicked || fillColor !== "white") {
		button.style.color = "#ffffff";
		if (prioButtonID.includes("low")) {
			button.style.backgroundColor = "#7AE229";
		} else if (prioButtonID.includes("medium")) {
			button.style.backgroundColor = "#FFA800";
		} else if (prioButtonID.includes("urgent")) {
			button.style.backgroundColor = "#FF3D00";
		}
		isActive = true;
	} else {
		button.style.backgroundColor = "#fffff";
		button.style.color = "#000000";
		isActive = false;
	}
}

/**
 * Clears the color of the priority button by resetting background and SVG colors.
 *
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Resets the background color for the "Add Task" priority buttons.
 * 2. Resets the SVG colors for the "Add Task" priority buttons.
 */
function clearPrioButtonColor() {
	resetBgColorAddTask();
	resetSVGColorAddTask();
}

/**
 * Resets the background color for the "Add Task" priority buttons.
 *
 * @returns {void} - No return value.
 */
function resetBgColorAddTask() {
	document.getElementById("urgent-btn").style.backgroundColor = "#ffffff";
	document.getElementById("urgent-btn").style.color = "#000000";
	document.getElementById("medium-btn").style.backgroundColor = "#ffffff";
	document.getElementById("medium-btn").style.color = "#000000";
	document.getElementById("low-btn").style.backgroundColor = "#ffffff";
	document.getElementById("low-btn").style.color = "#000000";
}

/**
 * Resets the SVG color for the "Add Task" priority buttons.
 *
 * @returns {void} - No return value.
 */
function resetSVGColorAddTask() {
	document.getElementById("low-btn-svg1").setAttribute("fill", "#7AE229");
	document.getElementById("low-btn-svg2").setAttribute("fill", "#7AE229");
	document.getElementById("medium-btn-svg1").setAttribute("fill", "#FFA800");
	document.getElementById("medium-btn-svg2").setAttribute("fill", "#FFA800");
	document.getElementById("urgent-btn-svg1").setAttribute("fill", "#FF3D00");
	document.getElementById("urgent-btn-svg2").setAttribute("fill", "#FF3D00");
}

/**
 * Sets the minimum date for a calendar input to the current date.
 *
 * @param {string} id - The ID of the calendar input element.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Get the current date in ISO format (yyyy-mm-dd).
 * 2. Set the "min" attribute of the calendar input with the provided ID to the current date.
 */
function setTodayDateForCalendar(id) {
	let today = new Date().toISOString().split("T")[0];
	document.getElementById(id).setAttribute("min", today);
}

/**ANPASSEN
 * Loads and displays the add task slider on the task overlay background.
 *
 * @param {string} boardColumnID - The ID of the board column to which the task will be added.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Get the task overlay background element.
 * 2. Create a new task ID using the createNewTaskID function.
 * 3. Clear the task overlay content.
 * 4. Create a new task in the specified board column with the generated task ID using createNewTask.
 * 5. Show the task overlay frame.
 * 6. Add an overlay background to the task overlay.
 * 7. Generate and set the HTML for the add task slider with the generated task ID.
 * 8. Set the minimum date for the calendar input in the slider using setTodayDateForCalendar.
 * 9. Initialize the add task slider with the generated task ID using initAddTaskSlider.
 * 10. Slide in the add task overlay frame.
 * 11. Load the default priority "Medium" using loadPrioOnEditTask.
 */
function loadAddTaskSlider(boardColumnID) {
	let taskOverlay = document.getElementById("task_overlay_bg");
	taskOverlay.innerHTML = "";
	//createNewTask(boardColumnID);
	showFrame("task_overlay_bg");
	addOverlayBg("task_overlay_bg");
	taskOverlay.innerHTML = generateAddTaskSliderHTML(boardColumnID);
	setTodayDateForCalendar("date_field");
	loadAllUsersForContactOnAssignedTo(assignedID, "et_contact_overlay");
	//initAddTaskSlider(taskID);
	frameSlideIn("task_open_overlay_frame");
	changePrioColor("Medium");
	//loadPrioOnEditTask("Medium");
}

/**LÖSCHEN
 * Initializes the add task slider with the specified task ID.
 *
 * @param {string} taskID - The ID of the task being added.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Get the assigned contacts for the task from the addedTasks array.
 * 2. Load all contacts for contact on assigned to using loadAllUsersForContactOnAssignedTo.
 */
function initAddTaskSlider(taskID) {
	loadAllUsersForContactOnAssignedTo(assignedID, "et_contact_overlay", taskID);
}

/**LÖSCHEN
 * Creates a new task with the specified board and task IDs.
 *
 * @param {number} boardColumnID - The ID of the board column to which the task is assigned.
 *
 * @returns {Object} - The newly created task object.
 *
 * @description
 * This function creates a new task object with the following properties:
 * 1. `id`: The ID of the task.
 * 2. `bucket`: The ID of the board column.
 * 3. `title`: The title of the task (initially empty).
 * 4. `description`: The description of the task (initially empty).
 * 5. `assigned`: An array of assigned contacts (initially empty).
 * 6. `duedate`: The due date of the task (initially empty).
 * 7. `prio`: The priority of the task (initially empty).
 * 8. `category`: The category of the task (initially empty).
 * 9. `subtasks`: An array of subtasks (initially empty).
 */
function createNewTask(boardColumnID) {
	newTask = {
		bucket: boardColumnID,
		title: "",
		description: "",
		assigned: assignedID,
		duedate: "",
		prio: "",
		category: "",
		subtasks: [],
	};
}

/**LÖSCHEN
 * Checks if a new task object is empty.
 *
 * @param {Object} obj - The task object to be checked.
 * @returns {boolean} - True if the object is empty, otherwise false.
 *
 * @description
 * This function performs the following steps:
 * 1. Uses Object.keys() to get an array of all own enumerable properties of the object.
 * 2. Checks the length of this array.
 * 3. Returns true if the length is 0 (the object is empty), otherwise false.
 */
function isNewTaskEmpty(obj) {
	return Object.keys(obj).length === 0;
}

/**LÖSCHEN
 * Deletes a new task from the addedTasks array.
 *
 * @param {number} taskID - The ID of the task to delete.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Removes the task with the specified ID from the addedTasks array.
 */
function deleteNewTask(taskID) {
	addedTasks.splice(taskID, 1);
}

/**
 * Submits a form for the specified bucket (board column).
 *
 * @param {string} bucket - The identifier of the bucket (board column) for which the form is submitted.
 * @returns {void}
 *
 */
function submitForm(bucket) {
	getRequiredFields(bucket);
}

/**
 * Retrieves and processes the required fields for a task in the specified bucket.
 *
 * @param {string} bucket - The identifier of the bucket (board column) for which the task is being created or edited.
 * @returns {void}
 *
 */
function getRequiredFields(bucket) {
	let titleInput = document.getElementById("enter_title_field").value;
	let dueDateInput = document.getElementById("date_field").value;
	let categoryInput = document.getElementById("select_category_field").value;
	checkRequiredFields(titleInput, dueDateInput, categoryInput, bucket);
}

/**
 * Checks if the required fields are filled for a task and takes appropriate actions.
 *
 * @param {string} titleInput - The value of the title input for the task.
 * @param {string} dueDateInput - The value of the due date input for the task.
 * @param {string} categoryInput - The value of the category input for the task.
 * @param {string} bucket - The identifier of the bucket (board column) for the task.
 * @returns {void}
 */
function checkRequiredFields(titleInput, dueDateInput, categoryInput, bucket) {
	if (titleInput !== "" && dueDateInput !== "" && categoryInput !== "") {
		addNewTask(bucket);
	} else {
		if (titleInput === "") {
			show("title_error_slider");
			document.getElementById("title_input_ed_task").classList.add("required-border");
		}
		if (dueDateInput === "") {
			show("date_error_slider");
			document.getElementById("calendar_edit_task").classList.add("required-border");
		}
		if (categoryInput === "") {
			show("category_error_slider");
			document.getElementById("select_category").classList.add("required-border");
		}
	}
}

/**
 * Creates a new task, adds it to the specified bucket, and updates the board.
 *
 * @async
 * @param {string} bucket - The bucket to which the new task should be added.
 * @returns {Promise<void>} A promise that resolves when the task is added and the board is updated.
 *
 */
async function addNewTask(bucket) {
	show("task_added_to_board");
	createTask(bucket);
	await loadAddedTasksFromStorage();
	await initBoard();
	hideTaskOpen("task_open_overlay_frame");
	setTimeout(function () {
		hide("task_added_to_board");
	}, 350);
}

/**
 * Updates the category of a task.
 *
 * @param {number} taskID - The ID of the task to update.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Retrieves the selected category value from the "select_category" element.
 * 2. Updates the category property of the task in the addedTasks array.
 */
function updateTaskCategory(taskID) {
	let categoryValue = document.getElementById("select_category").value;
	addedTasks[taskID]["category"] = categoryValue;
}
// LÖSCHEN
function updateOpenTaskTitle(taskID) {
	let titleValue = document.getElementById("title_input_ed_task").value;
	addedTasks[taskID]["title"] = titleValue;
}

function updateOpenTaskDesc(taskID) {
	let descValue = document.getElementById("description_ed_task").value;
	addedTasks[taskID]["description"] = descValue;
}

function updateOpenTaskDueDate(taskID) {
	let dueDateValue = document.getElementById("calendar_edit_task").value;
	addedTasks[taskID]["duedate"] = dueDateValue;
}

function createSubtasks() {
	let subtask = document.getElementById("add_new_subtask_field").value.trim();
	if (subtask !== "") {
		addedSubtasks.push({ subdone: false, subtitle: subtask });
		renderAddedSubtasksHTML();
		subtask.value = "";
	}
}

function renderAddedSubtasksHTML() {
	let subtaskContainer = document.getElementById("subtask_lists");
	subtaskContainer.innerHTML = "";
	for (let i = 0; i < addedSubtasks.length; i++) {
		let subtitle = addedSubtasks[i].subtitle;
		subtaskContainer.innerHTML += generateSubtaskListItemHTML(
			subtitle,
			i,
			0,
			"subtask_listitem_",
			"subtask_edit_container",
			"subtask_edit_input",
			"subtask_lists"
		);
	}
	// subtaskContainer.classList.remove("d-none");
	// closeSubtaskIcons();
}
