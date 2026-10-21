import type { PlatformRuntime } from '@common/types/runtime'
import { mapToTab, mapToWindow } from '@common/modules/runtime/maps'
import { logger } from '@common/modules'
import { decodeStorageEntries } from '@common/modules/runtime/utils'
import { toStorageSaveError } from '@common/modules/runtime/storageSave'

export function getChromeRuntimeAdapter(): PlatformRuntime {
    const nativeSession = chrome.storage.session ?? null

    return {
        trans(msg, ...args) {
            return chrome.i18n.getMessage(msg, args)
        },

        getUrl(path) {
            return chrome.runtime.getURL(path)
        },

        async sendMessage(message) {
            await chrome.runtime.sendMessage(message)
        },

        extension: {
            lastError() {
                return chrome.runtime.lastError?.message ?? null
            },

            async isAllowedIncognitoAccess() {
                return chrome.extension.isAllowedIncognitoAccess()
            },
        },

        action: {
            async setBadgeText(details) {
                await chrome.action.setBadgeText(details)
            },

            async setBadgeBackgroundColor(details) {
                await chrome.action.setBadgeBackgroundColor(details)
            },
        },

        storage: {
            MAX_BYTES_QUOTA: chrome.storage.local.QUOTA_BYTES,

            async all() {
                const items = await chrome.storage.local.get<{
                    [key: string]: string
                }>()

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
                await chrome.storage.local.clear()
            },

            async get<T>(keys: string | string[]) {
                return new Promise<T[]>(resolve => {
                    chrome.storage.local.get(keys, entries => {
                        resolve(decodeStorageEntries<T>(keys, entries))
                    })
                })
            },

            async set(key, value) {
                if (!value) {
                    logger().error(`Failed to save "${key}" to storage, no value`)
                    return
                }

                const jsonStr = JSON.stringify(value)

                const usedBytes = await this.getBytesInUse()

                try {
                    await chrome.storage.local.set({ [key]: jsonStr })
                } catch (err) {
                    throw toStorageSaveError(err, this.MAX_BYTES_QUOTA, usedBytes)
                }
            },

            async remove(key) {
                await chrome.storage.local.remove(key)
            },

            async getBytesInUse() {
                return await chrome.storage.local.getBytesInUse()
            },
        },

        sessionStorage: {
            isAvailable: nativeSession !== null,

            async get<T>(keys: string | string[]) {
                if (!nativeSession) {
                    return []
                }

                return new Promise<T[]>(resolve => {
                    nativeSession.get(keys, entries => {
                        resolve(decodeStorageEntries<T>(keys, entries))
                    })
                })
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
                return new Promise((resolve, reject) => {
                    chrome.tabs.query(queryInfo, tabs => {
                        if (chrome.runtime.lastError) {
                            reject(chrome.runtime.lastError)
                            return
                        }
                        if (chrome.runtime.lastError) {
                            reject(chrome.runtime.lastError)
                            return
                        }

                        resolve(tabs.map(mapToTab))
                    })
                })
            },

            async create(createProperties) {
                const chromeTab = await chrome.tabs.create(createProperties)
                return mapToTab(chromeTab)
            },

            async remove(tabId) {
                await chrome.tabs.remove(tabId)
            },
        },

        windows: {
            async getCurrent() {
                const chromeWindow = await chrome.windows.getCurrent()
                return mapToWindow(chromeWindow)
            },

            async update(windowId, updateInfo) {
                const win = await chrome.windows.update(windowId, updateInfo)
                return mapToWindow(win)
            },
        },
    }
}
