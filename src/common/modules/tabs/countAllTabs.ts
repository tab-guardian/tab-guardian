import { queryTabs } from '@common/modules/tabs/queryTabs'
import { isRuntime } from '@common/modules/runtime/utils'
import { logger } from '@common/modules'

export async function countAllTabs(): Promise<number> {
    if (isRuntime('web')) {
        return 2 // 2 fake links
    }

    try {
        const tabs = await queryTabs()
        return tabs.length
    } catch (err) {
        logger().error(err)
        return 0
    }
}
