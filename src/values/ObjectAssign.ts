export function useValueAssign(target: any, src: any, forced = false) {
    if (!src) {
        return undefined;
    }

    if (typeof src !== 'object' || Array.isArray(src)) {
        return src;
    }

    return useObjectAssign(target, src, forced);
}

export function useObjectAssign(target: any, src: any, forced = false) {
    for (const prop in src) {
        if (!target.hasOwnProperty(prop)) {
            if (forced) {
                target[prop] = undefined;
            }

            continue;
        }

        target[prop] = useValueAssign(target[prop], src[prop], forced)
    }

    return target;
}