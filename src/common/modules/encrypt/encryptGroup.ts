import type { EncryptionAlgo, Group, Link } from '@/types'
import { encryptWithWebCrypto } from '@common/modules/encrypt/encryptWithWebCrypto'
import { createEncryptKey } from "@common/modules/encrypt/webCrypto"

const DEFAULT_ENCRYPT_ALGO = import.meta.env.VITE_CURR_ENCRYPT_ALGO as EncryptionAlgo

export async function encryptGroup(group: Group, pass: string): Promise<Group> {
    const encryptedLinks: Link[] = []
    const encryptAlgo = group.algo || DEFAULT_ENCRYPT_ALGO

    const salt = crypto.getRandomValues(new Uint8Array(16))
    const key = await createEncryptKey(pass, salt, encryptAlgo)

    for (const link of group.links) {
        encryptedLinks.push({
            id: link.id,
            url: await encryptWithWebCrypto(link.url, key, salt, encryptAlgo),
            title: await encryptWithWebCrypto(link.title, key, salt, encryptAlgo),
            favIconUrl: await encryptWithWebCrypto(link.favIconUrl, key, salt, encryptAlgo),
            isPinned: link.isPinned,
        })
    }

    group.algo = encryptAlgo
    group.links = encryptedLinks
    group.isEncrypted = true

    return group
}
