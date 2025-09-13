const AUTO_HIDE_KEY = "ncst_auto_hide";

// Load the current auto-hide setting
async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get([AUTO_HIDE_KEY]);
    const autoHide = result[AUTO_HIDE_KEY] || false;
    document.getElementById('autoHideToggle').checked = autoHide;
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

// Save the auto-hide setting
async function saveAutoHideSetting(enabled) {
  try {
    await chrome.storage.sync.set({ [AUTO_HIDE_KEY]: enabled });
    
    // Notify content script about the setting change
    const tabs = await chrome.tabs.query({ 
      active: true, 
      currentWindow: true 
    });
    
    if (tabs[0]) {
      // Send message to the active tab; ignore if no receiver (not a Notion tab)
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          action: 'autoHideSettingChanged',
          enabled: enabled
        },
        () => {
          // Access lastError to silence unchecked runtime.lastError when there is no receiver
          void chrome.runtime.lastError;
        }
      );
    }
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

// Handle toggle change
document.getElementById('autoHideToggle').addEventListener('change', (e) => {
  saveAutoHideSetting(e.target.checked);
});

// Load settings when popup opens
document.addEventListener('DOMContentLoaded', loadSettings);
