import { trans } from '@common/modules'

export function validateImageUrl(url: string): string | null {
    const FORMATS = ['.png', '.webp', '.jpeg', '.jpg', '.svg', '.gif']
    const msg = validateUrl(url)

    if (msg !== null) {
        return msg
    }

    let hasImageExt = false

    for (const format of FORMATS) {
        if (url.includes(format)) {
            hasImageExt = true
            break
        }
    }

    if (!hasImageExt) {
        return trans('image_format_allowed') + ' ' + FORMATS.join(', ')
    }

    return null
}

export function validateUrl(url: string | null): string | null {
    const MIN_URL_LENGTH = 11
    const MAX_URL_LENGTH = 1000

    if (!url || url.length < MIN_URL_LENGTH) {
        return trans('url_must_be_at_least', MIN_URL_LENGTH.toString())
    }

    if (!url.match(/^(http|https):\/\/[^/:-]/)) {
        return trans('url_must_start_with_http')
    }

    if (url.length > MAX_URL_LENGTH) {
        return trans('url_must_be_less_than', MAX_URL_LENGTH.toString())
    }

    return null
}
