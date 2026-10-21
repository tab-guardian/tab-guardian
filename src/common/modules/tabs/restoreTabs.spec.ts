// @vitest-environment happy-dom

import { describe, it, expect, afterEach, vi } from 'vitest'
import { fakeLink } from '@common/modules/fake'
import { trans } from '@common/modules'
import { showToast } from '@common/modules/toast'
import { runtime } from '@common/modules/runtime'
import { restoreTabs } from '@common/modules/tabs/restoreTabs'

vi.mock('@common/modules/toast', () => ({
    showToast: vi.fn(),
}))

describe('restoreTabs()', () => {
    afterEach(() => {
        vi.restoreAllMocks()
        vi.clearAllMocks()
    })

    it('opens all links', async () => {
        const create = vi.spyOn(runtime.tabs, 'create').mockResolvedValue(null)
        const links = [fakeLink(), fakeLink()]

        const failedLinks = await restoreTabs(links)

        expect(create).toHaveBeenCalledTimes(2)
        expect(failedLinks).toHaveLength(0)
    })

    it('keeps opening tabs after one fails', async () => {
        const failedLink = fakeLink({ url: 'https://broken.example' })

        vi.spyOn(runtime.tabs, 'create').mockImplementation(async props => {
            if (props.url === failedLink.url) {
                throw new Error('Cannot create tab')
            }
            return null
        })

        const failedLinks = await restoreTabs([failedLink, fakeLink()])

        expect(runtime.tabs.create).toHaveBeenCalledTimes(2)
        expect(failedLinks).toEqual([failedLink])

        expect(showToast).toHaveBeenCalledWith({
            text: trans('browser_cannot_open_these_tabs', failedLink.url),
            type: 'error',
        })
    })
})
