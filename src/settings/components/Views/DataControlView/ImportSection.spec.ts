// @vitest-environment happy-dom

import type { Pinia } from 'pinia'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import {
    useFreshPinia,
    waitUntil,
    storedGroup,
    storedInitialGroup,
} from '@common/modules/testUtils'
import { generateExportSchema } from '@common/modules/importExport'
import { toBase64 } from '@common/modules/base64'
import { encryptExport } from '@common/modules/webCrypto'
import { fakeGroup, fakeLink } from '@common/modules/fake'
import { useCryptoStore } from '@/stores/crypto'
import { useFolderStore } from '@/stores/folder'
import { useGroupStore } from '@/stores/group'
import { useModalStore } from '@/stores/modal'
import ImportSection from '@settings/components/Views/DataControlView/ImportSection.vue'
import FileInput from '@common/components/Form/FileInput.vue'
import pako from 'pako'

const FILE_PASS = 'export-password-123'
const GROUP_PASS = 'original-password-123'

type TestFile = File & { __content?: string }

// happy-dom cannot read real files, so feed the attached content instead
function mockFileReader(): void {
    class MockFileReader {
        onload: ((event: { target: { result: string } }) => void) | null = null

        readAsText(file: TestFile): void {
            const content = file.__content ?? ''

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

function buildPlainFile(payload: unknown): string {
    return toBase64(pako.gzip(JSON.stringify(payload)))
}

async function buildPasswordProtectedFile(payload: unknown): Promise<string> {
    return await encryptExport(
        toBase64(pako.gzip(JSON.stringify(payload))),
        FILE_PASS,
    )
}

// Answers the password dialog with the file password and the duplicate
// dialog with `confirmDuplicates`. Only use in tests where a dialog fires.
function mockModals(
    modalStore: ReturnType<typeof useModalStore>,
    confirmDuplicates = true,
): void {
    vi.spyOn(modalStore, 'show').mockImplementation((async (
        key: string,
        data: any,
    ) => {
        if (key === 'password') {
            await data.decrypting(FILE_PASS)
            return true
        }

        return { isConfirmed: confirmDuplicates }
    }) as typeof modalStore.show)
}

function mountImportSection(pinia: Pinia): ReturnType<typeof mount> {
    return mount(ImportSection, {
        global: {
            plugins: [pinia],
            stubs: {
                Progress: true, // Ignore Progress component
                Section: { template: '<div><slot /></div>' },
            },
        },
    })
}

function chooseFile(wrapper: ReturnType<typeof mount>, content: string): void {
    const fileInput = wrapper.findComponent(FileInput)
    expect(fileInput.exists()).toBe(true)

    fileInput.vm.$emit('chosen', makeFile(content), document.createElement('input'))
}

describe('ImportSection', () => {
    beforeEach(() => {
        localStorage.clear()
        mockFileReader()
    })

    afterEach(() => {
        vi.unstubAllGlobals()
        vi.restoreAllMocks()
    })

    it('keeps locked group locked', async () => {
        const pinia = useFreshPinia()
        const modalStore = useModalStore()

        const plainUrl = 'https://locked.example/secret'
        const lockedGroup = await useCryptoStore().encryptGroup(
            fakeGroup({
                links: [fakeLink({ url: plainUrl, title: 'Locked' })],
            }),
            GROUP_PASS,
        )

        const wrapper = mountImportSection(pinia)

        mockModals(modalStore)
        chooseFile(wrapper, await buildPasswordProtectedFile([lockedGroup]))

        // Wait until groups will appear in the store after import
        await waitUntil(() => {
            expect(useGroupStore().groups.length).toBeGreaterThan(0)
        })

        const savedGroup = storedGroup(lockedGroup.name)

        expect(savedGroup.isEncrypted).toBe(true)

        // Verify that password for the group is still correct
        const decryptedGroup = await useCryptoStore().decryptGroup(
            savedGroup,
            GROUP_PASS,
        )

        expect(decryptedGroup.links[0].url).toEqual(plainUrl)

        wrapper.unmount()
    })

    it('keeps open group open', async () => {
        const pinia = useFreshPinia()
        const modalStore = useModalStore()

        const wrapper = mountImportSection(pinia)

        mockModals(modalStore)

        const exportGroups = [fakeGroup({ name: 'open-group' })]
        const encryptedExport = await buildPasswordProtectedFile(exportGroups)

        chooseFile(wrapper, encryptedExport)

        await waitUntil(() => {
            const groupsCount = useGroupStore().groups.length
            expect(groupsCount).toBeGreaterThan(0)
        })

        const savedGroup = storedGroup('open-group')

        expect(savedGroup.isEncrypted).toBe(false)
        expect(savedGroup.isPrivate).toBe(false)

        wrapper.unmount()
    })

    it('imports legacy single group', async () => {
        const pinia = useFreshPinia()

        const linkUrl = 'https://single.example/page'
        const groupLinks = [fakeLink({ url: linkUrl })]
        const group = fakeGroup({ links: groupLinks })

        const wrapper = mountImportSection(pinia)
        chooseFile(wrapper, buildPlainFile(group))

        await waitUntil(() => {
            const groupsCount = useGroupStore().groups.length
            expect(groupsCount).toBeGreaterThan(0)
        })

        expect(storedGroup(group.name).links[0].url).toEqual(linkUrl)

        wrapper.unmount()
    })

    it('imports legacy groups array', async () => {
        const pinia = useFreshPinia()

        const firstUrl = 'https://first.example/page'
        const secondUrl = 'https://second.example/page'

        const firstGroup = fakeGroup({
            name: 'first-group',
            links: [fakeLink({ url: firstUrl })],
        })

        const secondGroup = fakeGroup({
            name: 'second-group',
            links: [fakeLink({ url: secondUrl })],
        })

        const wrapper = mountImportSection(pinia)

        chooseFile(wrapper, buildPlainFile([firstGroup, secondGroup]))

        await waitUntil(() => {
            const groupsCount = useGroupStore().groups.length
            expect(groupsCount).toBeGreaterThan(1)
        })

        expect(storedGroup('first-group').links[0].url).toEqual(firstUrl)
        expect(storedGroup('second-group').links[0].url).toEqual(secondUrl)

        wrapper.unmount()
    })

    it('imports schema with folders', async () => {
        const pinia = useFreshPinia()
        const folderStore = useFolderStore()

        const folderName = 'import-folder-xyz'
        const topGroupUrl = 'https://top.example/page'
        const inFolderGroupUrl = 'https://folder.example/page'

        await folderStore.create(folderName)

        const folder = folderStore.folders.find(f => f.name === folderName)
        expect(folder).not.toBeUndefined()

        const wrapper = mountImportSection(pinia)

        const topGroup = fakeGroup({
            name: 'top-group',
            links: [fakeLink({ url: topGroupUrl })],
        })

        const inFolderGroup = fakeGroup({
            name: 'in-folder-group',
            folderId: folder!.id,
            links: [fakeLink({ url: inFolderGroupUrl })],
        })

        chooseFile(
            wrapper,
            buildPlainFile(
                generateExportSchema([topGroup, inFolderGroup], [folder!]),
            ),
        )

        await waitUntil(() => {
            const groupsCount = useGroupStore().groups.length
            expect(groupsCount).toBeGreaterThan(0)
        })

        await folderStore.load()

        const restoredFolder = folderStore.folders.find(f => f.id === folder!.id)
        expect(restoredFolder).toBeDefined()
        expect(restoredFolder!.name).toEqual(folderName)

        expect(storedGroup('top-group').links[0].url).toEqual(topGroupUrl)

        const savedInFolder = storedInitialGroup('in-folder-group')
        expect(savedInFolder.folderId).toEqual(folder!.id)
        expect(savedInFolder.links[0].url).toEqual(inFolderGroupUrl)

        wrapper.unmount()
    })

    it('keeps group linked on folder name conflict', async () => {
        const pinia = useFreshPinia()
        const folderStore = useFolderStore()

        const folderName = 'conflict-folder-xyz'
        const inFolderUrl = 'https://folder.example/page'

        await folderStore.create(folderName)

        const existingFolder = folderStore.folders.find(f => f.name === folderName)
        expect(existingFolder).not.toBeUndefined()

        const incomingFolder = { ...existingFolder!, id: existingFolder!.id + 1 }

        const wrapper = mountImportSection(pinia)

        const inFolderGroup = fakeGroup({
            name: 'in-folder-group',
            folderId: incomingFolder.id,
            links: [fakeLink({ url: inFolderUrl })],
        })

        chooseFile(
            wrapper,
            buildPlainFile(generateExportSchema([inFolderGroup], [incomingFolder])),
        )

        // Wait untils groups will appear in the store
        await waitUntil(() => {
            const groupsCount = useGroupStore().initialGroups.length
            expect(groupsCount).toBeGreaterThan(0)
        })

        await folderStore.load()

        const savedInFolder = storedInitialGroup('in-folder-group')
        const linkedFolder = folderStore.folders.find(
            f => f.id === savedInFolder.folderId,
        )

        expect(linkedFolder).toBeDefined()
        expect(savedInFolder.links[0].url).toEqual(inFolderUrl)

        wrapper.unmount()
    })

    it('creates copies when overwriting duplicates is declined', async () => {
        const pinia = useFreshPinia()
        const modalStore = useModalStore()

        const originalUrl = 'https://original.example/page'
        const incomingUrl = 'https://incoming.example/page'

        const declinedGroup = fakeGroup({
            name: 'declined-group-xyz',
            links: [fakeLink({ url: originalUrl })],
        })

        await useGroupStore().create(declinedGroup)
        const storedId = storedGroup(declinedGroup.name).id

        const wrapper = mountImportSection(pinia)

        mockModals(modalStore, false)

        chooseFile(
            wrapper,
            buildPlainFile([
                fakeGroup({
                    id: storedId,
                    name: declinedGroup.name,
                    links: [fakeLink({ url: incomingUrl })],
                }),
            ]),
        )

        await waitUntil(() => {
            const groupNames = useGroupStore().groups.map(g => g.name)
            expect(groupNames).toContain(`${declinedGroup.name} (Copy 1)`)
        })

        const originalGroup = storedGroup(declinedGroup.name)
        const copiedGroup = storedGroup(`${declinedGroup.name} (Copy 1)`)

        expect(originalGroup.links[0].url).toEqual(originalUrl)
        expect(originalGroup.id).toEqual(storedId)
        expect(copiedGroup.links[0].url).toEqual(incomingUrl)
        expect(copiedGroup.id).not.toEqual(storedId)

        wrapper.unmount()
    })

    it('overwrites group when duplicates are accepted', async () => {
        const pinia = useFreshPinia()
        const modalStore = useModalStore()

        const originalUrl = 'https://original.example/page'
        const incomingUrl = 'https://incoming.example/page'

        const acceptedGroup = fakeGroup({
            name: 'accepted-group-xyz',
            links: [fakeLink({ url: originalUrl })],
        })

        await useGroupStore().create(acceptedGroup)

        const storedId = storedGroup(acceptedGroup.name).id
        const wrapper = mountImportSection(pinia)

        mockModals(modalStore, true)

        chooseFile(
            wrapper,
            buildPlainFile([
                fakeGroup({
                    id: storedId,
                    name: acceptedGroup.name,
                    links: [fakeLink({ url: incomingUrl })],
                }),
            ]),
        )

        // Wait until link URL inside of a group will be updated
        await waitUntil(() => {
            const updatedGroup = useGroupStore().groups.find(
                g => g.name === acceptedGroup.name,
            )
            const updatedUrl = updatedGroup?.links[0].url
            expect(updatedUrl).toEqual(incomingUrl)
        })

        expect(useGroupStore().groups).toHaveLength(1)

        const storedLinkUrl = storedGroup(acceptedGroup.name).links[0].url
        expect(storedLinkUrl).toEqual(incomingUrl)

        wrapper.unmount()
    })
})
