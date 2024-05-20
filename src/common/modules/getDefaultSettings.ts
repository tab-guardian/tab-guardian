import { Settings } from '@/types'

export default (): Settings => {
    return {
        password: '',
        encryptAfterRestore: true,
    }
}