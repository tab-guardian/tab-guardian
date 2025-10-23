import { logger, trans } from '@common/modules'

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

export function getDecryptionError(err: any): string {
    if (!isWrongPassError(err)) {
        logger().error('Decryption: ', err)
        return trans('error_occurred')
    }

    return trans('wrong_pass')
}
