// @vitest-environment happy-dom

import type { Pinia } from 'pinia'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { generateExportSchemaV1 } from '@common/modules/importExport'
import { toBase64 } from '@common/modules/base64'
import { encryptExport } from '@common/modules/webCrypto'
import { fakeGroup, fakeLink } from '@common/modules/fake'
import { useCryptoStore } from '@/stores/crypto'
import { useGroupStore } from '@/stores/group'
import { useFolderStore } from '@/stores/folder'
import { useModalStore } from '@/stores/modal'
import { downloadFile } from '@common/modules'
import ExportSection from '@settings/components/Views/DataControlView/ExportSection.vue'
import Button from '@common/components/Form/Button.vue'
import pako from 'pako'
import ImportSection from '@settings/components/Views/DataControlView/ImportSection.vue'
import FileInput from '@common/components/Form/FileInput.vue'

vi.mock('@common/modules', async importOriginal => {
    const mod = await importOriginal<typeof import('@common/modules')>()
    return { ...mod, downloadFile: vi.fn() }
})

const EXPORT_PASS = 'export-password-123'
const ORIGINAL_PASS = 'original-password-123'

type TestFile = File & { __content?: string }
type FileLoadEvent = { target: { result: string } }
type LoadHandler = (event: FileLoadEvent) => void
type ErrorHandler = (error: unknown) => void

// FileReader can't read real files in happy-dom, so feed it attached content
function mockFileReader(): void {
    class MockFileReader {
        result: string | null = null
        onload: LoadHandler | null = null
        onerror: ErrorHandler | null = null

        readAsText(file: TestFile): void {
            const content = file.__content ?? ''
            this.result = content

            setTimeout(() => {
                this.onload?.({ target: { result: content } })
            }, 0)
        }
    }

    vi.stubGlobal('FileReader', MockFileReader)
}

function makeFile(content: string): TestFile {
    const file = new File([content], 'tab-groups-export', {
        type: 'text/plain',
    }) as TestFile

    file.__content = content

    return file
}

// Mirrors ExportSection: stringify -> gzip -> base64 -> password-protect
async function buildExportFile(exportSchema: unknown): Promise<string> {
    const json = JSON.stringify(exportSchema)
    const compressed = toBase64(pako.gzip(json))
    return await encryptExport(compressed, EXPORT_PASS)
}

// Auto-unlocks the password prompt with the export password,
// auto-confirms the duplicate-name prompt
function mockPasswordModal(modalStore: ReturnType<typeof useModalStore>): void {
    const fakeShow = async (key: string, data: any) => {
        if (key !== 'password') {
            return { isConfirmed: true }
        }

        await data.decrypting(EXPORT_PASS)

        return true
    }

    vi.spyOn(modalStore, 'show').mockImplementation(
        fakeShow as typeof modalStore.show,
    )
}

function mountImportSection(pinia: Pinia): ReturnType<typeof mount> {
    return mount(ImportSection, {
        global: {
            plugins: [pinia],
            stubs: {
                Progress: true,
                Section: { template: '<section><slot /></section>' },
            },
        },
    })
}

async function importFileContent(
    wrapper: ReturnType<typeof mount>,
    content: string,
): Promise<void> {
    const fileInput = wrapper.findComponent(FileInput)
    expect(fileInput.exists()).toBe(true)

    fileInput.vm.$emit('chosen', makeFile(content), document.createElement('input'))

    await vi.waitFor(
        () => {
            expect(useGroupStore().groups.length).toBeGreaterThan(0)
        },
        { timeout: 5000, interval: 25 },
    )
}

