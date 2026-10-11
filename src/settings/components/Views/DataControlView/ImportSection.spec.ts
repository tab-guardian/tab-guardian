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
import { folderStorage } from '@common/modules/storage/folder'
import pako from 'pako'
import ImportSection from '@settings/components/Views/DataControlView/ImportSection.vue'
import FileInput from '@common/components/Form/FileInput.vue'

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

        const folder = await folderStorage.save(folderName)
        expect(folder).not.toBeNull()

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

    it('renames imported folder when name already exists', async () => {
        const pinia = createPinia()
        setActivePinia(pinia)

        const modalStore = useModalStore()
        const folderStore = useFolderStore()

        const folderName = 'work-folder-xyz'
        const copyName = `${folderName} (Copy 1)`
        const inFolderUrl = 'https://folder.example/page'

        const existing = await folderStorage.save(folderName)
        expect(existing).not.toBeNull()

        // Same name as existing folder, different id, like a folder
        // coming from another machine
        const incomingFolder = { ...existing!, id: existing!.id + 1 }
        const inFolderGroup = fakeGroup({
            isPrivate: false,
            isEncrypted: false,
            folderId: incomingFolder.id,
            links: [fakeLink({ url: inFolderUrl })],
        })

        const topLevelGroup = fakeGroup({
            isPrivate: false,
            isEncrypted: false,
            links: [fakeLink()],
        })

        const exportSchema = generateExportSchemaV1(
            [topLevelGroup, inFolderGroup],
            [incomingFolder],
        )

        const fileContent = await buildExportFile(exportSchema)

        mockPasswordModal(modalStore)

        const wrapper = mountImportSection(pinia)
        await importFileContent(wrapper, fileContent)

        await folderStore.load()

        const folderNames = folderStore.folders.map(f => f.name)

        expect(folderNames).toContain(folderName)
        expect(folderNames).toContain(copyName)

        // The group must follow its folder instead of dangling
        // on the skipped id
        const folderCopy = folderStore.folders.find(f => f.name === copyName)
        const savedInFolder = useGroupStore().initialGroups.find(
            g => g.name === inFolderGroup.name,
        )

        expect(folderCopy).toBeDefined()
        expect(savedInFolder).toBeDefined()
        expect(savedInFolder!.folderId).toEqual(folderCopy!.id)
        expect(savedInFolder!.links[0].url).toEqual(inFolderUrl)

        wrapper.unmount()
    })

    it('numbers folder copies sequentially', async () => {
        const pinia = createPinia()
        setActivePinia(pinia)

        const modalStore = useModalStore()
        const folderStore = useFolderStore()

        const folderName = 'work-folder-xyz'

        const existingFolder = await folderStorage.save(folderName)
        expect(existingFolder).not.toBeNull()

        const firstFolderCopy = await folderStorage.save(`${folderName} (Copy 1)`)
        expect(firstFolderCopy).not.toBeNull()

        const incomingFolder = { ...existingFolder!, id: existingFolder!.id + 1 }
        const topLevelGroup = fakeGroup({
            isPrivate: false,
            isEncrypted: false,
            links: [fakeLink()],
        })

        const exportSchema = generateExportSchemaV1(
            [topLevelGroup],
            [incomingFolder],
        )

        const fileContent = await buildExportFile(exportSchema)

        mockPasswordModal(modalStore)

        const wrapper = mountImportSection(pinia)
        await importFileContent(wrapper, fileContent)

        await folderStore.load()

        expect(folderStore.folders.map(f => f.name)).toContain(
            `${folderName} (Copy 2)`,
        )

        wrapper.unmount()
    })
})
