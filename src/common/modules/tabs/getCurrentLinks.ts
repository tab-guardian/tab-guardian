import type { Link } from '@common/types'
import { queryTabs } from '@common/modules/tabs/queryTabs'
import { fakeLinks } from '@common/modules/fake'
import { convertTabsToLinks } from '@common/modules/tabs/convertTabsToLinks'
import { isRuntime } from '@common/modules/runtime/utils'
import { logger } from '@common/modules'

export async function getCurrentLinks(): Promise<Link[]> {
    if (isRuntime('web')) {
        return fakeLinks()
    }

    try {
        const tabs = await queryTabs()
        return convertTabsToLinks(tabs)
    } catch (err) {
        logger().error(err)
        return []
    }
}
