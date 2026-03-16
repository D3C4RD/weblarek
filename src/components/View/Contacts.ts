import { Form } from "./Form";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

export class Contacts extends Form{
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(protected events:IEvents){
        super(events,'#contacts','contacts:submit');

        this.emailInput = ensureElement<HTMLInputElement>('.form__input[name="email"]',this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('.form__input[name="phone"]',this.container);

        this.emailInput.addEventListener('input', ()=>{this.events.emit('contacts:email',{email:this.emailInput.value})});
        this.phoneInput.addEventListener('input', ()=>{this.events.emit('contacts:phone',{phone:this.phoneInput.value})});

        super.submitDisabled = true;
    }

    set email(value: string){
        this.emailInput.value = value;
    }

    set phone(value: string){
        this.phoneInput.value = value;
    }

    
}