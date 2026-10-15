import { runtime } from '@common/modules/runtime'

export const KEY_PREFIX = 'group-password-'
const LEGACY_CLEANUP_FLAG = 'legacy-pass-cleanup'

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

/**
 * Removes passwords that were stored in persistent storage by older versions
 * prior to 1.19.3. Idempotent, the flag makes repeat runs a single cheap read
 */
export async function cleanupLegacyPasswords(): Promise<void> {
    const [done] = await runtime.storage.get<string>(LEGACY_CLEANUP_FLAG)

    if (done) {
        return
    }

    const items = await runtime.storage.all()
    const legacyKeys = Object.keys(items).filter(key => key.startsWith(KEY_PREFIX))

    await Promise.all(legacyKeys.map(key => runtime.storage.remove(key)))
    await runtime.storage.set<string>(LEGACY_CLEANUP_FLAG, 'done')
}
