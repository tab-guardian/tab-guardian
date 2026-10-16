// @vitest-environment happy-dom

import { describe, it, expect } from 'vitest'
import pako from 'pako'
import { toBase64 } from '@common/modules/base64'
import { fakeFolder, fakeGroup } from '@common/modules/fake'
import {
    decompressExportPayload,
    dropMissingFolderIds,
    generateExportSchema,
    isEncryptedExport,
    normalizeExportSchema,
    splitDuplicateGroups,
} from '@common/modules/importExport'

describe('importExport helpers', () => {
    it('detects encrypted payload', () => {
        expect(isEncryptedExport('algo(AES-GCM,...)')).toBe(true)
        expect(isEncryptedExport('algo(')).toBe(true)
        expect(isEncryptedExport('algo(TEST)')).toBe(true)
        expect(isEncryptedExport('{"meta":{}}')).toBe(false)
    })

    it('passes plain json through', () => {
        const actual = decompressExportPayload('{"meta":{}}')
        expect(actual).toBe('{"meta":{}}')
    })

    it('ungzips compressed payload', () => {
        const json = JSON.stringify([{ name: 'Work' }])
        const gzipped = toBase64(pako.gzip(json))
        const actual = decompressExportPayload(gzipped)

        expect(actual).toBe(json)
    })

    it('wraps legacy array into export schema', () => {
        const group = fakeGroup({ name: 'Work' })
        const actual = normalizeExportSchema([group])

        expect(actual.meta).not.toBeUndefined()
        expect(actual.meta.extensionVersion).not.toBeUndefined()
        expect(actual.meta.schema).not.toBeUndefined()
        expect(actual.groups).toEqual([group])
    })

    it('wraps legacy single group into export schema', () => {
        const group = fakeGroup({ name: 'Work' })
        const actual = normalizeExportSchema(group)

        expect(actual.groups).toEqual([group])
        expect(actual.meta).not.toBeUndefined()
        expect(actual.meta.extensionVersion).not.toBeUndefined()
        expect(actual.meta.schema).not.toBeUndefined()
    })

    it('keeps new export schema as is', () => {
        const schema = generateExportSchema([fakeGroup()], [])
        const actual = normalizeExportSchema(schema)

        expect(actual).toEqual(schema)
    })

    it('splits duplicate and fresh groups by id', () => {
        const existing = [fakeGroup({ id: 1 }), fakeGroup({ id: 2 })]
        const incoming = [fakeGroup({ id: 2 }), fakeGroup({ id: 3 })]

        const { duplicates, fresh } = splitDuplicateGroups(incoming, existing)

        const duplicateIds = duplicates.map(g => g.id)
        const freshIds = fresh.map(g => g.id)

        expect(duplicateIds).toEqual([2])
        expect(freshIds).toEqual([3])
    })

    it('drops folderId when no matching folder exists', () => {
        const groups = [fakeGroup({ id: 1, folderId: 42 })]

        const actual = dropMissingFolderIds(groups, [])

        expect(actual).toHaveLength(1)
        expect(actual[0]?.folderId).toBeUndefined()
    })

    it('keeps folderId when the folder exists', () => {
        const folder = fakeFolder({ id: 42 })
        const groups = [fakeGroup({ id: 1, folderId: 42 })]

        const actual = dropMissingFolderIds(groups, [folder])

        expect(actual).toHaveLength(1)
        expect(actual[0]?.folderId).toEqual(42)
    })

    it('leaves groups without folderId untouched', () => {
        const group = fakeGroup({ id: 1 })

        const actual = dropMissingFolderIds([group], [])

        expect(actual).toHaveLength(1)
        expect(actual[0]).toEqual(group)
    })

    it('does not mutate the input groups', () => {
        const groups = [fakeGroup({ id: 1, folderId: 42 })]

        dropMissingFolderIds(groups, [])

        expect(groups[0]?.folderId).toEqual(42)
    })

    it('handles mixed groups with and without matching folders', () => {
        const folder = fakeFolder({ id: 42 })
        const groups = [
            fakeGroup({ id: 1, folderId: 42 }),
            fakeGroup({ id: 2, folderId: 43 }),
        ]

        const actual = dropMissingFolderIds(groups, [folder])

        expect(actual).toHaveLength(2)
        expect(actual[0]?.folderId).toEqual(42)
        expect(actual[1]?.folderId).toBeUndefined()
    })
})
