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
	//addUserToContacts(); //OPTION
	loadUserBadge();
	sortContactsAlphabetically(contacts);
	renderAllContacts();
}

/**
 * this function sorts the contact-array alphabetically by their username
 * @param {object} contacts - an array of objects, each representing contact with "username"
 */
function sortContactsAlphabetically(contacts) {
	contacts.sort((a, b) => a.username.localeCompare(b.username));
}

/**
 * this fucntion renders the contact view and sets up edit functionality based on the contacts login status
 * if user is logged in, function renders contacts for the logged-in user, otherwise it renders all contacts
 */
function renderAllContacts() {
	let contactsContainer = document.getElementById("contact_container");
	contactsContainer.innerHTML = renderLoggedContactsHTML();
	setupEditFunctionality();
}

/**LÖSCHEN?
 * this function renders contacts for a logged-in user and set up edit functionality
 */
// function renderLoggedContacts() {
// 	let contactsContainer = document.getElementById("contact_container");
// 	let contactsHTML = renderLoggedContactsHTML();
// 	contactsContainer.innerHTML = contactsHTML;
// 	setupEditFunctionality();
// }

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
 * @param {string} contacts[].username - The name of the contact.
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
		let initials = getInitials(contact.username);
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
 * Updates the contact details with the specified contact information.
 *
 * @param {number} selectedIndex - The index of the selected contact.
 * @param {string} circleColor - The color for the contact circle.
 * @param {string} contactInitials - The initials of the contact.
 * @param {object} selectedContact - The selected contact as an object.
 *
 * @returns {void} This function does not return any value, it updates the DOM directly.
 */
function updateContactDetails(selectedIndex, circleColor, contactInitials, selectedContact) {
	let contactDetails = document.getElementById("show_contact_details");
	if (selectedContact.type === "contact") {
		contactDetails.innerHTML = createContactDetailsHTML(selectedIndex, circleColor, contactInitials, selectedContact);
	} else {
		contactDetails.innerHTML = createProfileDetailsHTML(selectedIndex, circleColor, contactInitials, selectedContact);
	}
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
	let contactInitials = getInitials(selectedContact.username);
	let contactDetails = document.getElementById("show_contact_details");
	if (contactDetails) {
		updateContactDetails(selectedIndex, circleColor, contactInitials, selectedContact);
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

/**LÖSCHEN
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
	contact.username = document.getElementById("contact_Name").value;
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

/**LÖSCHEN?
 * this functoin adds new user to the list of contacts
 */
function addUserToContacts() {
	contacts.push({
		id: -2,
		username: localStorage.getItem("username"),
		email: localStorage.getItem("email"),
		phone: "",
		bgcolor: getRandomColor(),
	});
	// setItem("contacts", JSON.stringify(contacts));
	// renderAllContacts();
}

/**
 * Deletes a contact based on the provided contact ID and updates the UI.
 *
 * @param {string|number} contactID - The unique identifier of the contact to be deleted.
 * @returns {void}
 */
async function deleteContact(contactID) {
	await deletesContactInStorage(contactID);
	initContacts();
	closeResponsiveDetails();
	hideResponsiveEditMenu();
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
