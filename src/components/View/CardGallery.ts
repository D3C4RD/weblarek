
import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { ICardActions, isCategoryKey } from "../../types";
import { categoryMap } from "../../utils/constants";

export class CardGallery extends Card{
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(protected events: IEvents, template: HTMLElement, actions?: ICardActions) {
        super(events,template);

        this.categoryElement = ensureElement<HTMLElement>('.card__category',this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image',this.container);

        if(actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }
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
}