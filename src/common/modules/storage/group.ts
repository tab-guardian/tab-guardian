import type { Group } from '@common/types'
import { runtime } from '@common/modules/runtime'
import { cloneDeep } from 'lodash'
import { logger } from '@common/modules'
import {
    getGroupIdsFromStorage,
    saveGroupIdsToStorage,
    deleteGroupIdFromStorage,
} from '@common/modules/storage/groupIds'

export async function deleteGroupFromStorage(groupId: number): Promise<void> {
    await runtime.storage.remove(groupId.toString())
    await deleteGroupIdFromStorage(groupId)
}

export async function deleteAllGroupsFromStorage(): Promise<void> {
    await runtime.storage.clear()
    await saveGroupIdsToStorage([])
}

export async function getGroupsFromStorage(): Promise<Group[]> {
    const groupIds = await getGroupIdsFromStorage()
    const groups: Group[] = []

    for (let groupId of groupIds) {
        const group = await runtime.storage.get<Group>(groupId.toString())

        if (!group) {
            logger(`Group ${groupId} not found in storage, deleting it...`).error
            await deleteGroupIdFromStorage(groupId)
            continue
        }

        if (group.bindURL) {
            group.bindUrl = group.bindURL
            delete group.bindURL
        }

        groups.unshift(group)
    }

    return groups.map(group => decodeGroup(group))
}

export async function saveGroupToStorage(group: Group): Promise<void> {
    const links = group.links.map(link => {
        return {
            ...link,
            favIconUrl: encodeURIComponent(link.favIconUrl),
            url: encodeURIComponent(link.url),
        }
    })

    const newGroup = cloneDeep(group)
    newGroup.links = links

    const ids = await getGroupIdsFromStorage()

    if (ids.includes(newGroup.id)) {
        // delete old group
        await runtime.storage.remove(newGroup.id.toString())

        // save new group
        await runtime.storage.set<Group>(newGroup.id.toString(), newGroup)
        return
    }

    ids.push(newGroup.id)

    await saveGroupIdsToStorage(ids) // save new group id

    // save new group
    await runtime.storage.set<Group>(newGroup.id.toString(), newGroup)
}

function decodeGroup(group: Group): Group {
    const links = group.links.map(link => {
        return {
            ...link,
            favIconUrl: decodeURIComponent(link.favIconUrl),
            url: decodeURIComponent(link.url),
        }
    })

    return { ...group, links }
}
