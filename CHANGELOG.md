# Release Notes

## v1.13.1 (2025-10-02)
- 🐛 Fixed Chromium error for using badge on extension icon

## v1.13.0 (2025-10-02)
- 🐛 Fixed issue with creating private group and it wouldn't remember the password the user entered. Plus, this change improved the performance of creating a private group
- 🐛 Fixed incorrect bytes calculation on Firefox-based browsers. It was showing used space a little bit more than it really was
- 🐛 Fixed wrong groups sort order when you import all groups. Now, groups will be in the same order that they were when you exported them
- 🧑‍💻 Remove "import" button from importing groups on settings page [#60](https://github.com/tab-guardian/tab-guardian/issues/60)
- 🧑‍💻 A lot of refactoring and rewriting logic for creating a new group
- 🧑‍💻 When you add a new tab to a group, it will be appended to the end instead of the list
- 🧑‍💻 Now, when you open tabs, additional empty pages like `about:blank` and `about:privatebrowsing` will be automatically closed [#64](https://github.com/tab-guardian/tab-guardian/issues/64)
- 🧑‍💻 Remove `Import` buttom from settings page. Now, when you select a file, it will be automatically uploaded [#60](https://github.com/tab-guardian/tab-guardian/issues/60)
- 🧑‍💻 Now, you cannot rename private groups without unlocking them [#56](https://github.com/tab-guardian/tab-guardian/issues/56)
- 🧑‍💻 Change enter password max attempts to 5 and lock duration to 10 minutes. It means you have 5 attempts to enter the correct password, after which you will be unable to enter a password for 10 minutes
- 🧑‍💻 Refactored settings page into a different design
- 🧑‍💻 Added "Clear Cache" section to settings which only appears if you have any useless data in your cache that can be safely deleted to free up the space
- ✨ Added 3 more black and white icons for groups
- ✨ Added a spinner to the main (home) page where groups are loaded [#70](https://github.com/tab-guardian/tab-guardian/issues/70)
- ✨ Added a spinner when you export all groups in settings, which indicates that groups are being exported [#68](https://github.com/tab-guardian/tab-guardian/issues/68)
- ✨ Added a spinner to the "Export a group" button in group popup menu [#66](https://github.com/tab-guardian/tab-guardian/issues/66)
- ✨ Added a spinner to the "Create" button when you create a group or add more links to it [#67](https://github.com/tab-guardian/tab-guardian/issues/67)
- ✨ Added functionality that prevents from overloading storage. It will give you an error message that you used all of your quota [#58](https://github.com/tab-guardian/tab-guardian/issues/58)
- ✨ Added "Remember my password after unlock" option to settings, which you can toggle [#62](https://github.com/tab-guardian/tab-guardian/issues/62)
- ✨ Added minimum password length requirement with `6` characters [#63](https://github.com/tab-guardian/tab-guardian/issues/63)
- ✨ Added the ability to make your private groups open [#69](https://github.com/tab-guardian/tab-guardian/issues/69)
- ✨ Extension icon shows a red warning square when you have at least 1 private group unlocked. It also adds a bell icon to the navbar that tells you that you have a private group unlocked [#52](https://github.com/tab-guardian/tab-guardian/issues/52)

## v1.12.0 (2025-09-24)
- ✨ Added improved encryption algoriphm `AES-GCM` with WEB Crypto API without breaking backward compatibility [#54](https://github.com/tab-guardian/tab-guardian/issues/54)
- ✨ Added showing a warning message on private groups that use the old encryption implementation to suggest them to re-encrypt for improved security
- ✨ Added a loading spinner that appears when you unlock and lock the private group [#55](https://github.com/tab-guardian/tab-guardian/issues/55)
- ✨ Added a progress bar that shows progress on encryption and decryption of groups
- 🧑‍💻 Change password attempts from 2 to 3 for incorrect password because 3 is a sweet spot
- 🧑‍💻 Change keybind from `command + k` to `control+command+k` on macos

## v1.11.0 (2025-09-10)
- 🧑‍💻 Improve helping messages in settings
- 🐛 Fixed type in "Erase all groups" message
- 🐛 Fixed displaying message after wrong password attempts [#46](https://github.com/tab-guardian/tab-guardian/issues/46)
- ✨ When you lock a private group, you can now change its password to a new one [#41](https://github.com/tab-guardian/tab-guardian/issues/41)

## v1.10.0 (2025-09-05)
- ✨ Added copy and cut tabs from a group into a different group [#39](https://github.com/tab-guardian/tab-guardian/issues/39)
- ✨ Added 3 more black and white icons for groups
- ✨ Added emoji picker when you choose an emoji for your group as an icon
- ✨ Added preview for the image group icon when you choose it [#38](https://github.com/tab-guardian/tab-guardian/issues/38)
- 🧑‍💻 Changed: when you export a group, it will have a slugifying version of the group name. For example, 'Test Group' will have the name 'test-group.json'
- 🐛 Fixed not visible version number in the right bottom of the sidebar
- 🐛 Fixed a small style issue on a sidebar where the amount of bytes used were showing [#40](https://github.com/tab-guardian/tab-guardian/issues/40) [#42](https://github.com/tab-guardian/tab-guardian/issues/42)

## v1.9.3 (2025-08-13)
- Fixed wrong "Release Notes" link in the sidebar

## v1.9.2 (2025-08-13)
- Fixed issue with Chinese language not showing up in extension settings in Chrome developer dashboard

## v1.9.1 (2025-08-05)
- Fixes for Firefox-based browsers:
    - 🐛 Fixed "Move tabs into group" button not working properly. Tabs weren't closing
    - 🐛 Some links caused errors when opening them. Links like `about:debugging`, `about:config`, etc.
    - 🐛 You couldn't change group icons to some favicon icons before

## v1.9.0 (2025-07-23)
- ✨ Added support for Firefox based browsers
- 🧑‍💻 Added build script to `scripts` directory

## v1.8.1 (2025-07-05)
- 🧑‍💻 Added container engine support like Podman and Docker

## v1.8.0 (2025-05-19)
- ✨ To the "Last saved" and "Created at" fields on group details page added a tooltip `Date format is DD.MM.YYYY HH:SS` to let people know the format
- ✨ Storage usage number in the sidebar is now also formatted. Instead of a number like 34553 it will now show 34 553 with a space separator
- ✨ Added clearing search field after pressing Enter key
- 🧑‍💻 When you now open any tab (link) from the group, it will update the "Last updated" field on the group

## v1.7.4 (2025-05-17)
- 🐛 Fixed missing URL displayed when you hover over the "Bind to URL" select switch while creating a private group

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
