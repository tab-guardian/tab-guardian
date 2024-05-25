import deleteFromStorage from '@common/modules/storage/deleteFromStorage'
import deleteGroupIdFromStorage from '@common/modules/storage/deleteGroupIdFromStorage'

export default async (groupId: number): Promise<void> => {
    await deleteGroupIdFromStorage(groupId)
    await deleteFromStorage(groupId.toString())
}
