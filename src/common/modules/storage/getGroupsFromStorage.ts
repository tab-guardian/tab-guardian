import type { Group } from '@/types'
import { getFromStorage } from '@common/modules/storage/getFromStorage'
import { getGroupIdsFromStorage } from '@common/modules/storage/getGroupIdsFromStorage'
import { error } from '@common/modules/error'

export async function getGroupsFromStorage(): Promise<Group[]> {
    const groupIds = await getGroupIdsFromStorage()
    const groups: Group[] = []

    for (let groupId of groupIds) {
        const group = await getFromStorage<Group>(groupId.toString())

        if (!group) {
            error.err(`Group with id ${groupId} not found in storage`)
            continue
        }

        groups.unshift(group)
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
