
/**
 * Render HTML for login form.
 * @returns {string} HTML string for login form.
 */

function renderHtmlLogIn() {
  return /*html*/ `
  <div id="log_in_conatiner" class="log-in-container">
  <h1>Log in</h1>
  <div class="log-in-underline"></div>
  <form class="log-in-input-container" onsubmit="logIn(); return false">
   
  <div class="log-in-input-box">
      <input id="log_in_email" required type="email"  placeholder="Email" /><img
        src="./assets/img/mail.png"
        alt=""
        srcset=""
      />
    </div>
    <div class="log-in-msg" id="log_message"></div>
    <div class="log-in-input-box">
      <input id="log_in_password" required placeholder="Password"  type="password" /><img
        src="./assets/img/lock.png"
        alt=""
        srcset=""
      />
    </div>
    <div class="log-in-checkbox">
      <input required
      id="confirm" type="checkbox"
        checked
      /><label  for="confirm"
        >Remember me</label
      >
    </div>
    <div  class="btn-log-in-container">
      <button type="button" class="btn-log-in btn-log-mobile" onclick="logIn()">Log in</button>
      <button type="button" class="btn-log-in-guest btn-log-mobile" onclick="logInGuest()">Guest Log in</button>
    </div>
</form>
</div>
    `

}


/**
 * Render HTML for sign up form.
 * @returns {string} HTML string for sign up form.
 */
