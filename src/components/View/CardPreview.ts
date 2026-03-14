import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Card } from "./Card";
import { categoryMap } from "../../utils/constants";
import { isCategoryKey } from "../../types";

export class CardPreview extends Card{
    protected textElement: HTMLElement;
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected buttonElement: HTMLButtonElement;

    constructor(protected events: IEvents) {
        super(events,"#card-preview");

        this.categoryElement = ensureElement<HTMLElement>('.card__category',this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image',this.container);
        this.textElement = ensureElement<HTMLElement>('.card__text',this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.button', this.container);
        this.buttonElement.addEventListener('click', () => {
            events.emit("CardPreview:select", {id: this.id});
        });
    }

    set description(value: string){ //Описание в IProduct
        this.textElement.textContent = value;
    }

    set category(value: string){
        if(isCategoryKey(value)){
            this.categoryElement.textContent = value;
            this.categoryElement.className = `card__category ${categoryMap[value]}`;
        }
    }

    set image(src: string){
        this.setImage(this.imageElement, "/src/content/"+src, this.title || 'Незагруженная картинка');
    }

    set price(value: number | null){
        this.priceElement.textContent = (value === null) ? 'Бесценно' : `${value} синапсов`;
        if(!value){
            this.buttonElement.disabled = true;
            this.buttonElement.textContent = 'Недоступно';
        } else {
            this.buttonElement.disabled = false;
            this.buttonElement.textContent = 'Купить';
        }
    }

    public setTextOnButton(value: string){
        this.buttonElement.textContent = value;
    }
}