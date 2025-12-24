import type { Group, UserChoices, Link, SelectTabsOperation } from '@common/types'
import { reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import { generateId } from '@common/modules/group'
import { getDefaultName } from '@common/modules'
import { logger, trans } from '@common/modules'
import { useRouter } from 'vue-router'
import { useModalStore } from '@/stores/modal'
import ChevronRightIcon from '@common/components/Icons/ChevronRightIcon.vue'

export const useNewGroupStore = defineStore('newGroup', () => {
    const router = useRouter()
    const modalStore = useModalStore()

    // null suggest that there was no choice yet
    const choices = reactive<UserChoices>({
        isPrivate: null,
        name: null,
        closeTabs: null,
        password: null,
        confirmPassword: null,
        wantsSelectAllLinks: null,
        bindUrl: null,
        folderId: null,
    })

    const nameLength = computed<number>(() => {
        choices.name ??= ''
        return choices.name.length
    })

    function createGroupFromChoices(links: Link[]): Group {
        const group: Group = {
            id: generateId(),
            name: choices.name || getDefaultName('Group'),
            isPrivate: choices.isPrivate || false,
            isEncrypted: false,
            updatedAt: Date.now(),
            createdAt: Date.now(),
            links,
        }

        if (choices.folderId) {
            group.folderId = choices.folderId
        }

        if (choices.bindUrl) {
            group.bindUrl = choices.bindUrl
        }

        return group
    }

    function isPasswordEmpty(): boolean {
        choices.isPrivate ??= false
        return choices.isPrivate && !choices.password
    }

    function resetChoices(): void {
        for (const key in choices) {
            choices[key as keyof UserChoices] = null
        }
    }

    async function startGroupCreation(folderId?: number | null): Promise<void> {
        const resp = await modalStore.show('textInput', {
            label: trans('group_name'),
            title: trans('enter_group_name'),
            submitText: trans('next'),
            icon: ChevronRightIcon,
        })

        if (!resp || resp.canceled || !resp.name) {
            logger().info('Canceled entering group name')
            return
        }

        choices.name = resp.name
        choices.folderId = folderId || null
        choices.wantsSelectAllLinks = true
        choices.isPrivate = await askForPrivateGroupCreation()

        if (!choices.isPrivate) {
            moveToSelectTabsView()
            return
        }

        if (!(await askForPassword())) {
            return
        }

        if (!(await askToBindGroup())) {
            return
        }

        moveToSelectTabsView()
    }

    async function askForPrivateGroupCreation(): Promise<boolean> {
        const resp = await modalStore.show('confirm', {
            title: trans('make_private'),
            description: trans('do_you_want_private_group'),
        })

        return !!resp && resp.isConfirmed
    }

    async function askForPassword(): Promise<boolean> {
        const resp = await modalStore.show('newPassword', {
            title: trans('enter_pass'),
        })

        if (!resp || !resp.newPass) {
            logger().info('Cancled entering password name')
            return false
        }

        choices.password = resp.newPass
        choices.confirmPassword = resp.newPass

        return true
    }

    async function askToBindGroup(): Promise<boolean> {
        const confirmResp = await modalStore.show('confirm', {
            title: trans('bind_to_url'),
            description: trans('bind_group_url'),
        })

        if (!confirmResp || !confirmResp.isConfirmed) {
            logger().info('Not confirmed group bind URL')
            return true
        }

        const resp = await modalStore.show('bindGroup', {
            useCurrentUrl: true,
        })

        if (!resp || !resp.url) {
            logger().info('Canceled entering group bind URL')
            return false
        }

        choices.bindUrl = resp.url

        return true
    }

    function moveToSelectTabsView(): void {
        const operation: SelectTabsOperation = 'creating'
        router.push({ name: 'select-tabs', params: { operation } })
    }

    return {
        choices,
        nameLength,
        startGroupCreation,
        createGroupFromChoices,
        isPasswordEmpty,
        resetChoices,
    }
})
