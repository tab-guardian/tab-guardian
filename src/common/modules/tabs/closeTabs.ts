import { runtime } from '@common/modules/runtime'

export async function closeTabs(ids: number[]): Promise<void> {
    await runtime.sendMessage({ type: 'closeTabs', payload: ids })
}
