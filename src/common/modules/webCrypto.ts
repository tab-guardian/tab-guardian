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
        const saltBytes = fromBase64(salt)
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
        encrypted = fromBase64(encrypted)
    }

    const decrypted = await crypto.subtle.decrypt(
        { name: encryptAlgo, iv },
        key,
        encrypted,
    );

    return new TextDecoder().decode(decrypted)
}

export async function encrypt(
    text: string | Uint8Array,
    cryptoKey: CryptoKey,
    iv: Uint8Array,
    encryptAlgo: EncryptionAlgo,
): Promise<Uint8Array> {
    const textBytes = typeof text === 'string'
        ? new TextEncoder().encode(text)
        : text

    const encrypted = await crypto.subtle.encrypt(
        { name: encryptAlgo, iv },
        cryptoKey,
        textBytes,
    )

    return new Uint8Array(encrypted)
}

export function toBase64(arr: Uint8Array): string {
    const binary = Array.from(arr)
        .map(byte => String.fromCharCode(byte))
        .join('')

    return btoa(binary)
}

export function fromBase64(str: string): Uint8Array {
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

    return toBase64(uint8Arr)
}

export async function decryptString(
    encrypted: string,
    pass: string,
    algo: EncryptionAlgo,
): Promise<string> {
    const encryptedBytes = fromBase64(encrypted)

    // Extract the pieces
    const salt = encryptedBytes.slice(0, KEY_BYTES_LENGTH)
    const iv = encryptedBytes.slice(KEY_BYTES_LENGTH, KEY_BYTES_LENGTH * 2)
    const encryptedTextBytes = encryptedBytes.slice(KEY_BYTES_LENGTH * 2)

    const key = await createDecryptKey(pass, salt, algo)

    return await decrypt(encryptedTextBytes, key, iv, algo)
}
