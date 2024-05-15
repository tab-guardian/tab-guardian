const prefix = '[Tab Guardian]: '

export default {
    warn: (msg: string | unknown): void => console.warn(prefix + msg),
    err: (msg: string | unknown): void => console.error(prefix + msg),
    info: (msg: string | unknown): void => console.info(prefix + msg),
}
