import saveToStorage from '@common/modules/storage/saveToStorage'

export async function savePasswordToStorage(
    groupId: number,
    pass: string,
): Promise<void> {
    const key = `group-password-${groupId}`
    await saveToStorage<string>(key, pass)
}
