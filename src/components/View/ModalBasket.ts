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
        const container: HTMLElement = temp.content.cloneNode(true) as HTMLElement;
        super(container);

        this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('basket:order');
        });
    }

    set data(products: IProduct[]) {
        // Очищаем список
        this.listElement.innerHTML = '';
        this.basketItems = [];

        // Создаем карточки для каждого товара
        products.forEach((product, index) => {
            const card = new CardBasket(this.events);
            
            // Устанавливаем данные
            card.render(product);
            card.index = index + 1; // Нумерация с 1
            
            // Сохраняем ссылку на карточку
            this.basketItems.push(card);
            
            // Добавляем в DOM
            this.listElement.appendChild(card.render());
        });

        // Обновляем общую сумму
    }

    set total(value: number) {
        this.totalElement.textContent = `${value} синапсов`;
    }

    
}