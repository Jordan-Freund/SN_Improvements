// ==UserScript==
// @name         AutoCloseMidmark
// @namespace    https://github.com/Jordan-Freund/SN_Improvements
// @version      0.1.0
// @description  Add button to autocomplete Midmark Tasks
// @author       Jordan Lang
// @homepageURL  https://github.com/VivianVerdant/service-now-userscripts
// @match        https://*.service-now.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=service-now.com
// @require      https://github.com/VivianVerdant/service-now-userscripts/raw/refs/heads/main/lib/Service-Now-Utilities.js
// @require      https://github.com/VivianVerdant/service-now-userscripts/raw/refs/heads/main/lib/wait_for_element.js
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

/* globals page_header create_node create_button create_header_button add_header_button*/
/* globals wait_for_element */
/* globals GlideRecord g_form g_user g_navigation*/

(function() {
    'use strict';

    document.onkeydown = function(e) {
		if( e.ctrlKey && e.key === 's' ){
			e.preventDefault();
            try {
                g_form.save();
            } catch(e) {}
		}
	};

    var location = new URL(window.location.href);

    if (location.pathname.startsWith("/now/")) {
        location = location.pathname.match(/\/[a-z_]*(?=%)/);
    } else {
        location = location.pathname;
    }
    console.debug(location);


switch (location) {
    case "/sc_task.do":
        console.log("This tab is a TASK");
        wait_for_element("sc_task.short_description", searchDescription, true, document);
        searchDescription("sc_task.short_description");
        console.log("Completed Waiting for Element");
        break;
    default:
        break;
    }
})();
function task() {
    const page_type = "AWHMidmark";
    add_header_button("Midmark Install", AWHMidmark);
}

function searchDescription() {
    window.addEventListener('load', () => {
    console.log("Searching for Midmark Info");
    const shortDescField = document.getElementById("sc_task.short_description");
    if (shortDescField) {
        const textValue = shortDescField.value || shortDescField.textContent;
        if (textValue.includes("Midmark")) {
            console.log("Midmark found in short description!");
            task();
        } else {
            console.log("Midmark not found.");
        }
    } else {
    console.warn("Short description field not found.");
    }
    });
}

const AWHMidmark = () => {
    const workNotesField = document.getElementById("activity-stream-work_notes-textarea");
    console.log("Testing");
    g_form.setValue("work_notes", "Installed and configured Midmark.");
    g_form.setValue("state", 3);
    g_form.setValue("u_category", "Hardware");
    workNotesField.className = "sn-string-textarea form-control ng-isolate-scope ng-touched ng-dirty ng-valid-parse ng-not-empty ng-valid ng-valid-required";
    workNotesField.setAttribute("aria-invalid", "false")
    setTimeout(() => {g_form.save();}, 200);
}

function getFieldByLabel(labelText) {
    const labels = Array.from(document.querySelectorAll("label"));
    for (const label of labels) {
        return console.log(label);
        if (label.textContent.trim() === labelText) {
            const fieldContainer = label.closest(".form-group, .form-field");
            return console.log("CHECKING FOR PARENT TAG");
            if (fieldContainer) {
                return fieldContainer.querySelector("input, textarea, select");
            }
        }
    }
    return null;

}
