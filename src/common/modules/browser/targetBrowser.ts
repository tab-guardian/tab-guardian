import { isFirefox } from '@common/modules/browser/isFirefox'

export function targetBrowser(): typeof browser | typeof chrome {
    return isFirefox() ? browser : chrome
}
