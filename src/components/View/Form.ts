import { IBuyer } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export abstract class Form extends Component<IBuyer>{
    protected submit: HTMLButtonElement;
    protected errors: HTMLElement;
    constructor(protected events: IEvents, template: string, event: string){
        const temp: HTMLTemplateElement = ensureElement<HTMLTemplateElement>(template);
        const fragment = temp.content.cloneNode(true) as DocumentFragment;
        const container = fragment.firstElementChild as HTMLElement;
        super(container);

        this.submit = ensureElement<HTMLButtonElement>('.button[type="submit"]',this.container);
        this.errors = ensureElement<HTMLElement>('.form__errors',this.container);
        this.submit.addEventListener('click', (e) => {this.events.emit(event); e.preventDefault()});
    }

    public setSubmitDisable(value:boolean):void{
            this.submit.disabled = value;
    }

    public setErrors(value: string){
        this.errors.textContent = value;
    }
}