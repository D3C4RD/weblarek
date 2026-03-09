import { IProduct } from "../../types/index";

export class Products{
    private items: IProduct[] = [];
    private item: IProduct | undefined = undefined;

    public getItems(): readonly IProduct[]{
        return this.items;
    }

    public setItems(items: IProduct[]): void{
        this.items = items;
    }

    public getItemById(id: string): Readonly<IProduct> | undefined{
        const item = this.items.find(e => e.id === id);
        return item? item : undefined;
    }

    public getItem(): Readonly<IProduct> | undefined{
        return this.item || undefined;
    }

    public setItem(item: IProduct): void{
        this.item = item;
    }
}

