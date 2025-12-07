import type { Link, Group, Folder } from '@common/types'
import { generateId } from '@common/modules/group'

export function fakeLink(fields?: Partial<Link>): Link {
    fields ??= {}

    const id = fields.id || generateId()
    const randNum = Math.floor(Math.random() * 10000) + 1

    return {
        id,
        tabId: id,
        url: 'https://www.fake.com',
        title: `Link #${id}`,
        favIconUrl: `https://picsum.photos/seed/${randNum}/100/100`,
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

export function fakeFolder(fields?: Partial<Folder>): Folder {
    fields ??= {}

    const num = Math.floor(Math.random() * 1000000) + 1

    return {
        name: fields.name ?? `Folder ${num}`,
        updatedAt: Date.now(),
        groupIds: [],
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
