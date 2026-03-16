import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class Products{
    private items: IProduct[] = [];
    private item: IProduct | undefined = undefined;

    constructor(private events:IEvents){}

    public getItems(): readonly IProduct[]{
        return this.items;
    }

    public setItems(items: IProduct[]): void{
        this.items = items;
         this.events.emit('products:changed');
    }

    public getItemById(id: string): Readonly<IProduct> | undefined{
    
        const item = this.items.find(e => e.id === id);

        return item;
    }

    public getItem(): Readonly<IProduct> | undefined{
        return this.item;
    }

    public setItem(item: IProduct | undefined): void{
        this.item = item;
        this.events.emit('product:selected');
    }
}

