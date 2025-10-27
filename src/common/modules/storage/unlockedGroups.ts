import { runtime } from '@common/modules/runtime'

export const KEY = 'has-unlocked-groups'

export const unlockedGroupsStorage = {
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
}
