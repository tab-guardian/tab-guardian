export type Locale = 'ru' | 'zh_CN' | 'en'

export type LocaleMessageItem = {
    [key: string]: { message: string }
}

export type PasswordBytes = {
    groupId: number
    bytes: number
}

export type UserChoices = {
    isPrivate: boolean | null
    name: string | null
    closeTabs: boolean | null
    password: string | null
    confirmPassword: string | null
    wantsSelectAllLinks: boolean | null
    bindURL: string | null
}

export type SelectTabsOperation = 'adding' | 'creating'

export type Link = {
    id: number
    title: string
    url: string
    favIconUrl: string
    isPinned: boolean
    salt?: string
    iv?: string
}

export type EncryptionAlgo = 'AES-GCM'

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
    algo?: EncryptionAlgo
}

export type Settings = {
    encryptAfterRestore: boolean
    showPrivateGroupsOnlyInIncognito: boolean
    overrideWithSameName: boolean
    showOnlyPrivateGroupsInIncognito: boolean
    rememberPasswordAfterUnlock: boolean
}

type PopupItem = {
    open: boolean
    data: any
}

export type Popups = {
    groupMenuView: PopupItem
    deleteGroup: PopupItem
    groupName: PopupItem
    rebindGroup: PopupItem
    chooseEmoji: PopupItem
    chooseImageIcon: PopupItem
    newPassword: PopupItem
    enterPassword: PopupItem
    linkMenuView: PopupItem
    newGroupName: PopupItem
    editGroupName: PopupItem
}

export type Modals = {
    settings: boolean
    group: boolean
    selectTabs: boolean
}

export type Attempts = {
    amount: number
    lockEndTime: number
    isLocked: boolean
}
