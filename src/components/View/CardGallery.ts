
import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { isCategoryKey } from "../../types";
import { categoryMap } from "../../utils/constants";

export class CardGallery extends Card{
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(protected events: IEvents) {
        super(events,'#card-catalog');

        this.categoryElement = ensureElement<HTMLElement>('.card__category',this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image',this.container);

        this.container.addEventListener('click', () => {
            events.emit("CardGallery:select", {id: this.id});
        });
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