import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Component } from "../base/Component";

interface ISucces{
    total: number;
}

export class Succes extends Component<ISucces>{
    protected succesButton: HTMLButtonElement;
    protected orderSucces: HTMLElement;

    constructor(protected events: IEvents){
        const temp: HTMLTemplateElement = ensureElement<HTMLTemplateElement>("#success");
        const fragment = temp.content.cloneNode(true) as DocumentFragment;
        const container = fragment.firstElementChild as HTMLElement;
        super(container);

        this.succesButton = ensureElement<HTMLButtonElement>(".button",this.container);
        this.orderSucces = ensureElement<HTMLElement>('.order-success__description',this.container);

        this.succesButton.addEventListener('click', ()=> this.events.emit('succes:click'));
    }

    set total(value:number){
        this.orderSucces.textContent = `Заказ оформлен Списано ${value} синапсов За новыми покупками!`;
    }
}

