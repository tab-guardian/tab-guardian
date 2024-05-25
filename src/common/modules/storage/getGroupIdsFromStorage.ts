import getFromStorage from '@common/modules/storage/getFromStorage'

export default async (): Promise<number[]> => {
    const ids = await getFromStorage<number[]>('groupIds')
    return ids || []
}
