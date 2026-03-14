import { Component } from "../base/Component";
import {IEvents} from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { IProduct } from "../../types";


export abstract class Card extends Component<IProduct>{
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected _id: string = "";
    constructor(protected events: IEvents, template: string){
        const temp: HTMLTemplateElement = ensureElement<HTMLTemplateElement>(template);
        
        const fragment = temp.content.cloneNode(true) as DocumentFragment;
        
        const container = fragment.firstElementChild as HTMLElement;
        super(container);

        this.titleElement = ensureElement<HTMLElement>('.card__title',this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price',this.container);
    }

    set id(value: string) {
        this._id = value;
    }

    get id(): string {
        return this._id;
    }

    set title(value: string){
        this.titleElement.textContent = value;
    }

    set price(value: number | null){
        this.priceElement.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
    }
}