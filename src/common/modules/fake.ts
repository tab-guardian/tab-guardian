import type { Link, Group } from '@common/types'
import { generateId } from '@common/modules/group'

export function fakeLink(fields?: Partial<Link>): Link {
    fields ??= {}

    const id = fields.id || generateId()

    return {
        id,
        tabId: id,
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

export function fakeValidImageUrls(): string[] {
    return [
        'https://nice.com/nice_pic.jpg',
        'https://duck.com/duck-photo.png',
        'https://test.io/test.webp',
        'https://test.io/some/path/here/test.webp',
        'https://site.com/img.svg',
        'https://amy.net/photo.gif',
        'http://amy-adams.net/her-photo.png',
    ]
}

export function fakeInvalidImageUrls(): string[] {
    return [
        'https://nice.com/nice_pic.jp',
        'https://duck.com/duck-photo',
        'https://test.io/test.com',
        'https://site.com/',
        '//amy.net/photo.gif',
        'htt://amy-adams.net/her-photo.png',
        'amy-adams-photo.png',
    ]
}
