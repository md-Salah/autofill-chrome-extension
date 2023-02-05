chrome.tabs.onUpdated.addListener(async (tabId, tab) => {
  // console.log('background.js');
  // console.log(tab.url);

  let { userInfo } = await chrome.storage.local.get(["userInfo"]);

  chrome.tabs.sendMessage(tabId, {
    type: "NEW_TAB",
    url: tab.url,
    userInfo: userInfo,
  });
});
