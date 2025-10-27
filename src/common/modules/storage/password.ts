import type { PasswordBytes } from '@common/types'
import { runtime } from '@common/modules/runtime'
import { groupStorage } from '@common/modules/storage/group'

export const KEY_PREFIX = 'group-password-'

export const passwordStorage = {
    async save(groupId: number, pass: string): Promise<void> {
        if (pass === '') {
            return
        }

        await runtime.storage.set<string>(KEY_PREFIX + groupId, pass)
    },

    async get(groupId: number): Promise<string | null> {
        const results = await runtime.storage.get<string>(KEY_PREFIX + groupId)
        return results[0] ?? null
    },

    async delete(groupId: number): Promise<void> {
        await runtime.storage.remove(KEY_PREFIX + groupId)
    },

    async getBytes(): Promise<PasswordBytes[]> {
        const pwdBytes: PasswordBytes[] = await getBytesExt()

        const groups = await groupStorage.getAll()
        const unlockedIds = groups
            .filter(g => g.isPrivate && !g.isEncrypted)
            .map(g => g.id)

        return pwdBytes.filter(pwd => !unlockedIds.includes(pwd.groupId))
    },
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
