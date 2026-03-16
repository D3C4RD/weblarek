import { IGet, IPost, IOrder } from ".";

export interface IWebApi {
    getProducts(): Promise<IGet>;
    sendOrder(data: IOrder): Promise<IPost>;
}