import type { PlatformRuntime, Runtime } from '@common/types/runtime'
import { webRuntimeAdapter } from "@common/modules/runtime/webRuntimeAdapter"
import { chromeRuntimeAdapter } from "@common/modules/runtime/chromeRuntimeAdapter"
import { firefoxRuntimeAdapter } from "@common/modules/runtime/firefoxRuntimeAdapter"

let adapter: PlatformRuntime | null = null

if (isRuntime('chrome')) {
    adapter = chromeRuntimeAdapter
} else if (isRuntime('firefox')) {
    adapter = firefoxRuntimeAdapter
} else {
    adapter = webRuntimeAdapter
}

export const runtime = adapter!

export function isRuntime(runtime: Runtime): boolean {
    switch (runtime) {
        case 'firefox':
            return typeof browser !== 'undefined'
        case 'chrome':
            return typeof chrome !== 'undefined'
        case 'web':
            return typeof window !== 'undefined'
    }
}
