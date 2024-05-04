changeThemeToMatchDevicePreference()

function changeThemeToMatchDevicePreference() {
    const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)')

    chrome.runtime.sendMessage({
        theme: darkModePreference.matches ? 'dark' : 'light',
    })

    darkModePreference.addEventListener('change', e => {
        chrome.runtime.sendMessage({
            theme: e.matches ? 'dark' : 'light',
        })
    })
}
