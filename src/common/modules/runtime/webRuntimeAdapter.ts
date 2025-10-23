import type { PlatformRuntime } from '@common/types/runtime'
import type { Locale, LocaleMessageItem } from '@common/types'
import { throwIfQuotaExceeds } from '@common/modules/runtime/utils'
import { isRuntime } from '@common/modules/runtime/utils'
import { config } from '@common/config'
import enMessages from '@locales/en/messages.json'
import ruMessages from '@locales/ru/messages.json'
import zhMessages from '@locales/zh_CN/messages.json'
import { logger } from '..'

const messageMap = new Map<Locale, LocaleMessageItem>()
messageMap.set('en', enMessages)
messageMap.set('ru', ruMessages)
messageMap.set('zh_CN', zhMessages)

let translationMessages: null | LocaleMessageItem = null

if (!translationMessages && isRuntime('web')) {
    translationMessages = messageMap.get(config.DEV_LOCALE)!
}

export function getWebRuntimeAdapter(): PlatformRuntime {
    return {
        trans(msg, ...args) {
            if (!translationMessages) {
                throw new Error('Translation messages not loaded')
            }

            if (!translationMessages[msg]) {
                logger().warn(`English translation not found for key "${msg}"`)
                return msg
            }

            const output = translationMessages[msg].message

            if (args.length === 0) {
                return output
            }

            return output.replaceAll('$n$', args[0])
        },

        async sendMessage(): Promise<void> {
            logger().info('Cannot send message in web runtime')
        },

        getUrl(path) {
            return path
        },

        action: {
            async setBadgeText() {
                logger().info('Cannot set badge text in web runtime')
            },

            async setBadgeBackgroundColor() {
                logger().info('Cannot set badge background color in web runtime')
            },
        },

        extension: {
            lastError() {
                logger().info('Web runtime do not have last error implementation')
                return null
            },

            async isAllowedIncognitoAccess() {
                logger().info("Web runtime doesn't have incognito access")
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
                        logger().warn(
                            `Cannot get key with index ${i} from local storage`,
                        )
                        continue
                    }

                    const item = localStorage.getItem(key)

                    if (!item) {
                        logger().warn(
                            `Getting key ${key} from local storage returns null`,
                        )
                        continue
                    }

                    result[key] = item
                }

                return result
            },

            /**
             * Remove all items from storage
             */
            async clear() {
                localStorage.clear()
            },

            async get<T>(key: string) {
                const strValue: string | null = localStorage.getItem(key)

                if (!strValue) {
                    logger().info(`"${key}" key not found in local storage`)
                    return null
                }

                const value: T | null | undefined = JSON.parse(strValue)

                if (!value) {
                    logger().error(`Failed to parse ${key} from local storage`)
                    return null
                }

                return value
            },

            async set(key, value) {
                if (!value) {
                    logger().error(`Failed to save "${key}" to storage, no value`)
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
                logger().info('Cannot query tabs in web runtime')
                return []
            },

            async create(createProperties) {
                window.open(createProperties.url, '_blank')
                logger().info('Cannot get tab info in web runtime')
                return null
            },

            async remove(tabId) {
                logger().info(`Cannot remove tab with id ${tabId} in web runtime`)
            },
        },

        windows: {
            async getCurrent() {
                logger().info('Cannot get current window in web runtime')
                return null
            },

            async update() {
                logger().info('Cannot update window in web runtime')
                return null
            },
        },
    }
}
