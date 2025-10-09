import { isDevelopment } from '@common/modules/isDevelopment'
import { webRuntimeAdapter } from "@common/modules/runtime/webRuntimeAdapter"
import { chromeRuntimeAdapter } from "@common/modules/runtime/chromeRuntimeAdapter"
import { firefoxRuntimeAdapter } from "@common/modules/runtime/firefoxRuntimeAdapter"

let adapter: PlatformRuntime | null = null

if (isDevelopment()) {
    adapter = webRuntimeAdapter
} else if (isFirefox()) {
    adapter = firefoxRuntimeAdapter
} else {
    adapter = chromeRuntimeAdapter
}

export const runtime = adapter
