import CryptoJS from 'crypto-js'

export function hashURL(url: string): string {
    const trimmedURL = url.replace(/\/$/, '')
    return CryptoJS.SHA256(trimmedURL).toString().trim()
}
