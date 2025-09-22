import { createDecryptKey } from "@common/modules/encrypt/webCrypto"
import { EncryptionAlgo } from "@/types"

export async function decryptWithWebpCrypto(
    encrypted: string,
    pass: string,
    encryptAlgo: EncryptionAlgo,
): Promise<string> {
    const encryptedBytes = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0))

    // Extract the pieces (same as before)
    const salt = encryptedBytes.slice(0, 16)
    const iv = encryptedBytes.slice(16, 32)
    const encryptedTextBytes = encryptedBytes.slice(32)

    const key = await createDecryptKey(pass, salt, encryptAlgo)

    const decrypted = await crypto.subtle.decrypt(
        { name: encryptAlgo, iv },
        key,
        encryptedTextBytes,
    );

    return new TextDecoder().decode(decrypted)
}
