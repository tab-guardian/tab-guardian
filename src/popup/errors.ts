import { logger, trans } from '@common/modules'
import { StorageSaveError } from '@common/modules/runtime/storageSave'

export const CRYPTO_JS_DECRYPTION_FAILED = 'Malformed UTF-8 data'
export const WEB_CRYPTO_DECRYPTION_FAILED =
    'The operation failed for an operation-specific reason'

export function isWrongPassError(err: any): boolean {
    return (
        err instanceof Error &&
        [CRYPTO_JS_DECRYPTION_FAILED, WEB_CRYPTO_DECRYPTION_FAILED].includes(
            err.message,
        )
    )
}

// Storage failures already carry a user-facing message
// (storage is full or the change was not saved).
export function getSaveErrorMessage(err: unknown): string {
    if (err instanceof StorageSaveError) {
        return err.message
    }

    logger().error('Saving: ', err)

    return trans('save_failed')
}

export function getDecryptionError(err: any): string {
    if (!isWrongPassError(err)) {
        logger().error('Decryption: ', err)
        return trans('error_occurred')
    }

    return trans('wrong_pass')
}
