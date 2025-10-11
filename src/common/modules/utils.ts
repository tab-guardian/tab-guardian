import { runtime } from '@common/modules/runtime'

export function trans(msg: string, ...args: string[]): string {
    return runtime.trans(msg, ...args)
}

export function limitString(str: string, maxLength = 20) {
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str
}

export function formatNumber(num: number): string {
    return num.toLocaleString(undefined, { maximumFractionDigits: 0 })
}

export function generateGroupId(): number {
    return Date.now() + Math.floor(Math.random() * 1000)
}
