import countAllTabs from '@/modules/tabs/countAllTabs'

export default async (ids: number[]): Promise<void> => {
    const allTabsCount = await countAllTabs()

    // create a new tab to prevent closing the browser
    if (allTabsCount === ids.length) {
        chrome.tabs.create({})
    }

    for (const id of ids) {
        chrome.tabs.remove(id)
    }
}
