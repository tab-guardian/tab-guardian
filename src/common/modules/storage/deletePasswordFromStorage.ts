import { deleteFromStorage } from '@common/modules/storage/deleteFromStorage'

export async function deletePasswordFromStorage(groupId: number): Promise<void> {
    await deleteFromStorage(`group-password-${groupId}`)
}
