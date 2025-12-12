import { Link } from '@common/types'

type PopupItem<SHOW = any, HIDE = any> = {
    shown: boolean
    dataOnShow: SHOW | null
    dataOnHide: HIDE | null
    onClose: ((data: HIDE) => void) | null
}

type PasswordData = {
    decrypting: (password: string) => Promise<boolean>
    text: string
}

export type Popups = {
    groupMenu: PopupItem
    confirm: PopupItem<{ text: string }, { isConfirmed: boolean }>
    groupName: PopupItem
    removeUrlLock: PopupItem
    bindGroup: PopupItem
    chooseEmoji: PopupItem<{}, { emo?: string }>
    chooseImageIcon: PopupItem<{}, { url?: string }>
    newPassword: PopupItem<{}, { newPass?: string }>
    password: PopupItem<PasswordData>
    linkMenuView: PopupItem<{ link: Link }>
    editGroupName: PopupItem
    folderName: PopupItem<{}, { name?: string }>
}
