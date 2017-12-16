function isObjectLike(value: any): boolean {
    return !!value && typeof value === 'object';
}


export function isNumber(value: any): boolean {
    return typeof value === 'number' ||
        (isObjectLike(value) && Object.prototype.toString.call(value) === '[object Number]');
}
