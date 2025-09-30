import { getGroupsFromStorage } from '@common/modules/storage/group'
import { saveToStorage, getFromStorage, deleteFromStorage } from '@common/modules/storage'

const KEY = 'has-unlocked-groups'

export async function setHasUnlockedGroupsFlag(): Promise<void> {
    await saveToStorage<string>(KEY, '1')
}

export async function hasUnlockedGroupsFlag(): Promise<boolean> {
    const flag = await getFromStorage<string>(KEY)
    return flag === '1'
}

export async function getHasUnlockedGroupsFlag(): Promise<string | null> {
    return await getFromStorage<string>(KEY)
}

export async function deleteHasUnlockedGroupsFlag(): Promise<void> {
    await deleteFromStorage(KEY)
}

export async function countUnlockedGroups(): Promise<number> {
    const groups = await getGroupsFromStorage()
    return groups.filter(g => g.isPrivate && !g.isEncrypted).length
}
