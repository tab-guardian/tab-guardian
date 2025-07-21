import { deleteFromStorage } from '@common/modules/storage/deleteFromStorage'
import { deleteGroupIdFromStorage } from '@common/modules/storage/deleteGroupIdFromStorage'

export async function deleteGroupFromStorage(groupId: number): Promise<void> {
    await deleteFromStorage(groupId.toString())
    await deleteGroupIdFromStorage(groupId)
}
