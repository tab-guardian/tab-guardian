export function limitString(str: string, maxLength = 20) {
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str
} 
