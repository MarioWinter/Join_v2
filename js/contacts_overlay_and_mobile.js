// contacts - mobile

/**
 * this function displays contact details in a responsive view and responsive icons for contact handling updating accordingly
 */
function showResponsiveContactDetails() {
	document.getElementById("add_new_contact_main").classList.add("d-none");
	let contactsContainerRight = document.getElementById("contacts_container_right");
	if (contactsContainerRight) {
		contactsContainerRight.style.display = "flex";
	}
	document.getElementById("handle_resp_contact_icon").classList.add("d-none");
	document.getElementById("handle_resp_menu_icon").classList.remove("d-none");
}

/**
 * this function displays the back arrow for responsive navigation.
 */
function showResponsiveArrowBack() {
	document.getElementById("resp_arrow_back").classList.remove("d-none");
}

/**
 * this function closes contact details view and returns to main contact list
 */
function closeResponsiveDetails() {
	let contactDetails = document.getElementById("show_contact_details");
	let contactsContainerRight = document.getElementById("contacts_container_right");
	if (contactsContainerRight) {
		contactsContainerRight.style.display = "none";
	}
	helpForClosingResponsiveDetails();
	deactivateAllContacts();
	contactDetails.classList.remove("show");
}

/**
 * this help function provides assistance for closing the responsive details view
 */
function helpForClosingResponsiveDetails() {
	document.getElementById("resp_arrow_back").classList.add("d-none");
	document.getElementById("add_new_contact_main").classList.remove("d-none");
	document.getElementById("handle_resp_menu_icon").classList.add("d-none");
	document.getElementById("handle_resp_contact_icon").classList.remove("d-none");
	document.getElementById("resp_edit_container").classList.add("d-none");
}

/**
 * this function hides the responsive edit menu
 */
function hideResponsiveEditMenu() {
	let editOrDelete = document.getElementById("resp_edit_container");
	let responsiveContactsMenu = document.getElementById("handle_resp_menu_icon");
	editOrDelete.classList.add("d-none");
	responsiveContactsMenu.classList.remove("d-none");
}

/**
 * this function shows the responsive edit menu
 */
function showResponsiveEditMenu() {
	let responsiveContactsMenu = document.getElementById("handle_resp_menu_icon");
	let editOrDelete = document.getElementById("resp_edit_container");
	responsiveContactsMenu.classList.add("d-none");
	editOrDelete.classList.remove("d-none");
}

// contacts - overlay

/**
 * Shows the overlay view for editing or adding a new contact.
 *
 * @param {boolean} isEdit - Indicates whether the overlay is for editing an existing contact.
 * @param {object} selectedContact - The selected contact object, used for editing.
 *
 * @returns {void} This function does not return any value, it updates the DOM directly.
 */
function showOverlay(isEdit, selectedContact) {
	updateOverlayContent(isEdit);
	updateOverlayButtons(isEdit, selectedContact);
	let addNewContact = document.getElementById("add_new_contact");
	addNewContact.classList.remove("d-none");
	setTimeout(() => {
		addNewContact.classList.add("show");
	}, 10);
	cancelOverlay();
	document.getElementById("handle_resp_contact_container").classList.add("d-none");
}

/**
 * Adds a new contact to the system.
 *
 * This function collects contact information from form inputs, validates the form,
 * saves the new contact to storage, reloads the contacts list, and handles the newly added contact.
 *
 * @async
 * @param {Event} event - The event object from the form submission.
 * @returns {Promise<void>} A promise that resolves when the contact has been added and the contacts have been reloaded.
 * @throws {Error} If there's an issue saving the contact or reloading the contacts.
 */
async function addNewContact(event) {
	let newContact = {
		username: document.getElementById("contact_Name").value,
		email: document.getElementById("contact_Email").value,
		phone: document.getElementById("contact_Phone").value,
		bgcolor: getRandomColor(),
	};
	if (!validateForm()) {
		event.preventDefault();
	} else {
		let addedContact = await saveNewContactToStorage(newContact);
		await loadContacts();
		if (addedContact != false) handleNewContact(addedContact.id);
	}
}

/**
 * Handles the post-addition process for a new contact.
 *
 * @param {string|number} contactID - The unique identifier of the newly added contact.
 * @returns {void}
 */
function handleNewContact(contactID) {
	clearEntrys();
	cancelOverlay();
	showSuccessMessage();
	sortContactsAlphabetically(contacts);
	renderAllContacts();
	showContactDetails(contactID);
}

/**
 * Initiates the editing process for a selected contact.
 *
 * @param {string|number} contactID - The unique identifier of the contact to be edited.
 */
