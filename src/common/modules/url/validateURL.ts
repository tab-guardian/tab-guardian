import { trans } from '@common/modules/utils'

export function validateURL(url: string): string | null {
    const MIN_URL_LENGTH = 11
    const MAX_URL_LENGTH = 1000

    if (!url.match(/^(http|https):\/\//)) {
        return trans('url_must_start_with_http')
    }

    if (url.length > MAX_URL_LENGTH) {
        return trans('url_must_be_less_than', MAX_URL_LENGTH.toString())
    }

    if (url.length < MIN_URL_LENGTH) {
        return trans('url_must_be_at_least', MIN_URL_LENGTH.toString())
    }

    return null
}
