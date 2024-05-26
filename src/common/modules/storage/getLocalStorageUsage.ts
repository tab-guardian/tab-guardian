export default (): number => {
    let totalBytes = 0

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)

        if (!key) {
            continue
        }

        const value = localStorage.getItem(key)

        if (value) {
            totalBytes += key.length + value.length
        }
    }

    return totalBytes
}