describe('ImportSection double-encryption regression', () => {
    beforeEach(() => {
        localStorage.clear()
        mockFileReader()
    })

    afterEach(() => {
        vi.unstubAllGlobals()
        vi.restoreAllMocks()
    })

    it('documents data loss when an already-encrypted group is encrypted again', async () => {
        setActivePinia(createPinia())
        const cryptoStore = useCryptoStore()

        const plainUrl = 'https://original.example/article'
        const group = fakeGroup({
            isPrivate: true,
            isEncrypted: false,
            links: [fakeLink({ url: plainUrl, title: 'Original' })],
        })

        const onceEncrypted = await cryptoStore.encryptGroup(group, ORIGINAL_PASS)
        const originalSalt = onceEncrypted.links[0].salt

        // This is exactly what ImportSection.vue lines 98-99 do today:
        // encrypt without checking `isEncrypted` first.
        const twiceEncrypted = await cryptoStore.encryptGroup(
            onceEncrypted,
            EXPORT_PASS,
        )

        // Salt + IV are overwritten by the second encryption
        expect(twiceEncrypted.links[0].salt).not.toEqual(originalSalt)

        // Unlocking with the export password gives back ciphertext, not the URL
        const unlockedWithExportPass = await cryptoStore.decryptGroup(
            twiceEncrypted,
            EXPORT_PASS,
        )

        expect(unlockedWithExportPass.links[0].url).not.toEqual(plainUrl)
        expect(unlockedWithExportPass.links[0].url).toEqual(
            onceEncrypted.links[0].url,
        )

        // The original password fails on both the once- and twice-encrypted versions
        await expect(
            cryptoStore.decryptGroup(twiceEncrypted, ORIGINAL_PASS),
        ).rejects.toThrowError()
        await expect(
            cryptoStore.decryptGroup(unlockedWithExportPass, ORIGINAL_PASS),
        ).rejects.toThrowError()
    })

    it('does not encrypt an already-locked group on import', async () => {
        const pinia = createPinia()
        setActivePinia(pinia)

        const cryptoStore = useCryptoStore()
        const modalStore = useModalStore()

        const plainUrl = 'https://locked.example/secret'
        const locked = await cryptoStore.encryptGroup(
            fakeGroup({
                isPrivate: true,
                links: [fakeLink({ url: plainUrl, title: 'Locked' })],
            }),
            ORIGINAL_PASS,
        )
        const originalSalt = locked.links[0].salt
        const originalUrlCipher = locked.links[0].url

        const fileContent = await buildExportFile([locked])
        const encryptSpy = vi.spyOn(cryptoStore, 'encryptGroup')

        mockPasswordModal(modalStore)

        const wrapper = mountImportSection(pinia)
        await importFileContent(wrapper, fileContent)

        // Correct behavior: already-encrypted group is left untouched
        expect(encryptSpy).not.toHaveBeenCalled()

        const saved = useGroupStore().groups.find(g => g.name === locked.name)

        expect(saved).toBeDefined()
        expect(saved!.isEncrypted).toBe(true)
        expect(saved!.links[0].salt).toEqual(originalSalt)
        expect(saved!.links[0].url).toEqual(originalUrlCipher)

        const decrypted = await useCryptoStore().decryptGroup(saved!, ORIGINAL_PASS)
        expect(decrypted.links[0].url).toEqual(plainUrl)

        wrapper.unmount()
    })

    it('leaves an open group open on import', async () => {
        const pinia = createPinia()
        setActivePinia(pinia)

        const modalStore = useModalStore()

        const openGroup = fakeGroup({
            isPrivate: false,
            isEncrypted: false,
            links: [fakeLink({ url: 'https://open.example/page', title: 'Open' })],
        })

        const fileContent = await buildExportFile([openGroup])

        mockPasswordModal(modalStore)

        const wrapper = mountImportSection(pinia)
        await importFileContent(wrapper, fileContent)

        const saved = useGroupStore().groups.find(g => g.name === openGroup.name)

        expect(saved).toBeDefined()

        // The file password only protected the file in transit,
        // it must not turn an open group into a locked one
        expect(saved!.isEncrypted).toBe(false)
        expect(saved!.isPrivate).toBe(false)

        wrapper.unmount()
    })
})

