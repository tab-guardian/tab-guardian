import { runtime } from '@common/modules/runtime'

export async function getGroupIdsFromStorage(): Promise<number[]> {
    const ids = await runtime.storage.get<number[]>('groupIds')
    return ids || []
}

export async function saveGroupIdsToStorage(ids: number[]): Promise<void> {
    await runtime.storage.set<number[]>('groupIds', ids)
}

export async function deleteGroupIdFromStorage(groupId: number): Promise<void> {
    const ids = await getGroupIdsFromStorage()
    const newIds = ids.filter(id => id !== groupId)

    await saveGroupIdsToStorage(newIds)
}
