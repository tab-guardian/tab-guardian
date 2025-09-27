import type { Link } from '@/types'
import { queryTabs } from '@/modules/tabs/queryTabs'
import { getFakeLinks } from '@/modules/getFakeLinks'
import { convertTabsToLinks } from '@/modules/tabs/convertTabsToLinks'
import { isDevelopment } from '@common/modules/isDevelopment'

export async function getCurrentLinks(): Promise<Link[]> {
    if (isDevelopment()) {
        return getFakeLinks()
    }

    try {
        const tabs = await queryTabs()
        const links = convertTabsToLinks(tabs)

        return links
    } catch (err) {
        console.error(err)
        return []
    }
}
