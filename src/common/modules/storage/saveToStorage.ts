import error from '@common/modules/error'
import isDevelopment from '@common/modules/isDevelopment'

export default async <T>(
    key: string,
    value: T | null | undefined,
): Promise<void> => {
    if (!value) {
        const msg = `Failed to save "${key}" to storage because value is '${value}'`
        error.err(msg)
        return
    }

    let json = JSON.stringify(value)
    const limit = getBytesPerItem(key)
    const jsonChunks = splitString(json, limit)

    for (let i = 0; i < jsonChunks.length; i++) {
        const chunkKey = `${key}_${i}`
        const chunk = jsonChunks[i]

        if (isDevelopment()) {
            localStorage.setItem(chunkKey, chunk)
            continue
        }

        await chrome.storage.sync.set({ [chunkKey]: chunk })
    }
}

function splitString(str: string, bytesLimit: number): string[] {
    let result = []
    let currentChunk = ""
    let currentBytes = 0

    for (let char of str) {
        let charBytes = new TextEncoder().encode(char).length

        if (currentBytes + charBytes > bytesLimit) {
            result.push(currentChunk)
            currentChunk = char
            currentBytes = charBytes
            continue
        }

        currentChunk += char
        currentBytes += charBytes
    }

    if (currentChunk) {
        result.push(currentChunk)
    }

    return result
}

function getBytesPerItem(key: string): number {
    const extraBytes = key.length + 400

    if (isDevelopment()) {
        return 8192 - extraBytes
    }

    return chrome.storage.sync.QUOTA_BYTES_PER_ITEM - extraBytes
}