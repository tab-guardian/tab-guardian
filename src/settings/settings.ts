import saveToStorage from '@/modules/saveToStorage'
import sha256 from 'crypto-js/sha256'

saveToStorage('settings', {
    password: sha256('test').toString(),
})
