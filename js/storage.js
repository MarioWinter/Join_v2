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

/**
 * Creates a new item in the API.
 * @async
 * @param {Object} data - The data of the item to be created.
 * @param {string} endpoint - The API endpoint where the item should be created.
 * @returns {Promise<Object>} A Promise that resolves to the created item data from the API.
 * @throws {Error} If there's an error during the creation process or if the response is not OK.
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
			throw new Error(errorData.message || `Failed to create item. Status: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error("API Error:", error.message || error);
		throw error;
	}
}

/**
 * Updates an item in the API using the PUT method.
 * @async
 * @param {Object} data - The data to update the item with.
 * @param {string} endpoint - The API endpoint.
 * @param {string|number} id - The ID of the item to update.
 * @returns {Promise<Object>} The updated item data from the API.
 * @throws {Error} If there's an error during the update process.
 */
async function changeItem(data, endpoint, id) {
	const url = `${API_BASE_URL}/${endpoint}/${id}/`;

	try {
		const response = await fetch(url, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Token ${TOKEN}`,
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Failed to update item");
		}

		return await response.json();
	} catch (error) {
		console.error("Update error:", error.message);
		throw error;
	}
}

/**
 * Updates an item in the API and returns the updated data.
 * @async
 * @param {Object} data - The data to update.
 * @param {string} endpoint - The API endpoint.
 * @param {string|number} id - The ID of the item to update.
 * @returns {Promise<Object>} The updated data from the API.
 * @throws {Error} If there's an error during the update process.
 */
async function patchItem(data, endpoint, id) {
	const url = `${API_BASE_URL}/${endpoint}/${id}/`;

	try {
		const response = await fetch(url, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Token ${TOKEN}`,
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Failed to update item");
		}

		const responseData = await response.json();

		if (responseData.type === "user") {
			localStorage.setItem("username", responseData.username);
			localStorage.setItem("email", responseData.email);
		}

		return responseData;
	} catch (error) {
		console.error("Update error:", error.message);
		throw error;
	}
}

/**
 * Deletes an item from the specified endpoint using its ID.
 *
 * @async
 * @param {string} endpoint - The API endpoint for the item to be deleted.
 * @param {number|string} id - The ID of the item to be deleted.
 * @returns {Promise<Object|null>} A promise that resolves to the JSON response from the server if available, or null if the response is empty.
 * @throws {Error} Throws an error if the network request fails or if the response is not OK.
 */
async function deleteItem(endpoint, id) {
	const url = `${API_BASE_URL}/${endpoint}/${id}/`;

	try {
		const response = await fetch(url, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Token ${TOKEN}`,
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const text = await response.text();
		return text ? JSON.parse(text) : null;
	} catch (error) {
		console.error("Delete error:", error.message);
		throw error;
	}
}

/**
 * Retrieves items from a specified API endpoint.
 *
 * @async
 * @param {string} endpoint - The API endpoint from which to retrieve items.
 * @returns {Promise<Object[]>} A Promise that resolves to an array of items retrieved from the endpoint.
 * @throws {Error} Throws an error if the network request fails or if the response is not OK.
 */
async function getItems(endpoint) {
	const url = `${API_BASE_URL}/${endpoint}/`;

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

		return await response.json();
	} catch (error) {
		console.error("Fetch error:", error.message);
		throw error;
	}
}

/**
 * Sends a login request to the server and handles the response.
 *
 * @async
 * @param {Object} data - The login credentials (usually username/email and password).
 * @throws {Error} Throws an error if the login request fails or if the response is not OK.
 */
async function sendLoginRequest(data) {
	const url = "http://127.0.0.1:8000/api/auth/login/";

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(`Login failed: ${JSON.stringify(errorData)}`);
		}

		const responseData = await response.json();

		localStorage.setItem("currentUserIndex", responseData.user_id);
		localStorage.setItem("token", responseData.token);
		localStorage.setItem("username", responseData.username);
		localStorage.setItem("email", responseData.email);

		logInSuccedMsg();
	} catch (error) {
		console.error("Login failed:", error.message);
		logInFailMsg();
	}
}

/**
 * Sends a registration request to the server and handles the response.
 *
 * @async
 * @param {Object} data - The registration data (usually including username, email, and password).
 * @throws {Error} Throws an error if the registration request fails or if the response is not OK.
 */
async function sendRegistrationRequest(data) {
	const url = "http://127.0.0.1:8000/api/auth/registration/";

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		const responseData = await response.json();

		if (!response.ok) {
			if (responseData.email && responseData.email[0].includes("already exists")) {
				emailAlreadyTakenMessage();
			} else {
				registrationFailedMessage();
			}
			throw new Error(`Registration failed: ${JSON.stringify(responseData)}`);
		}

		successfulRegistration();
	} catch (error) {
		console.error("Registration failed:", error.message);
		registrationFailedMessage();
	}
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
