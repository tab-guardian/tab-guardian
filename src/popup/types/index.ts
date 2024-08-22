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
    updatedAt: number
    hide?: boolean
    bindURL?: string
    icon?: string
}

export type NewGroup = {
    name: string
    isPrivate: boolean
    password: string
    confirmPassword: string
    bindURL: string | null
}

export type Settings = {
    encryptAfterRestore: boolean
    showPrivateGroupsOnlyInIncognito: boolean
    overrideWithSameName: boolean
    showOnlyPrivateGroupsInIncognito: boolean
}

export type Popups = {
    groupView: boolean
    deleteGroup: boolean
    groupName: boolean
    rebindGroup: boolean
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
