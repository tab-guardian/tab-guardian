import type { Group } from '@/types'
import encryptGroup from '@/modules/encrypt/encryptGroup'

export default (groups: Group[], pass: string): Group[] => {
    const encryptedGroups: Group[] = []

    for (const group of groups) {
        if (!group.isPrivate || group.isEncrypted) {
            encryptedGroups.push(group)
            continue
        }

        if (pass === '') {
            throw new Error('Password is empty')
        }

        encryptedGroups.push(encryptGroup(group, pass))
    }

    return encryptedGroups
}
