import saveGroupIdsToStorage from '@common/modules/storage/saveGroupIdsToStorage'
import getGroupIdsFromStorage from '@common/modules/storage/getGroupIdsFromStorage'

export default async (groupId: number): Promise<void> => {
    const ids = await getGroupIdsFromStorage()
    const newIds = ids.filter(id => id !== groupId)

    await saveGroupIdsToStorage(newIds)
}
