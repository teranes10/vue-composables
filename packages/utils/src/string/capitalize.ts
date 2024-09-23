export function capitalize(string: string) {
    if (!string) return '';

    const firstChar = string.charAt(0);
    const restOfString = string.slice(1);
    return firstChar.toUpperCase() + restOfString
}