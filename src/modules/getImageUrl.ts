export default function (uri: string): string {
    return chrome.runtime.getURL(`images/${uri}`)
}
