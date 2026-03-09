import { Component } from "../base/Component";
import {IEvents} from "../base/Events";
import { ensureElement } from "../../utils/utils";

export interface IModalData {
    content: HTMLElement | null;
}

export class Modal extends Component<IModalData>{
    protected contentContainer: HTMLElement;
    protected closeButton: HTMLButtonElement;
    protected modalElement: HTMLElement;

    constructor(protected events: IEvents){
        const container = ensureElement<HTMLElement>('.modal');
        super(container);
        this.modalElement = this.container;
        this.contentContainer = ensureElement<HTMLElement>('.modal__content', this.container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container)

        this.closeButton.addEventListener('click', this.close.bind(this));
    }

    set content(value: HTMLElement | null) {
        this.contentContainer.innerHTML = '';
        if (value) {
            this.contentContainer.appendChild(value);
        }
    }

    open() {
        this.modalElement.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close() {
        this.modalElement.classList.remove('modal_active');
        this.content = null; // Очищаем контент
        this.events.emit('modal:close');
    }
}