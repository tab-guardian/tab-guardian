const prefix = '[Tab Guardian]: '

export default {
    warn: (...msgs: (string | unknown)[]): void => console.warn(prefix, ...msgs),
    err: (...msgs: (string | unknown)[]): void => console.error(prefix, ...msgs),
    info: (...msgs: (string | unknown)[]): void => console.info(prefix, ...msgs),
}
