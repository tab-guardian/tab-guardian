import isDevelopment from '@common/modules/isDevelopment'

export default async <T>(key: string): Promise<T | null> => {
    return new Promise(async (resolve) => {
        let result = ''

        for (let i = 0; true; i++) {
            let newKey = `${key}_${i}`

            if (isDevelopment()) {
                const item = localStorage.getItem(newKey)

                if (!item) {
                    break
                }

                result += item
                continue
            }

            const item = await getFromChromeStorage(newKey)

            if (!item[newKey]) {
                break
            }

            result += item[newKey]
        }

        if (!result) {
            resolve(null)
            return
        }

        resolve(JSON.parse(result))
    })
}

function getFromChromeStorage(key: string): Promise<{ [key: string]: any }> {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(key, items => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
                return
            }

            resolve(items)
        })
    })
}
