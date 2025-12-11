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
    folderName: PopupItem<{}, { name?: string }>
}
