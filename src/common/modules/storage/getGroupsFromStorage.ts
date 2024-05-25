import type { Group } from '@/types'
import getFromStorage from '@common/modules/storage/getFromStorage'
import getStorageItemsLimit from '@common/modules/storage/getStorageItemsLimit'

export default async (): Promise<Group[]> => {
    const groups: Group[] = []

    for (let i = 0; i < getStorageItemsLimit(); i++) {
        const group = await getFromStorage<Group>(`group_${i}`)

        if (!group) {
            break
        }

        groups.push(group)
    }

    if (groups.length === 0) {
        return []
    }

    return groups.map(group => decodeGroup(group))
}

function decodeGroup(group: Group): Group {
    const links = group.links.map(link => {
        return {
            ...link,
            favIconUrl: decodeURIComponent(link.favIconUrl),
            url: decodeURIComponent(link.url),
        }
    })

    return {
        ...group,
        links,
    }
}
