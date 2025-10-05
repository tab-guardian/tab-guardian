import { EncryptionAlgo } from "@/types"

const KEY_BITS = 256 // bits
const KEY_BYTES_LENGTH = 16
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
    salt: string | Uint8Array,
    encryptAlgo: EncryptionAlgo,
): Promise<CryptoKey> {
    if (typeof salt === 'string') {
        const saltBytes = stringToUint8Arr(salt)
        return await createCryptoKey(pass, saltBytes, encryptAlgo, ['decrypt'])
    }

    return await createCryptoKey(pass, salt, encryptAlgo, ['decrypt'])

}

export async function decrypt(
    encrypted: string | Uint8Array,
    key: CryptoKey,
    iv: Uint8Array,
    encryptAlgo: EncryptionAlgo,
): Promise<string> {
    if (typeof encrypted === 'string') {
        encrypted = stringToUint8Arr(encrypted)
    }

    const decrypted = await crypto.subtle.decrypt(
        { name: encryptAlgo, iv },
        key,
        encrypted,
    );

    return new TextDecoder().decode(decrypted)
}

export async function encrypt(
    text: string,
    cryptoKey: CryptoKey,
    iv: Uint8Array,
    encryptAlgo: EncryptionAlgo,
): Promise<Uint8Array> {
    const textBytes = new TextEncoder().encode(text)

    const encrypted = await crypto.subtle.encrypt(
        { name: encryptAlgo, iv },
        cryptoKey,
        textBytes,
    )

    return new Uint8Array(encrypted)
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
    // Improve the raw password as a CryptoKey
    const baseKey = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(pass),
        KEY_ALGO,
        false,
        ['deriveKey'],
    )

    const algorithm = { name: KEY_ALGO, salt, iterations: 100000, hash: HASH }
    const keyType = { name: encryptAlgo, length: KEY_BITS }

    // Create the actual CryptoKey from the base
    return await crypto.subtle.deriveKey(
        algorithm,
        baseKey,
        keyType,
        false,
        keyUsages,
    )
}

export async function encryptString(
    str: string,
    pass: string,
    algo: EncryptionAlgo,
): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(KEY_BYTES_LENGTH))
    const key = await createEncryptKey(pass, salt, algo)

    const iv = crypto.getRandomValues(new Uint8Array(KEY_BYTES_LENGTH))

    const encrypted = await encrypt(str, key, iv, algo)

    const arrLength = salt.length + iv.length + encrypted.byteLength
    const uint8Arr = new Uint8Array(arrLength)

    uint8Arr.set(salt, 0)
    uint8Arr.set(iv, salt.length)
    uint8Arr.set(new Uint8Array(encrypted), salt.length + iv.length)

    return uint8ArrToString(uint8Arr)
}

export async function decryptString(
    encrypted: string,
    pass: string,
    algo: EncryptionAlgo,
): Promise<string> {
    const encryptedBytes = stringToUint8Arr(encrypted)

    // Extract the pieces
    const salt = encryptedBytes.slice(0, KEY_BYTES_LENGTH)
    const iv = encryptedBytes.slice(KEY_BYTES_LENGTH, KEY_BYTES_LENGTH * 2)
    const encryptedTextBytes = encryptedBytes.slice(KEY_BYTES_LENGTH * 2)

    const key = await createDecryptKey(pass, salt, algo)

    return await decrypt(encryptedTextBytes, key, iv, algo)
}
