import { queryTabs } from '@common/modules/tabs/queryTabs'
import { isRuntime } from '@common/modules/runtime/utils'
import { fakeLinks } from '@common/modules/fake'
import { logger } from '@common/modules'

export async function countAllTabs(): Promise<number> {
    if (isRuntime('web')) {
        return fakeLinks().length
    }

    try {
        const tabs = await queryTabs()
        return tabs.length
    } catch (err) {
        logger().error(err)
        return 0
    }
}
