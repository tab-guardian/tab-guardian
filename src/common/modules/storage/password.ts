import type { PasswordBytes } from '@common/types'
import { runtime } from '@common/modules/runtime'
import { getGroupsFromStorage } from '@common/modules/storage/group'

const KEY_PREFIX = 'group-password-'

export async function savePasswordToStorage(groupId: number, pass: string): Promise<void> {
    await runtime.storage.set<string>(KEY_PREFIX + groupId, pass)
}

export async function getPasswordFromStorage(groupId: number): Promise<string | null> {
    return runtime.storage.get<string>(KEY_PREFIX + groupId)
}

export async function deletePasswordFromStorage(groupId: number): Promise<void> {
    await runtime.storage.remove(KEY_PREFIX + groupId)
}

export async function getPasswordsBytes(): Promise<PasswordBytes[]> {
    const pwdBytes: PasswordBytes[] = await getBytesExt()

    const groups = await getGroupsFromStorage()
    const unlockedIds = groups.filter(g => g.isPrivate && !g.isEncrypted)
        .map(g => g.id)

    return pwdBytes.filter(pwd => !unlockedIds.includes(pwd.groupId))
}

async function getBytesExt(): Promise<PasswordBytes[]> {
    const items = await runtime.storage.all()
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
