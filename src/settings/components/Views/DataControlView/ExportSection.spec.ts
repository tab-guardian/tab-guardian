// @vitest-environment happy-dom

import type { Pinia } from 'pinia'
import type { ExportSchema, Folder } from '@common/types'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { fromBase64 } from '@common/modules/base64'
import { fakeGroup, fakeLink } from '@common/modules/fake'
import { downloadFile } from '@common/modules'
import { decryptExport } from '@common/modules/webCrypto'
import { useFolderStore } from '@/stores/folder'
import { useGroupStore } from '@/stores/group'
import { useModalStore } from '@/stores/modal'
import { useFreshPinia, waitUntil } from '@common/modules/testUtils'
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
                Progress: true,
            },
        },
    })
}

async function clickExport(pinia: Pinia): Promise<ExportSchema> {
    const wrapper = mountExportSection(pinia)
    wrapper.findComponent(Button).vm.$emit('clicked')

    await waitUntil(() => {
        expect(vi.mocked(downloadFile)).toHaveBeenCalledOnce()
    })

    const exportContent = vi.mocked(downloadFile).mock.calls[0][0] as string
    wrapper.unmount()

    const fileContent = JSON.parse(
        pako.ungzip(fromBase64(exportContent), { to: 'string' }),
    ) as ExportSchema

    return fileContent
}

const topLevelGroupName = 'top-level-group'
const inFolderGroupName = 'in-folder-group'

async function seedFolderWithGroups(folderName: string): Promise<Folder> {
    const folderStore = useFolderStore()
    await folderStore.create(folderName)

    const folder = folderStore.get(folderName)
    expect(folder).not.toBeUndefined()

    const groupStore = useGroupStore()

    await groupStore.createMany([
        fakeGroup({ name: topLevelGroupName }),
        fakeGroup({ name: inFolderGroupName, folderId: folder!.id }),
    ])

    return folder!
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
        const pinia = useFreshPinia()

        await useGroupStore().create(fakeGroup({ name: topLevelGroupName }))

        const actual = await clickExport(pinia)

        expect(actual.meta.schema).toBe(1)
        expect(typeof actual.meta.extensionVersion).toBe('string')
        expect(actual.meta.extensionVersion.length).toBeGreaterThan(0)
    })

    it('includes groups stored inside folders into export', async () => {
        const pinia = useFreshPinia()
        await seedFolderWithGroups('my-folder-xyz')

        const actual = await clickExport(pinia)
        const actualNames = actual.groups.map(g => g.name)

        expect(actualNames).toContain(topLevelGroupName)
        expect(actualNames).toContain(inFolderGroupName)
    })

    it('includes folders into export', async () => {
        const pinia = useFreshPinia()
        const folder = await seedFolderWithGroups('my-folder-xyz')

        const actual = await clickExport(pinia)

        expect(actual.folders.map(f => f.name)).toContain(folder.name)
        expect(actual.folders.map(f => f.id)).toContain(folder.id)
    })

    it('exports nothing when storage is empty', async () => {
        const pinia = useFreshPinia()

        const wrapper = mountExportSection(pinia)
        wrapper.findComponent(Button).vm.$emit('clicked')

        await new Promise(resolve => setTimeout(resolve, 300))

        expect(vi.mocked(downloadFile)).not.toHaveBeenCalled()

        wrapper.unmount()
    })

    it('protects export with password', async () => {
        const pinia = useFreshPinia()

        const exportPass = 'export-password-123'
        const groupUrl = 'https://top.example/page'
        const modalStore = useModalStore()

        await useGroupStore().create(
            fakeGroup({
                name: topLevelGroupName,
                links: [fakeLink({ url: groupUrl })],
            }),
        )

        vi.spyOn(modalStore, 'show').mockImplementation((async () => ({
            newPass: exportPass,
        })) as typeof modalStore.show)

        const wrapper = mountExportSection(pinia)

        // Checkbox will tell to protect export with password
        await wrapper.find('input[type="checkbox"]').setValue(true)
        wrapper.findComponent(Button).vm.$emit('clicked')

        await waitUntil(() => {
            expect(vi.mocked(downloadFile)).toHaveBeenCalledOnce()
        })

        const exportContent = vi.mocked(downloadFile).mock.calls[0][0] as string
        wrapper.unmount()

        expect(exportContent.startsWith('algo(')).toBe(true)

        const decrypted = await decryptExport(exportContent, exportPass)

        const actual = JSON.parse(
            pako.ungzip(fromBase64(decrypted), { to: 'string' }),
        ) as ExportSchema

        expect(actual.groups.map(g => g.name)).toContain(topLevelGroupName)
        expect(actual.meta.schema).toBe(1)
    })
})
