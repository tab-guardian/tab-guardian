
export const webRuntimeAdapter: PlatformRuntime = {
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

        async set<T>(key: string, value: T | null | undefined) {
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

        async remove(key: string): Promise<void> {
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
}
