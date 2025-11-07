// ==UserScript==
// @name         AWHCellPhone
// @namespace    https://github.com/Jordan-Freund/SN_Improvements
// @version      0.1.0
// @description  Add buttons to automate cell phone tasks for Archwell
// @author       Jordan Lang
// @homepageURL  https://github.com/Jordan-Freund/SN_Improvements
// @supportURL   https://github.com/VivianVerdant/service-now-userscripts/issues
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
        wait_for_element("sc_task.short_description", searchDescription("sc_task.short_description"), true, document);
        break;
    default:
        break;
    }
})();

const locationTable = {
    "BHMFIV":"659",
    "BHMMID":"205",
    "BHMROE":"205",
    "CLTEAS":"704",
    "CLTNOR":"704",
    "KSCIND":"816",
    "KSCOVE":"913",
    "KSCPRO":"816",
    "LVSCEN":"725",
    "LVSEAS":"725",
    "LVSGAL":"725",
    "LVSPAR":"725",
}

function makeButtons() {
    const page_type = "AWHCellPhone";
    add_header_button("Order Cell",orderCellPhone);
    add_header_button("CHG Area Code",()=>{g_form.addInfoMessage(page_type);});
}



function searchDescription() {
    window.addEventListener('load', () => {
    console.log("Searching for Cell Phone Info");
    const shortDescField = g_form.getValue("short_description").toLowerCase();
    const companyName = g_form.getReference("request_item.company").name;
    if (shortDescField) {
        //const textValue = shortDescField.value || shortDescField.textContent;
        if (shortDescField.includes("cell") && shortDescField.includes("new colleague") && companyName.includes("Archwell")) {
            console.log("Cell found in short description!");
            makeButtons();
            // You can trigger other logic here, like highlighting the field or sending a message
        } else {
            console.log("Cell Phone not found.");
        }
    } else {
    console.warn("Short description field not found.");
    }
    });
}

function getLocation() {
    console.log("attempting to get location");
    const locationValue = g_form.getReference("primary_location").full_name;
    console.log(locationValue);
    return locationValue;
}

function findAreaCode(locationCode) {
    console.log("Attempting to find Area Code");
    const locationAreaCode = locationTable[locationCode] || "Unknown Area Code"
    console.log(locationAreaCode);
    return locationAreaCode;
}

function findUserName() {
    let firstName = g_form.getValue("first_name")
    let lastName = g_form.getValue("last_name")
    return (firstName + " " + lastName);
}

function checkProvider() {
    const shortDescription = g_form.getValue("short_description");
    if (shortDescription.includes("Provider")) {
        return (" - Provider")
    } else {
        return ("");
    }

}

function orderCellPhone() {
    console.log("Attempting to order cell phone");
    let tempLocation = getLocation().toUpperCase();
    let areaCode = findAreaCode(tempLocation);
    let userName = findUserName();
    let isProvider = checkProvider();
    let effectiveDate = g_form.getValue("effective_date")
    console.log(areaCode);
    g_form.setValue("assignment_group","AWH-Hardware Procurement");
    g_form.setValue("short_description", `New Colleague - New Cell Phone Order - ${userName} - ${effectiveDate}${isProvider}`);
    g_form.setValue("work_notes", `Please order a new cell phone for ${userName}\nRequested Area Code: ${areaCode} (${tempLocation})\nThank you!`);
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
