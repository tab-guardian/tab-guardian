import { describe, it, expect, afterEach, vi } from 'vitest'
import { config } from '@common/config'
import { getFirefoxRuntimeAdapter } from '@common/modules/runtime/firefoxRuntimeAdapter'
import { getChromeRuntimeAdapter } from '@common/modules/runtime/chromeRuntimeAdapter'

describe('removing a saved group from browser storage', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('firefox: reports removal only after the browser confirms it', async () => {
        let browserFinished = false

        vi.stubGlobal('browser', {
            storage: {
                local: {
                    session: null,
                    remove: async () => {
                        await new Promise(res => setTimeout(res, 20))
                        browserFinished = true
                    },
                },
            },
        })

        await getFirefoxRuntimeAdapter().storage.remove('1')

        expect(browserFinished).toBe(true)
    })

    it('chrome: reports removal only after the browser confirms it', async () => {
        let browserFinished = false

        vi.stubGlobal('chrome', {
            storage: {
                local: {
                    remove: async () => {
                        await new Promise(res => setTimeout(res, 20))
                        browserFinished = true
                    },
                    session: null,
                    QUOTA_BYTES: config.MAX_STORAGE_BYTES,
                },
            },
        })

        await getChromeRuntimeAdapter().storage.remove('1')

        expect(browserFinished).toBe(true)
    })
})
