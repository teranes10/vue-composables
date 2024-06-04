import { nanoid } from 'nanoid'

export function useShortUniqueId(size?: number) {
    return nanoid(size);
}