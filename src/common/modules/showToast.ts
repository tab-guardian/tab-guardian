import Toastify from 'toastify-js'

export function showToast(
    text: string,
    type: 'error' | 'info' = 'info',
    duration = 2000,
): void {
    Toastify({
        text,
        duration,
        close: false,
        gravity: 'bottom', // `top` or `bottom`
        position: 'center', // `left`, `center` or `right`
        stopOnFocus: true,
        style: {
            background:
                type === 'info' ? '' : 'linear-gradient(135deg, #7e3d3d, #7e1919)',
            borderRadius: '8px',
            position: 'absolute',
            boxShadow:
                type === 'info'
                    ? ''
                    : '0 3px 6px -1px rgb(52 47 47 / 12%), 0 10px 36px -4px rgb(232 77 77 / 30%)',
        },
    }).showToast()
}
