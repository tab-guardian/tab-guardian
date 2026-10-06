# Tab Guardian

Tab Guardian is a browser extension designed to help you save and restore your browser tabs. Perfect for professionals, students, and casual users alike, this tool allows you to organize your digital workspace with a few clicks. Save individual tabs and restore them later, ensuring you never lose track of important information.

For those who prioritize security, Tab Guardian offers the added feature of encrypting your saved tabs with a password. This ensures that your browsing data remains private and secure.

## Features

Here is what makes Tab Guardian a great tool for managing your tabs:

- [x] Save and restore your tabs with ease
- [x] Keep groups flexible: add, remove, copy, cut, or paste tabs between groups
- [x] Preserve tab order — restored exactly as saved
- [x] Pinned tabs are remembered and restored as pinned
- [x] Organize with drag-and-drop sorting
- [x] Protect sensitive groups with encryption and password locks
- [x] Privately export a single protected group into an encrypted file for later use or transfer
- [x] Export and import all open groups across devices and browsers
- [x] Customize groups with icons or emojis for quick recognition
- [x] Hide groups until needed by binding them to specific URLs
- [x] User-friendly interface with tooltips and confirmation modals
- [x] Highly configurable to suit your workflow
- [x] Multi-language support 🇬🇧 🇷🇺 🇨🇳 based on your system language
- [x] Works with all modern browsers: Chrome, Firefox, Edge, Brave, Zen, and more
- [x] Convert open groups to private

## Links

- [Firefox ADD-ONS](https://addons.mozilla.org/firefox/addon/tab-guardian/)
- [Chrome Web Store](https://chromewebstore.google.com/detail/tab-guardian/kjdklkfpliphcbnphmfhalllclfieojp)

## Build Extension from Source

You can build the extension in 3 ways:

1. `cmd/new` - updates extension version in manifest files and creates a new branch with provided version number
1. `cmd/build` - build locally. You'll need to have `npm` and `zip` installed on your machine
1. `cmd/podman` - bulid with Podman container engine. You'll need to have `podman` and `podman-compose` installed on your machine
1. `cmd/docker` - bulid with Docker container engine. You'll need to have `docker` installed on your machine

It will generate `firefox.zip`, `chrome.zip` and `source.zip` files inside of your project's root.

## Start working on the source code

All necessary scripts are in package.json file. You need to have [npm](https://www.npmjs.com/) JavaScript package managers (or other alternative).

### Installation

**Clone the repo**

```bash
git clone https://codeberg.org/tab-guardian/tab-guardian.git && cd tab-guardian
```

**Install all dependencies**

```bash
npm i
```

**Duplicate `.env.example` file and rename it to `.env`**

```bash
cp .env.example .env
```

**Check `.env` file**
Check your `.env` file and set `VITE_DEV_LOCALE` to language that you prefer.

### Code style

Don't worry about the code style. We use [Prettier](https://prettier.io/) to format the code. You can run it manually by executing `npm run prettier` to format the code, or `npm run prettier-check` to check if the code is formatted correctly.

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

#### Build the Image

To build the image, run this:

```bash
podman-compose build
```

#### Create `node_modules`

Run this command to install npm packages and generate a `node_modules` directory on your local machine:

```bash
podman-compose run --rm app npm i
```

#### Run the Container

After the image is build, you can run a container from that image. Run this:

With Podman:

```bash
podman-compose up -d
```

After the container is created, it will run the development server which is available on `http://localhost:3000` with hot reloading.

#### Enter the Container

To enter inside the container, run this:

```bash
podman-compose exec app bash
```

You'll be able to run [NPM commands](#npm-commands-available) inside of the container.

#### Delete the Container

When you are done working, you can delete the container by running this:

```bash
podman-compose down
```

## Terminology

Here are some words that you need to know in order to undetstand the context of the app:

- `group` group is a collection of links (tabs)
- `link` in the context of this app is a link that is stored in your group
- `tab` tab is what users see in their browsers. After storing those tabs in a group they become `links`

## Context

- We have `./src/common/modules/runtime/index.ts` file which is an adapter to abstract Firefox, Chrome and web based APIs
- This browser extension allows users to save their tabs into groups, each group contains links (browser tabs)
- At any point of time, user can restore links back into tabs in a browser
- A group can be private. When it's private, the field `isPrivate` is set to true

## Coding Style

- functions and variables - camelCase
- types and classes - PascalCase
- local constants - camelCase
- global constants, env variables - SCREAMING_SNAKE_CASE

## Technologies

This project uses these technologies:

- Vue 3
- Vitest (for tests)
- Pinia (store)
- TypeScript
- Prettier (formatter)
- Podman (containers)
- Vite

## Fast Commands

### Run Tests

The command for running tests with Vitest:

```bash
podman-compose exec app npm run test run
```

### Format with Prettier

To format files with prettier, run this command:

```bash
podman-compose exec app npm run prettier
```

### TypeScript Error Check

To see any TypeScript errors, run this command:

```bash
podman-compose exec app npm run check
```

### NPM Build

Build project to dist directory:

```bash
podman-compose exec app npm run build
```

## Project Structure

- `src/` - Contains all source files (functions, core, modules, etc.)
- `public/` - Contains `manifest2.json` for Firefox and `manifest3.json` for Chrome
- `cmd/` - Contains bash scripts for building files into extension archives ready to be uploaded to Chrome and Mozilla stores
