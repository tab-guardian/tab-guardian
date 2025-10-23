import type { PlatformRuntime } from '@common/types/runtime'
import { getWebRuntimeAdapter } from '@common/modules/runtime/webRuntimeAdapter'
import { getChromeRuntimeAdapter } from '@common/modules/runtime/chromeRuntimeAdapter'
import { getFirefoxRuntimeAdapter } from '@common/modules/runtime/firefoxRuntimeAdapter'
import { isRuntime } from '@common/modules/runtime/utils'
import { logger } from '@common/modules'

let adapter: PlatformRuntime | null = null

if (isRuntime('chrome')) {
    logger().info('Using Chrome runtime...')
    adapter = getChromeRuntimeAdapter()
} else if (isRuntime('firefox')) {
    logger().info('Using Firefox runtime...')
    adapter = getFirefoxRuntimeAdapter()
} else {
    logger().info('Using web runtime...')
    adapter = getWebRuntimeAdapter()
}

export const runtime = adapter!
