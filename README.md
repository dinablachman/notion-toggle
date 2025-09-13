### notion sidebar toggle (chrome mv3)

a tiny extension to fix a missing feature in Notion: there is no built‑in way to toggle the right sidebar (context panel). this adds a simple keyboard toggle and an optional auto‑hide.

<video width="600" controls>
  <source src="https://github.com/dinablachman/notion-toggle/raw/main/assets/notion-toggle-demo.mp4" type="video/mp4">
  your browser does not support the video tag.
</video>

### features
- keyboard toggle: cmd+/ (mac) or ctrl+/ (windows/linux)
- optional auto‑hide (set from the extension popup)
- lightweight, mv3, no background worker

### install

**option 1: from release (recommended)**
1. download the latest release: https://github.com/dinablachman/notion-toggle/releases/latest
2. unzip the downloaded file
3. in chrome: extensions → enable developer mode → click "load unpacked" → select the unzipped folder

**option 2: from source**
1. clone this repo
2. in chrome: extensions → enable developer mode → click "load unpacked" → select this folder

### usage
- open any page containing Notion Calendar content embeds. (Notion Calendar, Notion, etc).
- press cmd+/ or ctrl+/ to toggle the right sidebar.
- open the extension popup to enable/disable auto‑hide (refresh may be needed).

### permissions
- storage (for saving the auto‑hide setting)

### license
mit license - see license file for details