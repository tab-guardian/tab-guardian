import { runtime } from '@common/modules/runtime'

export function trans(msg: string, ...args: string[]): string {
    return runtime.trans(msg, ...args)
}
