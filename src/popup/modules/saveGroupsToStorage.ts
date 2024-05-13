import type { Group, Link } from '@/types'
import saveToStorage from '@/modules/saveToStorage'
import encryptGroup from '@/modules/encrypt/encryptGroup'

export default async (groups: Group[], pass: string): Promise<void> => {
    let saveGroups: Group[] = []

    for (const group of groups) {
        if (!group.isPrivate || group.isEncrypted) {
            saveGroups.push(group)
            continue
        }

        if (pass === '') {
            throw new Error('Password is empty')
        }

        saveGroups.push(encryptGroup(group, pass))
    }

    await saveToStorage('groups', saveGroups)
}
