import { Form } from "./Form";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import {TPayment} from "../../types/index";

export class Order extends Form{
    protected cashButton: HTMLButtonElement;
    protected cardButton: HTMLButtonElement;
    protected addressInput: HTMLInputElement;
    

    constructor(protected events: IEvents){
        super(events,"#order","order:submit");
        this.cashButton = ensureElement<HTMLButtonElement>('.button[name="cash"]',this.container);
        this.cardButton = ensureElement<HTMLButtonElement>('.button[name="card"]',this.container);
        this.addressInput = ensureElement<HTMLInputElement>('.form__input[name="address"]',this.container);
        

        this.cashButton.addEventListener('click', ()=> this.events.emit('order:payment', {payment: 'cash'}));
        this.cardButton.addEventListener('click', ()=> this.events.emit('order:payment', {payment: 'card'}));
        this.addressInput.addEventListener('input', ()=> this.events.emit('order:address', {address:this.addressInput.value}));
        super.submitDisabled = true;
    }

    set payment(value: TPayment){
        this.cashButton.classList.toggle('button_alt-active', value === 'cash');
        this.cardButton.classList.toggle('button_alt-active', value === 'card');
    }

    set address(value: string){
        this.addressInput.value = value;
    }

    
}