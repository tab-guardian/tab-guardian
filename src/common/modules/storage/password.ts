import type { PasswordBytes } from '@common/types'
import { saveToStorage, getFromStorage, deleteFromStorage } from '@common/modules/storage'
import { getGroupsFromStorage } from '@common/modules/storage/group'
import { isDevelopment } from '@common/modules/isDevelopment'
import { targetBrowser } from '@common/modules/browser/targetBrowser'

const KEY_PREFIX = 'group-password-'

export async function savePasswordToStorage(groupId: number, pass: string): Promise<void> {
    await saveToStorage<string>(KEY_PREFIX + groupId, pass)
}

export async function getPasswordFromStorage(groupId: number): Promise<string | null> {
    return getFromStorage<string>(KEY_PREFIX + groupId)
}

export async function deletePasswordFromStorage(groupId: number): Promise<void> {
    await deleteFromStorage(KEY_PREFIX + groupId)
}

export async function getPasswordsBytes(): Promise<PasswordBytes[]> {
    const pwdBytes: PasswordBytes[] = isDevelopment()
        ? getBytesDev()
        : await getBytesExt()

    const groups = await getGroupsFromStorage()
    const unlockedIds = groups.filter(g => g.isPrivate && !g.isEncrypted)
        .map(g => g.id)

    return pwdBytes.filter(pwd => !unlockedIds.includes(pwd.groupId))
}

function getBytesDev(): PasswordBytes[] {
    const result: PasswordBytes[] = []

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)

        if (!key || !key.startsWith(KEY_PREFIX)) {
            continue
        }

        const item = localStorage.getItem(key)

        result.push({
            groupId: Number(key.replace(KEY_PREFIX, '')),
            bytes: (item + key).length,
        })
    }

    return result
}

async function getBytesExt(): Promise<PasswordBytes[]> {
    const items = await targetBrowser().storage.local.get()
    const result: PasswordBytes[] = []

    for (const key in items) {
        if (!key.startsWith(KEY_PREFIX)) {
            continue
        }

        result.push({
            groupId: Number(key.replace(KEY_PREFIX, '')),
            bytes: (items[key] + key).length,
        })
    }

    return result
}
