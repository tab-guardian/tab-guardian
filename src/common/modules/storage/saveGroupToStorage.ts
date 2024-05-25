import type { Group, Link } from '@/types'
import saveToStorage from '@common/modules/storage/saveToStorage'
import deleteFromStorage from '@common/modules/storage/deleteFromStorage'
import saveGroupIdsToStorage from '@common/modules/storage/saveGroupIdsToStorage'
import getGroupIdsFromStorage from '@common/modules/storage/getGroupIdsFromStorage'

export default async (group: Group): Promise<void> => {
    group.links = group.links.map(link => {
        return {
            ...link,
            favIconUrl: encodeURIComponent(link.favIconUrl),
            url: encodeURIComponent(link.url),
        }
    })

    const ids = await getGroupIdsFromStorage()

    if (ids.includes(group.id)) {
        await deleteFromStorage(group.id.toString()) // delete old group
        await saveToStorage<Group>(group.id.toString(), group) // save new group
        return
    }

    ids.push(group.id)

    await saveGroupIdsToStorage(ids) // save new group id
    await saveToStorage<Group>(group.id.toString(), group) // save new group
}
