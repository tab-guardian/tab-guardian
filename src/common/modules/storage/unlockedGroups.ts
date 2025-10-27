import { groupStorage } from '@common/modules/storage/group'
import { runtime } from '@common/modules/runtime'

const KEY = 'has-unlocked-groups'

export const unlcokedGroupsStorage = {
    async set(): Promise<void> {
        await runtime.storage.set<string>(KEY, '1')
    },

    async has(): Promise<boolean> {
        const results = await runtime.storage.get<string>(KEY)
        return results.length > 0 && results[0] === '1'
    },

    async delete(): Promise<void> {
        await runtime.storage.remove(KEY)
    },

    async count(): Promise<number> {
        const groups = await groupStorage.getAll()
        return groups.filter(g => g.isPrivate && !g.isEncrypted).length
    },
}
