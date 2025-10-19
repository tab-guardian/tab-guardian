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
import ArrowDownTrayIcon from '@common/components/Icons/ArrowDownTrayIcon.vue'
import HomeIcon from '@common/components/Icons/HomeIcon.vue'
import BriefcaseIcon from '@common/components/Icons/BriefcaseIcon.vue'
import LanguageIcon from '@common/components/Icons/LanguageIcon.vue'
import BuildingOfficeIcon from '@common/components/Icons/BuildingOfficeIcon.vue'
import AcademicCapIcon from '@common/components/Icons/AcademicCapIcon.vue'
import WalletIcon from '@common/components/Icons/WalletIcon.vue'
import TruckIcon from '@common/components/Icons/TruckIcon.vue'
import ShoppingBagIcon from '@common/components/Icons/ShoppingBagIcon.vue'
import MusicalNoteIcon from '@common/components/Icons/MusicalNoteIcon.vue'
import HeartIcon from '@common/components/Icons/HeartIcon.vue'
import CurrencyDollarIcon from '@common/components/Icons/CurrencyDollarIcon.vue'
import BookOpenIcon from '@common/components/Icons/BookOpenIcon.vue'
import HomeModernIcon from '@common/components/Icons/HomeModernIcon.vue'
import RectangleStackIcon from '@common/components/Icons/RectangleStackIcon.vue'
import VideoCameraIcon from '@common/components/Icons/VideoCameraIcon.vue'
import BanknotesIcon from '@common/components/Icons/BanknotesIcon.vue'
import BellIcon from '@common/components/Icons/BellIcon.vue'
import BoltIcon from '@common/components/Icons/BoltIcon.vue'
import ChartBarIcon from '@common/components/Icons/ChartBarIcon.vue'
import CreditCardIcon from '@common/components/Icons/CreditCardIcon.vue'
import CpuChipIcon from '@common/components/Icons/CpuChipIcon.vue'
import FireIcon from '@common/components/Icons/FireIcon.vue'
import MicrophoneIcon from '@common/components/Icons/MicrophoneIcon.vue'
import PaintBrushIcon from '@common/components/Icons/PaintBrushIcon.vue'
import PlayIcon from '@common/components/Icons/PlayIcon.vue'
import FaceSmileIcon from '@common/components/Icons/FaceSmileIcon.vue'
import MagnifyingGlassIcon from '@common/components/Icons/MagnifyingGlassIcon.vue'
import InfoCircleIcon from '@common/components/Icons/InfoCircleIcon.vue'
import ScissorsIcon from '@common/components/Icons/ScissorsIcon.vue'
import CopyIcon from '@common/components/Icons/CopyIcon.vue'
import PasteIcon from '@common/components/Icons/PasteIcon.vue'
import PlusIcon from '@common/components/Icons/PlusIcon.vue'
import CircleStackIcon from '@common/components/Icons/CircleStackIcon.vue'
import LockOpenIcon from '@common/components/Icons/LockOpenIcon.vue'

type IconsComponent = {
    [key: string]: Component
}

export function getIcons(icon?: string): IconsComponent | Component {
    const icons: IconsComponent = {
        HomeIcon,
        BriefcaseIcon,
        UserCircleIcon,
        StarIcon,
        TrashIcon,
        LockClosedIcon,
        LockOpenIcon,
        ArrowLeftEndIcon,
        PhotoIcon,
        WalletIcon,
        LanguageIcon,
        BuildingOfficeIcon,
        AcademicCapIcon,
        TruckIcon,
        ShoppingBagIcon,
        MusicalNoteIcon,
        HeartIcon,
        BanknotesIcon,
        FaceSmileIcon,
        CurrencyDollarIcon,
        BookOpenIcon,
        HomeModernIcon,
        BellIcon,
        RectangleStackIcon,
        VideoCameraIcon,
        BoltIcon,
        ChartBarIcon,
        CreditCardIcon,
        CpuChipIcon,
        FireIcon,
        MicrophoneIcon,
        PaintBrushIcon,
        PlayIcon,
        DocumentIcon,
        CogIcon,
        MagnifyingGlassIcon,
        PencilSquareIcon,
        ArrowLeftStartIcon,
        CheckIcon,
        ChevronRightIcon,
        ArrowRightIcon,
        ArrowUpAndDownIcon,
        CloseIcon,
        DoubleChevronUpIcon,
        EllipsisVerticalIcon,
        MenuIcon,
        PlusCircleIcon,
        PlusIcon,
        ArrowDownTrayIcon,
        GitHubIcon,
        InfoCircleIcon,
        ScissorsIcon,
        CopyIcon,
        PasteIcon,
        CircleStackIcon,
    }

    if (icon) {
        return icons[icon]
    }

    return icons
}
