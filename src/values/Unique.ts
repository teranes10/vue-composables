import { nanoid } from 'nanoid'

export function useShortUniqueId() {
    return nanoid();
}