import { EncryptionAlgo, Link } from '@common/types'

type PopupItem<T = any> = {
    open: boolean
    data: T | null
}

export type EnterPasswordData = {
    decrypting: (password: string) => Promise<boolean>
    algo: EncryptionAlgo | null
}

export type LinkMenuData = {
    link: Link
}

export type Popups = {
    groupMenuView: PopupItem
    deleteGroup: PopupItem
    groupName: PopupItem
    rebindGroup: PopupItem
    chooseEmoji: PopupItem
    chooseImageIcon: PopupItem
    newPassword: PopupItem
    enterPassword: PopupItem<EnterPasswordData>
    linkMenuView: PopupItem<LinkMenuData>
    newGroupName: PopupItem
    editGroupName: PopupItem
}
