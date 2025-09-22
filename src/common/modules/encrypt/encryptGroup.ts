import type { EncryptionAlgo, Group, Link } from '@/types'
import { encryptWithWebCrypto } from '@common/modules/encrypt/encryptWithWebCrypto'

const DEFAULT_ENCRYPT_ALGO = import.meta.env.VITE_CURR_ENCRYPT_ALGO as EncryptionAlgo

export async function encryptGroup(group: Group, pass: string): Promise<Group> {
    const encryptedLinks: Link[] = []
    const encryptAlgo = group.algo || DEFAULT_ENCRYPT_ALGO

    for (const link of group.links) {
        const encryptedLink = await encryptLink(link, pass, encryptAlgo)
        encryptedLinks.push(encryptedLink)
    }

    group.algo = encryptAlgo
    group.links = encryptedLinks
    group.isEncrypted = true

    return group
}

async function encryptLink(
    link: Link,
    pass: string,
    encryptionAlgo: EncryptionAlgo,
): Promise<Link> {
    return {
        id: link.id,
        url: await encryptWithWebCrypto(link.url, pass, encryptionAlgo),
        title: await encryptWithWebCrypto(link.title, pass, encryptionAlgo),
        favIconUrl: await encryptWithWebCrypto(link.favIconUrl, pass, encryptionAlgo),
        isPinned: link.isPinned,
    }
}
