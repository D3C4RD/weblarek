import { IProduct } from "../../types/index";

export class Busket{
    private items: IProduct[] = [];

    public getItems(): IProduct[]{
        return [...this.items];
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
        return this.items.reduce((total, item) => total + (item.price || 0), 0);
    }

    public hasItem(id: string): boolean{
        return this. items.some(item => item.id === id); 
    }
}