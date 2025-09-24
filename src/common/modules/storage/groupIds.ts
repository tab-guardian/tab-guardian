import { saveToStorage, getFromStorage } from '@common/modules/storage'

export async function getGroupIdsFromStorage(): Promise<number[]> {
    const ids = await getFromStorage<number[]>('groupIds')
    return ids || []
}

export async function saveGroupIdsToStorage(ids: number[]): Promise<void> {
    await saveToStorage<number[]>('groupIds', ids)
}

export async function deleteGroupIdFromStorage(groupId: number): Promise<void> {
    const ids = await getGroupIdsFromStorage()
    const newIds = ids.filter(id => id !== groupId)

    await saveGroupIdsToStorage(newIds)
}
