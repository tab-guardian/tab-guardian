const prefix = '[Tab Guardian]: '

export default {
    warn: (msg: string): void => console.warn(prefix + msg),
    err: (msg: string): void => console.error(prefix + msg),
    info: (msg: string): void => console.info(prefix + msg),
}
