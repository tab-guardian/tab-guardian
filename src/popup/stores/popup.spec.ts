// @vitest-environment happy-dom

import type { Popups } from '@common/types/popup'
import { describe, it, expect, suite, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { usePopupStore } from '@/stores/popup'

describe('popupStore', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    suite('hideAll()', () => {
        it('hides all popups', () => {
            const popupStore = usePopupStore()

            for (const key in popupStore.popups) {
                popupStore.popups[key as keyof Popups].shown = true
            }

            popupStore.hideAll()

            for (const key in popupStore.popups) {
                expect(popupStore.popups[key as keyof Popups].shown).toBeFalsy()
            }
        })
    })

    suite('show()', () => {
        it('shows popup', () => {
            const popupStore = usePopupStore()
            popupStore.show('removeUrlLock', {})
            expect(popupStore.popups.removeUrlLock.shown).toBeTruthy()
        })

        it('shows popup with data', () => {
            const popupStore = usePopupStore()

            popupStore.show('confirm', { text: 'Sydney' })

            expect(popupStore.popups.confirm.shown).toBeTruthy()
            expect(popupStore.popups.confirm.dataOnShow?.text).equal('Sydney')
        })
    })

    suite('hide()', () => {
        it('hides popup after show', () => {
            const popupStore = usePopupStore()

            popupStore.show('removeUrlLock', {})
            popupStore.hide('removeUrlLock', {})

            expect(popupStore.popups.removeUrlLock.shown).toBeFalsy()
        })

        it('passes data when hiding the popup', async () => {
            const popupStore = usePopupStore()

            const resp = popupStore.show('chooseImageIcon', {})
            popupStore.hide('chooseImageIcon', { url: 'test' })

            expect(popupStore.popups.chooseImageIcon.shown).toBeFalsy()

            const data = await resp

            expect(data).not.toBeNull()
            expect(data?.url).equal('test')
        })
    })

    suite('isPopupVisible()', () => {
        it('returns true when popup is shown', () => {
            const popupStore = usePopupStore()
            popupStore.popups.removeUrlLock.shown = true

            const isVisible = popupStore.isPopupVisible('removeUrlLock')
            expect(isVisible).toBeTruthy()
        })

        it('returns false when popup is hidden', () => {
            const popupStore = usePopupStore()
            const isVisible = popupStore.isPopupVisible('removeUrlLock')
            expect(isVisible).toBeFalsy()
        })
    })

    suite('getSharedData()', () => {
        it("returns popup's shared data", () => {
            const popupStore = usePopupStore()

            popupStore.show('confirm', { text: 'Amy Adams' })

            const sharedData = popupStore.getSharedData('confirm')

            expect(sharedData).not.toBeNull()
            expect(sharedData?.text).equal('Amy Adams')
        })

        it("returned popup's shared data is null when popup is not open", () => {
            const popupStore = usePopupStore()
            const sharedData = popupStore.getSharedData('confirm')
            expect(sharedData).toBeNull()
        })
    })
})
