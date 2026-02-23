import { IProduct } from "../../types/index";

export class Products{
    private items: IProduct[] = [];
    private item: IProduct | null = null;

    public getItems(): readonly IProduct[]{
        return this.items;
    }

    public setItems(items: IProduct[]): void{
        this.items = items;
    }

    public getItemById(id: string): Readonly<IProduct> | null{
        const item = this.items.find(e => e.id === id);
        return item? item : null;
    }

    public getItem(): Readonly<IProduct> | null{
        return this.item || null;
    }

    public setItem(item: IProduct): void{
        this.item = item;
    }
}

