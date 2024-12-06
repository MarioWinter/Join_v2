let selectedContactID = null;
let colorIndex = 0;
let isEditing = false;

let contactsData = [
	{
		id: 1,
		name: "Anton Meyer",
		email: "antom@gmail.com",
		phone: "0123 45678910",
		bgcolor: "#6E52FF",
	},
	{
		id: 2,
		name: "Anja Schulz",
		email: "schulz@hotmail.com",
		phone: "0123 45678910",
		bgcolor: "#FF7A00",
	},
	{
		id: 3,
		name: "Benedikt Ziegler",
		email: "benedikt@gmail.com",
		phone: "0123 45678910",
		bgcolor: "#9327FF",
	},
	{
		id: 4,
		name: "David Eisenberg",
		email: "davidberg@gmail.com",
		phone: "0123 45678910",
		bgcolor: "#FC71FF",
	},
	{
		id: 5,
		name: "Eva Fischer",
		email: "eva@gmail.com",
		phone: "0123 45678910",
		bgcolor: "#FFBB2B",
	},
	{
		id: 6,
		name: "Emmanuel Mauer",
		email: "emmanuelma@gmail.com",
		phone: "0123 45678910",
		bgcolor: "#1FD7C1",
	},
	{
		id: 7,
		name: "Marcel Bauer",
		email: "bauer@gmail.com",
		phone: "0123 45678910",
		bgcolor: "#462F8A",
	},
	{
		id: 8,
		name: "Tatjana Wolf",
		email: "wolf@gmail.com",
		phone: "0123 45678910",
		bgcolor: "#FF5EB3",
	},
];

let contactCircleColors = [
	"#FF7A00",
	"#9327FF",
	"#6E52FF",
	"#FC71FF",
	"#FFBB2B",
	"#1FD7C1",
	"#462F8A",
	"#FF4646",
	"#00BEE8",
	"#FF5EB3",
	"#FFA35E",
	"#FF745E",
	"#C3FF2B",
	"#0038FF",
	"#FFC701",
	"#FFE62B",
];

/**
 * this function initailizes the contacts and loads user data
 */
async function initContacts() {
	await loadContacts();
	await loadAddedTasksFromStorage();
	loadCurrentUser();
	loadUserBadge();
	sortContactsAlphabetically(contacts);
	renderAllContacts();
}

/**
 * this function sorts the contact-array alphabetically by their name
 * @param {object} contacts - an array of objects, each representing contact with "name"
 */
