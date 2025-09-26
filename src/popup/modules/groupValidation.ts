import { trans } from '@common/modules/trans'

export function passwordError(pass: string | null, confirm: string | null): string | null {
    pass ??= ''
    confirm ??= ''
    const hasError = confirm.length > 0 && pass !== confirm

    return hasError ? trans('passwords_not_match') : ''
}
