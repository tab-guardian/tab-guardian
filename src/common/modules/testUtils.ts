import type { Pinia } from 'pinia'
import type { Group, Folder } from '@common/types'
import { createPinia, setActivePinia } from 'pinia'
import { vi } from 'vitest'
import { fakeGroup, fakeLink } from '@common/modules/fake'

export function useFreshPinia(): Pinia {
    const pinia = createPinia()
    setActivePinia(pinia)

    return pinia
}

export async function waitUntil(assertion: () => void): Promise<void> {
    await vi.waitFor(assertion, { timeout: 5000, interval: 25 })
}

export function getOpenGroup(name: string, url: string, folderId?: number): Group {
    return fakeGroup({
        name,
        isPrivate: false,
        isEncrypted: false,
        folderId,
        links: [fakeLink({ url })],
    })
}

