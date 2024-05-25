import getGroupIdsFromStorage from '@common/modules/storage/getGroupIdsFromStorage'
import deleteGroupFromStorage from '@common/modules/storage/deleteGroupFromStorage'
import saveGroupIdsToStorage from '@common/modules/storage/saveGroupIdsToStorage'

export default async (): Promise<void> => {
    const ids = await getGroupIdsFromStorage()

    for (let id of ids) {
        await deleteGroupFromStorage(id)
    }

    await saveGroupIdsToStorage([])
}