function sortContactsAlphabetically(contacts) {
	contacts.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * this fucntion renders the contact view and sets up edit functionality based on the contacts login status
 * if user is logged in, function renders contacts for the logged-in user, otherwise it renders all contacts
 */
function renderAllContacts() {
	let contactsContainer = document.getElementById("contact_container");
	let contactsHTML;
	if (currentUser >= 0) {
		contactsHTML = renderLoggedContactsHTML();
	} else {
		contactsHTML = generateContactsHTML(contactsData);
	}
	contactsContainer.innerHTML = contactsHTML;
	setupEditFunctionality();
}

/**
 * this function renders contacts for a logged-in user and set up edit functionality
 */
function renderLoggedContacts() {
	let contactsContainer = document.getElementById("contact_container");
	let contactsHTML = renderLoggedContactsHTML();
	contactsContainer.innerHTML = contactsHTML;
	setupEditFunctionality();
}

/**
 * this generates html for rendering contacts or logged-in contact/user
 * @returns {string} the string represents rendered contacts
 */
function renderLoggedContactsHTML() {
	return generateContactsHTML(contacts);
}

/**
 * Generates HTML for rendering a list of contacts, grouped by the first letter of their names.
 *
 * @param {Object[]} contacts - Array of contact objects.
 * @param {string} contacts[].name - The name of the contact.
 * @param {string} contacts[].id - The unique identifier of the contact.
 * @param {string} [contacts[].bgcolor] - The background color for the contact's initials circle (optional).
 * @param {string} [contacts[].color] - Fallback color if bgcolor is not provided (optional).
 * @returns {string} HTML string representing the rendered contacts list.
 *
 */
function generateContactsHTML(contacts) {
	let contactsHTML = "";
	let alphabetLetters = {};
	let contactID = 0;
	contacts.forEach((contact) => {
		let initials = getInitials(contact.name);
		contactID = contact.id;
		let firstLetter = initials.charAt(0).toUpperCase();
		let circleColor = contact.bgcolor || contact.color || getRandomColor();
		if (!alphabetLetters[firstLetter]) {
			alphabetLetters[firstLetter] = true;
			contactsHTML += createAlphabetHTML(firstLetter);
		}
		contactsHTML += generateContactHTML(contact, initials, circleColor, contactID);
	});
	return contactsHTML;
}

/**
 * this function sets up edit functionality for contacts
 */
function setupEditFunctionality() {
	let editLinks = document.getElementsByClassName("edit-text");
	for (let i = 0; i < editLinks.length; i++) {
		editLinks[i].addEventListener("click", function () {
			editContacts(i);
		});
	}
}

/**
 * Retrieves a specific contact from the contacts array based on the given contact ID.
 *
 * @param {string|number} contactID - The unique identifier of the contact to retrieve.
 * @returns {Object|undefined} The contact object if found, or undefined if not found.
 *
 */
function getCurrentUserContact(contactID) {
	let currentContact = contacts.find((contact) => contact.id == contactID);
	return currentContact;
}

/**
 * this function removes active-style from contact and resetting background and color
 * @param {html element} contact - contact element
 */
function removeActiveContactStyles(contact) {
	contact.classList.remove("active-contact");
	contact.style.backgroundColor = "";
	let nameElement = contact.getElementsByClassName("contact-name")[0];
	nameElement.style.color = "";
}

/**
 * this fucntion activates styles for a contact. setting background color, adding active-contact class, and updating text color
 * @param {html element} contact - contact element
 */
function activateContactStyles(contact) {
	contact.style.backgroundColor = "#2a3647";
	contact.classList.add("active-contact");
	let nameElement = contact.getElementsByClassName("contact-name")[0];
	nameElement.style.color = "white";
}

/**
 * this function deactivates styles for all contacts by removing active-contact class and resetting background and text colors
 */
function deactivateAllContacts() {
	let contacts = document.getElementsByClassName("contact-container");
	for (let i = 0; i < contacts.length; i++) {
		let currentContact = contacts[i];
		if (currentContact.classList.contains("active-contact")) {
			removeActiveContactStyles(currentContact);
		}
	}
}

/**
 * this function updates contact details with specified contact info
 * @param {object} selectedContact - selected contact as object
 * @param {string} circleColor - color for the contact circle
 * @param {string} contactInitials - initials of the contact
 */
function updateContactDetails(selectedContact, circleColor, contactInitials) {
	let contactDetails = document.getElementById("show_contact_details");
	contactDetails.innerHTML = createContactDetailsHTML(selectedContact, circleColor, contactInitials);
	contactDetails.classList.remove("d-none");
	contactDetails.classList.add("show");
}

/**
 * this function shows or hides contact details based on selected/choosed index/contact
 * activates or deactivates the contact details and adjusts the responsive layout accordingly
 * @param {number} selectedIndex - index of the selected contact
 */
function showContactDetails(selectedIndex) {
	let contact = document.getElementById(`contact-${selectedIndex}`);
	let isActive = contact ? contact.classList.contains("active-contact") : false;
	let contactDetails = document.getElementById("show_contact_details");

	if (isActive) {
		deactivateContactDetails(contact);
	} else if (contact) {
		activateDetailAndDisplay(selectedIndex, contact);
		if (window.innerWidth < 850) {
			showResponsiveContactDetails();
			showResponsiveArrowBack();
			hideResponsiveEditMenu();
		}
	}
}

/**
 * this function activates contact details and display them for the selected contact index
 * @param {number} selectedIndex - index of selected contact
 * @param {html element} contact - contact element
 */
function activateDetailAndDisplay(selectedIndex, contact) {
	activateContactDetails(contact);
	let circleColor = contact.querySelector(".contact-circle > svg > circle").getAttribute("fill");
	let selectedContact = getCurrentUserContact(selectedIndex);
	let contactInitials = getInitials(selectedContact.name);
	let contactDetails = document.getElementById("show_contact_details");
	if (contactDetails) {
		updateContactDetails(selectedIndex, circleColor, contactInitials);
		contactDetails.classList.remove("d-none");
		contactDetails.classList.add("show");
	}
}

/**
 * this help function for deactivating contact details for the specified contact by removing active styles and hiding the details
 * @param {html element} contact - the contact element
 */
function deactivateContactDetails(contact) {
	removeActiveContactStyles(contact);
	hideContactDetails();
}

/**
 * this help function activates contact details and deactivating other contacts
 * @param {html element} contact - contact element
 */
function activateContactDetails(contact) {
	deactivateAllContacts();
	activateContactStyles(contact);
}

/**
 * this function hides the contact details
 */
function hideContactDetails() {
	let contactDetails = document.getElementById("show_contact_details");
	contactDetails.classList.remove("show");
}

/**
 * this function gets the initials from a given name
 * @param {string} name - shows full name
 * @returns {string} The initials extracted from the name.
 */
function getInitials(name) {
	let parts = name.split(" ");
	let initials = "";
	parts.forEach((part) => {
		initials += part.charAt(0).toUpperCase();
	});
	return initials;
}

/**
 * Updates the details of a specific contact and saves the changes.
 *
 * @param {string|number} contactID - The unique identifier of the contact to be updated.
 * @returns {void}
 */
function updateContact(contactID) {
	let contact = getCurrentUserContact(contactID);
	if (!contact) return;
	contact.name = document.getElementById("contact_Name").value;
	contact.email = document.getElementById("contact_Email").value;
	contact.phone = document.getElementById("contact_Phone").value;
	sortContactsAlphabetically(contacts);
	updatedContactToStorage(contact, contactID);
	finalizeContactUpdate();
}

/**
 * this function performs additional actions to finalize the contact update
 */
function finalizeContactUpdate() {
	hideContactDetails();
	cancelOverlay();
	clearEntrys();
	renderAllContacts();
}

/**
 * Finds the insert index for a new contact in a contact list based on its ID.
 *
 * @param {number|string} newContactId - The ID of the new contact to be inserted.
 * @param {Object[]} contactList - The list of existing contacts.
 * @param {number|string} contactList[].id - The ID of each contact in the list.
 * @returns {number} The index where the new contact should be inserted.
 *                   Returns the length of the list if the ID is not found.
 */
function findInsertIndex(newContactId, contactList) {
	let index = contactList.findIndex((contact) => contact.id === newContactId);
	return index !== -1 ? index : contactList.length;
}

/**LÖSCHEN
 * this functoin adds new user to the list of contacts
 */
function addUser() {
	contacts.push({
		name: contact_Name.value,
		email: contact_Email.value,
		phone: contact_Phone.value,
		bgcolor: getRandomColor(),
	});
	setItem("contacts", JSON.stringify(contacts));
	renderAllContacts();
}

/**LÖSCHEN
 * this function adds new contact data to the list of contactsData
 */
function addContactsData() {
	contactsData.push({
		name: contact_Name.value,
		email: contact_Email.value,
		phone: contact_Phone.value,
		bgcolor: getRandomColor(),
	});
	renderAllContacts();
}

/**
 * Deletes a contact based on the provided index.
 * @param {number} index - The index of the contact to be deleted.
 * @returns {Promise<void>} A Promise that resolves after the contact is deleted.
 */
async function deleteContact(index) {
	if (currentUser >= 0) {
		let currentLoggedUser = nameOfCurrentUser();
		deleteUserInAssignedTo(index);
		await setItem("addedTasks", JSON.stringify(addedTasks));
		contacts.splice(index, 1);
		await setItem("contacts", JSON.stringify(contacts));
		updateCurrentUser(currentLoggedUser);
	}
	let contactDetails = document.getElementById("show_contact_details");
	if (contactDetails.classList.contains("show")) {
		hideContactDetails();
	}
	renderAllContacts();
	hideResponsiveEditMenu();
	loadAddedTasksFromStorage();
}

/**
 * Retrieves the name of the current user.
 * @returns {string} The name of the current user.
 */
function nameOfCurrentUser() {
	let i = currentUser;
	let user = contacts[i].name;
	return user;
}

/**
 * Updates the current user based on the provided user name.
 * @param {string} user - The name of the user to set as the current user.
 */
function updateCurrentUser(user) {
	let found = false;
	for (let i = 0; i < contacts.length; i++) {
		if (contacts[i].name === user) {
			userIndex = i;
			localStorage.setItem("currentUserIndex", userIndex);
			loadCurrentUser();
			found = true;
			break;
		}
	}
	if (!found) {
		console.error("User not found");
	}
}

/**
 * Deletes a user from the "assigned" array in all tasks
 * @param {number} index - The index of the user in the contacts array to be deleted
 * @description
 * This function removes a user from the "assigned" array in all tasks. It takes the index of the user in the contacts array and filters out the user's name from the "assigned" array of each task.
 */
function deleteUserInAssignedTo(index) {
	let deletedUser = contacts[index].name;
	addedTasks.forEach((task) => {
		let assignedIndex = task.assigned.indexOf(deletedUser);
		if (assignedIndex !== -1) {
			task.assigned.splice(assignedIndex, 1);
		}
	});
}

/**
 * this function displays success message for contact creation
 */
function showSuccessMessage() {
	let successMessage = document.getElementById("contact_succesfully_created");
	successMessage.classList.remove("d-none");
	successMessage.style.opacity = 1;
	successMessage.style.transform = "translateX(0)";
	setTimeout(() => {
		successMessage.style.opacity = 0;
		successMessage.style.transform = "translateX(100%)";
	}, 2000);
	setTimeout(() => {
		successMessage.classList.add("d-none");
	}, 3500);
}
