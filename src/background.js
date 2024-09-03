// Listener for when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");

    // Create a context menu item with the id "makeMeSpecial"
    chrome.contextMenus.create({
        id: "makeMeSpecial",
        title: "MAKE ME SPECIAL",
        contexts: ["all"] // Make the context menu available in all contexts
    });
    console.log("Context menu created");
});

// Listener for when a context menu item is clicked
chrome.contextMenus.onClicked.addListener((info, tab) => {
    console.log("Context menu item clicked");

    // Check if the clicked menu item is "makeMeSpecial" and if a tab is available
    if (info.menuItemId === "makeMeSpecial" && tab) {
        console.log("makeMeSpecial menu item clicked");

        // Group the tab and get the groupId (returns a promise)
        const groupId = chrome.tabs.group({ tabIds: [tab.id] });

        // Handle the promise to get the actual groupId
        groupId.then((id) => {
            console.log("Tab grouped, groupId:", id);
            // You can add further actions here using the groupId
        }).catch((error) => {
            console.error("Error grouping tab:", error);
        });
    }
});