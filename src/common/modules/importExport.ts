import type { Group, Folder, ExportSchemaV1 } from '@common/types'

export function generateExportSchemaV1(
    groups: readonly Group[],
    folders: readonly Folder[],
    extensionVersion = __APP_VERSION__,
): ExportSchemaV1 {
    return {
        meta: { schema: 1, extensionVersion },
        groups,
        folders,
    }
}
