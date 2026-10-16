import { isRuntime } from '@common/modules/runtime/utils'
import { renderWarningBadgeIfNeeded } from '@bg/modules/badge'
import { closeTabs } from '@bg/modules/tabs'
import { migrateStorage } from '@common/modules/storage/migrate'

const target = isRuntime('firefox') ? browser : chrome

// onInstalled
target.runtime.onInstalled.addListener(async () => {
    await migrateStorage()
    await renderWarningBadgeIfNeeded()
})

// onStartup
target.runtime.onStartup.addListener(async () => {
    await migrateStorage()
    await renderWarningBadgeIfNeeded()
})

// onMessage
target.runtime.onMessage.addListener(async request => {
    if (request.type === 'closeTabs') {
        await closeTabs(request.payload)
    }
})
