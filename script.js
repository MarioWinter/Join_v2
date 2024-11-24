let username;
let currentUser;
let contacts = [];

let today = new Date();
let hour = today.getHours();

/**
 * Includes HTML Templates (header/footer) asynchronously.
 * Fetches HTML files specified in elements with attribute 'w3-include-html' and inserts them into those elements.
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html"); // "includes/header.html"
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
  checkPath();
}

/**
 * Initializes summary page by loading contacts, setting current user, greeting user, loading added tasks, loading user badge, and rendering summary data.
 */
async function summaryInit() {
  await includeHTML();
  loadCurrentUser();
  greetUser();
  await loadAddedTasksFromStorage();
  loadUserBadge();
  renderSummaryData();
}

/**
 * Initializes the page by loading contacts and rendering the login window.
 */
async function init() {
  renderLogIn();
}

async function initSidePages() {
  await includeHTML();
  loadCurrentUser();
  loadUserBadge();
}

/**
 * Renders the login window.
 */
function renderLogIn() {
  let log_container = document.getElementById("log_container");
  log_container.innerHTML = "";
  log_container.classList.remove("height-sing-up");
  log_container.innerHTML += renderHtmlLogIn();
  showSignUpBtn();
}

/**
 * Renders the Sign Up window.
 */
function renderSignUp() {
  let log_container = document.getElementById("log_container");
  log_container.innerHTML = "";
  log_container.classList.add("height-sing-up");
  log_container.innerHTML += renderSignUpHTML();
  ifChecked();
  hideSignUpBtn();
}

// Sign up //

/**
 * Registers a user.
 */
async function registerUser() {  
  const data = {
		username: sign_name.value,
		email: sign_email.value,
		password: sign_password.value,
		repeated_password: sign_password_confirm.value,
	};
  
  if (ifChecked()) {

  }else{
    sendRegistrationRequest(data);
  }
  //emailExist() Error Handling?
}

/**
 * Checks if the terms and conditions checkbox is checked to enable the register button.
 */
function ifChecked() {
  let checkedTrue = document.getElementById('sing-up-check');
  let registerBtn = document.getElementById('register_btn');

  if (checkedTrue.checked) {
    registerBtn.disabled = false;
    registerBtn.classList.remove('reg-btn'); // Reset background color
  } else {
    registerBtn.disabled = true;
    registerBtn.classList.add('reg-btn'); // Set background color to gray
  }
}

/**
 * Generates a random color code.
 * @returns {string} The generated color code.
 */
function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/** Change
 * Displays a message indicating that the email already exists.
 */
function emailExist() {
  let messageElement = document.getElementById("message");
  messageElement.innerText = "Die E-Mail ist bereits vorhanden.";
  messageElement.style.color = "red";
}

/**
 * Loads contacts from remote storage to the local array.
 */
async function loadContacts() {
  try {
    contacts = await getItems("contacts");
  } catch (e) {
    console.error("Loading error:", e);
  }
}

/**
 * Checks if the password and confirm password fields match to enable the register button.
 */
function validatePassword() {
  if (
    document.getElementById("sign_password").value ==
    document.getElementById("sign_password_confirm").value
  ) {
    document.getElementById("register_btn").disabled = false;
    document.getElementById("message").style.color = "green";
    document.getElementById("message").innerHTML = "matching";
  } else {
    document.getElementById("register_btn").disabled = true;
    document.getElementById("message").style.color = "red";
    document.getElementById("message").innerHTML = "not matching";
  }
}

/**
 * Resets input fields in the registration form.
 */
function resetForm() {
  document.getElementById("sign_name").value = "";
  document.getElementById("sign_email").value = "";
  document.getElementById("sign_password").value = "";
  document.getElementById("sign_password_confirm").value = "";
}

// Log in //

/**
 * Logs in the user if username and password match.
 */
function logIn() {
  let email = log_in_email.value;
  let password = log_in_password.value;
  const data = {
		email: email,
		password: password,
	};
  sendLoginRequest(data)
}

function logOut() {
	localStorage.clear();
}

/**
 * Displays a message indicating successful registration and redirects to login after a short delay.
 */
function successfulRegistration() {
	sing_up_container.innerHTML = '<span class="register-msg">Registration successful</span>';

	setTimeout(() => {
		renderLogIn();
	}, 1000);
}

/**
 * Displays a message indicating that the email is already taken.
 */
function emailAlreadyTakenMessage() {
  sing_up_container.innerHTML = '<span class="register-msg">This email is already taken</span>';

  setTimeout(() => {
      renderSignUp(); // Annahme: Diese Funktion rendert das Registrierungsformular neu
  }, 3000);
}

/**
* Displays a message indicating that the registration failed.
*/
function registrationFailedMessage() {
  sing_up_container.innerHTML = '<span class="register-msg">Registration failed. Please try again.</span>';

  setTimeout(() => {
      renderSignUp(); // Annahme: Diese Funktion rendert das Registrierungsformular neu
  }, 3000);
}



/**
 * redirects to the summary page after a short delay.
 */
function logInSuccedMsg() {
  setTimeout(() => {
    window.location.href = 'summary.html';
  }, 1000);
}

/**
 * Displays a failure message for unsuccessful login attempts.
 * Sets the text content of the login message element to indicate
 * that the name or password was not found, and changes the text color to red.
 */
// function logInFailMsg(){
//   log_message.innerText = 'name or password not found';
//   log_message.style = 'color: red';
// }
function logInFailMsg() {
  log_message.innerText = 'Email or password is not valid';
  log_message.style.color = 'red';
}


/**
 * Loads the current user index from local storage.
 */
function loadCurrentUser() {
  if (localStorage.getItem('currentUserIndex')){
    currentUser = Number(localStorage.getItem('currentUserIndex'));
    username = localStorage.getItem('username')
  } else {
    logOut()
  }
}

/**
 * Greets the user based on the current time and the current user.
 */
function greetUser() {
  let greet = document.getElementById('user_name');
  i = currentUser;
  if (i >= 0) {
    greet.innerHTML = `${username}`;
  } else {
    greet.innerHTML = `Guest`;
  }
  displayGreeting();
}

/**
 * Registers a guest user and redirects to the summary page.
 */
function logInGuest() {
  window.location.href = 'summary.html';
  userIndex = -1;
  localStorage.setItem('token', 'd6d7a8a491b0a7038adc6c78623dcffd83aef5e6');
  localStorage.setItem('currentUserIndex', userIndex);
  document.getElementById('user_name') = 'Guest User';
}

/**
 * Displays a greeting based on the current time.
 */
function displayGreeting() {
  let greeting;
  if (hour >= 4 && hour < 12) {
    greeting = 'Good morning';
  } else if (hour >= 12 && hour < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }

  let greetBox = document.getElementById('greet_box');
  greetBox.textContent = greeting;
}

/**
 * Hides the sign-up button on mobile devices.
 */
function hideSignUpBtn() {
  let width = document.documentElement.clientWidth;
  if (width < 500) {
    document.getElementById('sing_up_mobile').classList.add('d-none');
  }
}

/**
 * Shows the sign-up button on mobile devices.
 */
function showSignUpBtn() {
  let width = document.documentElement.clientWidth;
  if (width < 500) {
    document.getElementById('sing_up_mobile').classList.remove('d-none');
  }
}
