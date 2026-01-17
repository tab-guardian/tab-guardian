import type { Mock } from 'vitest'
import type { RuntimeType } from '@common/types/runtime'

export function setIsRuntimeTo(runtime: RuntimeType, mock: Mock): void {
    mock.mockImplementation((arg: RuntimeType) => arg === runtime)
}