describe('ImportSection export file schemas', () => {
    beforeEach(() => {
        localStorage.clear()
        mockFileReader()
    })

    afterEach(() => {
        vi.unstubAllGlobals()
        vi.restoreAllMocks()
    })

    it('imports legacy single-group file', async () => {
        const pinia = createPinia()
        setActivePinia(pinia)

        const singleUrl = 'https://single.example/page'
        const group = fakeGroup({
            isPrivate: false,
            isEncrypted: false,
            links: [fakeLink({ url: singleUrl, title: 'Single' })],
        })

        // Single-group export from the popup menu is plain gzip + base64,
        // no password envelope around it
        const plainContent = toBase64(pako.gzip(JSON.stringify(group)))

        const wrapper = mountImportSection(pinia)
        await importFileContent(wrapper, plainContent)

        const saved = useGroupStore().groups.find(g => g.name === group.name)

        expect(saved).toBeDefined()
        expect(saved!.isEncrypted).toBe(false)
        expect(saved!.links[0].url).toEqual(singleUrl)

        wrapper.unmount()
    })

    it('imports legacy groups-array file', async () => {
        const pinia = createPinia()
        setActivePinia(pinia)

        const modalStore = useModalStore()

        const firstUrl = 'https://first.example/page'
        const secondUrl = 'https://second.example/page'
        const first = fakeGroup({
            isPrivate: false,
            isEncrypted: false,
            links: [fakeLink({ url: firstUrl })],
        })

        const second = fakeGroup({
            isPrivate: false,
            isEncrypted: false,
            links: [fakeLink({ url: secondUrl })],
        })

        const fileContent = await buildExportFile([first, second])

        mockPasswordModal(modalStore)

        const wrapper = mountImportSection(pinia)
        await importFileContent(wrapper, fileContent)

        const savedFirst = useGroupStore().groups.find(g => g.name === first.name)
        const savedSecond = useGroupStore().groups.find(g => g.name === second.name)

        expect(savedFirst).toBeDefined()
        expect(savedSecond).toBeDefined()
        expect(savedFirst!.links[0].url).toEqual(firstUrl)
        expect(savedSecond!.links[0].url).toEqual(secondUrl)

        wrapper.unmount()
    })

    it('imports new ExportFile with groups and folders', async () => {
        const pinia = createPinia()
        setActivePinia(pinia)

        const modalStore = useModalStore()
        const folderStore = useFolderStore()

        const folderName = 'import-folder-xyz'
        const topUrl = 'https://top.example/page'
        const inFolderUrl = 'https://folder.example/page'

        await folderStore.save(folderName)

        const folder = folderStore.folders.find(f => f.name === folderName)
        expect(folder).not.toBeUndefined()

        const topLevel = fakeGroup({
            isPrivate: false,
            isEncrypted: false,
            links: [fakeLink({ url: topUrl })],
        })

        const inFolderGroup = fakeGroup({
            isPrivate: false,
            isEncrypted: false,
            folderId: folder!.id,
            links: [fakeLink({ url: inFolderUrl })],
        })

        const exportSchema = generateExportSchemaV1(
            [topLevel, inFolderGroup],
            [folder!],
        )

        const fileContent = await buildExportFile(exportSchema)

        mockPasswordModal(modalStore)

        const wrapper = mountImportSection(pinia)
        await importFileContent(wrapper, fileContent)

        await folderStore.load()

        const savedTop = useGroupStore().groups.find(g => g.name === topLevel.name)
        const restoredFolder = folderStore.folders.find(f => f.id === folder!.id)

        // In-folder groups live in initialGroups, not the top-level display list
        const savedInFolder = useGroupStore().initialGroups.find(
            g => g.name === inFolderGroup.name,
        )

        expect(savedTop).toBeDefined()
        expect(savedTop!.links[0].url).toEqual(topUrl)

        // Folders come back with their ids so group links stay valid
        expect(restoredFolder).toBeDefined()
        expect(restoredFolder!.name).toEqual(folderName)

        expect(savedInFolder).toBeDefined()
        expect(savedInFolder!.folderId).toEqual(folder!.id)
        expect(savedInFolder!.links[0].url).toEqual(inFolderUrl)

        wrapper.unmount()
    })

    it('links imported group to the renamed folder copy on name conflict', async () => {
        const pinia = createPinia()
        setActivePinia(pinia)

        const modalStore = useModalStore()
        const folderStore = useFolderStore()

        const folderName = 'conflict-folder-xyz'
        const inFolderUrl = 'https://folder.example/page'

        await folderStore.save(folderName)

        const existingFolder = folderStore.folders.find(f => f.name === folderName)
        expect(existingFolder).not.toBeUndefined()

        // Same name as the existing folder, foreign id, like a folder
        // coming from another machine
        const incomingFolder = { ...existingFolder!, id: existingFolder!.id + 1 }
        const inFolderGroup = fakeGroup({
            isPrivate: false,
            isEncrypted: false,
            folderId: incomingFolder.id,
            links: [fakeLink({ url: inFolderUrl })],
        })
        const topLevel = fakeGroup({
            isPrivate: false,
            isEncrypted: false,
            links: [fakeLink()],
        })

        const exportSchema = generateExportSchemaV1(
            [topLevel, inFolderGroup],
            [incomingFolder],
        )

        const fileContent = await buildExportFile(exportSchema)

        mockPasswordModal(modalStore)

        const wrapper = mountImportSection(pinia)
        await importFileContent(wrapper, fileContent)

        await folderStore.load()

        // The group must land in a folder that exists, not dangle
        // on the skipped folder id
        const savedInFolder = useGroupStore().initialGroups.find(
            g => g.name === inFolderGroup.name,
        )

        expect(savedInFolder).toBeDefined()

        const linkedFolder = folderStore.folders.find(
            f => f.id === savedInFolder!.folderId,
        )

        expect(linkedFolder).toBeDefined()
        expect(savedInFolder!.links[0].url).toEqual(inFolderUrl)

        wrapper.unmount()
    })

    it('imports declined duplicates as copies instead of aborting', async () => {
        const pinia = createPinia()
        setActivePinia(pinia)

        const modalStore = useModalStore()

        const groupName = 'declined-group-xyz'
        const originalUrl = 'https://original.example/page'
        const incomingUrl = 'https://incoming.example/page'

        await useGroupStore().save(
            fakeGroup({
                name: groupName,
                links: [fakeLink({ url: originalUrl })],
            }),
        )

        const incomingGroup = fakeGroup({
            name: groupName,
            links: [fakeLink({ url: incomingUrl })],
        })

        const fileContent = await buildExportFile([incomingGroup])

        // Unlock the file but decline replacing duplicates
        vi.spyOn(modalStore, 'show').mockImplementation((async (
            key: string,
            data: any,
        ) => {
            if (key === 'password') {
                await data.decrypting(EXPORT_PASS)
                return true
            }

            return { isConfirmed: false }
        }) as typeof modalStore.show)

        const wrapper = mountImportSection(pinia)

        const fileInput = wrapper.findComponent(FileInput)
        expect(fileInput.exists()).toBe(true)

        fileInput.vm.$emit(
            'chosen',
            makeFile(fileContent),
            document.createElement('input'),
        )

        await vi.waitFor(
            () => {
                expect(useGroupStore().groups.map(g => g.name)).toContain(
                    `${groupName} (Copy 1)`,
                )
            },
            { timeout: 5000, interval: 25 },
        )

        const groupNames = useGroupStore().groups.map(g => g.name)

        expect(groupNames).toContain(groupName)
        expect(groupNames).toContain(`${groupName} (Copy 1)`)

        const originalGroup = useGroupStore().groups.find(g => g.name === groupName)
        const copiedGroup = useGroupStore().groups.find(
            g => g.name === `${groupName} (Copy 1)`,
        )

        expect(originalGroup!.links[0].url).toEqual(originalUrl)
        expect(copiedGroup!.links[0].url).toEqual(incomingUrl)

        wrapper.unmount()
    })
})