function editContacts(contactID) {
	let contact = getCurrentUserContact(contactID);
	if (!contact) return;
	selectedContactID = contactID;
	let originalCircleColor = contact.bgcolor || contact.color;
	let initials = getInitials(contact.username);
	showOverlay(true, contact);
	updateContactDetails(contactID, originalCircleColor, initials, contact);
	generateOverlayContactCircle(originalCircleColor, initials);
	updateContactInputs(contact);
	setSaveButtonFunction(contactID);
	hideResponsiveEditMenu();
	document.getElementById("handle_resp_menu_container").classList.add("d-none");
}

/**
 * this function is for checking the overlays current state
 */
function cancelOverlay() {
	let overlay = document.getElementById("add_new_contact");
	if (overlay.classList.contains("show")) {
		closeOverlay();
		hide("email_error_msg");
		hide("phone_error_msg");
	} else {
		handleOverlay();
	}
}

/**
 * this function is for closing the overlay and show responsivemenu again
 */
function closeOverlay() {
	let overlay = document.getElementById("add_new_contact");
	overlay.classList.remove("show");
	overlay.classList.add("close");
	setTimeout(() => {
		hideAddNewContact();
		resetOverlayContactCircle();
		setTimeout(() => {
			overlay.classList.remove("close");
			hideAddNewContact();
		}, 300);
		clearEntrys();
	}, 300);
	document.getElementById("handle_resp_contact_container").classList.remove("d-none");
}

/**
 * this function is for handle the overlay.
 */
function handleOverlay() {
	let overlay = document.getElementById("add_new_contact");
	overlay.classList.remove("close");
	overlay.classList.add("show");
}

/**
 * Updates the buttons in the overlay view based on whether it is for editing or adding a new contact.
 *
 * @param {boolean} isEdit - Indicates whether the overlay is for editing.
 * @param {string} selectedContact - The type of the selected contact, used to determine the button configuration.
 *
 * @returns {void} This function does not return any value, it updates the DOM directly.
 */
function updateOverlayButtons(isEdit, selectedContact) {
	let overlayCancelButton = document.getElementById("overlay_cancel_button");
	let overlayCreateButton = document.getElementById("overlay_create_contact_button");
	if (isEdit && selectedContact.type === "contact") {
		setEditButtons(overlayCancelButton);
	} else {
		setCreateButtons(overlayCancelButton, overlayCreateButton);
	}
}

/**
 * this function resets the overlay contact circle
 */
function resetOverlayContactCircle() {
	let overlayContactCircle = document.getElementById("overlay_contact_circle");
	overlayContactCircle.innerHTML = getOverlayContactCircleHTML();
}

/**
 * this function clears the input fields for contact details
 */
function clearEntrys() {
	document.getElementById("contact_Name").value = "";
	document.getElementById("contact_Email").value = "";
	document.getElementById("contact_Phone").value = "";
}

/**
 * this function updates the input fields for contact details with the provided contact data
 * @param {object} contact - contact containing name mail and phone
 */
function updateContactInputs(contact) {
	let contactNameInput = document.getElementById("contact_Name");
	let contactEmailInput = document.getElementById("contact_Email");
	let contactPhoneInput = document.getElementById("contact_Phone");
	contactNameInput.value = contact.username;
	contactEmailInput.value = contact.email;
	contactPhoneInput.value = contact.phone;
}

/**
 * Configures the save button functionality for editing a contact.
 *
 * @param {string|number} contactID - The unique identifier of the contact being edited.
 */
function setSaveButtonFunction(contactID) {
	let overlayCreateButton = document.getElementById("overlay_create_contact_button");
	overlayCreateButton.innerHTML = "Save <img src='./assets/img/overlay-ok.svg'/>";
	overlayCreateButton.onclick = function (event) {
		if (!validateForm()) {
			event.preventDefault();
		} else {
			updateContact(contactID);
			showSuccessMessage();
			closeOverlay();
			showContactDetails(contactID);
		}
	};
}

/**
 * this function sets the functionality for edit buttons in the overlay
 * @param {html element} overlayCancelButton - overlay cancel button
 */
function setEditButtons(overlayCancelButton) {
	overlayCancelButton.textContent = "Delete";
	overlayCancelButton.onclick = function () {
		deleteContact(selectedContactID);
		cancelOverlay();
	};
}

/**
 * this function sets the functionality for create buttons in the overlay
 * @param {html element} overlayCancelButton - overlay cancel button
 * @param {html element} overlayCreateButton - overlay create button
 */
