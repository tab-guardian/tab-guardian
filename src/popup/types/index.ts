export type Messages = {
    [key: string]: {
        [key: string]: string
    }
}

export type Link = {
    id: number
    title: string
    url: string
    favIconUrl: string
    isPinned: boolean
}

export type Group = {
    id: number
    name: string
    links: Link[]
    isPrivate: boolean
    isEncrypted: boolean
    hide?: boolean
    bindURL?: string
    iconName?: string
}

export type NewGroup = {
    name: string
    isPrivate: boolean
    password: string
    bindURL: string | null
}

export type Settings = {
    encryptAfterRestore: boolean
    showPrivateGroupsOnlyInIncognito: boolean
    overrideWithSameName: boolean
    showOnlyPrivateGroupsInIncognito: boolean
}

export type Popups = {
    groupView: {
        open: boolean
    }
    deleteGroup: {
        open: boolean
    }
    groupName: {
        open: boolean
    }
    enterPassword: {
        open: boolean
        passwords: { [key: number]: string }
    }
}

export type Modals = {
    settings: boolean
    group: boolean
    selectTabs: boolean
}

export type SelectTabsOperation = 'adding' | 'creating'

export type Attempts = {
    amount: number
    lockEndTime: null | number
    isLocked: boolean
}
