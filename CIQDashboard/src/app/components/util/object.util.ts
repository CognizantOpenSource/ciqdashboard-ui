export class ObjectUtil {
    public static move<T>(array: Array<T>, from: number, to: number) {
        // remove item
        const item = array.splice(from, 1)[0];
        ObjectUtil.insert(array, item, to);
    }
    public static insert<T>(array: Array<T>, item: T, index: number) {
        array.splice(index, 0, item);
    }
}
