import trans from '@common/modules/trans'

export default () => {
    const MIN_URL_LENGTH = 11
    const MAX_URL_LENGTH = 1000

    function urlError(url: string): string | null {
        if (!url.match(/^(http|https):\/\//)) {
            return trans('URL must start with http:// or https://')
        }

        if (url.length > MAX_URL_LENGTH) {
            return trans('url_must_be_less_than', MAX_URL_LENGTH.toString())
        }

        if (url.length < MIN_URL_LENGTH) {
            return trans('url_must_be_at_least', MIN_URL_LENGTH.toString())
        }

        return null
    }

    return {
        urlError,
    }
}
