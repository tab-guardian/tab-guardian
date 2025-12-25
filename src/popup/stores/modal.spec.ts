// @vitest-environment happy-dom

import type { Modals } from '@common/types/modal'
import { describe, it, expect, suite, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useModalStore } from '@/stores/modal'

describe('modal store', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    suite('hideAll()', () => {
        it('hides all modals', () => {
            const modalStore = useModalStore()

            for (const key in modalStore.modals) {
                modalStore.modals[key as keyof Modals].shown = true
            }

            modalStore.hideAll()

            for (const key in modalStore.modals) {
                expect(modalStore.modals[key as keyof Modals].shown).toBeFalsy()
            }
        })
    })

    suite('show()', () => {
        it('shows modal', () => {
            const modalStore = useModalStore()
            modalStore.show('removeUrlLock', {})
            expect(modalStore.modals.removeUrlLock.shown).toBeTruthy()
        })

        it('shows modal with data', () => {
            const modalStore = useModalStore()

            modalStore.show('confirm', { title: 'Sydney' })

            expect(modalStore.modals.confirm.shown).toBeTruthy()
            expect(modalStore.modals.confirm.dataOnShow?.title).equal('Sydney')
        })
    })

    suite('hide()', () => {
        it('hides modal after show', () => {
            const modalStore = useModalStore()

            modalStore.show('removeUrlLock', {})
            modalStore.hide('removeUrlLock', {})

            expect(modalStore.modals.removeUrlLock.shown).toBeFalsy()
        })

        it('passes data when hiding the modal', async () => {
            const modalStore = useModalStore()

            const resp = modalStore.show('chooseImageIcon', {})
            modalStore.hide('chooseImageIcon', { url: 'test' })

            expect(modalStore.modals.chooseImageIcon.shown).toBeFalsy()

            const data = await resp

            expect(data).not.toBeNull()
            expect(data?.url).equal('test')
        })
    })

    suite('isModalVisible()', () => {
        it('returns true when modal is shown', () => {
            const modalStore = useModalStore()
            modalStore.modals.removeUrlLock.shown = true

            const isVisible = modalStore.isModalVisible('removeUrlLock')
            expect(isVisible).toBeTruthy()
        })

        it('returns false when modal is hidden', () => {
            const modalStore = useModalStore()
            const isVisible = modalStore.isModalVisible('removeUrlLock')
            expect(isVisible).toBeFalsy()
        })
    })

    suite('getSharedData()', () => {
        it("returns modal's shared data", () => {
            const modalStore = useModalStore()

            modalStore.show('confirm', { title: 'Amy Adams' })

            const sharedData = modalStore.getSharedData('confirm')

            expect(sharedData).not.toBeNull()
            expect(sharedData?.title).equal('Amy Adams')
        })

        it("returned modal's shared data is null when modal is not open", () => {
            const modalStore = useModalStore()
            const sharedData = modalStore.getSharedData('confirm')
            expect(sharedData).toBeNull()
        })
    })
})
