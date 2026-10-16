import type { Group, Link } from '@common/types'

/**
 * Conversion between a `Group` in memory and the way it is persisted.
 *
 * Link URLs are URL-encoded before they are written to storage and
 * decoded when they are read back. It keeps a stored link value from being
 * a live, ready-to-use URL. Older versions also stored the bound URL under
 * the `bindURL` field, which is folded into `bindUrl` on read.
 *
 * Both functions return new objects and never mutate the input.
 */

export function encodeGroup(group: Group): Group {
    return { ...group, links: group.links.map(encodeLink) }
}

export function decodeGroup(group: Group): Group {
    return {
        ...normalizeLegacyFields(group),
        links: group.links.map(decodeLink),
    }
}

function encodeLink(link: Link): Link {
    return {
        ...link,
        favIconUrl: encodeURIComponent(link.favIconUrl),
        url: encodeURIComponent(link.url),
    }
}

function decodeLink(link: Link): Link {
    return {
        ...link,
        favIconUrl: decodeURIComponent(link.favIconUrl),
        url: decodeURIComponent(link.url),
    }
}

function normalizeLegacyFields(group: Group): Group {
    if (!group.bindURL) {
        return group
    }

    const { bindURL, ...rest } = group

    return { ...rest, bindUrl: bindURL }
}
