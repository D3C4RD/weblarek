import { IProduct } from "./index";
import { BaseClass } from "./BaseClass";

export class Products extends BaseClass {
    private items: IProduct[] = [];
    private item: IProduct | null = null;

    public getItems(): IProduct[]{
        return this.copyItems(this.items);
    }

    public setItems(items: IProduct[]): void{
        this.items = this.copyItems(items);
    }

    public getItemById(id: string): IProduct{
        const item = this.items.find(e => e.id === id);
        if(!item) throw new Error("Такого товара нет");
        return {...item};
    }

    public getItem(): IProduct{
        if(!this.item) throw new Error("Карточка не выбрана");
        return {...this.item};
    }

    public setItem(item: IProduct): void{
        this.item = {...item};
    }
}

