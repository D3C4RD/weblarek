import { IBuyer } from "../../types";

export class Buyer{
    private data: IBuyer = {
        payment:"",
        address:"",
        phone:"",
        email:""
    };

    public getData(): Readonly<IBuyer>{
        return this.data;
    }

    public setData(data: Partial<IBuyer>): void{
        this.data = {
            ...this.data,
            ...data
        };
    }

    public clearData(): void{
        this.data.address = "";
        this.data.email = "";
        this.data.payment = "";
        this.data.phone = "";
    }

    public checkData(): Partial<Record<keyof IBuyer, string>>{
        const errors: Partial<Record<keyof IBuyer, string>> = {};
        if(!this.data.payment){
            errors.payment = "Не выбран вид оплаты";
        }

        if(!this.data.email.trim()){
            errors.email = "Укажите email";
        }

        if(!this.data.phone.trim()){
            errors.phone = "Укажите телефон";
        }

        if(!this.data.address.trim()){
            errors.address = "Укажите адрес";
        }
        return errors;
    }
}