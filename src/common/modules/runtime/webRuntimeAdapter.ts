import type { PlatformRuntime } from "@common/types/runtime"
import { throwIfQuotaExceeds } from "@common/modules/runtime/utils"
import { isRuntime } from "@common/modules/runtime"
import { env } from '@common/env'

let translationMessages: null | { [key: string]: { message: string } } = null

if (isRuntime('web')) {
    translationMessages = (await import(`../../../_locales/${env.DEV_LOCALE}/messages.json`))
        .default
}

export const webRuntimeAdapter: PlatformRuntime = {
    trans(msg, ...args) {
        if (!translationMessages) {
            throw new Error('Translation messages not loaded')
        }

        if (!translationMessages[msg]) {
            console.warn(`English translation not found for key "${msg}"`)
            return msg
        }

        const output = translationMessages[msg].message

        if (args.length === 0) {
            return output
        }

        return output.replaceAll('$n$', args[0])
    },

    getURL(path) {
        return path
    },

    action: {
        async setBadgeText() {
            console.info('Cannot set badge text in web runtime')
        },

        async setBadgeBackgroundColor() {
            console.info('Cannot set badge background color in web runtime')
        },
    },

    extension: {
        lastError() {
            console.info('Web runtime do not have last error implementation')
            return null
        },

        async isAllowedIncognitoAccess() {
            console.info("Web runtime doesn't have incognito access")
            return false
        },
    },

    storage: {
        MAX_BYTES_QUOTA: 5_242_880,

        async all() {
            const result: { [key: string]: string } = {}

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i)

                if (!key) {
                    console.warn(`Cannot get key with index ${i} from local storage`)
                    continue
                }

                const item = localStorage.getItem(key)

                if (!item) {
                    console.warn(`Getting key ${key} from local storage returns null`)
                    continue
                }

                result[key] = item
            }

            return result
        },

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
        async query() {
            console.info('Cannot query tabs in web runtime')
            return []
        },

        async create(createProperties) {
            window.open(createProperties.url, '_blank')
            console.info('Cannot get tab info in web runtime')
            return null
        },

        async remove(tabId) {
            console.info(`Cannot remove tab with id ${tabId} in web runtime`)
        },
    },

    windows: {
        async getCurrent() {
            console.info('Cannot get current window in web runtime')
            return null
        },

        async update() {
            console.info('Cannot update window in web runtime')
            return null
        },
    }
}
