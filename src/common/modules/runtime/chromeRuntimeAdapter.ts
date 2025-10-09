import type { PlatformRuntime } from "@common/types/runtime"
import { getFromExtentionStorage, throwIfQuotaExceeds } from "@common/modules/runtime/utils"

export const chromeRuntimeAdapter: PlatformRuntime = {
    storage: {
        MAX_BYTES_QUOTA: chrome.storage.local.QUOTA_BYTES,

        async get<T>(key: string) {
            return new Promise<T | null>(resolve => {
                chrome.storage.local.get(key, result => {
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

            await chrome.storage.local.set({ [key]: jsonStr })
        },

        async remove(key) {
            chrome.storage.local.remove(key)
        },

        async getBytesInUse() {
            return await chrome.storage.local.getBytesInUse()
        },
    },

    tabs: {
        async query(queryInfo) {
            new Promise(resolve => {
                chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                    resolve(url)
                })
            })
        },
        async create(createProperties) {
            //
        },
        async remove(tabId) {
            //
        },
    },
}
