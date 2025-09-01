const DEFAULT_OPEN_WIDTH = "250px";
const WIDTH_KEY = "ncst_open_width";

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
  if (isTextEditing(document.activeElement)) return; // don’t interfere with typing

  e.preventDefault();
  e.stopPropagation();

  toggleSidebar();
}, { capture: true });

nudgeInitialWidth();

// OPTIONAL: alt+cmd+= (or alt+ctrl+=) to quickly save the current open width as your default
document.addEventListener("keydown", (e) => {
  const plusPressed = e.key === "="; // the '+' key without shift
  const metaOrCtrl = e.metaKey || e.ctrlKey;
  if (!(metaOrCtrl && e.altKey && plusPressed)) return;
  if (isTextEditing(document.activeElement)) return;

  e.preventDefault();
  const current = getCurrentWidth();
  if (current !== "0px") {
    saveOpenWidth(current);
  } else {
    saveOpenWidth(DEFAULT_OPEN_WIDTH);
  }
}, { capture: true });
