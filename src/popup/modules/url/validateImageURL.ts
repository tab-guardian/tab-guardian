import { trans } from '@common/modules/trans'
import { validateURL } from '@/modules/url/validateURL'

export function validateImageURL(url: string): string | null {
    const FORMATS = ['.png', '.webp', '.jpeg', '.jpg', '.svg', '.gif']
    const msg = validateURL(url)

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
