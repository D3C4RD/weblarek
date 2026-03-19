import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { ICardActions } from "../../types";

export class CardBasket extends Card{
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;


    constructor(events: IEvents, template: HTMLElement, actions?: ICardActions){
        super(events,template);

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index',this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
        if(actions?.onClick) {
            this.deleteButton.addEventListener('click', actions.onClick);
        }
    }

    set index(value: number){
        this.indexElement.textContent = String(value);
    }
}