function setCreateButtons(overlayCancelButton, overlayCreateButton) {
	overlayCancelButton.innerHTML =
		"Cancel <svg xmlns='http://www.w3.org/2000/svg' width='24' height='25' viewBox='0 0 24 25' fill='none'><mask id='mask0_71720_5473' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='24' height='25'><rect y='0.96582' width='24' height='24' fill='#D9D9D9'/></mask><g mask='url(#mask0_71720_5473)'><path d='M11.9998 14.3659L7.0998 19.2659C6.91647 19.4492 6.68314 19.5409 6.3998 19.5409C6.11647 19.5409 5.88314 19.4492 5.6998 19.2659C5.51647 19.0825 5.4248 18.8492 5.4248 18.5659C5.4248 18.2825 5.51647 18.0492 5.6998 17.8659L10.5998 12.9659L5.6998 8.06587C5.51647 7.88254 5.4248 7.6492 5.4248 7.36587C5.4248 7.08254 5.51647 6.8492 5.6998 6.66587C5.88314 6.48254 6.11647 6.39087 6.3998 6.39087C6.68314 6.39087 6.91647 6.48254 7.0998 6.66587L11.9998 11.5659L16.8998 6.66587C17.0831 6.48254 17.3165 6.39087 17.5998 6.39087C17.8831 6.39087 18.1165 6.48254 18.2998 6.66587C18.4831 6.8492 18.5748 7.08254 18.5748 7.36587C18.5748 7.6492 18.4831 7.88254 18.2998 8.06587L13.3998 12.9659L18.2998 17.8659C18.4831 18.0492 18.5748 18.2825 18.5748 18.5659C18.5748 18.8492 18.4831 19.0825 18.2998 19.2659C18.1165 19.4492 17.8831 19.5409 17.5998 19.5409C17.3165 19.5409 17.0831 19.4492 16.8998 19.2659L11.9998 14.3659Z' fill='#2A3647'/></g></svg>";
	overlayCreateButton.innerHTML = "Create contact <img src='./assets/img/overlay-ok.svg'/>";
	overlayCancelButton.onclick = function () {
		cancelOverlay();
	};
}

/**
 * this function hides the add new contact container
 */
function hideAddNewContact() {
	let addNewContact = document.getElementById("add_new_contact");
	addNewContact.classList.remove("show");
	addNewContact.classList.add("d-none");
}

/**
 * Displays an error message for the username field.
 * @param {string} message - The error message to be displayed.
 */
function errorMsgUsername(massage) {
	hide("username_error_msg");
	username_error_msg.innerHTML = "";
	username_error_msg.innerHTML = massage;
	show("username_error_msg");
}

/**
 * Displays an error message for the email field.
 * @param {string} message - The error message to be displayed.
 */
function errorMsgEmail(massage) {
	hide("email_error_msg");
	email_error_msg.innerHTML = "";
	email_error_msg.innerHTML = massage;
	show("email_error_msg");
}

/**
 * Displays an error message for the phone number field.
 * @param {string} message - The error message to be displayed.
 */
function errorMsgPhone(massage) {
	hide("phone_error_msg");
	phone_error_msg.innerHTML = "";
	phone_error_msg.innerHTML = massage;
	show("phone_error_msg");
}

/**
 * Validates the entire form by checking the username, email, and phone number fields.
 * @returns {boolean} True if all fields are valid, false otherwise.
 */
function validateForm() {
	hide("username_error_msg");
	hide("email_error_msg");
	hide("phone_error_msg");
	return validateUsername(contact_Name.value) && validateEmail(contact_Email.value) && validateInternationalPhoneNumber(contact_Phone.value);
}

/**
 * Validates the username field.
 * @param {string} username - The username to be validated.
 * @returns {boolean} True if the username is valid, false otherwise.
 */
function validateUsername(username) {
	const regex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,100}$/u;
	if (regex.test(username)) {
		return true;
	} else {
		errorMsgUsername("Please enter a valid username with at least 2 characters");
		return false;
	}
}

/**
 * Validates the email field.
 * @param {string} email - The email address to be validated.
 * @returns {boolean} True if the email address is valid, false otherwise.
 */
function validateEmail(email) {
	const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	if (regex.test(email)) {
		return true;
	} else {
		errorMsgEmail("Please enter a valid email address");
		return false;
	}
}

/**
 * Validates the international phone number field.
 * @param {string} phone - The phone number to be validated.
 * @returns {boolean} True if the phone number is valid, false otherwise.
 */
function validateInternationalPhoneNumber(phone) {
	const regex = /^\+?(?:[0-9] ?){6,14}[0-9]$/;
	if (regex.test(phone)) {
		return true;
	} else {
		errorMsgPhone("Enter a valid phone number");
		return false;
	}
}
