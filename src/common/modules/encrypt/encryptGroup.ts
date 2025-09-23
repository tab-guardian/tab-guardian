import type { EncryptionAlgo, Group, Link } from '@/types'
import { encrypt, uint8ArrToString } from '@common/modules/encrypt/webCrypto'
import { createEncryptKey } from "@common/modules/encrypt/webCrypto"

const DEFAULT_ENCRYPT_ALGO = import.meta.env.VITE_CURR_ENCRYPT_ALGO as EncryptionAlgo

export async function encryptGroup(group: Group, pass: string): Promise<Group> {
    const encryptedLinks: Link[] = []
    const encryptAlgo = group.algo || DEFAULT_ENCRYPT_ALGO

    for (const link of group.links) {
        const salt = crypto.getRandomValues(new Uint8Array(16))
        const iv = crypto.getRandomValues(new Uint8Array(16))
        const key = await createEncryptKey(pass, salt, encryptAlgo)

        encryptedLinks.push({
            id: link.id,
            url: await encrypt(link.url, key, iv, encryptAlgo),
            title: await encrypt(link.title, key, iv, encryptAlgo),
            favIconUrl: await encrypt(link.favIconUrl, key, iv, encryptAlgo),
            isPinned: link.isPinned,
            salt: uint8ArrToString(salt),
            iv: uint8ArrToString(iv),
        })
    }

    group.algo = encryptAlgo
    group.links = encryptedLinks
    group.isEncrypted = true

    return group
}
