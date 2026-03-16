import { IBuyer } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer{
    private data: IBuyer = {
        payment:"",
        address:"",
        phone:"",
        email:""
    };

    constructor(private events: IEvents) {}

    public getData(): Readonly<IBuyer>{
        return this.data;
    }

    public setData(data: Partial<IBuyer>): void{
        this.data = {
            ...this.data,
            ...data
        };
        this.events.emit('buyer:changed');
    }

    public clearData(): void{
        this.data.address = "";
        this.data.email = "";
        this.data.payment = "";
        this.data.phone = "";
        this.events.emit('buyer:changed');
    }

    public checkData(): Partial<Record<keyof IBuyer, string>>{
        const errors: Partial<Record<keyof IBuyer, string>> = {};
        if(!this.data.payment){
            errors.payment = "Необходимо указать способ оплаты";
        }

        if(!this.data.email.trim()){
            errors.email = "Необходимо указать почту";
        }

        if(!this.data.phone.trim()){
            errors.phone = "Необходимо указать телефон";
        }

        if(!this.data.address.trim()){
            errors.address = "Необходимо указать адрес";
        }
        return errors;
    }
}