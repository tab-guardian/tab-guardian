import type { Component } from 'vue'
import type { Link } from '@common/types'

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

type TextInputData = {
    label: string
    title: string
    submitText: string
    text?: string
    icon?: Component
}

export type Popups = {
    groupMenu: PopupItem
    folderMenu: PopupItem
    confirm: PopupItem<{ text: string }, { isConfirmed: boolean }>
    removeUrlLock: PopupItem
    bindGroup: PopupItem
    chooseEmoji: PopupItem<{}, { emo?: string }>
    chooseImageIcon: PopupItem<{}, { url?: string }>
    newPassword: PopupItem<{}, { newPass?: string }>
    password: PopupItem<PasswordData>
    linkMenu: PopupItem<{ link: Link }>
    textInput: PopupItem<TextInputData, { canceled: boolean; name?: string }>
}
