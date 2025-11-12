// ==UserScript==
// @name         Service-Now Midmark Button
// @namespace    https://github.com/Jordan-Freund/SN_Improvements
// @version      0.2.0
// @description  Add button to autocomplete Midmark Tasks
// @author       Jordan Lang
// @homepageURL  https://github.com/Jordan-Freund/SN_Improvements
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
        task();
        break;
    default:
        break;
    }
})();
function task() {
    wait_for_element("[id='sc_task.short_description']",(node) => {
        if (node.value.includes("Midmark")) {
            console.debug("Midmark found in short description!");
            add_header_button("Midmark Install", AWHMidmark);
        }
    });
}

const AWHMidmark = () => {
    console.log("Testing");
    g_form.setValue("work_notes", "Installed and configured Midmark.");
    g_form.setValue("state", 3);
    g_form.setValue("u_category", "Hardware");
    setTimeout(() => {g_form.save();}, 200);
}
