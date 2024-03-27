
export function useValueCompare(target: any, src: any, forced = false): boolean {
    if (typeof target !== typeof src) {
        return false;
    }

    if (typeof src !== 'object') {
        return target === src
    }

    if (Array.isArray(src)) {
        return useArrayCompare(target, src, forced)
    }

    return useObjectCompare(target, src, forced);
}

export function useObjectCompare(target: any, src: any, forced = false): boolean {
    if (target === src) {
        return true;
    }

    if (!src || !target || !Object.keys(target)?.length) {
        return false;
    }

    for (const prop in src) {
        if (!target.hasOwnProperty(prop)) {
            if (forced) {
                return false;
            }

            continue;
        }

        if (!useValueCompare(target[prop], src[prop], forced)) {
            return false;
        }
    }

    return true;
}

export function useArrayCompare(target: any[], src: any[], forced = false): boolean {
    if (target === src) {
        return true;
    }

    if (!src || !target || target.length !== src.length) {
        return false;
    }

    for (let i = 0; i < src.length; i++) {
        if (!useValueCompare(target[i], src[i], forced)) {
            return false;
        }
    }

    return true;
}