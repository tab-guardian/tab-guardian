export default (isPrivate: boolean): string => {
    if (isPrivate) {
        return 'Private Group'
    }

    const date = new Date()
    const year = date.getFullYear()
    const month = addZeroWhenNeeded(date.getMonth() + 1)
    const day = date.getDate()
    const hour = addZeroWhenNeeded(date.getHours())
    const minute = addZeroWhenNeeded(date.getMinutes())
    const second = addZeroWhenNeeded(date.getSeconds())

    return `Quick Save ${day}.${month}.${year} ${hour}:${minute}:${second}`
}

function addZeroWhenNeeded(value: number): string {
    return value < 10 ? `0${value}` : `${value}`
}
