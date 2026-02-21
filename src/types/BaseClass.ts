export abstract class BaseClass {
    protected copyItems<T>(items: T[]): T[] {
        return items.map(item => ({ ...item }));
    }
}