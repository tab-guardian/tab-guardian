// @vitest-environment happy-dom

import type { Pinia } from 'pinia'
import type { ExportSchemaV1 } from '@common/types'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { fromBase64 } from '@common/modules/base64'
import { fakeGroup, fakeLink } from '@common/modules/fake'
import { downloadFile } from '@common/modules'
import { groupStorage } from '@common/modules/storage/group'
import { folderStorage } from '@common/modules/storage/folder'
import { useGroupStore } from '@/stores/group'
import { useFolderStore } from '@/stores/folder'
import ExportSection from '@settings/components/Views/DataControlView/ExportSection.vue'
import Button from '@common/components/Form/Button.vue'
import pako from 'pako'

vi.mock('@common/modules', async importOriginal => {
    const mod = await importOriginal<typeof import('@common/modules')>()
    return { ...mod, downloadFile: vi.fn() }
})

function mountExportSection(pinia: Pinia): ReturnType<typeof mount> {
    return mount(ExportSection, {
        global: {
            plugins: [pinia],
            stubs: {
                Section: { template: '<section><slot /></section>' },
                SlideSwitch: true,
                Progress: true,
            },
        },
    })
}

async function exportAndParse(): Promise<ExportSchemaV1> {
    const mocked = vi.mocked(downloadFile)
    expect(mocked).toHaveBeenCalledOnce()

    const payload = mocked.mock.calls[0][0] as string
    const json = pako.ungzip(fromBase64(payload), { to: 'string' })

    return JSON.parse(json) as ExportSchemaV1
}

async function clickExport(pinia: Pinia): Promise<ExportSchemaV1> {
    const wrapper = mountExportSection(pinia)
    wrapper.findComponent(Button).vm.$emit('clicked')

    await vi.waitFor(
        () => {
            expect(vi.mocked(downloadFile)).toHaveBeenCalledOnce()
        },
        { timeout: 5000, interval: 25 },
    )

    const parsed = await exportAndParse()
    wrapper.unmount()

    return parsed
}

describe('ExportSection export file', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('writes meta with schema and extension versions', async () => {
        const pinia = createPinia()
        setActivePinia(pinia)

        const group = fakeGroup({ name: 'top-level-group' })

        await useGroupStore().save(group)

        const parsed = await clickExport(pinia)

        expect(parsed.meta.schema).toBe(1)
        expect(typeof parsed.meta.extensionVersion).toBe('string')
        expect(parsed.meta.extensionVersion.length).toBeGreaterThan(0)
    })

    it('includes groups stored inside folders', async () => {
        const pinia = createPinia()
        setActivePinia(pinia)

        const groupStore = useGroupStore()
        const folder = await folderStorage.save('my-folder-xyz')

        expect(folder).not.toBeNull()

        const topLevelGroup = fakeGroup({
            name: 'top-level-group',
            links: [fakeLink()],
        })

        const inFolderGroup = fakeGroup({
            name: 'in-folder-group',
            folderId: folder!.id,
            links: [fakeLink()],
        })

        await groupStore.save(topLevelGroup)
        await groupStore.save(inFolderGroup)
        await groupStore.load()

        const stored = await groupStorage.getAll()

        expect(stored.map(g => g.name).sort()).toEqual([
            inFolderGroup.name,
            topLevelGroup.name,
        ])

        const parsed = await clickExport(pinia)
        const names = parsed.groups.map(g => g.name)

        expect(names).toContain(topLevelGroup.name)
        expect(names).toContain(inFolderGroup.name)
    })

    it('includes folders', async () => {
        const pinia = createPinia()
        setActivePinia(pinia)

        const groupStore = useGroupStore()
        const folderStore = useFolderStore()

        const folderName = 'my-folder-xyz'
        const folder = await folderStorage.save(folderName)

        expect(folder).not.toBeNull()

        const topLevelGroup = fakeGroup({
            name: 'top-level-group',
            links: [fakeLink()],
        })

        const inFolderGroup = fakeGroup({
            name: 'in-folder-group',
            folderId: folder!.id,
            links: [fakeLink()],
        })

        await groupStore.save(topLevelGroup)
        await groupStore.save(inFolderGroup)

        await groupStore.load()
        await folderStore.load()

        expect(folderStore.folders.map(f => f.name)).toContain(folderName)

        const parsed = await clickExport(pinia)

        expect(parsed.folders.map(f => f.name)).toContain(folderName)
        expect(parsed.folders.map(f => f.id)).toContain(folder!.id)
    })
})
