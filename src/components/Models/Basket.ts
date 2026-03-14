import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class Basket{
    private items: IProduct[] = [];

    constructor(private events: IEvents){}

    public getItems(): readonly IProduct[]{
        return this.items;
    }

    public addItem(item: IProduct): void{
        this.items.push(item);
        this.events.emit("basket:changed", {items: this.items});
    }

    public removeItem(item: IProduct): void{
        const index = this.items.findIndex(e => e.id === item.id);
        if(index === -1 ){
            throw new Error("Товар не найден в корзине");
        }
        this.items.splice(index,1);
        this.events.emit("basket:changed", {items: this.items});
    }

    public clearBasket(): void{
        this.items = [];
        this.events.emit("basket:changed", {items: this.items});
    }

    public getQuantity(): number{
        return this.items.length;
    }

    public getTotal(): number{
        return this.items.reduce((total, item) => total + (item.price || 0), 0);
    }

    public hasItem(id: string): boolean{
        return this. items.some(item => item.id === id); 
    }
}