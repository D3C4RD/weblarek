import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Component } from "../base/Component";


export interface IGallery{
    items: HTMLElement[];
}

export class Gallery extends Component<IGallery>{
    protected content: HTMLElement;

    constructor(protected events: IEvents){
        const container = ensureElement<HTMLElement>(".gallery");
        super(container);

        this.content = container;
    }

    set items(elements: HTMLElement[]){
        this.content.innerHTML = '';
        elements.forEach(e => {
            this.content.appendChild(e);
        });
    }
}