import { Link } from '@common/types'

type PopupItem<O = any, C = any> = {
    shown: boolean
    dataOnShow: O | null
    dataOnHide: C | null
    onClose: ((data: C) => void) | null
}

type PasswordData = {
    decrypting: (password: string) => Promise<boolean>
    text: string
}

export type Popups = {
    groupMenuView: PopupItem
    confirm: PopupItem<{ text: string }, { isConfirmed: boolean }>
    groupName: PopupItem
    removeUrlLock: PopupItem
    bindGroup: PopupItem
    chooseEmoji: PopupItem<{}, { emo: string | null }>
    chooseImageIcon: PopupItem<{}, { url: string | null }>
    newPassword: PopupItem<{}, { newPass: string | null }>
    password: PopupItem<PasswordData>
    linkMenuView: PopupItem<{ link: Link }>
    editGroupName: PopupItem
    folderName: PopupItem
}
