import { isRuntime } from '@common/modules/runtime'

export function targetBrowser(): typeof browser | typeof chrome {
    return isRuntime('firefox') ? browser : chrome
}
