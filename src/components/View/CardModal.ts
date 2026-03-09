import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { CardGallery } from "./CardGallery";

export class CardModal extends CardGallery{
    protected textElement: HTMLElement;

    constructor(protected events: IEvents){
        super(events,"#card-preview",".card__button","CardModal:buttonClick");
        this.textElement = ensureElement<HTMLElement>('.card__text',this.container);
    }

    set description(value: string){ //Описание в IProduct
        this.textElement.textContent = value;
    }

    set price(value: number | null){
        this.priceElement.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
        if(!value){
            this.buttonElement.disabled = true;
            this.buttonElement.textContent = 'Недоступно';
        }
    }
}