import { IProduct } from "./index";
import { BaseClass } from "./BaseClass";

export class Busket extends BaseClass{
    private items: IProduct[] = [];

    public getItems(): IProduct[]{
        return this.copyItems(this.items);
    }

    public addItem(item: IProduct): void{
        this.items.push({...item});
    }

    public removeItem(item: IProduct): void{
        const index = this.items.findIndex(e => e.id === item.id);
        if(index === -1 ){
            throw new Error("Товар не найден в корзине");
        }
        this.items.splice(index,1);
    }

    public clearBusket(): void{
        this.items = [];
    }

    public getQuantity(): number{
        return this.items.length;
    }

    public getTotal(): number{
        let total: number= 0;
        this.items.forEach(e => {
            if (e.price !== null) { 
                total += e.price;
            }
        });
        return total;
    }

    public hasItem(id: string): boolean{
        const item = this.items.find(e => e.id === id);
        if(item) return true;
        return false;
    }
}