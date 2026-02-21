import { IApi, IOrder, IResponse } from "./index";

export class WebApi{
    private api: IApi;

    constructor(api: IApi){
        this.api = api;
    }

    async getProducts(): Promise<IResponse>{
        try{
            const products = await this.api.get<IResponse>('/product/');
            return products;
        }
        catch{
            throw new Error("Ошибка при GET запросе");
        }
        
    }

    async sendOrder(data: IOrder): Promise<IResponse>{
        try{
            const answer = await this.api.post<IResponse>('/order/',data);
            return answer;
        }
        catch{
            throw new Error("Ошибка при POST запросе");
        }
        
    }
}