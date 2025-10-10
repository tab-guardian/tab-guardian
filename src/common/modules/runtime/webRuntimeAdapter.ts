import type { PlatformRuntime } from "@common/types/runtime"
import { throwIfQuotaExceeds } from "@common/modules/runtime/utils"
import { getFakeTab } from "@common/modules/fake"

export const webRuntimeAdapter: PlatformRuntime = {
    lastError() {
        console.info('web runtime do not have last error implementation')
        return null
    },

    storage: {
        MAX_BYTES_QUOTA: 5_242_880,

        async get<T>(key: string) {
            const strValue: string | null = localStorage.getItem(key)

            if (!strValue) {
                console.info(`"${key}" key not found in local storage`)
                return null
            }

            const value: T | null | undefined = JSON.parse(strValue)

            if (!value) {
                console.error(`Failed to parse ${key} from local storage`)
                return null
            }

            return value
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

            localStorage.setItem(key, jsonStr)
        },

        async remove(key) {
            localStorage.removeItem(key)
        },

        async getBytesInUse() {
            let totalBytes = 0

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i)

                if (!key) {
                    continue
                }

                const value = localStorage.getItem(key)

                if (value) {
                    totalBytes += key.length + value.length
                }
            }

            return totalBytes
        },
    },

    tabs: {
        async query(_) {
            console.info('Cannot query tabs in web runtime')
            return []
        },
        async create(createProperties) {
            window.open(createProperties.url, '_blank')
            console.info('Cannot get tab info in web runtime')
            return getFakeTab()
        },
        async remove(tabId) {
            console.info(`Cannot remove tab with id ${tabId} in web runtime`)
        },
    },
}
