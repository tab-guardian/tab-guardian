import type { PlatformRuntime } from '@common/types/runtime'
import { mapToTab, mapToWindow } from '@common/modules/runtime/maps'
import { logger } from '@common/modules'
import { config } from '@common/config'
import {
    decodeStorageEntries,
    throwIfQuotaExceeds,
} from '@common/modules/runtime/utils'

export function getFirefoxRuntimeAdapter(): PlatformRuntime {
    const nativeSession = browser.storage.session ?? null

    return {
        trans(msg, ...args) {
            return browser.i18n.getMessage(msg, args)
        },

        getUrl(path) {
            return browser.runtime.getURL(path)
        },

        async sendMessage(message) {
            await browser.runtime.sendMessage(message)
        },

        extension: {
            lastError() {
                return browser.runtime.lastError?.message ?? null
            },

            async isAllowedIncognitoAccess() {
                return browser.extension.isAllowedIncognitoAccess()
            },
        },

        action: {
            async setBadgeText(details) {
                await browser.browserAction.setBadgeText(details)
            },

            async setBadgeBackgroundColor(details) {
                await browser.browserAction.setBadgeBackgroundColor(details)
            },
        },

        storage: {
            MAX_BYTES_QUOTA: config.MAX_STORAGE_BYTES,

            async all() {
                const items = await browser.storage.local.get()
                const result: { [key: string]: string } = {}

                for (const key in items) {
                    result[key] = items[key]
                }

                return result
            },

            /**
             * Remove all items from storage
             */
            async clear() {
                await browser.storage.local.clear()
            },

            async get<T>(keys: string | string[]) {
                return new Promise<T[]>(async resolve => {
                    const entries = await browser.storage.local.get(keys)
                    resolve(decodeStorageEntries<T>(keys, entries))
                })
            },

            async set(key, value) {
                if (!value) {
                    logger().error(`Failed to save "${key}" to storage, no value`)
                    return
                }

                const jsonStr = JSON.stringify(value)

                const usedBytes = await this.getBytesInUse()

                throwIfQuotaExceeds(jsonStr, usedBytes, this.MAX_BYTES_QUOTA)

                await browser.storage.local.set({ [key]: jsonStr })
            },

            async remove(key) {
                await browser.storage.local.remove(key)
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

        sessionStorage: {
            isAvailable: nativeSession !== null,

            async get<T>(keys: string | string[]) {
                if (!nativeSession) {
                    return []
                }

                const entries = await nativeSession.get(keys)
                return decodeStorageEntries<T>(keys, entries)
            },

            async set(key, value) {
                if (!value) {
                    logger().error(
                        `Failed to save "${key}" to session storage, no value`,
                    )
                    return
                }

                if (!nativeSession) {
                    return
                }

                await nativeSession.set({ [key]: JSON.stringify(value) })
            },

            async remove(key) {
                if (nativeSession) {
                    await nativeSession.remove(key)
                }
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
                    updateInfo.state === 'locked-fullscreen'
                        ? 'docked'
                        : updateInfo.state

                const win = await browser.windows.update(windowId, {
                    ...updateInfo,
                    state: firefoxWindowState,
                })

                return mapToWindow(win)
            },
        },
    }
}
