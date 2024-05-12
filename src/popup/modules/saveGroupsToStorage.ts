import type { Group, Link } from '@/types'
import saveToStorage from '@/modules/saveToStorage'
import hmacSHA512 from 'crypto-js/hmac-sha512'

export default async (groups: Group[], pass: string): Promise<void> => {
    let saveGroups: Group[] = []

    for (const group of groups) {
        if (!group.isPrivate || group.isEncrypted) {
            saveGroups.push(group)
            continue
        }

        if (pass === '') {
            throw new Error('Password is empty')
        }

        saveGroups.push(encryptGroup(group, pass))
    }

    await saveToStorage('groups', saveGroups)
}

function encryptGroup(group: Group, pass: string): Group {
    const encryptedLinks: Link[] = []

    for (const link of group.links) {
        encryptedLinks.push(encryptLink(link, pass))
    }

    group.links = encryptedLinks
    group.isEncrypted = true

    return group
}

function encryptLink(link: Link, pass: string): Link {
    return {
        id: link.id,
        url: hmacSHA512(link.url, pass).toString(),
        title: hmacSHA512(link.title, pass).toString(),
        favIconUrl: hmacSHA512(link.favIconUrl, pass).toString(),
    }
}