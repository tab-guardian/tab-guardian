import { runtime } from '@common/modules/runtime'

export const groupIdsStorage = {
    async getAll(): Promise<number[]> {
        const results = await runtime.storage.get<number[]>('groupIds')
        return results[0] ?? []
    },

    async save(ids: number[]): Promise<void> {
        await runtime.storage.set<number[]>('groupIds', ids)
    },

    async delete(groupId: number): Promise<void> {
        const ids = await this.getAll()
        const newIds = ids.filter(id => id !== groupId)

        await this.save(newIds)
    },
}
