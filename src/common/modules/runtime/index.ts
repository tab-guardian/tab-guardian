import type { PlatformRuntime, RuntimeType } from '@common/types/runtime'
import { getWebRuntimeAdapter } from "@common/modules/runtime/webRuntimeAdapter"
import { getChromeRuntimeAdapter } from "@common/modules/runtime/chromeRuntimeAdapter"
import { getFirefoxRuntimeAdapter } from "@common/modules/runtime/firefoxRuntimeAdapter"

let adapter: PlatformRuntime | null = null

if (isRuntime('chrome')) {
    adapter = getChromeRuntimeAdapter()
} else if (isRuntime('firefox')) {
    adapter = getFirefoxRuntimeAdapter()
} else {
    adapter = getWebRuntimeAdapter()
}

export const runtime = adapter!

export function isRuntime(runtime: RuntimeType): boolean {
    switch (runtime) {
        case 'firefox':
            return typeof browser !== 'undefined'
        case 'chrome':
            return typeof chrome !== 'undefined'
        case 'web':
            return typeof window !== 'undefined'
        default:
            throw new Error('Unknown runtime is used')
    }
}
