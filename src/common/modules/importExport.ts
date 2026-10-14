import type { ExportSchema, Folder, Group, LegacyExportSchema } from '@common/types'
import { fromBase64 } from '@common/modules/base64'
import pako from 'pako'

export function generateExportSchema(
    groups: readonly Group[],
    folders: readonly Folder[],
    extensionVersion = __APP_VERSION__,
): ExportSchema {
    return {
        meta: { schema: 1, extensionVersion },
        groups,
        folders,
    }
}

export function isEncryptedExport(rawData: string): boolean {
    return rawData.startsWith('algo(')
}

export function decompressExportPayload(rawData: string): string {
    const isCompressed = !rawData.startsWith('{') && !rawData.startsWith('[{')

    if (!isCompressed) {
        return rawData
    }

    return pako.ungzip(fromBase64(rawData), { to: 'string' })
}

export function normalizeExportSchema(json: LegacyExportSchema): ExportSchema {
    if (json !== null && typeof json === 'object' && 'meta' in json) {
        return json
    }

    const groups = Array.isArray(json) ? json : [json]

    // We use extension version 1.18.2 because this is the last version which
    // didn't have any normalized schema. It was just Group and Group[] for
    // export files. Starting from v1.19.0 we now have proper export format
    // with 'meta' field.
    return generateExportSchema(groups, [], '1.18.2')
}

// Seperates groups into fresh and duplicates.
export function splitDuplicateGroups(
    incoming: readonly Group[],
    existing: readonly Group[],
): { duplicates: Group[]; fresh: Group[] } {
    const existingIds = new Set(existing.map(group => group.id))
    const duplicates: Group[] = []
    const fresh: Group[] = []

    for (const group of incoming) {
        if (existingIds.has(group.id)) {
            duplicates.push(group)
            continue
        }

        fresh.push(group)
    }

    return { duplicates, fresh }
}
