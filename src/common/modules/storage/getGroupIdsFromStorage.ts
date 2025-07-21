import { getFromStorage } from '@common/modules/storage/getFromStorage'

export async function getGroupIdsFromStorage(): Promise<number[]> {
    const ids = await getFromStorage<number[]>('groupIds')
    return ids || []
}
