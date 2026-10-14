// @vitest-environment happy-dom

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useFreshPinia } from '@common/modules/testUtils'
import { fakeGroup } from '@common/modules/fake'
import { runtime } from '@common/modules/runtime'
import { useFolderStore } from '@/stores/folder'
import { useGroupStore } from '@/stores/group'
import { useSettingsStore } from '@/stores/settings'

describe('groups in folders in incognito window', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('marks open groups inside folders as hidden in private window', async () => {
        useFreshPinia()

        vi.spyOn(runtime.windows, 'getCurrent').mockResolvedValue({
            incognito: true,
        } as any)

        const folderStore = useFolderStore()
        const groupStore = useGroupStore()
        const settingsStore = useSettingsStore()

        await folderStore.create('work')
        const folder = folderStore.get('work')!

        const openGroup = fakeGroup({
            name: 'open-task',
            isPrivate: false,
            folderId: folder.id,
        })
        await groupStore.create(openGroup)

        settingsStore.settings.showOnlyPrivateGroupsInIncognito = true
        await groupStore.load()

        expect(groupStore.get(openGroup.id)?.hide).toBe(true)
    })
})
