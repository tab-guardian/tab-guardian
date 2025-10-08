export function isDevelopment() {
    return ['development', 'test'].includes(import.meta.env.MODE)
}
