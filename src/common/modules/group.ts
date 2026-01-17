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

export function printForbiddenLinks(links: Link[]): void {
    for (const link of links) {
        showToast({
            text: trans('browser_cannot_open_tab', link.url),
            type: 'error',
        })
    }
}

export function filterForbiddenLinks(links: Link[]): {
    allowed: Link[]
    forbidden: Link[]
} {
    let allowed: Link[] = []
    let forbidden: Link[] = []

    for (const link of links) {
        if (isForbiddenUrl(link.url)) {
            forbidden.push(link)
            continue
        }

        allowed.push(link)
    }

    allowed = toRaw(allowed.map(l => toRaw(l)))

    return { allowed, forbidden }
}
