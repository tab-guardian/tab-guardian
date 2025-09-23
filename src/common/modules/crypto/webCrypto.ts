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
    salt: string,
    encryptAlgo: EncryptionAlgo,
): Promise<CryptoKey> {
    const saltBytes = stringToUint8Arr(salt)
    return await createCryptoKey(pass, saltBytes, encryptAlgo, ['decrypt'])
}

export async function decrypt(
    encrypted: string,
    key: CryptoKey,
    iv: Uint8Array,
    encryptAlgo: EncryptionAlgo,
): Promise<string> {
    const encryptedBytes = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0))

    const decrypted = await crypto.subtle.decrypt(
        { name: encryptAlgo, iv },
        key,
        encryptedBytes,
    );

    return new TextDecoder().decode(decrypted)
}

export async function encrypt(
    text: string,
    cryptoKey: CryptoKey,
    iv: Uint8Array,
    encryptAlgo: EncryptionAlgo,
): Promise<string> {
    const textBytes = new TextEncoder().encode(text)

    const encrypted = await crypto.subtle.encrypt(
        { name: encryptAlgo, iv },
        cryptoKey,
        textBytes,
    )

    return uint8ArrToString(new Uint8Array(encrypted))
}

export function uint8ArrToString(arr: Uint8Array): string {
    return btoa(String.fromCharCode(...arr))
}

export function stringToUint8Arr(str: string): Uint8Array {
    return Uint8Array.from(atob(str), c => c.charCodeAt(0))
}

async function createCryptoKey(
    pass: string,
    salt: Uint8Array,
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
