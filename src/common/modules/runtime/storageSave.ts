import { formatNumber, logger, trans } from '@common/modules'

// Best-effort detection. Browsers use different messages for the same
// "storage is full" condition, so we fall back to a general save error.
const QUOTA_ERROR_MARKERS = ['QUOTA_BYTES', 'QuotaExceededError', 'quota exceeded']

export class StorageSaveError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'StorageSaveError'
    }
}

export function isQuotaError(err: unknown): boolean {
    if (!(err instanceof Error)) {
        return false
    }

    const details = `${err.name} ${err.message}`.toLowerCase()

    return QUOTA_ERROR_MARKERS.some(marker => details.includes(marker.toLowerCase()))
}

export function quotaMessage(bytesQuota: number, usedBytes: number): string {
    const MB = 1024 * 1024

    return trans(
        'not_enough_storage',
        formatNumber(bytesQuota / MB),
        formatNumber(usedBytes / MB),
    )
}

// Converts a failed write into an error callers can check.
export function toStorageSaveError(
    err: unknown,
    bytesQuota: number,
    usedBytes: number,
): StorageSaveError {
    logger().error('Failed to save to storage:', err)

    const msg = isQuotaError(err)
        ? quotaMessage(bytesQuota, usedBytes)
        : trans('save_failed')

    return new StorageSaveError(msg)
}
