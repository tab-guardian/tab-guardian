import type { Component } from 'vue'
import ArrowLeftEndIcon from '@common/components/Icons/ArrowLeftEndIcon.vue'
import ArrowLeftStartIcon from '@common/components/Icons/ArrowLeftStartIcon.vue'
import ArrowRightIcon from '@common/components/Icons/ArrowRightIcon.vue'
import ArrowUpAndDownIcon from '@common/components/Icons/ArrowUpAndDownIcon.vue'
import CheckIcon from '@common/components/Icons/CheckIcon.vue'
import ChevronRightIcon from '@common/components/Icons/ChevronRightIcon.vue'
import CloseIcon from '@common/components/Icons/CloseIcon.vue'
import CogIcon from '@common/components/Icons/CogIcon.vue'
import DocumentIcon from '@common/components/Icons/DocumentIcon.vue'
import DoubleChevronUpIcon from '@common/components/Icons/DoubleChevronUpIcon.vue'
import EllipsisVerticalIcon from '@common/components/Icons/EllipsisVerticalIcon.vue'
import GitHubIcon from '@common/components/Icons/GitHubIcon.vue'
import LockClosedIcon from '@common/components/Icons/LockClosedIcon.vue'
import MenuIcon from '@common/components/Icons/MenuIcon.vue'
import PencilSquareIcon from '@common/components/Icons/PencilSquareIcon.vue'
import PlusCircleIcon from '@common/components/Icons/PlusCircleIcon.vue'
import StarIcon from '@common/components/Icons/StarIcon.vue'
import TrashIcon from '@common/components/Icons/TrashIcon.vue'
import UserCircleIcon from '@common/components/Icons/UserCircleIcon.vue'
import PhotoIcon from '@common/components/Icons/PhotoIcon.vue'

export default (): { [key: string]: Component } => {
    return {
        ArrowLeftEndIcon,
        ArrowLeftStartIcon,
        ArrowRightIcon,
        ArrowUpAndDownIcon,
        CheckIcon,
        ChevronRightIcon,
        CloseIcon,
        CogIcon,
        DocumentIcon,
        DoubleChevronUpIcon,
        EllipsisVerticalIcon,
        GitHubIcon,
        LockClosedIcon,
        MenuIcon,
        PencilSquareIcon,
        PlusCircleIcon,
        StarIcon,
        TrashIcon,
        UserCircleIcon,
        PhotoIcon,
    }
}
