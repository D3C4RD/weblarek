import { IApi, IOrder, IGet, IPost } from "../../types/index";

export class WebApi{
    private api: IApi;

    constructor(api: IApi){
        this.api = api;
    }

    async getProducts(): Promise<IGet>{
        return await this.api.get<IGet>('/product/');
    }

    async sendOrder(data: IOrder): Promise<IPost>{
        return await this.api.post<IPost>('/order/',data);
    }
}