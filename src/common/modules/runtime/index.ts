import type { PlatformRuntime, RuntimeType } from '@common/types/runtime'
import { getWebRuntimeAdapter } from "@common/modules/runtime/webRuntimeAdapter"
import { getChromeRuntimeAdapter } from "@common/modules/runtime/chromeRuntimeAdapter"
import { getFirefoxRuntimeAdapter } from "@common/modules/runtime/firefoxRuntimeAdapter"

let adapter: PlatformRuntime | null = null

if (isRuntime('chrome')) {
    console.info('Using Chrome runtime...')
    adapter = getChromeRuntimeAdapter()
} else if (isRuntime('firefox')) {
    console.info('Using Firefox runtime...')
    adapter = getFirefoxRuntimeAdapter()
} else {
    console.info('Using web runtime...')
    adapter = getWebRuntimeAdapter()
}

export const runtime = adapter!

export function isRuntime(runtime: RuntimeType): boolean {
    switch (runtime) {
        case 'firefox':
            return typeof browser !== 'undefined'
        case 'chrome':
            return typeof browser === 'undefined' && typeof chrome !== 'undefined'
        case 'web':
            return typeof window !== undefined
        default:
            throw new Error('Unknown runtime is used')
    }
}
