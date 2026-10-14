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
    const group = useGroupStore().groups.find(g => g.name === name)
    expect(group).toBeDefined()
    return group!
}

// Initial groups are all groups loaded from the storage without any exceptions
export function storedInitialGroup(name: string): Group {
    const group = useGroupStore().initialGroups.find(g => g.name === name)
    expect(group).toBeDefined()
    return group!
}
