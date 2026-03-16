import { Component } from "../base/Component";
import {IEvents} from "../base/Events";
import { ensureElement } from "../../utils/utils";

export interface IModalData {
    content: HTMLElement | null;
}

export class Modal extends Component<IModalData>{
    protected contentContainer: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(protected events: IEvents){
        const container = ensureElement<HTMLElement>('.modal');
        super(container);
        this.contentContainer = ensureElement<HTMLElement>('.modal__content', this.container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container)

        this.closeButton.addEventListener('click', ()=>{
          this.events.emit("modal:close");  
        });

        this.container.addEventListener('click', (event: MouseEvent) => {
            if (event.target === this.container) {
                this.events.emit("modal:close"); 
            }
        });
    }

    set content(value: HTMLElement | null) {
        this.contentContainer.innerHTML = '';
        if (value) {
            this.contentContainer.appendChild(value);
        }
    }

    open() {
        this.container.classList.toggle('modal_active');
    }

    close() {
        this.container.classList.toggle('modal_active');
    }
}