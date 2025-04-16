// Global variables for tracking tabs and operations
let pendingTabId = null;
let isProcessingPopup = false;

// Create context menu item when extension is installed
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'createTabGroup',
        title: 'Create or Rename Tab Group',
        contexts: ['action']
    });
});

// Handle browser action clicks (toolbar button)
chrome.action.onClicked.addListener(tab => handleTabAction(tab));

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'createTabGroup') {
        chrome.tabs.query({ active: true, currentWindow: true }, ([activeTab]) => {
            activeTab && handleTabAction(activeTab);
        });
    }
});

// Track popup window closure
chrome.windows.onRemoved.addListener(() => isProcessingPopup = false);

// Main function to handle tab grouping
async function handleTabAction(tab) {
    try {
        pendingTabId = tab.id;
        isProcessingPopup = true;
        
        const tabInfo = await chrome.tabs.get(tab.id);
        
        // First create unnamed group if tab isn't already in one
        if (!tabInfo.groupId || tabInfo.groupId === -1) {
            await chrome.tabs.update(tab.id, { active: true });
            try {
                await chrome.tabs.group({ tabIds: [tab.id] });
            } catch (err) {
                if (err.message.includes("normal windows")) {
                    const normalWindows = await chrome.windows.getAll({windowTypes: ['normal']});
                    if (normalWindows.length > 0) {
                        await chrome.tabs.move(tab.id, { windowId: normalWindows[0].id, index: -1 });
                        await chrome.tabs.update(tab.id, { active: true });
                        await chrome.tabs.group({ tabIds: [tab.id] });
                    }
                }
            }
        }
        
        // Open popup for naming
        chrome.windows.create({
            url: 'popup-dialog.html',
            type: 'popup',
            width: 400,
            height: 200
        });
    } catch (err) {
        isProcessingPopup = false;
    }
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "createGroup" && message.groupName && pendingTabId) {
        (async () => {
            try {
                const tabInfo = await chrome.tabs.get(pendingTabId);
                if (tabInfo.groupId && tabInfo.groupId !== -1) {
                    await chrome.tabGroups.update(tabInfo.groupId, { 
                        title: message.groupName,
                        color: "blue" 
                    });
                    sendResponse({success: true});
                }
            } catch (err) {
                sendResponse({success: false, error: err.message});
            } finally {
                if (sender.tab?.windowId) chrome.windows.remove(sender.tab.windowId);
                isProcessingPopup = false;
            }
        })();
        return true; // Keep listener alive for async response
    }
});