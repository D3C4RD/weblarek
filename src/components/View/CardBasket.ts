import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

export class CardBasket extends Card{
    protected indexElement: HTMLElement;
    protected buttonElement :HTMLButtonElement;

    constructor(events: IEvents){
        super(events,'#card-basket');

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index',this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.basket__item-delete',this.container);

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('CardBasket:delete');
        })
    }

    set index(value: number){
        this.indexElement.textContent = String(value);
    }
}