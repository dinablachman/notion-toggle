const DEFAULT_OPEN_WIDTH = "250px";
const WIDTH_KEY = "ncst_open_width";
const AUTO_HIDE_KEY = "ncst_auto_hide";

let autoHideEnabled = false;

function isTextEditing(el) {
  if (!el) return false;
  // ignore when typing in inputs, textareas, contenteditable, or ARIA textboxes
  if (el.closest('input, textarea, [contenteditable="true"], [role="textbox"]')) return true;
  let cur = el;
  while (cur) {
    if (cur.nodeType === 1 && cur.getAttribute && cur.getAttribute("contenteditable") === "true") {
      return true;
    }
    cur = cur.parentElement;
  }
  return false;
}

function getCurrentWidth() {
  const root = document.documentElement;
  const val = getComputedStyle(root).getPropertyValue("--context-panel-width").trim();
  return val || "0px";
}

function setWidth(px) {
  document.documentElement.style.setProperty("--context-panel-width", px);
}

function getOpenWidth() {
  return localStorage.getItem(WIDTH_KEY) || DEFAULT_OPEN_WIDTH;
}

function saveOpenWidth(px) {
  try { localStorage.setItem(WIDTH_KEY, px); } catch {}
}

function toggleSidebar() {
    const root = document.documentElement;
    const current = getComputedStyle(root).getPropertyValue("--context-panel-width").trim();
    const openWidth = getOpenWidth();
    const next = current === "0px" ? openWidth : "0px";
  
    root.style.setProperty("--context-panel-width", next);
  
    // force notion + embeds to redraw
    window.dispatchEvent(new Event("resize"));
  }

function hideSidebar() {
  setWidth("0px");
  window.dispatchEvent(new Event("resize"));
}

async function checkAutoHideSetting() {
  try {
    const result = await chrome.storage.sync.get([AUTO_HIDE_KEY]);
    autoHideEnabled = result[AUTO_HIDE_KEY] || false;
    
    if (autoHideEnabled) {
      // Wait a bit for Notion to initialize, then hide the sidebar
      setTimeout(() => {
        hideSidebar();
      }, 100);
    }
  } catch (error) {
    console.error('Error checking auto-hide setting:', error);
  }
}
  

function nudgeInitialWidth() {
  // if Notion hasn’t initialized the var yet, this no-ops until it exists.
  // optional: if the panel is open, remember its width once.
  const current = getCurrentWidth();
  if (current !== "0px" && current !== "") {
    saveOpenWidth(current);
  }
}

// handle cmd+/ (mac) or ctrl+/ (win/linux)
document.addEventListener("keydown", (e) => {
  const slashPressed = e.key === "/";
  const metaOrCtrl = e.metaKey || e.ctrlKey;

  if (!metaOrCtrl || !slashPressed) return;
  if (isTextEditing(document.activeElement)) return; // don't interfere with typing
  
  // If auto-hide is enabled, don't allow manual toggling
  if (autoHideEnabled) return;

  e.preventDefault();
  e.stopPropagation();

  toggleSidebar();
}, { capture: true });

nudgeInitialWidth();

// Check auto-hide setting on page load
checkAutoHideSetting();

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'autoHideSettingChanged') {
    autoHideEnabled = request.enabled;
    if (autoHideEnabled) {
      hideSidebar();
    }
    // If disabled, we don't need to do anything - user can toggle manually again
  }
});

