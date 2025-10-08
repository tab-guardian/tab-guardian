import { PlatformRuntime } from "@common/types"
import { isFirefox } from '@common/modules/browser/isFirefox'
import { isDevelopment } from '@common/modules/isDevelopment'
import { browserRuntimeAdapter } from "@common/modules/runtime/browserRuntimeAdapter"
import { chromeRuntimeAdapter } from "@common/modules/runtime/chromeRuntimeAdapter"
import { firefoxRuntimeAdapter } from "@common/modules/runtime/firefoxRuntimeAdapter"

let adapter: PlatformRuntime | null = null

if (isDevelopment()) {
    adapter = browserRuntimeAdapter
} else if (isFirefox()) {
    adapter = firefoxRuntimeAdapter
} else {
    adapter = chromeRuntimeAdapter
}

export const runtime = adapter
