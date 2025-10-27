import type { Group } from '@common/types'
import { runtime } from '@common/modules/runtime'
import { cloneDeep } from 'lodash'
import { groupIdsStorage } from '@common/modules/storage/groupIds'

export const groupStorage = {
    async delete(groupId: number): Promise<void> {
        await runtime.storage.remove(groupId.toString())
        await groupIdsStorage.delete(groupId)
    },

    async deleteAll(): Promise<void> {
        await runtime.storage.clear()
        await groupIdsStorage.save([])
    },

    async getAll(): Promise<Group[]> {
        const groupIds = await groupIdsStorage.getAll()
        const groups = await runtime.storage.get<Group>(
            groupIds.map(id => id.toString()),
        )

        for (let group of groups) {
            if (group.bindURL) {
                group.bindUrl = group.bindURL
                delete group.bindURL
            }
        }

        return groups.map(group => decodeGroup(group))
    },

    async save(group: Group): Promise<void> {
        const links = group.links.map(link => {
            return {
                ...link,
                favIconUrl: encodeURIComponent(link.favIconUrl),
                url: encodeURIComponent(link.url),
            }
        })

        const newGroup = cloneDeep(group)
        newGroup.links = links

        const ids = await groupIdsStorage.getAll()

        if (ids.includes(newGroup.id)) {
            // delete old group
            await runtime.storage.remove(newGroup.id.toString())

            // save new group
            await runtime.storage.set<Group>(newGroup.id.toString(), newGroup)
            return
        }

        ids.push(newGroup.id)

        await groupIdsStorage.save(ids) // save new group id

        // save new group
        await runtime.storage.set<Group>(newGroup.id.toString(), newGroup)
    },

    async countUnlocked(): Promise<number> {
        const groups = await this.getAll()
        return groups.filter(g => g.isPrivate && !g.isEncrypted).length
    },
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
