import type { PlatformRuntime } from "@common/types/runtime"
import { getFromExtentionStorage, throwIfQuotaExceeds, mapToTab } from "@common/modules/runtime/utils"

export const firefoxRuntimeAdapter: PlatformRuntime = {
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
            const tabs = await browser.tabs.query(queryInfo)
            return tabs.map(mapToTab)
        },
        async create(createProperties) {
            //
        },
        async remove(tabId) {
            //
        },
    },
}
