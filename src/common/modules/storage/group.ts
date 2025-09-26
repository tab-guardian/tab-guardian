import type { Group } from '@/types'
import { saveToStorage, getFromStorage, deleteFromStorage } from '@common/modules/storage'
import { cloneDeep } from 'lodash'
import { error } from '@common/modules/error'
import {
    getGroupIdsFromStorage,
    saveGroupIdsToStorage,
    deleteGroupIdFromStorage,
} from '@common/modules/storage/groupIds'

export async function deleteGroupFromStorage(groupId: number): Promise<void> {
    await deleteFromStorage(groupId.toString())
    await deleteGroupIdFromStorage(groupId)
}

export async function deleteAllGroupsFromStorage(): Promise<void> {
    const ids = await getGroupIdsFromStorage()

    for (let id of ids) {
        await deleteGroupFromStorage(id)
    }

    await saveGroupIdsToStorage([])
}

export async function getGroupsFromStorage(): Promise<Group[]> {
    const groupIds = await getGroupIdsFromStorage()
    const groups: Group[] = []

    for (let groupId of groupIds) {
        const group = await getFromStorage<Group>(groupId.toString())

        if (!group) {
            error.err(`Group ${groupId} not found in storage, deleting it...`)
            await deleteGroupIdFromStorage(groupId)
            continue
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
        await deleteFromStorage(newGroup.id.toString()) // delete old group
        await saveToStorage<Group>(newGroup.id.toString(), newGroup) // save new group
        return
    }

    ids.push(newGroup.id)

    await saveGroupIdsToStorage(ids) // save new group id
    await saveToStorage<Group>(newGroup.id.toString(), newGroup) // save new group
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
        ...group, links
    }
}
