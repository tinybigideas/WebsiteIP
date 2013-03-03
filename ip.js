// Set variables
var websiteIP_status, setPosition;
var url = window.location.host;

$(document).ready(function() {
	
	// Set position to left for these websites
	var noRight = new Array();
		noRight[0] = "www.facebook.com";
		noRight[1] = "www.google.com";
		
	//Check if on noRight array and set position accordingly
	var noRightCheck = $.inArray(url, noRight);
	
	if (noRightCheck >= 0) {
		setPosition = "left";
	}
	else {
		setPosition = "right";
	}
	
	chrome.extension.sendMessage({name: "getIP"}, function(response) {
		var finalIP = response.domainToIP;
		chrome.extension.sendMessage({name: "getOptions"}, function(response) {
			var websiteIP_status = response.enableDisableIP;
			if (websiteIP_status == "Disable" || typeof websiteIP_status == 'undefined') {
				$("body").append('<div id="chrome_websiteIP" class="chrome_websiteIP_' + setPosition + '">' + finalIP + '</div>');
			}
		});
	});
	
	$("#chrome_websiteIP").live('mouseover', function() {
		if ($(this).hasClass('chrome_websiteIP_right')) {
			$(this).removeClass("chrome_websiteIP_right");
			$(this).addClass("chrome_websiteIP_left");
		}
		else {
			$(this).removeClass("chrome_websiteIP_left");
			$(this).addClass("chrome_websiteIP_right");
		}
	});
	
	loadOptions(); //To set default value on pop-up button

});

function loadOptions() {
	chrome.extension.sendMessage({name: "getOptions"}, function(response) {
		var enableDisableIP = response.enableDisableIP;
		
		// set default as disabled
		if (typeof enableDisableIP == 'undefined') {
			chrome.extension.sendMessage({name: "setOptions", status: 'Disable'}, function(response) {});
		}
	});
}

// popup button clicked
document.addEventListener('DOMContentLoaded', function () {
	chrome.extension.sendMessage({name: "getOptions"}, function(response) {
		$("#EnableDisableIP").val(response.enableDisableIP);
	});
	
	document.querySelector('input').addEventListener('click', function() {
		if ($('#EnableDisableIP').val() == "Disable") {
			// save to localstore
			chrome.extension.sendMessage({name: "setOptions", status: 'Enable'}, function(response) {});
			$('#EnableDisableIP').val('Enable')	
		}
		else if ($('#EnableDisableIP').val() == "Enable") {
			// save to localstore
			chrome.extension.sendMessage({name: "setOptions", status: 'Disable'}, function(response) {});
			$('#EnableDisableIP').val('Disable')
		}
	});
});
