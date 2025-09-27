export function formatNumber(num: number): string {
    return num.toLocaleString(undefined, { maximumFractionDigits: 0 })
}
