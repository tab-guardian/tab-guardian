import { runtime } from '@common/modules/runtime'

export const KEY_PREFIX = 'group-password-'

export const passwordStorage = {
    async save(groupId: number, pass: string): Promise<void> {
        if (pass === '') {
            return
        }

        await runtime.sessionStorage.set<string>(KEY_PREFIX + groupId, pass)
    },

    async get(groupId: number): Promise<string | null> {
        const results = await runtime.sessionStorage.get<string>(
            KEY_PREFIX + groupId,
        )
        return results[0] ?? null
    },

    async delete(groupId: number): Promise<void> {
        await runtime.sessionStorage.remove(KEY_PREFIX + groupId)
    },
}
