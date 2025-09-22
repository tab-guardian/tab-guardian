import { EncryptionAlgo } from "@/types"
import { createEncryptKey } from "@common/modules/encrypt/webCrypto"

export async function encryptWithWebCrypto(
    text: string,
    pass: string,
    encryptionAlgo: EncryptionAlgo,
): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const iv = crypto.getRandomValues(new Uint8Array(16))
    const cryptoKey = await createEncryptKey(pass, salt, encryptionAlgo)
    const textBytes = new TextEncoder().encode(text)

    const encrypted = await crypto.subtle.encrypt(
        { name: encryptionAlgo, iv },
        cryptoKey,
        textBytes,
    )

    const arrLength = salt.length + iv.length + encrypted.byteLength

    const uint8Arr = new Uint8Array(arrLength)
    uint8Arr.set(salt, 0)
    uint8Arr.set(iv, salt.length)
    uint8Arr.set(new Uint8Array(encrypted), salt.length + iv.length)

    return btoa(String.fromCharCode(...uint8Arr))
}
