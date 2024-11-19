let TOKEN = "";
const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

/** setItem
 * Set an item in remote storage.
 * @param {string} key - The key of the item to be stored.
 * @param {any} value - The value of the item to be stored.
 * @returns {Promise<Object>} A Promise that resolves to the response from the server.
 */
async function setItem(data, endpoint, id) {
	let url = `${API_BASE_URL}/${endpoint}/${id}/`;
	return fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Token ${TOKEN}`,
		},
		body: JSON.stringify(data),
	})
		.then((response) => response.json())
		.catch((error) => console.error("Fehler:", error));
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

async function deleteItem(data, endpoint, id) {
	let url = `${API_BASE_URL}/${endpoint}/${id}/`;
	return fetch(url, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Token ${TOKEN}`,
		},
		body: JSON.stringify(data),
	})
		.then((response) => response.json())
		.catch((error) => console.error("Fehler:", error));
}

/** getItem
 * Retrieve an item from remote storage.
 * @param {string} key - The key of the item to be retrieved.
 * @returns {Promise<any>} A Promise that resolves to the value of the retrieved item.
 * @throws {string} Throws an error if the data with the specified key is not found.
 */
async function getItems(endpoint) {
	let url = `${API_BASE_URL}/${endpoint}/`;
	return fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Token ${TOKEN}`,
		},
	})
		.then((response) => response.json())
		.then((data) => console.log(data))
		.catch((error) => console.error("Fehler:", error));
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
				throw new Error(`HTTP-Fehler! Status: ${response.status}`);
			}
			return response.json();
		})
		.then((data) => {
			localStorage.setItem("currentUserIndex", data.user_id);
			localStorage.setItem("token", data.token);
			localStorage.setItem("username", data.username);
			localStorage.setItem("email", data.email);
		})
		.catch((error) => console.error("Fehler:", error));
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
				throw new Error(`HTTP-Fehler! Status: ${response.status}`);
			}
			return response.json();
		})
		.then((data) => {
			// localStorage.setItem("currentUserIndex", data.user_id);
			// localStorage.setItem("token", data.token);
			// localStorage.setItem("username", data.username);
			// localStorage.setItem("email", data.email);
		})
		.catch((error) => console.error("Fehler:", error));
}
