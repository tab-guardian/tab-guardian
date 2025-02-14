# Release Notes

## v1.8.0 (2025-02-14)

## v1.7.3 (2025-02-04)
- 🐛 Fixed a bug where you after creating a private group, it was unlocked. Plus, you couldn't lock it because it was giving you an error `Something went wrong! Cannot remember your password`
- ✨ If, for some reason, the extension forgot the group password when you private group is unlocked, you'll be able to create a new password for the group

## v1.7.2 (2025-01-11)
- 🐛 Fixed a bug where we couldn't export any groups in settings, were getting an error "No groups to export"

## v1.7.1 (2025-01-08)
- 🧑‍💻 Remove 'Group views' stats from groups that was updated each time when we view the group

## v1.7.0 (2025-01-05)
- ✨ When you filter groups, you can press `Enter` to open the first group in the list
- 🐛 Bug fix. Sometimes, when you create a new group, it wasn't showing up immediately. The popup needed to be reloaded to see a new group. Now it fixed

## v1.6.0 (2024-12-02)
- ✨ Added 1 more icon for groups
- ✨ When the group is opened, it will show the number of tabs in the group
- ✨ Added "Details" page for the group where you can see all the details of the particular group
- ✨ Added the statistics of how many times the user opened tabs and viewed the group. You can access it on the group "Details" page

## v1.5.1 (2024-11-30)
- 🧑‍💻 Change internalization to match [Chrome i18n API](https://developer.chrome.com/docs/extensions/reference/api/i18n#concepts_and_usage)

## v1.5.0 (2024-11-29)
- 🧑‍💻 Added `Settings` button to the sidebar
- ✨ Added support for the Russian language 🇷🇺
- ✨ Added the ability to choose the language of the extension on the settings page
- ✨ When you open an extension, it will choose the language based on your browser language. If you chose a different language in the extension settings, it will use that language instead
- ✨ When renaming the group, you can now press `Enter` to save the new name
- ✨ Added support for the Chinese language 🇨🇳
- 🐛 Fix typos

## v1.4.4 (2024-10-31)
- ✨ Restore tabs button is now disabled if the group is empty
- 🐛 Bug fix [#7](https://github.com/tab-guardian/tab-guardian/issues/7). If you restore tabs from an empty group, it would error out
- 🐛 Bug fix [#8](https://github.com/tab-guardian/tab-guardian/issues/8). Reproduce by filtering groups, entering one, go back to main screen and you see only those groups that were visible when filtering. Other groups would not be visible

## v1.4.3 (2024-10-05)
- 🐛 Bug fix where you couldn't delete a group

## v1.4.2 (2024-09-19)
- 🐛 Additional group search fix following changes in the previous patch

## v1.4.1 (2024-09-19)
- 🐛 Bug fix. When you try to give a name to a group, it's not letting you to do that

## v1.4.0 (2024-09-18)
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