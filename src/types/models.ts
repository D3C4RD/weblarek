import { IProduct,IBuyer} from "./index.ts";

export interface IProductsModel {
    getItems(): readonly IProduct[];
    setItems(items: IProduct[]): void;
    getItemById(id: string): Readonly<IProduct> | undefined;
    getItem(): Readonly<IProduct> | undefined;
    setItem(item: IProduct | undefined): void;
}

export interface IBasketModel {
    getItems(): readonly IProduct[];
    addItem(item: IProduct): void;
    removeItem(item: IProduct): void;
    clearBasket(): void;
    getQuantity(): number;
    getTotal(): number;
    hasItem(id: string): boolean;
}

export interface IBuyerModel {
    getData(): Readonly<IBuyer>;
    setData(data: Partial<IBuyer>): void;
    clearData(): void;
    checkData(): Partial<Record<keyof IBuyer, string>>;
}