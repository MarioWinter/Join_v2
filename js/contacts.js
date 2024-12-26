let selectedContactID = null;
let colorIndex = 0;
let isEditing = false;

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
	contact.username = contact_Name.value;
	contact.email = contact_Email.value;
	contact.phone = contact_Phone.value;
	updatedUserOrContact(contact, contactID);
	finalizeContactUpdate();
}

/**
 * Updates a user or contact in storage based on the type.
 *
 * @async
 * @param {Object} contact - The contact or user object to be updated.
 * @param {string} contactID - The unique identifier of the contact or user.
 * @param {string} contact.type - The type of the object, either "contact" or "user".
 * @throws {Error} If there's an issue updating the storage.
 * @returns {Promise<void>}
 */
async function updatedUserOrContact(contact, contactID) {
	try {
		if (contact.type === "contact") {
			await updatedContactToStorage(contact, contactID);
		} else {
			const profileID = contact.user;
			await updatedProfileToStorage(contact, profileID);
			updateProfileContactBagde(contact);
			await updatedContactToStorage(contact, contactID);
		}
	} catch (error) {
		console.error("Error updating:", error);
	}
}

/**
 * Updates the background color of a contact's badge.
 * @param {Object} contact - The contact object to update.
 */
function updateProfileContactBagde(contact) {
	contact.bgcolor = localStorage.getItem("bgcolor");
}

/**
 * this function performs additional actions to finalize the contact update
 */
async function finalizeContactUpdate() {
	await loadContacts();
	loadCurrentUser();
	loadUserBadge();
	sortContactsAlphabetically(contacts);
	renderAllContacts();
	hideContactDetails();
	cancelOverlay();
	clearEntrys();
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
