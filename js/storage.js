let TOKEN = "";
const API_BASE_URL = "http://127.0.0.1:8000/api/v1";
checkIsLogedIn();

/**
 * Loads the token from local storage and stores it in the global variable TOKEN.
 * @global
 */
function loadTokenFromLocalStorage() {
	TOKEN = localStorage.getItem("token");
}

/**
 * Checks if the user is logged in by looking for a token in local storage.
 * If a token is found, it calls the loadTokenFromLocalStorage function
 * to load the token.
 */
function checkIsLogedIn() {
	if (localStorage.getItem("token")) {
		loadTokenFromLocalStorage();
		if (window.location.href.includes("index.html")) {
			window.location.href = "summary.html";
		}
	} else if (!window.location.href.includes("index.html")) {
		window.location.href = "index.html";
	}
}

/** setItem
 * Set an item in remote storage.
 * @param {string} key - The key of the item to be stored.
 * @param {any} value - The value of the item to be stored.
 * @returns {Promise<Object>} A Promise that resolves to the response from the server.
 */
async function setItem(data, endpoint) {
	const url = `${API_BASE_URL}/${endpoint}/`;

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Token ${TOKEN}`,
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw errorData;
		}

		return await response.json();
	} catch (error) {
		//console.error("API Error:", error.message || error);
		throw error;
	}
}

async function changeItem(data, endpoint, id) {
	let url = `${API_BASE_URL}/${endpoint}/${id}/`;
	return fetch(url, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Token ${TOKEN}`,
		},
		body: JSON.stringify(data),
	})
		.then((response) => response.json())
		.catch((error) => console.error("Fehler:", error));
}

async function patchItem(data, endpoint, id) {
	let url = `${API_BASE_URL}/${endpoint}/${id}/`;
	return fetch(url, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Token ${TOKEN}`,
		},
		body: JSON.stringify(data),
	})
		.then((response) => response.json())
		.catch((error) => console.error("Fehler:", error));
}

/**
 * Deletes an item from the specified endpoint using its ID.
 *
 * @async
 * @param {string} endpoint - The API endpoint for the item to be deleted.
 * @param {number|string} id - The ID of the item to be deleted.
 * @returns {Promise<Object|null>} A promise that resolves to the JSON response from the server if available, or null if the response is empty.
 * @throws {Error} Throws an error if the network request fails.
 */
async function deleteItem(endpoint, id) {
	let url = `${API_BASE_URL}/${endpoint}/${id}/`;
	return fetch(url, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Token ${TOKEN}`,
		},
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.text();
		})
		.then((text) => {
			return text ? JSON.parse(text) : null;
		})
		.catch((error) => {
			console.error("Error:", error);
			throw error;
		});
}

/** getItem
 * Retrieve an item from remote storage.
 * @param {string} key - The key of the item to be retrieved.
 * @returns {Promise<any>} A Promise that resolves to the value of the retrieved item.
 * @throws {string} Throws an error if the data with the specified key is not found.
 */
async function getItems(endpoint) {
	let url = `${API_BASE_URL}/${endpoint}/`;
	try {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Token ${TOKEN}`,
			},
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();

		return data;
	} catch (error) {
		console.error("Fehler:", error);
		throw error;
	}
}

async function sendLoginRequest(data) {
	const url = "http://127.0.0.1:8000/api/auth/login/";
	fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	})
		.then((response) => {
			if (!response.ok) {
				return response.json().then((errorData) => {
					//logInFailMsg();
					throw new Error(`Login failed: ${JSON.stringify(errorData)}`);
				});
			}
			return response.json();
		})
		.then((data) => {
			localStorage.setItem("currentUserIndex", data.user_id);
			localStorage.setItem("token", data.token);
			localStorage.setItem("username", data.username);
			localStorage.setItem("email", data.email);
			logInSuccedMsg();
		})
		.catch((error) => {
			console.error("Login failed:", error);
			logInFailMsg();
		});
}

async function sendRegistrationRequest(data) {
	const url = "http://127.0.0.1:8000/api/auth/registration/";
	fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	})
		.then((response) => {
			if (!response.ok) {
				if (response.email && response.email[0].includes("already exists")) {
					emailAlreadyTakenMessage();
				} else {
					registrationFailedMessage();
				}

				return response.json();
			}
		})
		.then((data) => {
			successfulRegistration();
		})
		.catch((error) => {
			registrationFailedMessage();
		});
}

/**
 * Saves new tasks to storage asynchronously.
 *
 * @async
 * @param {Object|Array} newTasks - The new task(s) to be saved to storage.
 * @returns {Promise<void>}
 */
async function saveNewTaskToStorage(newTasks) {
	try {
		await setItem(newTasks, "tasks");
	} catch (e) {
		console.error("Error saving new tasks:", e);
	}
}

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