describe('Export-import round trip', () => {
    beforeEach(() => {
        localStorage.clear()
        mockFileReader()
    })

    afterEach(() => {
        vi.unstubAllGlobals()
        vi.restoreAllMocks()
        vi.clearAllMocks()
    })

    it('restores exact bytes produced by export', async () => {
        const folderName = 'roundtrip-folder-xyz'
        const topUrl = 'https://top.example/page'
        const inFolderUrl = 'https://folder.example/page'

        // First machine: build data and export it
        const exportPinia = createPinia()
        setActivePinia(exportPinia)

        const exportFolderStore = useFolderStore()
        await exportFolderStore.save(folderName)

        const exportedFolder = exportFolderStore.folders.find(
            f => f.name === folderName,
        )
        expect(exportedFolder).toBeDefined()

        const exportGroupStore = useGroupStore()
        await exportGroupStore.save(
            fakeGroup({ links: [fakeLink({ url: topUrl })] }),
        )
        const topName = exportGroupStore.groups[0]!.name

        await exportGroupStore.save(
            fakeGroup({
                folderId: exportedFolder!.id,
                links: [fakeLink({ url: inFolderUrl })],
            }),
        )

        const exportWrapper = mount(ExportSection, {
            global: {
                plugins: [exportPinia],
                stubs: {
                    Section: { template: '<section><slot /></section>' },
                    SlideSwitch: true,
                    Progress: true,
                },
            },
        })

        exportWrapper.findComponent(Button).vm.$emit('clicked')

        await vi.waitFor(
            () => {
                expect(vi.mocked(downloadFile)).toHaveBeenCalledOnce()
            },
            { timeout: 5000, interval: 25 },
        )

        const payload = vi.mocked(downloadFile).mock.calls[0][0] as string
        const folderId = exportedFolder!.id
        exportWrapper.unmount()

        // Second machine: blank storage, import the payload
        localStorage.clear()
        vi.clearAllMocks()

        const importPinia = createPinia()
        setActivePinia(importPinia)

        const importWrapper = mountImportSection(importPinia)
        await importFileContent(importWrapper, payload)

        const folderStore = useFolderStore()
        await folderStore.load()

        const restoredFolder = folderStore.folders.find(f => f.id === folderId)

        expect(restoredFolder).toBeDefined()
        expect(restoredFolder!.name).toEqual(folderName)

        const savedTop = useGroupStore().groups.find(g => g.name === topName)
        expect(savedTop).toBeDefined()
        expect(savedTop!.links[0].url).toEqual(topUrl)

        const inFolderNames = useGroupStore()
            .initialGroups.filter(g => g.folderId === folderId)
            .map(g => g.links[0].url)

        expect(inFolderNames).toContain(inFolderUrl)

        importWrapper.unmount()
    })
})
