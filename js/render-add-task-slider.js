function generateAddTaskSliderHTML(bucket, id = 0) {
	return /*HTML*/ `
<div id="task_open_overlay_frame" class="slider-frame" onclick="doNotForward(event); closeContactOverlay('et_contact_overlay', 'et_selected_contacts')">
    <div class="add-task-head">
        <h1>Add Task</h1>
        <div class="close-button" onclick="hideTaskOpen('task_open_overlay_frame')">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                fill="none">
                <mask id="mask0_99234_5574" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0"
                    y="0" width="24" height="24">
                    <rect width="24" height="24" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_99234_5574)">
                    <path
                        d="M12 13.4L7.1 18.3C6.91667 18.4834 6.68333 18.575 6.4 18.575C6.11667 18.575 5.88333 18.4834 5.7 18.3C5.51667 18.1167 5.425 17.8834 5.425 17.6C5.425 17.3167 5.51667 17.0834 5.7 16.9L10.6 12L5.7 7.10005C5.51667 6.91672 5.425 6.68338 5.425 6.40005C5.425 6.11672 5.51667 5.88338 5.7 5.70005C5.88333 5.51672 6.11667 5.42505 6.4 5.42505C6.68333 5.42505 6.91667 5.51672 7.1 5.70005L12 10.6L16.9 5.70005C17.0833 5.51672 17.3167 5.42505 17.6 5.42505C17.8833 5.42505 18.1167 5.51672 18.3 5.70005C18.4833 5.88338 18.575 6.11672 18.575 6.40005C18.575 6.68338 18.4833 6.91672 18.3 7.10005L13.4 12L18.3 16.9C18.4833 17.0834 18.575 17.3167 18.575 17.6C18.575 17.8834 18.4833 18.1167 18.3 18.3C18.1167 18.4834 17.8833 18.575 17.6 18.575C17.3167 18.575 17.0833 18.4834 16.9 18.3L12 13.4Z"
                        fill="#2A3647" />
                </g>
            </svg>
        </div>
    </div>
    <!-- Add Task Content -->
    <!-- Left side Add Task -->
    <form class="add-task-container" novalidate="">
        <div class="left-side-slider">
            <!-- Title Add Task -->
            <div class="title-content-slider">
                <div class="span-style-slider">Title <span class="required-star-slider">*</span>
                </div>

                <input required="" placeholder="Enter a title" id="enter_title_field" type="text"
                    autocomplete="off" class="input-frame-ed-task">
                <div class="error-message-slider d-none" id="title_error_slider">This field is required</div>
            </div>
            <!-- Description Add Task -->
            <div class="slider-description">
                <span class="span-style-slider">Description</span>
                <textarea required="" placeholder="Enter a Description" name=""
                    class="description-textarea" cols="20" rows="10" id="enter_description_field"></textarea>
                <div></div>
            </div>
            <!-- Assigned To Add Task -->
            <div class="subhead-container-ed-task">
                <div class="subhead-ed-task">Assigned to</div>
                <div class="assigned-to-input-slider" onclick="doNotForward(event)">
                    <input id="et_select_contacts_search" class="assigned-to-slider" type="text "
                        placeholder="Select contacts to assign" autocomplete="off" onkeyup="filterUserOnAssignedTo('et_select_contacts_search', 'et_contact_overlay', ${id})">
                    <img id="select-contacts_down" class="select-contacts-dropdown" src="./assets/img/arrow_drop_down.svg"
                    alt="Select Contacts Button" onclick="openContactOverlay('et_contact_overlay','et_selected_contacts')">
                    <img id="select-contacts_up" class="select-contacts-dropdown d-none" src="./assets/img/arrow_drop_up.svg"
                    alt="Select Contacts Button" onclick="closeContactOverlay('et_contact_overlay', 'et_selected_contacts')">

                </div>
                <div class="p-relative">
                    <div class="contact-overlay d-none" id="et_contact_overlay" onclick="doNotForward(event)">
                        <!-- Contact for render -->
                        
                    </div>
                    <div id="et_selected_contacts" class="selected-contacts">
                        <!-- select contact -->

                    </div>
                </div>
            </div>

        </div>

        <div class="separator"></div>
        <!-- Right side Add Task -->
        <div class="right-side-slider">

        <!-- Due Date Add Task -->
            <div class="date-container-slider">
                <div class="span-style-slider">Due date
                    <span class="required-star-slider">*</span>
                </div>
                <input class="calendar-task" required type="date" id="date_field" placeholder="tt.mm.jjjj">
                <div class="error-message-slider d-none" id="date_error_slider">This field is required</div>
            </div>
            <!-- Prio Add Task -->
            <div class="prio-container">
                <div class="prio-field">Prio</div>
                <div class="status-container">
                    <div id="Urgent_container" onclick="changePrioColor('Urgent')" class="status-definition-container">
                        Urgent<img id="Urgent_img" class="prio-images" src="./assets/img/Urgent.svg" />
                    </div>
                    <div id="Medium_container" onclick="changePrioColor('Medium')" class="status-definition-container">
                        Medium<img id="Medium_img" class="prio-images" src="./assets/img/Medium.svg" />
                    </div>
                    <div id="Low_container" onclick="changePrioColor('Low')" class="status-definition-container">
                        Low<img id="Low_img" class="prio-images" src="./assets/img/Low.svg" />
                    </div>
                </div>
            </div>
            <!-- Category Add Task -->
            <div class="category-container">
                <div class="span-style-slider">Category <span class="required-star-slider">*</span>
                </div>
                <select class="select-category" required name="Select contacts to assign" id="select_category_field">
                    <option value="" disabled="" selected="" hidden="">Select task
                        category
                    </option>
                    <option value="Technical Task">Technical Task</option>
                    <option value="User Story">User Story</option>
                </select>
                <div class="error-message-slider d-none" id="category_error_slider">This field is required</div>
            </div>

            <!-- Subtask-->
            <div id="subtask_container_slider" class="subtask-container-slider">
                <div class="subhead-ed-task">Subtasks</div>
                <div class="subtask-input-container">
                    <input id="add_new_subtask_field" class="subtask-input-slider" type="text" placeholder="Add new subtask"
                        autocomplete="off">
                    <img id="add_subtask" class="add-subtask-slider" src="./assets/img/add-plus-icon.svg"
                        alt="Add Subtasks" onclick="showSubtaskInput('add_subtask', 'check_subtask_icons')">

                    <div id="check_subtask_icons" class="check-subtask-icons d-none">
                        <img class="subtask-button-slider" src="./assets/img/add-cancel-icon.svg"
                            alt="Cancel Subtask" onclick="cancelAddSubtask('add_subtask', 'check_subtask_icons')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="2" height="24" viewBox="0 0 2 24"
                            fill="none">
                            <path d="M1.14453 0V24" stroke="#D1D1D1" />
                        </svg>
                        <img class="subtask-button-slider" src="./assets/img/add-check-icon.svg"
                            alt="Check Substask" onclick="createSubtasks()">

                    </div>
                </div>

                <div id="subtask_lists">
                    
                    
                </div>
            </div>
        </div>
    </form>
    <footer class="footer-subtask-slider">

        <div id="required_info" class="required_info">
            <span><span class="required-star-slider">*</span>This field is
                required</span>
        </div>

        <div class="clear-create-subtask-btn">
            <button onclick="hideTaskOpen('task_open_overlay_frame')" type="button" id="clear_btn">
                Cancel
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M12.2496 11.9998L17.4926 17.2428M7.00659 17.2428L12.2496 11.9998L7.00659 17.2428ZM17.4926 6.75684L12.2486 11.9998L17.4926 6.75684ZM12.2486 11.9998L7.00659 6.75684L12.2486 11.9998Z"
                        stroke="#2A3647" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round"></path>
                </svg>
            </button>
            <button onclick="submitForm('${bucket}')" type="button" id="create_btn">
                Create Task <img src="./assets/img/add-check-icon-white.svg" alt="Add Subtask">
            </button>
        </div>


    </footer>

</div>   
    
    
    `;
}
