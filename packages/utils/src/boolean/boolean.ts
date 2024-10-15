export function boolean(value: unknown): value is boolean {
    return value === true || value === 'true'
}