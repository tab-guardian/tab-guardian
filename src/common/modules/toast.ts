import Toastify from 'toastify-js'

type Params = Toastify.Options & {
    type?: 'error' | 'info'
}

export function showToast(params: Params): void {
    Toastify({
        text: params.text,
        duration: params.duration || 3000,
        close: params.close || false,
        gravity: params.gravity || 'bottom',
        position: params.position || 'center',
        stopOnFocus: params.stopOnFocus || true,
        style: getStyles(params.type || 'info'),
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
        boxShadow: t === 'info' ? '' : ERROR_SHADOW,
    }
}
