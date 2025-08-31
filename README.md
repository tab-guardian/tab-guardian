# Tab Guardian
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Tab Guardian is a powerful browser extension designed to help you save and restore your browser tabs effortlessly. Perfect for professionals, students, and casual users alike, this tool allows you to organize your digital workspace with ease. Save individual tabs with a single click and restore them whenever you need, ensuring you never lose track of important information.

For those who prioritize security, Tab Guardian offers the added feature of encrypting your saved tabs with a password. This ensures that your browsing data remains private and secure. Simplify your online experience and protect your information with Tab Guardian, the all-in-one solution for efficient and secure tab management.

## Features
Here is what makes Tab Guardian a great tool for managing your tabs:

- [x] Multi-language support 🇬🇧 🇷🇺 🇨🇳 depending on your operating system's language preferences
- [x] You can save tabs and restore them later
- [x] You can edit a group including adding and removing tabs from it
- [x] You can create encrypted (locked) groups that require password to unlock
- [x] All the pinned tabs are saved and restored as pinned tabs
- [x] Tabs restored in the same order as they were saved
- [x] Supports all the modern browsers: Firefox, Zen, Brave, Edge, Chrome, etc.
- [x] Tab Guardian is very configurable to suit your needs
- [x] You can privately export individual private tab group into an encrypted file and import it later or on another device or browser
- [x] You can export all of your public tab groups into a file and import them later or on another device or browser
- [x] You can set an icon for each group to make it easier to recognize
- [x] You can bind a Tab Group to a specific URL so that it visible in the group list only when you are on that URL. This is useful if you want to hide a group and access it only when you are on a specific web page
- [x] You can sort tabs by dragging and dropping them
- [x] You can set emoji as an icon for your group

## Links
- [Firefox ADD-ONS](https://addons.mozilla.org/firefox/addon/tab-guardian/)
- [Chrome Web Store](https://chromewebstore.google.com/detail/tab-guardian/kjdklkfpliphcbnphmfhalllclfieojp)

## Build Extension from Source
You can build the extension in 3 ways:
1. `cmd/build` - build locally. You'll need to have `npm` and `zip` installed on your machine
2. `cmd/podman` - bulid with Podman container engine. You'll need to have `podman` and `podman-compose` installed on your machine
3. `cmd/docker` - bulid with Docker container engine. You'll need to have `docker` installed on your machine

It will generate `firefox.zip`, `chrome.zip` and `source.zip` files inside of your project's root.

## Start working on the source code
All necessary scripts are in package.json file. You need to have [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/lang/en/) JavaScript package managers.

### Installation
**Clone the repo**
```bash
git clone https://github.com/tab-guardian/tab-guardian.git && cd tab-guardian
```

**Install all dependencies**
```bash
npm i
```

**Duplicate `.env.example` file and rename it to `.env`**
```bash
cp .env.example .env
```

### Code style
Don't worry about the code style. We use [Prettier](https://prettier.io/) to format the code. You can run it manually by executing `yarn prettier` or `npm run prettier` to format the code, or `yarn prettier-check` or `npm run prettier-check` to check if the code is formatted correctly.

## Contribute
### NPM Commands Available
All necessary scripts are in `package.json` file. I'm using Vite here.

#### Watch File Changes
Start a development server with Vite and serve your source files via native ES modules.
```bash
npm run dev
```

#### Compile to Production
Compile files for production or compile them in order to check how the extension works in the browser.
```bash
npm run build
```

#### Check files with Prettier
```bash
npm run prettier
```

### With a Container Engine
> [!NOTE]
> If you use [🐳 Docker](https://app.docker.com/) instead of [🦦 Podman](https://podman.io/), just replace `podman-compose` with `docker compose`, and `podman` with `docker` in code examples below.

#### Build the Image
To build the image, run this command:
```bash
podman-compose build
```

#### Run the Container
After the image is build, you can run a container from that image. Run this command:
```bash
podman-compose up -d
```

After the container is created, it will run the development server which is available on `http://localhost:3000`.

#### Copy `node_modules` Locally
If you need to copy `node_modules` directory from the container to your local machine, run this command:
```bash
podman cp tab-guardian:/app/node_modules .
```

> [!NOTE]
> `node_modules` is excluded from using volume in [compose.yml](compose.yml) file, that's why you need to copy it manually. It's done to prevent your local modules to be copied to Linux container, since it can create incompatibility issues between operating systems if you don't use Linux.

#### Enter the Container
To enter inside the container, run this command:
```bash
podman-compose exec app sh
```

You'll be able to run [NPM commands](#npm-commands-available) inside of the container.

#### Delete the Container
When you are done working, you can delete the container by running this:
```bash
podman-compose down
```