function renderSignUpHTML() {
  return /*html*/ `
   <div id="sing_up_container" class="sing-up-container">
        <div onclick="renderLogIn()"><svg class="left-arrow" xmlns="http://www.w3.org/2000/svg" width="40" height="40"
            viewBox="0 0 32 32" fill="none">
            <path
              d="M10.4373 14.6667H25.3333C26.0696 14.6667 26.6666 15.2637 26.6666 16.0001C26.6666 16.7364 26.0696 17.3334 25.3333 17.3334H10.4373L16.6466 23.5427C17.1672 24.0634 17.1672 24.9074 16.6466 25.4281C16.126 25.9487 15.2819 25.9487 14.7613 25.4281L6.74746 17.4143C5.96642 16.6332 5.96642 15.3669 6.74747 14.5858L14.7613 6.57206C15.2819 6.05144 16.126 6.05144 16.6466 6.57206C17.1672 7.09268 17.1672 7.93677 16.6466 8.45739L10.4373 14.6667Z"
              fill="#29ABE2" />
          </svg></div>
        <h1>Sign up</h1>
        <div class="log-in-underline"></div>
        <form class="sing-up-content" onsubmit="registerUser(); return false">

          <form class="sing-up-input-container">

            <div class="log-in-input-box">
              <input id="sign_name" required type="text" placeholder="Name" /><svg xmlns="http://www.w3.org/2000/svg"
                width="24" height="24" viewBox="0 0 24 24" fill="none">
                <mask id="mask0_100427_6058" style="mask-type: alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24"
                  height="24">
                  <rect width="24" height="24" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_100427_6058)">
                  <path
                    d="M12 12C10.9 12 9.95833 11.6083 9.175 10.825C8.39167 10.0417 8 9.1 8 8C8 6.9 8.39167 5.95833 9.175 5.175C9.95833 4.39167 10.9 4 12 4C13.1 4 14.0417 4.39167 14.825 5.175C15.6083 5.95833 16 6.9 16 8C16 9.1 15.6083 10.0417 14.825 10.825C14.0417 11.6083 13.1 12 12 12ZM18 20H6C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V17.2C4 16.6333 4.14583 16.1125 4.4375 15.6375C4.72917 15.1625 5.11667 14.8 5.6 14.55C6.63333 14.0333 7.68333 13.6458 8.75 13.3875C9.81667 13.1292 10.9 13 12 13C13.1 13 14.1833 13.1292 15.25 13.3875C16.3167 13.6458 17.3667 14.0333 18.4 14.55C18.8833 14.8 19.2708 15.1625 19.5625 15.6375C19.8542 16.1125 20 16.6333 20 17.2V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20ZM6 18H18V17.2C18 17.0167 17.9542 16.85 17.8625 16.7C17.7708 16.55 17.65 16.4333 17.5 16.35C16.6 15.9 15.6917 15.5625 14.775 15.3375C13.8583 15.1125 12.9333 15 12 15C11.0667 15 10.1417 15.1125 9.225 15.3375C8.30833 15.5625 7.4 15.9 6.5 16.35C6.35 16.4333 6.22917 16.55 6.1375 16.7C6.04583 16.85 6 17.0167 6 17.2V18ZM12 10C12.55 10 13.0208 9.80417 13.4125 9.4125C13.8042 9.02083 14 8.55 14 8C14 7.45 13.8042 6.97917 13.4125 6.5875C13.0208 6.19583 12.55 6 12 6C11.45 6 10.9792 6.19583 10.5875 6.5875C10.1958 6.97917 10 7.45 10 8C10 8.55 10.1958 9.02083 10.5875 9.4125C10.9792 9.80417 11.45 10 12 10Z"
                    fill="#A8A8A8" />
                </g>
              </svg>
            </div>
            <div class="log-in-input-box">
              <input id="sign_email" required type="email" placeholder="Email" />
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <mask id="mask0_100427_6065" style="mask-type: alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24"
                  height="24">
                  <rect width="24" height="24" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_100427_6065)">
                  <path
                    d="M4 20C3.45 20 2.97917 19.8042 2.5875 19.4125C2.19583 19.0208 2 18.55 2 18V6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4H20C20.55 4 21.0208 4.19583 21.4125 4.5875C21.8042 4.97917 22 5.45 22 6V18C22 18.55 21.8042 19.0208 21.4125 19.4125C21.0208 19.8042 20.55 20 20 20H4ZM20 8L12.525 12.675C12.4417 12.725 12.3542 12.7625 12.2625 12.7875C12.1708 12.8125 12.0833 12.825 12 12.825C11.9167 12.825 11.8292 12.8125 11.7375 12.7875C11.6458 12.7625 11.5583 12.725 11.475 12.675L4 8V18H20V8ZM12 11L20 6H4L12 11ZM4 8.25V6.775V6.8V6.7875V8.25Z"
                    fill="#A8A8A8" />
                </g>
              </svg>
            </div>
            <div class="log-in-input-box">
              <input id="sign_password" onkeyup='checkPass();' required minlength="4" type="password"
                placeholder="Password" />
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <mask id="mask0_100427_6072" style="mask-type: alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24"
                  height="24">
                  <rect width="24" height="24" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_100427_6072)">
                  <path
                    d="M6 22C5.45 22 4.97917 21.8042 4.5875 21.4125C4.19583 21.0208 4 20.55 4 20V10C4 9.45 4.19583 8.97917 4.5875 8.5875C4.97917 8.19583 5.45 8 6 8H7V6C7 4.61667 7.4875 3.4375 8.4625 2.4625C9.4375 1.4875 10.6167 1 12 1C13.3833 1 14.5625 1.4875 15.5375 2.4625C16.5125 3.4375 17 4.61667 17 6V8H18C18.55 8 19.0208 8.19583 19.4125 8.5875C19.8042 8.97917 20 9.45 20 10V20C20 20.55 19.8042 21.0208 19.4125 21.4125C19.0208 21.8042 18.55 22 18 22H6ZM6 20H18V10H6V20ZM12 17C12.55 17 13.0208 16.8042 13.4125 16.4125C13.8042 16.0208 14 15.55 14 15C14 14.45 13.8042 13.9792 13.4125 13.5875C13.0208 13.1958 12.55 13 12 13C11.45 13 10.9792 13.1958 10.5875 13.5875C10.1958 13.9792 10 14.45 10 15C10 15.55 10.1958 16.0208 10.5875 16.4125C10.9792 16.8042 11.45 17 12 17ZM9 8H15V6C15 5.16667 14.7083 4.45833 14.125 3.875C13.5417 3.29167 12.8333 3 12 3C11.1667 3 10.4583 3.29167 9.875 3.875C9.29167 4.45833 9 5.16667 9 6V8Z"
                    fill="#A8A8A8" />
                </g>
              </svg>
            </div>

            <div class="log-in-input-box">
              <input id="sign_password_confirm" onkeyup='checkPass();' required minlength="4" type="password"
                placeholder="Confirm Password" />
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <mask id="mask0_100427_6072" style="mask-type: alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24"
                  height="24">
                  <rect width="24" height="24" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_100427_6072)">
                  <path
                    d="M6 22C5.45 22 4.97917 21.8042 4.5875 21.4125C4.19583 21.0208 4 20.55 4 20V10C4 9.45 4.19583 8.97917 4.5875 8.5875C4.97917 8.19583 5.45 8 6 8H7V6C7 4.61667 7.4875 3.4375 8.4625 2.4625C9.4375 1.4875 10.6167 1 12 1C13.3833 1 14.5625 1.4875 15.5375 2.4625C16.5125 3.4375 17 4.61667 17 6V8H18C18.55 8 19.0208 8.19583 19.4125 8.5875C19.8042 8.97917 20 9.45 20 10V20C20 20.55 19.8042 21.0208 19.4125 21.4125C19.0208 21.8042 18.55 22 18 22H6ZM6 20H18V10H6V20ZM12 17C12.55 17 13.0208 16.8042 13.4125 16.4125C13.8042 16.0208 14 15.55 14 15C14 14.45 13.8042 13.9792 13.4125 13.5875C13.0208 13.1958 12.55 13 12 13C11.45 13 10.9792 13.1958 10.5875 13.5875C10.1958 13.9792 10 14.45 10 15C10 15.55 10.1958 16.0208 10.5875 16.4125C10.9792 16.8042 11.45 17 12 17ZM9 8H15V6C15 5.16667 14.7083 4.45833 14.125 3.875C13.5417 3.29167 12.8333 3 12 3C11.1667 3 10.4583 3.29167 9.875 3.875C9.29167 4.45833 9 5.16667 9 6V8Z"
                    fill="#A8A8A8" />
                </g>
              </svg>
            </div>
            <span id='message'></span>
            <div class="sing-up-check-box">
              <input required style="margin-right: 10px; color: black"  type="checkbox" id="sing-up-check" name="sing-up-check"
                 checked onclick="ifChecked()"/><label style="font-size: 2rem" for="sing-up-check">I accept the  <a style="padding-left: 10px" class="sign-up-link"
                  href="privacy_policy_without_log_in.html" target="_blank">Privacy policy</a></label>
            </div>


            <div class="sign-up-btn-container"> <button disabled id="register_btn" class="btn-sign-up reg-btn">
                Sign up
              </button></div>
          </form>
      </div>
    `
}