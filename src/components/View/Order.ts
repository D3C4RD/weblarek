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
        

        this.cashButton.addEventListener('click', ()=> this.events.emit('order:payment:select', {payment: 'cash'}));
        this.cardButton.addEventListener('click', ()=> this.events.emit('order:payment:select', {payment: 'card'}));
        this.addressInput.addEventListener('input', ()=> this.events.emit('order:address:change', {address:this.addressInput.value}));
        super.setSubmitDisable(true);
    }

    set payment(value: TPayment){
        this.cashButton.classList.remove('button_alt-active');
        this.cardButton.classList.remove('button_alt-active');

        if (value === 'card') {
            this.cardButton.classList.toggle('button_alt-active');
        } else if (value === 'cash') {
            this.cashButton.classList.toggle('button_alt-active');
        }
    }

    set address(value: string){
        this.addressInput.value = value;
    }

    
}