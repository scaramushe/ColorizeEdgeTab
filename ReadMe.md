# Colorful Tabs Extension

## Overview

The Colorful Tabs extension allows you to add a context menu item to your Edge browser that creates a group consisting of this tab only
The idea is to mark the current tab and differ from tabs with the same icon

## Features

- Adds a context menu item "MAKE ME SPECIAL" to the Edge browser.
- Groups the selected tab into a new tab group.

## Installation

### Prerequisites

- Microsoft Edge browser (version 89 or later).

### Steps
Load your add-on into Microsoft Edge for testing:

Open Edge, go to edge://extensions/.

Enable "Developer mode" (toggle in the bottom left).

Click "Load unpacked" and select your add-on folder.


## Known issues\future plans

### The original idea + known blockers
- Right click on the tab name in the side panel. Does not work with the current APIs :(
- Choose the color and title for this API. The chrome.tabGroups.update API does not work for some reason

