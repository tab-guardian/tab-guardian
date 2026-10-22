import type { Group } from '@common/types'
import { runtime } from '@common/modules/runtime'
import { groupIdsStorage } from '@common/modules/storage/groupIds'
import { passwordStorage } from '@common/modules/storage/password'
import { decodeGroup, encodeGroup } from '@common/modules/group-codec'

export const groupStorage = {
    async delete(groupId: number): Promise<void> {
        await runtime.storage.remove(groupId.toString())
        await groupIdsStorage.delete(groupId)
    },

    async deleteAll(): Promise<void> {
        const groupIds = await groupIdsStorage.getAll()

        for (const id of groupIds) {
            await this.delete(id)
            await passwordStorage.delete(id)
        }
    },

    async getAll(): Promise<Group[]> {
        const groupIds = await groupIdsStorage.getAll()
        const groups = await runtime.storage.get<Group>(
            groupIds.map(id => id.toString()),
        )

        return groups.map(decodeGroup)
    },

    async save(group: Group): Promise<void> {
        const newGroup = encodeGroup(group)
        const ids = await groupIdsStorage.getAll()

        // Save the group before registering its id, so a failed write
        // cannot leave an id pointing to data that was never stored.
        await runtime.storage.set<Group>(newGroup.id.toString(), newGroup)

        if (ids.includes(newGroup.id)) {
            return
        }

        ids.push(newGroup.id)

        await groupIdsStorage.save(ids)
    },

    async countUnlocked(): Promise<number> {
        const groups = await this.getAll()
        return groups.filter(g => g.isPrivate && !g.isEncrypted).length
    },
}
