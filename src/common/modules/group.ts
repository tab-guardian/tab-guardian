export function getDefaultGroupName(): string {
    const date = new Date()
    const year = date.getFullYear()
    const month = addZeroWhenNeeded(date.getMonth() + 1)
    const day = date.getDate()
    const hour = addZeroWhenNeeded(date.getHours())
    const minute = addZeroWhenNeeded(date.getMinutes())
    const second = addZeroWhenNeeded(date.getSeconds())

    return `Group ${day}.${month}.${year} ${hour}:${minute}:${second}`
}

export function generateId(): number {
    return Math.floor(Math.random() * 1000000)
}

export function isComponentIcon(str: string): boolean {
    return str.slice(-4) === 'Icon'
}

function addZeroWhenNeeded(value: number): string {
    return value < 10 ? `0${value}` : `${value}`
}
