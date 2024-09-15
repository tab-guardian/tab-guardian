# Release Notes

## v1.4.0 (2024-09-16)
- 🐛 Fixed not working sorting of groups. When you change the group icon, the group should be first in the list since it's last edited group
- ✨ Added a new icon for groups Magnifying Glass
- ✨ Added the ability to search for a group on the main screen by typing the group name or tab title in the search box

## v1.3.0 (2024-09-15)
- ✨ Added the ability to set a custom group icon by providing a URL to an image. You can use any image you like
- ✨ Added a new icon for groups Face Smile
- 🧑‍💻 Added showing group icon on the group screen on the left side of the group name
- 🐛 Fixed overflowing text inside tip popups

## v1.2.0 (2024-09-12)
- ✨ Added 25 more icons that you can use for your groups
- 🐛 Fixed resorting groups when you open it. Recently opened group should be the first in the list
- ✨ Added the ability to set a custom emoji icon for your groups. You can use any emoji you like

## v1.1.0 (2024-08-22)
- 🐛 Removed showing error toast when restoring tabs from the main screen if the group is private. The error was "Group is already locked". It was happening because it was trying to encrypt the group twice. Now it will just encrypt once
- ✨ Added the ability to rebind a private group to a different URL in the dropdown menu. You can enter a new URL and click `Rebind` to bind the group to the new URL

## v1.0.0 (2024-08-20)
- Updated `README.md` with the latest information
- ✨ Added `Rate Us` link to the extension sidebar menu
- ✨ Added the ability to sort tabs when you are creating a new group
- ✨ Added the ability to sort tabs on the group screen where you can delete or add more tabs

## v0.1.0 (2024-08-08)
- ✨ You can save tabs and restore them later
- ✨ You can edit a group including adding and removing tabs from it
- ✨ You can create encrypted (locked) groups that require password to unlock
- ✨ All the pinned tabs are saved and restored as pinned tabs
- ✨ Tabs restored in the same order as they were saved
- ✨ Supports all the modern browsers: Brave, Edge, and Chrome
- ✨ Tab Guardian is very configurable to suit your needs
- ✨ You can privately export individual private tab group into an encrypted file and import it later or on another device or browser
- ✨ You can export all of your public tab groups into a file and import them later or on another device or browser
- ✨ You can set an icon for each group to make it easier to recognize
- ✨ You can bind a Tab Group to a specific URL so that it visible in the group list only when you are on that URL. This is useful if you want to hide a group and access it only when you are on a specific web page