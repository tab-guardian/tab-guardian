import { renderWarningBadgeIfNeeded } from '@bg/modules/badge'
import { closeTabs } from '@bg/modules/tabs'
import { isRuntime } from '@common/modules/runtime/utils'
import { listenEventMessage } from '@bg/modules/event'
import { decryptGroup, encryptGroup } from '@bg/modules/groupCrypto'

const target = isRuntime('firefox') ? browser : chrome

// On installed listener
target.runtime.onInstalled.addListener(async () => {
    await renderWarningBadgeIfNeeded()
})

// On startup listener
target.runtime.onStartup.addListener(async () => {
    await renderWarningBadgeIfNeeded()
})

// On message listener
listenEventMessage(async msg => {
    switch (msg.type) {
        case 'closeTabs':
            await closeTabs(msg.payload)
            break
        case 'encryptGroup':
            await encryptGroup(msg.payload.group, msg.payload.password)
            break
        case 'decryptGroup':
            await decryptGroup(
                msg.payload.group,
                msg.payload.password,
                msg.payload.rememberPass,
            )
            break
    }
})
