import type { Link, Group } from '@common/types'

export function fakeLink(fields?: Partial<Link>): Link {
    fields ??= {}

    const rand = Date.now() + Math.floor(Math.random() * 1000)
    const id = fields.id || rand

    return {
        id,
        url: 'https://duckduckgo.com',
        title: `Link #${id}`,
        favIconUrl: 'https://placehold.co/50',
        isPinned: false,
        ...fields,
    }
}

export function fakeLinks(): Link[] {
    return [fakeLink(), fakeLink()]
}

export function fakeGroup(fields?: Partial<Group>): Group {
    fields ??= {}

    const id = Math.floor(Date.now() + Math.random() * 1000)

    return {
        id,
        name: fields.name ?? `Test group ${id}`,
        links: fields.links || fakeLinks(),
        isPrivate: false,
        isEncrypted: false,
        updatedAt: Date.now(),
        ...fields,
    }
}
