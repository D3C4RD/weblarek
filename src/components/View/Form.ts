import { IBuyer } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export abstract class Form extends Component<IBuyer>{
    protected submit: HTMLButtonElement;
    protected errors: HTMLElement;
    constructor(protected events: IEvents, template: HTMLElement, event: string){
        super(template);

        this.submit = ensureElement<HTMLButtonElement>('.button[type="submit"]',this.container);
        this.errors = ensureElement<HTMLElement>('.form__errors',this.container);
        this.submit.addEventListener('click', (e) => {this.events.emit(event); e.preventDefault()});
    }

    set submitDisabled(value: boolean) {
        this.submit.disabled = value;
    }

    set errorText(value: string) {
        this.errors.textContent = value;
    }
}