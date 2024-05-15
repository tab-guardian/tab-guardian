import type { Link } from '@/types'
import queryTabs from '@/modules/tabs/queryTabs'
import getFakeLinks from '@/modules/getFakeLinks'
import convertTabsToLinks from '@/modules/tabs/convertTabsToLinks'
import closeTabs from '@/modules/tabs/closeTabs'
import error from '@/modules/error'
import isDevelopment from '@/modules/isDevelopment'

type Params = {
    closeTabs: boolean
}

export default async (params: Params): Promise<Link[]> => {
    try {
        const tabs = await queryTabs()

        if (isDevelopment()) {
            return getFakeLinks()
        }

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
