import queryTabs from '@/modules/tabs/queryTabs'
import error from '@common/modules/error'
import isDevelopment from '@common/modules/isDevelopment'

export default async (): Promise<number> => {
    if (isDevelopment()) {
        return 3
    }

    try {
        const tabs = await queryTabs()
        return tabs.length
    } catch (err) {
        error.err(err)
        return 0
    }
}
