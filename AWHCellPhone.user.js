// ==UserScript==
// @name         *TEST* Service-Now Edit Cell Task *TEST*
// @namespace    https://github.com/VivianVerdant/service-now-userscripts
// @version      0.1.0
// @description  Add buttons to automate cell phones
// @author       Jordan Lang
// @homepageURL  https://github.com/VivianVerdant/service-now-userscripts
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
            } catch(e) {};
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
	"LVSRAN":"725",
	"LVSSPR":"725",
	"LVSWES":"725",
	"LVSWLM":"725",
	"OKCMID":"405",
	"OKCSOU":"405",
	"OKCWIN":"405",
	"OMHNOM":"531",
	"OMHNOR":"531",
	"OMHWES":"531",
	"PHXAPA":"480",
	"PHXBET":"623",
	"PHXEAS":"480",
	"PHXMES":"480",
	"PHXNOR":"602",
	"PHXPAP":"602",
	"PHXPEO":"623",
	"PHXSOU":"480",
	"PHXSUN":"623",
	"PHXSUR":"623",
	"STLFER":"314",
	"STLNOR":"314",
	"STLOVE":"314",
	"STLSOU":"314",
	"TCSEAS":"520",
	"TCSNOR":"520",
	"TCSSOU":"520",
	"TMPBAY":"941",
	"TMPBEN":"941",
	"TMPBRA":"941",
	"TMPDUN":"727",
	"TMPGOL":"727",
	"TMPHOL":"727",
	"TMPLAR":"727",
	"TMPSTP":"727",
	"TMPVEN":"941",
	"TMPWES":"941",
	"TULGAR":"918",
	"TULSOU":"539",
	"TMPSOU":"941",
	"JAXARL":"904",
	"DENARV":"303",
	"DENENG":"303",
	"DENLWD":"720",
	"LITPBF":"870",
	"NVL WOODMONT":"615",
	"CLEPMA":"440",
	"CLEBRP":"216",
	"CLEELK":"440",
	"CLEMPH":"216"
}

function makeButtons() {
    const page_type = "AWHCellPhone";
    add_header_button("Order Cell",orderCellPhone);
    //add_header_button("CHG Area Code",()=>{g_form.addInfoMessage(page_type);});
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
    const locationAreaCode = locationTable[locationCode] || "Unknown Area Code";
    console.log(locationAreaCode);
    return locationAreaCode;
}

function findUserName() {
    let firstName = g_form.getValue("first_name");
    let lastName = g_form.getValue("last_name");
    return (firstName + " " + lastName);
}

function checkProvider() {
    const shortDescription = g_form.getValue("short_description");
    if (shortDescription.includes("Provider")) {
        return (" - Provider");
    } else {
        return ("");
    }

}

//function ritmActivation() {
	//console.log("Opening RITM page");
	//document.querySelectorAll('button.icon-info')[1].click();
	//setTimeout(openRitmWindow,2000);
    //setTimeout(shSelect,8000);
//}

//function shSelect() {
//const rows = document.querySelectorAll('.list2_body.-sticky-group-headers .list_row');
//rows.forEach(row => {
    // Get all cells with class 'vt' in the current row
    //const cells = row.querySelectorAll('.vt');
    // Check if any cell contains "S&H"
    //const containsSH = Array.from(cells).some(cell => cell.innerHTML.includes('S&amp;H'));
    //if (containsSH) {
        // Find the first link in the row and click it
        //const link = row.querySelector('a');
        //if (link) {
            //link.click();
            //console.log('Clicked link in row containing "S&H"');
        //} else {
            //console.warn('No link found in row containing "S&H"');
       //}
    //}
//});

//}

//function openRitmWindow() {
	//const ritmLinkList = document.querySelectorAll('a[href*="sc_req_item.do?sys_id="]');
	//const ritmLink = ritmLinkList[0];
	//ritmLink.click();
//}

function orderCellPhone() {
    console.log("Attempting to order cell phone");
    let tempLocation = getLocation().toUpperCase();
    let areaCode = findAreaCode(tempLocation);
    let userName = findUserName();
    let isProvider = checkProvider();
    let effectiveDate = g_form.getValue("effective_date");
    console.log(areaCode);
    //g_form.setValue("assignment_group","AWH-Hardware Procurement");
    g_form.setValue("assignment_group", "511c0b7fdb0101141ab5121d139619fb", "AWH-Hardware Procurement")
    g_form.setValue("short_description", `New Colleague - New Cell Phone Order - ${userName} - ${effectiveDate}${isProvider}`);
    g_form.setValue("work_notes", `Please order a new cell phone for ${userName}\nRequested Area Code: ${areaCode} (${tempLocation})\nThank you!`);
	//ritmActivation();
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
