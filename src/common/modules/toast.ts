import Toastify from 'toastify-js'
import type { ToastMessage } from '@common/types'

type Params = Toastify.Options & {
    type?: ToastMessage['type']
}

const DEDUPE_WINDOW_MS = 1_000

let lastToast: { key: string; shownAt: number } | null = null

export function showToast(params: Params | ToastMessage): void {
    const options: Params = params
    const key = `${options.type || 'info'}:${options.text}`
    const now = Date.now()

    if (
        lastToast &&
        lastToast.key === key &&
        now - lastToast.shownAt < DEDUPE_WINDOW_MS
    ) {
        return
    }

    lastToast = { key, shownAt: now }

    Toastify({
        text: options.text,
        duration: options.duration || 5000,
        close: options.close || false,
        gravity: options.gravity || 'bottom',
        position: options.position || 'center',
        stopOnFocus: options.stopOnFocus || true,
        style: getStyles(options.type || 'info'),
    }).showToast()
}

function getStyles(t: Params['type']): Params['style'] {
    const ERROR_BG = 'linear-gradient(135deg, #7e3d3d, #7e1919)'
    const ERROR_SHADOW =
        '0 3px 6px -1px rgb(52 47 47 / 12%), 0 10px 36px -4px rgb(232 77 77 / 30%)'

    return {
        background: t === 'info' ? '' : ERROR_BG,
        borderRadius: '8px',
        position: 'absolute',
        width: '90%',
        maxWidth: '380px',
        textAlign: 'center',
        boxShadow: t === 'info' ? '' : ERROR_SHADOW,
    }
}
