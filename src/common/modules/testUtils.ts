import type { Pinia } from 'pinia'
import type { Group } from '@common/types'
import { expect } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useGroupStore } from '@/stores/group'
import { vi } from 'vitest'

export function useFreshPinia(): Pinia {
    const pinia = createPinia()
    setActivePinia(pinia)

    return pinia
}

export async function waitUntil(assertion: () => void): Promise<void> {
    await vi.waitFor(assertion, { timeout: 5000, interval: 25 })
}

// Stored group only includes groups that are visible in the top level.
// Groups that are in folders or hidden are not gonna be returned here.
export function storedGroup(name: string): Group {
    const group = useGroupStore().rootGroups.find(g => g.name === name)
    expect(group).toBeDefined()
    return group!
}

// Initial groups are all groups loaded from the storage without any exceptions
export function storedInitialGroup(name: string): Group {
    const group = useGroupStore().allGroups.find(g => g.name === name)
    expect(group).toBeDefined()
    return group!
}

// Makes generateId() return the given ids in order and only then
// fallback to real randomness. Handy to force an id collision in tests.
export function stubGenerateId(ids: number[]): void {
    const spy = vi.spyOn(crypto, 'getRandomValues')

    for (const id of ids) {
        spy.mockImplementationOnce((buffer: ArrayBufferView) => {
            const values = buffer as Uint32Array

            // Same 21/32 bits split that generateId() packs back together
            values[0] = Math.floor(id / 0x100000000) % 0x200000
            values[1] = id % 0x100000000

            return buffer
        })
    }
}
