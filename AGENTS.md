## Description
This is a browser extension that supports all Chrome-based and Firefox-based browsers. It allows users to save their browser tabs into Tab Guardian group and later restore it back to tabs.

## CodingStyle
- functions and variables - camelCase
- types and classes - PascalCase

## Rules
- Never change any d.ts files and files in ./cmd/ directory unless explicitly told so

## Technologies
This project uses these technologies:

- Vue 3
- Vitest (for tests)
- Pinia
- TypeScript
- Prettier
- Podman
- Vite

## Project Structure
- `src/` - Contains all source files (functions, core, modules, etc.)
- `public/` - Contains `manifest2.json` for Firefox and `manifest3.json` for Chrome
- `cmd/` - Contains bash scripts for building files into extension archives ready to be uploaded to Chrome and Mozilla stores.

## Context
- We have `./src/common/modules/runtime/index.ts` file which is an adapter to abstract Firefox, Chrome and web based APIs
- This browser extension allows users to save their tabs into groups, each group contains links (browser tabs)
- At any point of time, user can restore links back into tabs in a browser
- A group can be private. When it's private, the field `isPrivate` is set to true

## Commands
### Tests
The cammand for running tests with Vitest:
`podman-compose exec app npm run test run`

### Formatting
To format files with prettier, run this command:
`podman-compose exec app npm run prettier`

### TypeScript
To see any TypeScript errors, run this command:
`podman-compose exec app npm run check`

### Build
Build project to dist directory:
`podman-compose exec app npm run build`
