import { saveToStorage } from '@common/modules/storage/saveToStorage'

export async function saveGroupIdsToStorage(ids: number[]): Promise<void> {
    await saveToStorage<number[]>('groupIds', ids)
}
