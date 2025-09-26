import { trans } from '@common/modules/trans'

export const GROUP_NAME_MAX_LENGTH = 45

export function passwordError(pass: string | null, confirm: string | null): string | null {
    pass ??= ''
    confirm ??= ''
    const hasError = confirm.length > 0 && pass !== confirm

    return hasError ? trans('passwords_not_match') : ''
}

export function isNameTooLong(name: string | null): boolean {
    if (!name) {
        return false
    }

    return name.length > GROUP_NAME_MAX_LENGTH
}
