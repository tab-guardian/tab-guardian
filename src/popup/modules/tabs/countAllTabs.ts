import { queryTabs } from '@/modules/tabs/queryTabs'
import { isDevelopment } from '@common/modules/isDevelopment'
import { getFakeLinks } from '@/modules/getFakeLinks'

export async function countAllTabs(): Promise<number> {
    if (isDevelopment()) {
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
