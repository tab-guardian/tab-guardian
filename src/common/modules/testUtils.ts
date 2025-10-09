import type { Group } from '@common/types'

export function getFakeGroup(name: string = 'Test Group'): Group {
    return {
        id: 1,
        name,
        links: [],
        isPrivate: false,
        isEncrypted: false,
        updatedAt: Date.now(),
    }
}
