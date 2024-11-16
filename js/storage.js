const STORAGE_TOKEN = "CIEVHNM0XX863NLG0FAFWLL9NBEWOL7NM5VP7VCZ";
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";

/**
 * Set an item in remote storage.
 * @param {string} key - The key of the item to be stored.
 * @param {any} value - The value of the item to be stored.
 * @returns {Promise<Object>} A Promise that resolves to the response from the server.
 */
async function setItem(key, value) {
	const payload = { key, value, token: STORAGE_TOKEN };
	return fetch(STORAGE_URL, { method: "POST", body: JSON.stringify(payload) }).then((res) => res.json());
}

/**
 * Retrieve an item from remote storage.
 * @param {string} key - The key of the item to be retrieved.
 * @returns {Promise<any>} A Promise that resolves to the value of the retrieved item.
 * @throws {string} Throws an error if the data with the specified key is not found.
 */
async function getItem(key) {
	const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
	return fetch(url)
		.then((res) => res.json())
		.then((res) => {
			// Improved code
			if (res.data) {
				return res.data.value;
			}
			throw `Could not find data with key "${key}".`;
		});
}

async function signIn(data) {
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
			localStorage.setItem("currentUserIndex", data.id);
			localStorage.setItem("token", data.token);
			localStorage.setItem("full_name", data.full_name);
			localStorage.setItem("username", data.username);
		})
		.catch((error) => console.error("Fehler:", error));
}

async function signUp(data) {
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
			localStorage.setItem("currentUserIndex", data.id);
			localStorage.setItem("token", data.token);
			localStorage.setItem("username", data.username);
		})
		.catch((error) => console.error("Fehler:", error));
}

function testLogin() {
	const data = {
		username: "jürgenwinter",
		password: "werte12345",
	};
	signIn(data);
}

function testLogOut() {
	localStorage.clear();
	window.location.href = "index.html";
}

function testRegistration() {
	const data = {
		username: "niklasberting",
		email: "niklasberting@gmail.com",
		password: "werte12345",
		repeated_password: "werte12345",
	};
	signUp(data);
}
