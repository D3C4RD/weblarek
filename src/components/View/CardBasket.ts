import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

export class CardBasket extends Card{
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;


    constructor(events: IEvents){
        super(events,'#card-basket');

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index',this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
        this.deleteButton.addEventListener('click',()=>{
            events.emit('CardBasket:delete', {id: this.id});
        });
    }

    set index(value: number){
        this.indexElement.textContent = String(value);
    }
}