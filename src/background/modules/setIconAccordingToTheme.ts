export default (theme: 'dark' | 'light'): void => {
    let iconVariant = 'dark'

    if (theme === 'dark') {
        iconVariant = 'light'
    }

    chrome.action.setIcon({
        path: {
            16: `/icons/icon-16-${iconVariant}.png`,
            32: `/icons/icon-32-${iconVariant}.png`,
            48: `/icons/icon-48-${iconVariant}.png`,
            64: `/icons/icon-64-${iconVariant}.png`,
            128: `/icons/icon-128-${iconVariant}.png`,
        },
    })
}
