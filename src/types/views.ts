import { TPayment } from ".";
import { IProduct } from ".";

export interface IModalView {
    content: HTMLElement | null;
    open(): void;
    close(): void;
    render(data: { content: HTMLElement | null }): HTMLElement;
}

export interface IHeaderView {
    counter: number;
}

export interface IBasketView {
    data: HTMLElement[];           
    total: number;                  
    buttonDisabled: boolean;     
    
    render(data?: { data: HTMLElement[], total: number }): HTMLElement;
}

export interface IOrderView {
    payment: TPayment;
    address: string;
    errorText: string;
    submitDisabled: boolean;
    render(data: { payment: TPayment, address: string }): HTMLElement;
}

export interface IContactsView {
    errorText: string;
    submitDisabled: boolean;
    render(data: { phone: string, email: string }): HTMLElement;
}

export interface ISuccesView {
    render(data: { total: number }): HTMLElement;
}

export interface IGalleryView {
    items: HTMLElement[]; 
    render(): HTMLElement; 
}

export interface ICardView {
    render(product: IProduct): HTMLElement;
}

export interface ICardGalleryView extends ICardView {
    category: string;
    image: string;
}

export interface ICardBasketView extends ICardView {
    index: number;
}

export interface ICardPreviewView extends ICardView {
    description: string;
    category: string;
    image: string;
    buttonText: string;
    buttonDisabled: boolean;
}