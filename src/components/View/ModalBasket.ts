import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { CardBasket } from "./CardBasket";

export interface IModalBasket{
    data: readonly IProduct[],
    total: number
}

export class ModalBasket extends Component<IModalBasket>{
    protected listElement: HTMLElement;
    protected totalElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;
    protected basketItems: CardBasket[] = [];
    
    constructor(protected events: IEvents) {
        const temp: HTMLTemplateElement = ensureElement<HTMLTemplateElement>("#basket");
        const fragment = temp.content.cloneNode(true) as DocumentFragment;
        const container = fragment.firstElementChild as HTMLElement;
        super(container);

        this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this.buttonElement.disabled = true;
        this.buttonElement.addEventListener('click', () => {
            this.events.emit('basket:order');
        });
    }

    set data(products: IProduct[]) {
        
        this.listElement.innerHTML = '';
        this.basketItems = [];

        products.forEach((product, index) => {
            const card = new CardBasket(this.events);
            
            card.render(product);
            card.index = index + 1; // Нумерация с 1
            
            this.basketItems.push(card);
            
            this.listElement.appendChild(card.render());
        });

    }

    set total(value: number) {
        this.totalElement.textContent = `${value} синапсов`;
    }

    public setButtonDisabled(value:boolean): void{
        this.buttonElement.disabled = value;
    }
}