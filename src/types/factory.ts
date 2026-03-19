import { ICardActions, IProduct } from ".";
import { IEvents } from "../components/base/Events";
import { CardGallery } from "../components/View/CardGallery";
import { CardBasket } from "../components/View/CardBasket";
import { cloneTemplate } from "../utils/utils";

export interface ICardGalleryFactory {
    createCard(
        product: IProduct,
        onClick?: () => void,
    ): HTMLElement;
}

export class CardGalleryFactory implements ICardGalleryFactory {
    constructor(
        private events: IEvents,
        private template: string,
    ) {}

    createCard(
        product: IProduct, 
        onClick?: () => void, 
    ): HTMLElement {
        const clonedTemplate = cloneTemplate(this.template);
        
        const actions: ICardActions = {
            onClick: () => {
                if (onClick) onClick();
            }
        };
        
        const card = new CardGallery(
            this.events,
            clonedTemplate,
            actions
        );

        return card.render(product);
    }
}

export interface ICardBasketFactory {
    createCard(
        product: IProduct,
        index: number,  
        onClick?: () => void
    ): HTMLElement;
}

export class CardBasketFactory implements ICardBasketFactory {
    constructor(
        private events: IEvents,
        private template: string
    ) {}

    createCard(product: IProduct, index: number, onClick?: () => void): HTMLElement {
        const clonedTemplate = cloneTemplate(this.template);
        
        const actions: ICardActions = {
            onClick: () => {
                if (onClick) onClick();
            }
        };
        
        const card = new CardBasket(
            this.events,
            clonedTemplate,
            actions
        );

        card.index = index + 1;

        return card.render(product);
    }
}
