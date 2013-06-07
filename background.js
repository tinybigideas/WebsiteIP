// Add icon to URL bar
function checkForValidUrl(tabId, changeInfo, tab) {
	chrome.pageAction.show(tab.id);
};

// Listen for any changes to the URL of any tab
chrome.tabs.onUpdated.addListener(checkForValidUrl);

// Set the item in the localstorage
function setItem(key, value) {
	window.localStorage.removeItem(key);
	window.localStorage.setItem(key, value);
}

// Get the item from local storage with the specified key
function getItem(key) {
	var value;
	try {
		value = window.localStorage.getItem(key);
	}catch(e) {
		value = "null";
	}
	return value;
}

// Extract domain name (DN) from URL
function url2dn (url) {
	var tmpa = document.createElement('a');
	tmpa.href = url;
	return tmpa.host;
}

// get IP using webRequest
var currentIPList	= {};
chrome.webRequest.onCompleted.addListener(
  function(info) {
	  currentIPList[ url2dn(info.url) ] = info.ip;
	return;
  },
  {
	urls: [],
	types: []
  },
  []
);

// Listeners
chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse)
	{
		switch (request.name)
		{
			
			case "setOptions":
				// request from the content script to set the options.
				//localStorage["websiteIP_status"] = websiteIP_status;
				localStorage.setItem("websiteIP_status", request.status);
			break;
			
			case "getOptions":
				// request from the content script to get the options.
				sendResponse({
					enableDisableIP : localStorage["websiteIP_status"]
				});
			break;
		
		case "getIP":
			var currentDN = url2dn(sender.tab.url);
			if (currentIPList[currentDN] !== undefined) {
				sendResponse({
					domainToIP: currentIPList[currentDN]
				});
			} else {
				sendResponse({
					domainToIP: null
				});
			}
			
		break;
		
			default:
			sendResponse({});
		}
	}
);
