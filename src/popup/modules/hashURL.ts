import CryptoJS from 'crypto-js'

export default (url: string): string => {
    const trimmedURL = url.replace(/\/$/, '')
    return CryptoJS.SHA256(trimmedURL).toString().trim()
}
