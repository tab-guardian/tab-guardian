import type { Link } from '@common/types'
import { toRaw } from 'vue'
import { isForbittenUrl } from '@common/modules/url'
import { showToast } from '@common/modules/toast'
import { trans } from '@common/modules'

export function generateId(): number {
    return Math.floor(Math.random() * 1000000)
}

export function isComponentIcon(str: string): boolean {
    if (str.length <= 4) {
        return false
    }

    return str.slice(-4) === 'Icon'
}

export function filterForbittenLinks(links: Link[]): Link[] {
    const forbitten = links.filter(l => isForbittenUrl(l.url))

    if (forbitten.length > 0) {
        for (const link of forbitten) {
            showToast({
                text: trans('browser_cannot_open_tab', link.url),
                type: 'error',
            })
        }
    }

    const result = links.filter(l => !isForbittenUrl(l.url)).map(l => toRaw(l))

    return toRaw(result)
}
