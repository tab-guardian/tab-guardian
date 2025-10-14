import type { Link } from '@common/types'
import { queryTabs } from '@common/modules/tabs/queryTabs'
import { getFakeLinks } from '@common/modules/fake'
import { convertTabsToLinks } from '@common/modules/tabs/convertTabsToLinks'
import { isRuntime } from '@common/modules/runtime/utils'

export async function getCurrentLinks(): Promise<Link[]> {
    if (isRuntime('web')) {
        return getFakeLinks()
    }

    try {
        const tabs = await queryTabs()
        return convertTabsToLinks(tabs)
    } catch (err) {
        console.error(err)
        return []
    }
}
