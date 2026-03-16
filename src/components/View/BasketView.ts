
import { ensureElement, cloneTemplate } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasketView{
    data: HTMLElement[],
    total: number
}

export class BasketView extends Component<IBasketView>{
    protected listElement: HTMLElement;
    protected totalElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;
    
    constructor(protected events: IEvents) {
        const container = cloneTemplate<HTMLElement>("#basket");
        super(container);

        this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this.buttonElement.disabled = true;
        this.buttonElement.addEventListener('click', () => {
            this.events.emit('basket:order');
        });
    }

    set data(elements: HTMLElement[]) {
        
        this.listElement.innerHTML = '';

        elements.forEach((e) => {
            
            this.listElement.appendChild(e);
        });

    }

    set total(value: number) {
        this.totalElement.textContent = `${value} синапсов`;
    }

    set buttonDisabled(value: boolean) {
        this.buttonElement.disabled = value;
    }
}