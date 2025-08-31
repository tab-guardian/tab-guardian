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
    openedTimes?: number
    createdAt?: number
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
    createdAt?: number
}

export type Settings = {
    encryptAfterRestore: boolean
    showPrivateGroupsOnlyInIncognito: boolean
    overrideWithSameName: boolean
    showOnlyPrivateGroupsInIncognito: boolean
}

export type Popups = {
    groupMenuView: boolean
    deleteGroup: boolean
    groupName: boolean
    rebindGroup: boolean
    chooseEmoji: boolean
    chooseImageIcon: boolean
    newPassword: boolean
    tabMenuView: boolean
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
