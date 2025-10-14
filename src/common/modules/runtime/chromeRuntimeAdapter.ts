import type { PlatformRuntime } from '@common/types/runtime'
import { mapToTab, mapToWindow } from '@common/modules/runtime/maps'
import {
    getFromExtentionStorage,
    throwIfQuotaExceeds,
} from '@common/modules/runtime/utils'

export function getChromeRuntimeAdapter(): PlatformRuntime {
    return {
        trans(msg, ...args) {
            return chrome.i18n.getMessage(msg, args)
        },

        getURL(path) {
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
                const items = await chrome.storage.local.get()
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
