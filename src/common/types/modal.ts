import type { Component } from 'vue'
import type { Link } from '@common/types'

type ModalItem<SHOW = any, HIDE = any> = {
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

export type Modals = {
    groupMenu: ModalItem
    folderMenu: ModalItem
    confirm: ModalItem<
        { title: string; description?: string },
        { isConfirmed: boolean }
    >
    removeUrlLock: ModalItem
    bindGroup: ModalItem<{ useCurrentUrl: boolean }, { url?: string }>
    chooseEmoji: ModalItem<{}, { emo?: string }>
    chooseImageIcon: ModalItem<{}, { url?: string }>
    newPassword: ModalItem<{ title?: string }, { newPass?: string }>
    password: ModalItem<PasswordData>
    linkMenu: ModalItem<{ link: Link }>
    textInput: ModalItem<TextInputData, { canceled: boolean; name?: string }>
}
