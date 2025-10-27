import { getGroupsFromStorage } from '@common/modules/storage/group'
import { runtime } from '@common/modules/runtime'

const KEY = 'has-unlocked-groups'

export async function setHasUnlockedGroupsFlag(): Promise<void> {
    await runtime.storage.set<string>(KEY, '1')
}

export async function hasUnlockedGroupsFlag(): Promise<boolean> {
    const results = await runtime.storage.get<string>(KEY)
    return results.length > 0 && results[0] === '1'
}

export async function deleteHasUnlockedGroupsFlag(): Promise<void> {
    await runtime.storage.remove(KEY)
}

export async function countUnlockedGroups(): Promise<number> {
    const groups = await getGroupsFromStorage()
    return groups.filter(g => g.isPrivate && !g.isEncrypted).length
}
