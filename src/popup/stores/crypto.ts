import type { Group } from '@common/types'
import { useProgressStore } from '@/stores/progress'
import { useSettingsStore } from '@/stores/settings'
import { defineStore } from 'pinia'
import { runtime } from '@common/modules/runtime'

export const useCryptoStore = defineStore('crypto', () => {
    const progressStore = useProgressStore()
    const settingsStore = useSettingsStore()

    async function encryptGroup(group: Group, password: string): Promise<void> {
        if (password === '') {
            throw new Error('password should not be empty when encryping group')
        }

        progressStore.start(group.links.length)

        await runtime.sendMessage({
            type: 'encryptGroup',
            payload: { group, password },
        })
    }

    async function decryptGroup(group: Group, password: string): Promise<void> {
        if (password === '') {
            throw new Error('password should not be empty when decrypting group')
        }

        progressStore.start(group.links.length)

        const rememberPass = settingsStore.settings.rememberPasswordAfterUnlock

        await runtime.sendMessage({
            type: 'decryptGroup',
            payload: { group: group, password, rememberPass },
        })
    }

    return {
        encryptGroup,
        decryptGroup,
    }
})
