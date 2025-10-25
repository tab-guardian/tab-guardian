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
        const newGroupStore = useNewGroupStore()

        for (const key in newGroupStore.choices) {
            expect(newGroupStore.choices[key as keyof UserChoices]).toBeNull()
        }
    })

    suite('nameLength', () => {
        it('returns the length of the group name', () => {
            const newGroupStore = useNewGroupStore()
            const groupName = 'Amy Adams Movies'

            newGroupStore.choices.name = groupName

            expect(newGroupStore.nameLength).equal(groupName.length)
        })

        it('returns 0 when name is null', () => {
            const newGroupStore = useNewGroupStore()
            expect(newGroupStore.nameLength).equal(0)
        })

        it('returns 0 for empty string', () => {
            const newGroupStore = useNewGroupStore()
            newGroupStore.choices.name = ''
            expect(newGroupStore.nameLength).equal(0)
        })
    })

    suite('createGroupFromChoices()', () => {
        it('creates group from provided choices', () => {
            const newGroupStore = useNewGroupStore()
            const name = 'Amy Adams Movies'
            const bindUrl = 'https://amy-adams.org'

            newGroupStore.choices.name = name
            newGroupStore.choices.isPrivate = true
            newGroupStore.choices.bindUrl = bindUrl

            const group = newGroupStore.createGroupFromChoices([
                fakeLink(),
                fakeLink(),
            ])

            expect(group.name).equal(name)
            expect(group.isPrivate).toBeTruthy()
            expect(group.bindUrl).equal(bindUrl)
            expect(group.updatedAt).toBeTypeOf('number')
            expect(group.createdAt).toBeTypeOf('number')
            expect(group.links).toHaveLength(2)
        })

        it('does not add bindUrl field when not provided', () => {
            const newGroupStore = useNewGroupStore()
            const name = 'Sydney Sweeney Movies'

            newGroupStore.choices.name = name
            newGroupStore.choices.isPrivate = true

            const group = newGroupStore.createGroupFromChoices([fakeLink()])

            expect(group.name).equal(name)
            expect(group.isPrivate).toBeTruthy()
            expect(group.bindUrl).toBeUndefined()
        })
    })

    suite('isPasswordEmpty()', () => {
        it('returns false for empty password for non-private group', () => {
            const newGroupStore = useNewGroupStore()
            newGroupStore.choices.password = ''
            newGroupStore.choices.isPrivate = false

            expect(newGroupStore.isPasswordEmpty()).toBeFalsy()
        })

        it('returns false for empty password when isPrivate equal to null', () => {
            const newGroupStore = useNewGroupStore()
            newGroupStore.choices.password = ''
            newGroupStore.choices.isPrivate = null

            expect(newGroupStore.isPasswordEmpty()).toBeFalsy()
        })

        it('returns true for empty password for private group', () => {
            const newGroupStore = useNewGroupStore()
            newGroupStore.choices.password = ''
            newGroupStore.choices.isPrivate = true

            expect(newGroupStore.isPasswordEmpty()).toBeTruthy()
        })

        it('returns true for null password for private group', () => {
            const newGroupStore = useNewGroupStore()
            newGroupStore.choices.password = null
            newGroupStore.choices.isPrivate = true

            expect(newGroupStore.isPasswordEmpty()).toBeTruthy()
        })
    })

    suite('resetChoices()', () => {
        it('choices are null by default', () => {
            const newGroupStore = useNewGroupStore()

            newGroupStore.choices.name = 'Amy Adams Movies'
            newGroupStore.choices.isPrivate = true
            newGroupStore.choices.bindUrl = 'https://amy-adams.org'
            newGroupStore.choices.closeTabs = false
            newGroupStore.choices.password = 'sydney-sweeney'
            newGroupStore.choices.wantsSelectAllLinks = true

            newGroupStore.resetChoices()

            for (const key in newGroupStore.choices) {
                expect(newGroupStore.choices[key as keyof UserChoices]).toBeNull()
            }
        })
    })
})
