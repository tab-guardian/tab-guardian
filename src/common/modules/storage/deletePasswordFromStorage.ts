import deleteFromStorage from '@common/modules/storage/deleteFromStorage'

export default async (groupId: number): Promise<void> => {
    await deleteFromStorage(`group-password-${groupId}`)
}
