/**
 * Saves a new contact to storage.
 * @async
 * @param {Object} addContact - The contact object to be saved.
 * @returns {Promise<Object|boolean>} The saved contact object if successful, false otherwise.
 * @throws {Error} If there's an error during the saving process.
 */
async function saveNewContactToStorage(addContect) {
	try {
		return await setItem(addContect, "contacts");
	} catch (error) {
		if (error.email) errorMsgEmail(error.email[0]);
		if (error.phone) errorMsgPhone(error.phone[0]);
		return false;
	}
}

/**
 * Asynchronously loads added tasks from storage.
 *
 * @returns {Promise<void>} - A promise that resolves when added tasks are loaded.
 */
async function loadAddedTasksFromStorage() {
	try {
		addedTasks = await getItems("tasks");
		console.log("Loaded tasks:", addedTasks);
	} catch (e) {
		console.error("Loading Added Tasks error:", e);
	}
}

/**
 * Loads contacts from remote storage to the local array.
 */
async function loadContacts() {
	try {
		contacts = await getItems("combinedlist");
	} catch (e) {
		console.error("Loading error:", e);
	}
}

/**
 * Asynchronously updates a specific task in storage with changed properties.
 *
 * @async
 * @param {Object} changedItem - An object containing the properties of the task that have been changed.
 * @param {string} taskID - The ID of the task to be updated.
 * @returns {Promise<void>} A promise that resolves when the task has been successfully updated in storage.
 */
async function updatedAddedTaskToStorage(changedItem, taskID) {
	try {
		await patchItem(changedItem, "tasks", taskID);
	} catch (e) {
		console.error("Update Added Tasks error:", e);
	}
}

/**
 * Asynchronously updates a specific contact in storage with changed properties.
 *
 * @async
 * @param {Object} changedContact - An object containing the properties of the contact that have been changed.
 * @param {string|number} contactID - The ID of the contact to be updated.
 * @returns {Promise<void>} A promise that resolves when the contact has been successfully updated in storage.
 *
 */
async function updatedContactToStorage(changedContact, contactID) {
	try {
		await patchItem(changedContact, "contacts", contactID);
	} catch (e) {
		console.error("Update Contact error:", e);
	}
}

/**
 * Updates the user's profile in storage.
 * @async
 * @param {Object} changedProfile - The updated profile data.
 * @param {string|number} userID - The ID of the user whose profile is being updated.
 * @throws {Error} If there's an error during the update process.
 */
async function updatedProfileToStorage(changedProfile, userID) {
	try {
		await patchItem(changedProfile, "profile", userID);
	} catch (e) {
		console.error("Update Profile error:", e);
	}
}

/**
 * Asynchronously updates the subtasks of a specific task in storage.
 *
 * @async
 * @param {string} taskID - The ID of the task whose subtasks are being updated.
 * @param {Object} changedSubtask - An object containing the updated subtask information.
 * @returns {Promise<void>}
 */
async function updatedSubtaskToStorage(taskID, changedSubtask) {
	try {
		await patchItem(changedSubtask, "tasks", taskID);
	} catch (e) {
		console.error("Patch Added Tasks error:", e);
	}
}

/**
 * Asynchronously deletes a task from storage based on its ID.
 *
 * @async
 * @param {string|number} taskID - The unique identifier of the task to be deleted.
 * @returns {Promise<void>} A promise that resolves when the task has been successfully deleted from storage.
 */
async function deletesTaskInStorage(taskID) {
	try {
		await deleteItem("tasks", taskID);
	} catch (e) {
		console.error("Delete Task Error:", e);
	}
}

/**
 * Asynchronously deletes a contact from storage based on its ID.
 *
 * @async
 * @param {string|number} contactID - The unique identifier of the contact to be deleted.
 * @returns {Promise<void>} A promise that resolves when the contact has been successfully deleted from storage.
 */
async function deletesContactInStorage(contactID) {
	try {
		await deleteItem("contacts", contactID);
	} catch (e) {
		console.error("Delete Contact Error:", e);
	}
}
