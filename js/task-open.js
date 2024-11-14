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
        let subtasks = task["subtask"];
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
        let [taskID, bucket, title, description, prio, category, subtasks, assigneds, duedate] = getTaskVariables(
            tasks,
            index
        );

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
 * @param {string} assigneds - contains all Assigneds users per task
 * @param {date} duedate - contains the due date
 */
function loadTask(taskID, title, description, prio, category, subtasks, assigneds, duedate) {
    let categoryColor = loadCategoryColor(category);
    document.getElementById("task_overlay_bg").innerHTML = generateOpenTaskHTML(
        taskID,
        title,
        description,
        category,
        categoryColor,
        duedate
    );
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
 * Loads all Assigneds users from the respective open task
 *
 * @param {string} assigneds - contains all Assigneds users per task
 * @param {int} taskID - transfers the task ID
 */
function loadAssignedsOpenTask(assigneds, taskID) {
    let assigned = document.getElementById("assigned_to_contacts_task_open");
    assigned.innerHTML = "";
    for (let i = 0; i < assigneds.length; i++) {
        let badgeColor = getUserColor(assigneds, i);
        let assignedUserName = assigneds[i];
        let userBadge = generateUserBadge(assignedUserName);
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
 * changes the status of the subtask whether it is finished or still open
 *
 * @param {string} elementID - contains all HTML attributes of the checkbox input field
 * @param {int} subtaskNumber - contains the subtask number
 * @param {int} taskID - transfers the task ID
 */
function changeSubtaskConfirmation(elementID, subtaskNumber, taskID) {
    let checkSubtask = document.getElementById(elementID);
    let subtask = addedTasks[taskID].subtask[subtaskNumber];
    if (checkSubtask.checked) {
        subtask["subdone"] = true;
    } else if (!checkSubtask.checked) {
        subtask["subdone"] = false;
    }
}

/**
 * Gets the specified user color for the user badge
 *
 * @param {string} assigneds - contains the assigned array of the respective task
 * @param {int} index - contains the index number of the required Assigned User
 * @returns
 */
function getUserColor(assigneds, index) {
    let assignedName = assigneds[index];
    let filteredUser = users.filter((t) => t["name"] === assignedName);
    if (filteredUser.length > 0) {
        return filteredUser[0]["bgcolor"];
    }
}
