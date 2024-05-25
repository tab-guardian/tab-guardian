import isDevelopment from '@common/modules/isDevelopment'

export default (): number => {
    if (isDevelopment()) {
        return 512
    }

    return chrome.storage.sync.MAX_ITEMS
}
