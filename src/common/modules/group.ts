import { getDefaultName } from '@common/modules'

export function generateId(): number {
    return Math.floor(Math.random() * 1000000)
}

export function isComponentIcon(str: string): boolean {
    if (str.length <= 4) {
        return false
    }

    return str.slice(-4) === 'Icon'
}
