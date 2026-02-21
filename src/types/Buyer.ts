import { IBuyer } from ".";

export class Buyer{
    private data: IBuyer = {
        payment:"",
        address:"",
        phone:"",
        email:""
    };

    public getData(): IBuyer{
        return {...this.data};
    }

    public setData(data: IBuyer): void{
        this.data = {...data};
    }

    public clearData(): void{
        this.data.address = "";
        this.data.email = "";
        this.data.payment = "";
        this.data.phone = "";
    }

    public checkData(): IBuyer{
        const checkPayment: string[] = ["online","cash"];
        const ret: IBuyer = {
            payment: (checkPayment.includes(this.data.payment))? this.data.payment:'Не выбран вид оплаты',
            email: (/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i.test(this.data.email))? this.data.email:'Укажите емэйл',
            phone: (/^\+?(\d{1,3})?[- .]?\(?(?:\d{2,3})\)?[- .]?\d\d\d[- .]?\d\d\d\d$/.test(this.data.phone))? 
                this.data.phone:'Укажите телефон',
            address: (this.data.address !== "")? this.data.address:'Укажите адрес'
        };

        return ret;
    }
}