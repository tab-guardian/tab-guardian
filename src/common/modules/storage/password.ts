import { saveToStorage, getFromStorage, deleteFromStorage } from '@common/modules/storage'

export async function savePasswordToStorage(groupId: number, pass: string): Promise<void> {
    await saveToStorage<string>(`group-password-${groupId}`, pass)
}

export async function getPasswordFromStorage(groupId: number): Promise<string | null> {
    return getFromStorage<string>(`group-password-${groupId}`)
}

export async function deletePasswordFromStorage(groupId: number): Promise<void> {
    await deleteFromStorage(`group-password-${groupId}`)
}
