import type { Group } from '@/types'
import saveToStorage from '@/modules/saveToStorage'

export default (groups: Group[]): void => {

    saveToStorage('groups', groups)
}
