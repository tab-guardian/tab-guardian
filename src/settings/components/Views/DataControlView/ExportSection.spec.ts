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
import { useGroupStore } from '@/stores/group'
import { useFolderStore } from '@/stores/folder'
import { useModalStore } from '@/stores/modal'
import { decryptExport } from '@common/modules/webCrypto'
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

        await useGroupStore().create(group)

        const parsed = await clickExport(pinia)

        expect(parsed.meta.schema).toBe(1)
        expect(typeof parsed.meta.extensionVersion).toBe('string')
        expect(parsed.meta.extensionVersion.length).toBeGreaterThan(0)
    })

    it('includes groups stored inside folders', async () => {
        const pinia = createPinia()
        setActivePinia(pinia)

        const groupStore = useGroupStore()
        const folderStore = useFolderStore()

        await folderStore.create('my-folder-xyz')

        const folder = folderStore.folders.find(f => f.name === 'my-folder-xyz')

        expect(folder).not.toBeUndefined()

        const topLevelGroup = fakeGroup({
            name: 'top-level-group',
            links: [fakeLink()],
        })

        const inFolderGroup = fakeGroup({
            name: 'in-folder-group',
            folderId: folder!.id,
            links: [fakeLink()],
        })

        await groupStore.create(topLevelGroup)
        await groupStore.create(inFolderGroup)
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
        await folderStore.create(folderName)

        const folder = folderStore.folders.find(f => f.name === folderName)

        expect(folder).not.toBeUndefined()

        const topLevelGroup = fakeGroup({
            name: 'top-level-group',
            links: [fakeLink()],
        })

        const inFolderGroup = fakeGroup({
            name: 'in-folder-group',
            folderId: folder!.id,
            links: [fakeLink()],
        })

        await groupStore.create(topLevelGroup)
        await groupStore.create(inFolderGroup)

        await groupStore.load()
        await folderStore.load()

        expect(folderStore.folders.map(f => f.name)).toContain(folderName)

        const parsed = await clickExport(pinia)

        expect(parsed.folders.map(f => f.name)).toContain(folderName)
        expect(parsed.folders.map(f => f.id)).toContain(folder!.id)
    })

    it('exports nothing when storage is empty', async () => {
        const pinia = createPinia()
        setActivePinia(pinia)

        const wrapper = mountExportSection(pinia)
        wrapper.findComponent(Button).vm.$emit('clicked')

        await new Promise(resolve => setTimeout(resolve, 300))

        expect(vi.mocked(downloadFile)).not.toHaveBeenCalled()

        wrapper.unmount()
    })

    it('protects export with password', async () => {
        const pinia = createPinia()
        setActivePinia(pinia)

        const exportPass = 'export-password-123'
        const groupUrl = 'https://top.example/page'
        const modalStore = useModalStore()

        await useGroupStore().create(
            fakeGroup({
                name: 'top-level-group',
                links: [fakeLink({ url: groupUrl })],
            }),
        )

        vi.spyOn(modalStore, 'show').mockImplementation((async () => ({
            newPass: exportPass,
        })) as typeof modalStore.show)

        const wrapper = mount(ExportSection, {
            global: {
                plugins: [pinia],
                stubs: {
                    Section: { template: '<section><slot /></section>' },
                    Progress: true,
                },
            },
        })

        await wrapper.find('input[type="checkbox"]').setValue(true)
        wrapper.findComponent(Button).vm.$emit('clicked')

        await vi.waitFor(
            () => {
                expect(vi.mocked(downloadFile)).toHaveBeenCalledOnce()
            },
            { timeout: 5000, interval: 25 },
        )

        const payload = vi.mocked(downloadFile).mock.calls[0][0] as string

        expect(payload.startsWith('algo(')).toBe(true)

        const decrypted = await decryptExport(payload, exportPass)
        const json = pako.ungzip(fromBase64(decrypted), { to: 'string' })
        const parsed = JSON.parse(json) as ExportSchemaV1

        expect(parsed.groups.map(g => g.name)).toContain('top-level-group')
        expect(parsed.meta.schema).toBe(1)

        wrapper.unmount()
    })
})
