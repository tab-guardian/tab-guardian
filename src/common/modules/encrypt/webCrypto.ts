import { EncryptionAlgo } from "@/types"

const SIZE_OF_KEY = 256 // bits
const KEY_ALGO = 'PBKDF2'
const HASH = 'SHA-256'

export async function createEncryptKey(
    pass: string,
    salt: Uint8Array<ArrayBuffer>,
    encryptAlgo: EncryptionAlgo,
): Promise<CryptoKey> {
    return await createCryptoKey(pass, salt, encryptAlgo, ['encrypt'])
}

export async function createDecryptKey(
    pass: string,
    salt: Uint8Array<ArrayBuffer>,
    encryptAlgo: EncryptionAlgo,
): Promise<CryptoKey> {
    return await createCryptoKey(pass, salt, encryptAlgo, ['decrypt'])
}

async function createCryptoKey(
    pass: string,
    salt: Uint8Array<ArrayBuffer>,
    encryptAlgo: EncryptionAlgo,
    keyUsages: KeyUsage[],
): Promise<CryptoKey> {
    // Derive key from password
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(pass),
        KEY_ALGO,
        false,
        ['deriveKey'],
    )

    const algorithm = {
        name: KEY_ALGO,
        salt,
        iterations: 100000,
        hash: HASH,
    }

    return await crypto.subtle.deriveKey(
        algorithm,
        keyMaterial,
        { name: encryptAlgo, length: SIZE_OF_KEY },
        false,
        keyUsages,
    )
}
