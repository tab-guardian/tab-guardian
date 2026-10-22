import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { showToast } from '@common/modules/toast'

const { toastifyShowToast } = vi.hoisted(() => ({
    toastifyShowToast: vi.fn(),
}))

vi.mock('toastify-js', () => ({
    default: vi.fn(() => ({ showToast: toastifyShowToast })),
}))

describe('showToast()', () => {
    let now: ReturnType<typeof vi.spyOn>

    beforeEach(() => {
        now = vi.spyOn(Date, 'now').mockReturnValue(1_000)
        toastifyShowToast.mockClear()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('shows the same message only once in a short window', () => {
        showToast({ text: 'Could not save', type: 'error' })
        showToast({ text: 'Could not save', type: 'error' })

        expect(toastifyShowToast).toHaveBeenCalledTimes(1)
    })

    it('shows different messages even when they arrive together', () => {
        showToast({ text: 'Group is locked', type: 'info' })
        showToast({ text: 'Could not save', type: 'error' })

        expect(toastifyShowToast).toHaveBeenCalledTimes(2)
    })

    it('shows the same message again after the window passes', () => {
        showToast({ text: 'Tabs restored', type: 'info' })

        now.mockReturnValue(1_500)
        showToast({ text: 'Tabs restored', type: 'info' })

        now.mockReturnValue(2_500)
        showToast({ text: 'Tabs restored', type: 'info' })

        expect(toastifyShowToast).toHaveBeenCalledTimes(2)
    })
})
