import { trans } from '@common/modules/trans'
import { validateURL } from '@/modules/url/validateURL'
import { isImageURL, imgFormats } from '@/modules/url/isImageURL'

export function validateImageURL(url: string): string | null {
    const msg = validateURL(url)

    if (msg !== null) {
        return msg
    }

    if (!isImageURL(url)) {
        return trans('image_format_allowed') + ' ' + imgFormats.join(', ')
    }

    return null
}
