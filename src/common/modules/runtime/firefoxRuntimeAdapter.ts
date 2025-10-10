import type { PlatformRuntime } from "@common/types/runtime"
import { mapToTab, mapToWindow } from "@common/modules/runtime/maps"
import { getFromExtentionStorage, throwIfQuotaExceeds } from "@common/modules/runtime/utils"

export const firefoxRuntimeAdapter: PlatformRuntime = {
    lastError() {
        return browser.runtime.lastError?.message ?? null
    },

    storage: {
        MAX_BYTES_QUOTA: 5_242_880,

        async get<T>(key: string) {
            return new Promise<T | null>(resolve => {
                browser.storage.local.get(key).then(result => {
                    resolve(getFromExtentionStorage<T>(key, result))
                })
            })
        },

        async set(key, value) {
            if (!value) {
                const msg = `Failed to save "${key}" to storage because there is not value`
                console.error(msg)
                return
            }

            const jsonStr = JSON.stringify(value)

            const usedBytes = await this.getBytesInUse()

            throwIfQuotaExceeds(jsonStr, usedBytes, this.MAX_BYTES_QUOTA)

            await browser.storage.local.set({ [key]: jsonStr })
        },

        async remove(key) {
            browser.storage.local.remove(key)
        },

        async getBytesInUse() {
            const storageData = await browser.storage.local.get()

            const entries = Object.entries(storageData)
                .map(([key, value]) => key + JSON.stringify(value))
                .map(str => str.replaceAll('\\"', '"'))
                .join('')

            return new TextEncoder().encode(entries).length
        },
    },

    tabs: {
        async query(queryInfo) {
            const firefoxTabs = await browser.tabs.query(queryInfo)
            return firefoxTabs.map(mapToTab)
        },
        async create(createProperties) {
            const firefoxTab = await browser.tabs.create(createProperties)
            return mapToTab(firefoxTab)
        },
        async remove(tabId) {
            await browser.tabs.remove(tabId)
        },
    },

    windows: {
        async getCurrent() {
            const firefoxWindow = await browser.windows.getCurrent()
            return mapToWindow(firefoxWindow)
        },
        async update(windowId, updateInfo) {
            const firefoxWindowState: browser.windows.Window['state'] =
                updateInfo.state === 'locked-fullscreen' ? 'docked' : updateInfo.state

            const win = await browser.windows.update(windowId, {
                ...updateInfo,
                state: firefoxWindowState,
            })

            return mapToWindow(win)
        },
    }
}
