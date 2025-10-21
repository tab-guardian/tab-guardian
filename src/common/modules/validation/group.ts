export const GROUP_NAME_MAX_LENGTH = 45

export function isNameTooLong(name: string | null): boolean {
    if (!name) {
        return false
    }

    return name.length > GROUP_NAME_MAX_LENGTH
}
