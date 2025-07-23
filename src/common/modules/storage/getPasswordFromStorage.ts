import { getFromStorage } from '@common/modules/storage/getFromStorage'

export async function getPasswordFromStorage(
    groupId: number,
): Promise<string | null> {
    const key = `group-password-${groupId}`
    return getFromStorage<string>(key)
}
