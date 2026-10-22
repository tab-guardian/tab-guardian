import type { Group, GroupVisibility, Link } from '@common/types'
import { toRaw } from 'vue'
import { isForbiddenUrl } from '@common/modules/url'
import { trans } from '@common/modules'

// 53 bits of cryptographic randomness packed into a number:
// 21 high bits and 32 low bits, the largest exact integer
// a JS number can hold. Much better than using Math.random which
// we were using before.
export function generateId(): number {
    const buffer = crypto.getRandomValues(new Uint32Array(2))
    const high = buffer[0] % 0x200000

    return high * 0x100000000 + buffer[1]
}

// Returns a random id that is not in takenIds
export function generateUniqueId(takenIds: ReadonlySet<number>): number {
    let id = generateId()

    while (takenIds.has(id)) {
        id = generateId()
    }

    return id
}

// Returns a new name for given folder or group name in format
// `<name> (Copy <number>)`
export function forceUniqueName(oldName: string, takenNames: Set<string>): string {
    if (!takenNames.has(oldName)) {
        return oldName
    }

    let duplicateIndex = 1

    while (takenNames.has(`${oldName} (Copy ${duplicateIndex})`)) {
        duplicateIndex++
    }

    return `${oldName} (Copy ${duplicateIndex})`
}

export function isGroupHidden(group: Group, visibility: GroupVisibility): boolean {
    if (group.bindUrl) {
        if (visibility.currHashedUrl !== group.bindUrl) {
            return true
        }
    }

    if (
        !group.isPrivate &&
        visibility.isIncognito &&
        visibility.settings.showOnlyPrivateGroupsInIncognito
    ) {
        return true
    }

    if (
        group.isPrivate &&
        !visibility.isIncognito &&
        visibility.settings.showPrivateGroupsOnlyInIncognito
    ) {
        return true
    }

    return false
}

export function isComponentIcon(str: string): boolean {
    if (str.length <= 4) {
        return false
    }

    return str.slice(-4) === 'Icon'
}

export function forbiddenLinksMessage(links: Link[]): string | null {
    if (links.length === 0) {
        return null
    }

    const urls = links.map(link => link.url).join(', ')

    return trans('browser_cannot_open_these_tabs', urls)
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
