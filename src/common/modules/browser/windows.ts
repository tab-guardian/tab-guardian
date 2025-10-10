import { runtime } from '@common/modules/runtime'

export async function isIncognito(): Promise<boolean> {
    const currWindow = await runtime.windows.getCurrent()
    return currWindow ? currWindow.incognito : false
}
