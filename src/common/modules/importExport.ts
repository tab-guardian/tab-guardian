import type { Group, Folder, ExportSchema } from '@common/types'

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
