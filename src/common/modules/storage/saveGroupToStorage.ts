import type { Group } from '@/types'
import saveToStorage from '@common/modules/storage/saveToStorage'
import deleteFromStorage from '@common/modules/storage/deleteFromStorage'
import saveGroupIdsToStorage from '@common/modules/storage/saveGroupIdsToStorage'
import getGroupIdsFromStorage from '@common/modules/storage/getGroupIdsFromStorage'

export default async (group: Group): Promise<void> => {
    const links = group.links.map(link => {
        return {
            ...link,
            favIconUrl: encodeURIComponent(link.favIconUrl),
            url: encodeURIComponent(link.url),
        }
    })

    const newGroup = {
        ...group,
        links,
    }

    const ids = await getGroupIdsFromStorage()

    if (ids.includes(newGroup.id)) {
        await deleteFromStorage(newGroup.id.toString()) // delete old group
        await saveToStorage<Group>(newGroup.id.toString(), newGroup) // save new group
        return
    }

    ids.push(newGroup.id)

    await saveGroupIdsToStorage(ids) // save new group id
    await saveToStorage<Group>(newGroup.id.toString(), newGroup) // save new group
}
