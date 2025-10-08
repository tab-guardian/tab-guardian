import { PlatformRuntime } from "@common/types"
import { throwIfQuotaExceeds } from "@common/modules/runtime/utils"
import { getFromExtentionStorage } from "@common/modules/runtime/utils"

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

        async set<T>(key: string, value: T | null | undefined) {
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

        async remove(key: string): Promise<void> {
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
}
