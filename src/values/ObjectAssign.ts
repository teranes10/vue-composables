
export function useValueAssign(target: any, src: any, forced = false) {
    if (!src) {
        target = undefined;
        return;
    }

    if (typeof src !== 'object') {
        target = src;
        return;
    }

    if (Array.isArray(src)) {
        target = src;
        return;
    }

    useObjectAssign(target, src, forced);
}

export function useObjectAssign(target: any, src: any, forced = false) {
    for (const prop in src) {
        if (!target.hasOwnProperty(prop)) {
            if (forced) {
                target[prop] = undefined;
            }

            continue;
        }

        useValueAssign(target[prop], src[prop], forced)
    }

    return target;
}