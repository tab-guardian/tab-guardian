import { runtime } from '@common/modules/runtime'
import { KEY_PREFIX as PASSWORD_KEY_PREFIX } from '@common/modules/storage/password'

export const KEY_PREFIX = 'storage-schema'
const LEGACY_PASSWORD_CLEANUP = 1

/**
 * Always point to the latest migration when adding a new one.
 * Each step below runs only if its version is newer than the stored schema.
 */
const LATEST_SCHEMA = LEGACY_PASSWORD_CLEANUP

export async function migrateStorage(): Promise<void> {
    // decodeStorageEntries drops falsy values, so a missing key and
    // version 0 both mean "nothing applied yet". Never store 0.
    const [storedSchema = 0] = await runtime.storage.get<number>(KEY_PREFIX)

    if (storedSchema >= LATEST_SCHEMA) {
        return
    }

    if (LEGACY_PASSWORD_CLEANUP > storedSchema) {
        await removeLegacyPasswords()
    }

    await runtime.storage.set<number>(KEY_PREFIX, LATEST_SCHEMA)
}

async function removeLegacyPasswords(): Promise<void> {
    const items = await runtime.storage.all()
    const legacyKeys = Object.keys(items).filter(key =>
        key.startsWith(PASSWORD_KEY_PREFIX),
    )

    await Promise.all(legacyKeys.map(key => runtime.storage.remove(key)))
}
