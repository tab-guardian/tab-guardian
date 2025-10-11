import { queryTabs } from '@common/modules/tabs/queryTabs'
import { isRuntime } from '@common/modules/runtime/utils'
import { getFakeLinks } from '@common/modules/fake'

export async function countAllTabs(): Promise<number> {
    if (isRuntime('web')) {
        return getFakeLinks().length
    }

    try {
        const tabs = await queryTabs()
        return tabs.length
    } catch (err) {
        console.error(err)
        return 0
    }
}
