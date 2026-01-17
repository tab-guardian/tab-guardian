import type { Link } from '@common/types'
import { toRaw } from 'vue'
import { isForbiddenUrl } from '@common/modules/url'
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

export function filterForbiddenLinks(links: Link[]): Link[] {
    const allowed: Link[] = []

    for (const link of links) {
        if (isForbiddenUrl(link.url)) {
            showToast({
                text: trans('browser_cannot_open_tab', link.url),
                type: 'error',
            })
            continue
        }

        allowed.push(link)
    }

    return toRaw(allowed.map(l => toRaw(l)))
}
