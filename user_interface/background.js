chrome.tabs.onUpdated.addListener(async (tabId, tab) => {
  // console.log('background.js');
  // console.log(tab.url);
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    let { userInfo } = await chrome.storage.local.get(["userInfo"]);

    if(true){
        chrome.tabs.sendMessage(tabId, {
          type: "NEW_TAB",
          url: tab.url,
          userInfo: userInfo,
        });
    }

    // Request for email update
    chrome.runtime.onMessage.addListener(
      async function(request, sender, sendResponse) {
        if (request.type == 'MAIL_UPDATE'){
          sendResponse({farewell: 'not solved'});
        }
      }
    );

  });
});
