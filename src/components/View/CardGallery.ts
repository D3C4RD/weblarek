
import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { categoryMap } from "../../utils/constants";

export class CardGallery extends Card{
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected buttonElement: HTMLButtonElement;

    constructor(protected events: IEvents, template: string = '#card-catalog', button: string = '.gallery__item', event: string='CardGallery:select') {
        super(events,template);

        this.categoryElement = ensureElement<HTMLElement>('.card__category',this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image',this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>(button,this.container);

        this.buttonElement.addEventListener('click', () => {
            this.events.emit(event);
        })
    }

    set category(value: string){
        function isCategoryKey(key: string): key is keyof typeof categoryMap {
            return key in categoryMap;
        }
        if(isCategoryKey(value)){
            this.categoryElement.textContent = value;
            this.categoryElement.className = `card__category ${categoryMap[value]}`;
        }
    }

    set image(src: string){
        if(this.imageElement instanceof HTMLImageElement)
        {
            this.imageElement.src = "/src/content/"+src;
            this.imageElement.alt = this.title || 'Непрогруженная картинка';
        }
    }
}