let addedSubtasks = [];
let newAssigned = [];

/**
 * this function initializes task addition process by loading necessary data and setting up the interface
 */
async function initAddTask() {
  await loadUsers();
  await loadAddedTasks();
  loadCurrentUser();
  loadUserBadge();
  getDateToday();
  changePrioColor("Medium");
  initUserSelectField("et_contact_overlay");
  checkIfSendingIsPossible();
}

/**
 * this function loads asynchronously added tasks from local storage and updates the global addedTasks variable
 * if loading fails, logs an error to the console
 */
async function loadAddedTasks() {
  try {
    addedTasks = JSON.parse(await getItem("addedTasks"));
  } catch (e) {
    console.error("Loading Added Tasks error:", e);
  }
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
  for (let i = 0; i < users.length; i++) {
    let userName = users[i]["name"];
    let userBadge = generateUserBadge(userName);
    let badgeColor = users[i]["bgcolor"];
    if (newAssigned.includes(userName)) {
      contactsContainer.innerHTML += generateTaskAssigmentContactsHTML(userName, badgeColor, userBadge, i);
    } else {
      contactsContainer.innerHTML += generateTaskAssigmentContactsHTML(userName, badgeColor, userBadge, i);
    }
  }
}

/**
 * this function adds or removes elected contact based on checkbox status
 * @param {string} id - id of checkbox element
 * @param {number} i - index of the user in the users array
 * @param {string} newAssigned - array containing names of newly assigned contacts
 */
function addElectedContact(id, i, newAssigned) {
  let checkAssigned = document.getElementById(id);
  let userName = users[i]["name"];
  let deleteName = newAssigned.indexOf(userName);
  if (checkAssigned.checked) {
    newAssigned.push(userName);
  } else if (!checkAssigned.checked) {
    newAssigned.splice(deleteName, 1);
  }
  showSelectedContacts(newAssigned, "et_selected_contacts");
}

/**
 * this function displays selected contacts in designated container
 * @param {string} newAssigned - array containing the names of newly assigned contacts
 */
function showSelectedContacts(newAssigned) {
  let selectedContacts = document.getElementById("et_selected_contacts");
  selectedContacts.innerHTML = "";
  for (let i = 0; i < newAssigned.length; i++) {
    let userName = newAssigned[i];
    let userIndex = users.findIndex((user) => user.name === userName);
    if (userIndex !== -1) {
      let badgeColor = users[userIndex]["bgcolor"];
      let userBadge = generateUserBadge(userName);
      let selectedContactHTML = generateSelectedContactHTML(userName, badgeColor, userBadge, i);
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
 * this function handles subtask actions by obtaining the value from input field for adding new subtasks trimming input
 * and changing visibility of subtask icons. displaying subtask and clearing the input field
 */
function handleSubtaskActions() {
  let subtaskInput = document.getElementById("add_new_subtask_field");
  let input = document.getElementById("add_new_subtask_field");
  let subtask = subtaskInput.value.trim();
  changingSubtaskIcons();
  displaySubtasks();
  input.value = "";
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
}

/**
 * this function initaites editing subtask adjusting icons and focusing on input
 * @param {number} index - index of the subtask in addedSubtasks array
 */
function editAddedSubtask(index) {
  moveIconsForEditing(index);
  document.getElementById(`subtask_icons_1_${index}`).classList.add("d-none");
  document.getElementById(`check_dark_save_${index}`).classList.remove("d-none");
  let inputField = document.getElementById(`input_${index}`);
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
 * this function is clearing selected contacts by resetting newAssigned array and updating the display
 */
function clearSelectedContacts() {
  newAssigned = [];
  showSelectedContacts(newAssigned);
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
    if (
      titleField.value.trim().length > 0 && dateField.value.trim().length > 0 && categoryField.value.trim().length > 0
    ) {
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
 * this function creates new task, assigns a priority and stores it in the JSON data
 */
async function createTask() {
  let setNewTask = createNewTaskID();
  let selectedPriority = getSelectedPriority();
  await pushToJSON(setNewTask, selectedPriority);
  await setItem("addedTasks", JSON.stringify(addedTasks));
  createTaskMessage();
  setTimeout(() => {
    window.location.href = "board.html";
  }, 1000);
}

/**
 * tihs function adds new task to the JSON data
 * @param {string} setNewTask - id of new task
 * @param {string} selectedPriority - priority assigned to the task
 */
async function pushToJSON(setNewTask, selectedPriority) {
  addedTasks.push({
    id: setNewTask,
    bucket: "to-do",
    title: enter_title_field.value,
    description: enter_description_field.value,
    assigned: newAssigned,
    duedate: date_field.value,
    prio: selectedPriority,
    category: select_category_field.value,
    subtask: addedSubtasks,
  });
}

/**
 * this function generates new task id based on length of existing added task
 * @returns {number} - new task id
 */
function createNewTaskID() {
  let newTaskID;
  if (addedTasks.length !== 0) {
    newTaskID = addedTasks.length;
  } else {
    newTaskID = 0;
  }
  return newTaskID;
}