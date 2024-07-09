# Tab Guardian
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Browser extension that allows you to

## Features
Here is what makes Tab Guardian a great tool for managing your tabs:

- [x] You can save tabs and restore them later
- [x] You can edit a group including adding and removing tabs from it
- [x] You can create encrypted (locked) groups that require password to unlock
- [x] All the pinned tabs are saved and restored as pinned tabs
- [x] Tabs restored in the same order as they were saved
- [x] Supports all the modern browsers: Brave, Edge, Firefox and Chrome
- [x] Tab Guardian is very configurable to suit your needs
- [x] You can privately export individual private tab group into an encrypted file and import it later or on another device or browser
- [x] You can export all of your public tab groups into a file and import them later or on another device or browser
- [ ] You can set an icon for each group to make it easier to recognize
- [ ] You can set a "Double Security" in settings. It will not only require a password to unlock a group, but also you must be on a specific domain to unlock it. For example, you can set a domain to be `serhii.io` and you will be able to unlock the group only when you are on `serhii.io` domain

## Links

- [Firefox extension](https://addons.mozilla.org/en-US/firefox/addon/tab-guardian)
- [Brave extension](https://addons.mozilla.org/en-US/firefox/addon/tab-guardian)
- [Edge extension](https://addons.mozilla.org/en-US/firefox/addon/tab-guardian)
- [Chrome extension](https://chrome.google.com/webstore/detail/tab-guardian/fceclmihdanbepiogjoeiolnpkalcjpe)

## Start working on the source code

All necessary scripts are in package.json file. I'm using the wrapper around a webpack that's called [Laravel mix](https://laravel-mix.com/). You need to have [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/lang/en/) JavaScript package managers.

Configuration file for __Laravel mix__ is called __webpack.mix.js__, it is in the root of the project.

### Installation

**Clone the repo**
```bash
git clone https://github.com/tab-guardian/tab-guardian.git && cd tab-guardian
```

**Install all dependencies**
```bash
yarn install
# or
npm i
```

**Watch files**
```bash
yarn watch
# or
npm run watch
```

**Compile to production**
```bash
yarn prod
# or
npm run prod
```

### How to change the plugin version

To change the plugin version you need to modify 3 files:

1. [manifest.json](extension/manifest.json) - change the `version` field in JSON
2. [manifest2.json](extension/manifest2.json) - change the `version` field in JSON
3. [package.json](package.json) - change the `version` field in JSON

### Code style

Don't worry about the code style. We use [Prettier](https://prettier.io/) to format the code. You can run it manually by executing `yarn prettier` or `npm run prettier` to format the code, or `yarn prettier-check` or `npm run prettier-check` to check if the code is formatted correctly.

### Notes

- The extension should be supported by all major browsers: Chrome, Firefox, Edge and Brave. Since Firefox does't support manifest version 3 yet, we have to use [manifest2.json](extension/manifest2.json) for Firefox and [manifest.json](extension/manifest.json) for Chrome based browsers.
- The program also supports running as a web page. With Vite, we can do that by running `yarn dev` or `npm run dev` and opening the browser at `http://localhost:5173/`