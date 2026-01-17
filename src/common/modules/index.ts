import { runtime } from '@common/modules/runtime'

export function trans(msg: string, ...args: string[]): string {
    return runtime.trans(msg, ...args)
}

export function removeTrail(str: string, tail: string): string {
    return str.endsWith(tail) && tail !== '' ? str.slice(0, -tail.length) : str
}

export function limitString(str: string, maxLength = 20) {
    if (str.length <= 3) {
        return str
    }

    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str
}

export function formatNumber(num: number): string {
    return num.toLocaleString(undefined, { maximumFractionDigits: 0 })
}

export function downloadFile(text: string, name: string): void {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `${name}.bak`
    a.click()

    URL.revokeObjectURL(url)
}

export function logger() {
    if (import.meta.env?.TEST === 'true') {
        return {
            error: () => null,
            info: () => null,
            warn: () => null,
            debug: () => null,
        }
    }

    return {
        error: (...err: any) => console.error('[ERROR]:', ...err),
        info: (...err: any) => console.info('[INFO]:', ...err),
        warn: (...err: any) => console.warn('[WARN]:', ...err),
        debug: (...err: any) => console.debug('[DEBUG]:', ...err),
    }
}

export function getDefaultName(prefix: string): string {
    const date = new Date()
    const year = date.getFullYear()
    const month = addZeroWhenNeeded(date.getMonth() + 1)
    const day = date.getDate()
    const hour = addZeroWhenNeeded(date.getHours())
    const minute = addZeroWhenNeeded(date.getMinutes())
    const second = addZeroWhenNeeded(date.getSeconds())

    return `${prefix} ${day}.${month}.${year} ${hour}:${minute}:${second}`
}

function addZeroWhenNeeded(value: number): string {
    return value < 10 ? `0${value}` : `${value}`
}
