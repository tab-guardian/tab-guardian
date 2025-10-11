import { trans } from '@common/modules/utils'
import { env } from '@common/env'

export const GROUP_NAME_MAX_LENGTH = 45

export function passwordError(pass: string | null, confirm: string | null): string | null {
    pass ??= ''
    confirm ??= ''

    if (pass !== confirm) {
        return trans('passwords_not_match')
    }

    const tooShort = pass.length < env.MIN_PASS_LENGTH

    if (tooShort) {
        return trans('passwords_min_length', env.MIN_PASS_LENGTH.toString())
    }

    return ''
}

export function isNameTooLong(name: string | null): boolean {
    if (!name) {
        return false
    }

    return name.length > GROUP_NAME_MAX_LENGTH
}
