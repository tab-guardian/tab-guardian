import type { Link } from '@/types'
import queryTabs from '@/modules/tabs/queryTabs'
import getFakeLinks from '@/modules/getFakeLinks'
import convertTabsToLinks from '@/modules/tabs/convertTabsToLinks'
import closeTabs from '@/modules/tabs/closeTabs'
import error from '@common/modules/error'
import isDevelopment from '@common/modules/isDevelopment'

type Params = {
    closeTabs: boolean
}

export default async (params: Params): Promise<Link[]> => {
    if (isDevelopment()) {
        return getFakeLinks()
    }

    try {
        const tabs = await queryTabs()
        const links = convertTabsToLinks(tabs)

        if (params.closeTabs) {
            closeTabs(tabs)
        }

        return links
    } catch (err) {
        error.err(err)
        return []
    }
}
