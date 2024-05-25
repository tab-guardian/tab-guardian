import isDevelopment from '@common/modules/isDevelopment'

export default (key: string): number => {
    const encoder = new TextEncoder()
    const extraBytes = encoder.encode(key).length + 600

    if (isDevelopment()) {
        return 8192 - extraBytes
    }

    return chrome.storage.sync.QUOTA_BYTES_PER_ITEM - extraBytes
}
