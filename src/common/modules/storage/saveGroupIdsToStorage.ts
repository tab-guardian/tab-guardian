import saveToStorage from '@common/modules/storage/saveToStorage'

export default async (ids: number[]): Promise<void> => {
    await saveToStorage<number[]>('groupIds', ids)
}
