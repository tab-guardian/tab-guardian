export default async (ids: number[]): Promise<void> => {
    await chrome.runtime.sendMessage({ type: 'closeTabs', payload: ids })
}
