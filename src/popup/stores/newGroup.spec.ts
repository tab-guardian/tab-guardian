// @vitest-environment happy-dom

import type { UserChoices } from '@common/types'
import { describe, it, expect, suite, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useNewGroupStore } from '@/stores/newGroup'
import { fakeLink } from '@common/modules/fake'

describe('newGroupStore', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    it('choices are null by default', () => {
        const store = useNewGroupStore()

        for (const key in store.choices) {
            expect(store.choices[key as keyof UserChoices]).toBeNull()
        }
    })

    suite('nameLength', () => {
        it('returns the length of the group name', () => {
            const store = useNewGroupStore()
            const groupName = 'Amy Adams Movies'

            store.choices.name = groupName

            expect(store.nameLength).equal(groupName.length)
        })

        it('returns 0 when name is null', () => {
            const store = useNewGroupStore()
            expect(store.nameLength).equal(0)
        })

        it('returns 0 for empty string', () => {
            const store = useNewGroupStore()
            store.choices.name = ''
            expect(store.nameLength).equal(0)
        })
    })

    suite('createGroupFromChoices()', () => {
        it('creates group from provided choices', () => {
            const store = useNewGroupStore()
            const name = 'Amy Adams Movies'
            const bindUrl = 'https://amy-adams.org'

            store.choices.name = name
            store.choices.isPrivate = true
            store.choices.bindUrl = bindUrl

            const group = store.createGroupFromChoices([fakeLink(), fakeLink()])

            expect(group.name).equal(name)
            expect(group.isPrivate).toBeTruthy()
            expect(group.bindUrl).equal(bindUrl)
            expect(group.updatedAt).toBeTypeOf('number')
            expect(group.createdAt).toBeTypeOf('number')
            expect(group.links).toHaveLength(2)
        })

        it('does not add bindUrl field when not provided', () => {
            const store = useNewGroupStore()
            const name = 'Sydney Sweeney Movies'

            store.choices.name = name
            store.choices.isPrivate = true

            const group = store.createGroupFromChoices([fakeLink()])

            expect(group.name).equal(name)
            expect(group.isPrivate).toBeTruthy()
            expect(group.bindUrl).toBeUndefined()
        })
    })

    suite('isPasswordEmpty()', () => {
        it('returns false for empty password for non-private group', () => {
            const store = useNewGroupStore()
            store.choices.password = ''
            store.choices.isPrivate = false

            expect(store.isPasswordEmpty()).toBeFalsy()
        })

        it('returns false for empty password when isPrivate equal to null', () => {
            const store = useNewGroupStore()
            store.choices.password = ''
            store.choices.isPrivate = null

            expect(store.isPasswordEmpty()).toBeFalsy()
        })

        it('returns true for empty password for private group', () => {
            const store = useNewGroupStore()
            store.choices.password = ''
            store.choices.isPrivate = true

            expect(store.isPasswordEmpty()).toBeTruthy()
        })

        it('returns true for null password for private group', () => {
            const store = useNewGroupStore()
            store.choices.password = null
            store.choices.isPrivate = true

            expect(store.isPasswordEmpty()).toBeTruthy()
        })
    })

    suite('resetChoices()', () => {
        it('choices are null by default', () => {
            const store = useNewGroupStore()

            store.choices.name = 'Amy Adams Movies'
            store.choices.isPrivate = true
            store.choices.bindUrl = 'https://amy-adams.org'
            store.choices.closeTabs = false
            store.choices.password = 'sydney-sweeney'
            store.choices.wantsSelectAllLinks = true

            store.resetChoices()

            for (const key in store.choices) {
                expect(store.choices[key as keyof UserChoices]).toBeNull()
            }
        })
    })
})
