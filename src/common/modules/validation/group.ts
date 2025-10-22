import { config } from '@common/config'
import { trans } from '@common/modules'

export function validatePassword(pass: string, confirm?: string): string | null {
    if (pass === '') {
        return trans('pass_empty')
    }

    if (pass.length < config.MIN_PASS_LENGTH) {
        return trans('passwords_min_length', config.MIN_PASS_LENGTH.toString())
    }

    if (confirm && pass !== confirm) {
        return trans('passwords_not_match')
    }

    return null
}
