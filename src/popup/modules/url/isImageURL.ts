export const imgFormats = ['.png', '.webp', '.jpeg', '.jpg', '.svg', '.gif']

export function isImageURL(imgURL: string | null | undefined): boolean {
    if (!imgURL) {
        return false
    }

    // remove everything after ? mark from image URL
    const clearURL = imgURL.split('?')[0]

    let hasImageExt = false

    for (const format of imgFormats) {
        if (clearURL.endsWith(format)) {
            hasImageExt = true
            break
        }
    }

    if (!hasImageExt) {
        return false
    }

    return clearURL.startsWith('http')
}
