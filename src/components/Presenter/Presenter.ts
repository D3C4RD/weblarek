import { EventEmitter } from "../base/Events";
import { WebApi } from "../Models/WebApi";
import { Products } from "../Models/Products";
import { Basket } from "../Models/Basket";
import { Buyer } from "../Models/Buyer";
import { Modal } from "../View/Modal";
import { Header } from "../View/Header";
import { ModalBasket } from "../View/ModalBasket";
import { Order } from "../View/Order";
import { Contacts } from "../View/Contacts";
import { Succes } from "../View/Succes";
import { CardGallery } from "../View/CardGallery";
import { CardPreview } from "../View/CardPreview";
import { ensureElement } from "../../utils/utils";
import { IProduct, IBuyer, IOrder, TPayment } from "../../types";

export class Presenter{
    //Брокер событий
    protected events: EventEmitter;
    //Api
    protected webapi: WebApi;

    //Modal
    protected products: Products;
    protected basket: Basket;
    protected buyer: Buyer;

    //View
    protected modal: Modal;
    protected header: Header;
    protected modalBasket: ModalBasket;
    protected order: Order;
    protected contacts: Contacts;
    protected succes: Succes;
    protected preview: CardPreview;

    //Gallery 
    protected gallery: HTMLElement;

    constructor(api:WebApi){
        this.events = new EventEmitter();

        this.webapi = api;

        this.products = new Products(this.events);
        this.basket = new Basket(this.events);
        this.buyer = new Buyer(this.events);

        this.modal = new Modal(this.events);
        this.header = new Header(this.events, ensureElement<HTMLElement>(".header"));
        this.modalBasket = new ModalBasket(this.events);
        this.order = new Order(this.events);
        this.contacts = new Contacts(this.events);
        this.succes = new Succes(this.events);
        this.preview = new CardPreview(this.events);

        this.gallery = ensureElement(".gallery");

        this.subscribeToEvents();
    }

    public async init(): Promise<void>{
        try{
            const data = await this.webapi.getProducts();
            this.products.setItems(data.items);

            this.renderGallery();
        }
        catch(error)
        {
            console.error('Ошибка при инициализации', error);
        }
    }

    protected subscribeToEvents(): void{
        //Выбор карточки в галлерее
        this.events.on("CardGallery:select", this.handleCardGallerySelect.bind(this));
        
        //Добавление/удаление товара
        this.events.on("CardPreview:select", this.handleCardPreviewSelect.bind(this));

        //События корзины
        this.events.on("basket:changed", this.handleBasketChanged.bind(this));
        this.events.on("basket:open", this.handleBasketOpen.bind(this));
        this.events.on("basket:order", this.handleBasketOrder.bind(this));

        //Событие карточки корзины
        this.events.on("CardBasket:delete", this.handleCardBasketDelete.bind(this));

        //События Формы заказа
        this.events.on("order:payment:select", this.handleOrderPaymentSelect.bind(this));
        this.events.on("order:address:change", this.handleOrderAddressChange.bind(this));
        this.events.on("order:submit", this.handleOrderSubmit.bind(this));
        this.events.on("contacts:email", this.handleContactsEmail.bind(this));
        this.events.on("contacts:phone", this.handleContactsPhone.bind(this));
        this.events.on("contacts:submit", this.handleContactsSubmit.bind(this));
        this.events.on("succes:click", this.handleSuccesClick.bind(this));

        //Событие покупателя 
        this.events.on("buyer:changed", this.handleBuyerChanged.bind(this));
    }

    protected renderGallery(): void {
        const products = this.products.getItems();
        this.gallery.innerHTML = ''; // Очищаем галерею
        
        products.forEach(product => {
            const card = new CardGallery(this.events);
            this.gallery.appendChild(card.render(product));
        });
    }

    /**
     * Обработчик выбора карточки в галерее
     */
    protected handleCardGallerySelect(data: { id: string }): void {
        const product = this.products.getItemById(data.id);
        if (!product) {
            console.error(`Товар с id ${data.id} не найден`);
            return;
        }
        
        const previewElement = this.preview.render(product);
        const isInBasket = this.basket.hasItem(data.id);
        
        if (isInBasket) {
            this.preview.setTextOnButton("Удалить из корзины");
        } else if (product.price) {
            this.preview.setTextOnButton("Купить");
        }
        
        this.modal.render({ content: previewElement });
        this.modal.open();
    }

    /**
     * Обработчик клика по кнопке в превью
     */
    protected handleCardPreviewSelect(data: { id: string }): void {
        const product = this.products.getItemById(data.id);
        if (!product) {
            console.error(`Товар с id ${data.id} не найден`);
            return;
        }
        
        const isInBasket = this.basket.hasItem(data.id);
        
        if (isInBasket && product.price) {
            this.preview.setTextOnButton("Купить");
            this.basket.removeItem(product);
        } else if (product.price) {
            this.preview.setTextOnButton("Удалить из корзины");
            this.basket.addItem(product);
        }
        
        this.modal.close();
    }
    
    /**
     * Обработчик изменения корзины
     */
    protected handleBasketChanged(data: { items: IProduct[] }): void {
        const isEmpty = this.basket.getQuantity() === 0;
        this.modalBasket.setButtonDisabled(isEmpty);
        this.header.render({ counter: data.items.length });
        this.modalBasket.render({ 
            data: this.basket.getItems(), 
            total: this.basket.getTotal() 
        });
    }

    /**
     * Обработчик открытия корзины
     */
    protected handleBasketOpen(): void {
        this.modal.render({ 
            content: this.modalBasket.render({ 
                data: this.basket.getItems(), 
                total: this.basket.getTotal() 
            })
        });
        this.modal.open();
    }

    /**
     * Обработчик перехода к оформлению заказа
     */
    protected handleBasketOrder(): void {
        const temp = this.buyer.getData();
        this.modal.render({ 
            content: this.order.render({ 
                payment: temp.payment, 
                address: temp.address, 
                phone: temp.phone, 
                email: temp.email 
            })
        });
    }

    /**
     * Обработчик удаления товара из корзины
     */
    protected handleCardBasketDelete(data: { id: string }): void {
        const product = this.products.getItemById(data.id);
        
        if (!product) {
            console.error(`Товар с id ${data.id} не найден`);
            return;
        }

        if (this.basket.hasItem(data.id)) {
            this.basket.removeItem(product);
        }

        this.modalBasket.setButtonDisabled(this.basket.getQuantity() === 0);
    }

    /**
     * Обработчик выбора способа оплаты
     */
    protected handleOrderPaymentSelect(data: { payment: TPayment }): void {
        const currentPayment = this.buyer.getData().payment;
        
        if (currentPayment === data.payment) {
            this.buyer.setData({ payment: "" });
            this.order.payment = "";
        } else {
            this.buyer.setData({ payment: data.payment });
            this.order.payment = data.payment;
        }
    }

    /**
     * Обработчик изменения адреса
     */
    protected handleOrderAddressChange(data: { address: string }): void {
        this.buyer.setData({ address: data.address });
    }

    /**
     * Обработчик отправки формы заказа
     */
    protected handleOrderSubmit(): void {
        const temp = this.buyer.getData();
        this.modal.render({ 
            content: this.contacts.render({ 
                payment: temp.payment, 
                address: temp.address, 
                phone: temp.phone, 
                email: temp.email 
            })
        });
    }

    /**
     * Обработчик изменения email
     */
    protected handleContactsEmail(data: { email: string }): void {
        this.buyer.setData({ email: data.email });
    }

    /**
     * Обработчик изменения телефона
     */
    protected handleContactsPhone(data: { phone: string }): void {
        this.buyer.setData({ phone: data.phone });
    }

    /**
     * Обработчик отправки контактных данных
     */
    protected handleContactsSubmit(): void {
        const temp = this.buyer.getData();
         
        const toSend: IOrder = {
            payment: temp.payment,
            address: temp.address,
            email: temp.email,
            phone: temp.phone,
            total: this.basket.getTotal(),
            items: this.basket.getItems().map(e => e.id)
        };
        
        this.webapi.sendOrder(toSend)
            .then(answer => {
                this.modal.render({ 
                    content: this.succes.render({ total: answer.total })
                });
                console.log(answer);
            })
            .catch(error => {
                console.error('Ошибка при отправке заказа:', error);
            });
    }

    /**
     * Обработчик изменения данных покупателя
     */
    protected handleBuyerChanged(data: IBuyer): void {
        const errors = this.buyer.checkData();
        
        // Валидация полей заказа
        if (errors.payment) {
            this.order.setErrors(errors.payment);
            this.order.setSubmitDisable(true);
        } else if (errors.address) {
            this.order.setErrors(errors.address);
            this.order.setSubmitDisable(true);
        } else {
            this.order.setErrors("");
            this.order.setSubmitDisable(false);
        }
        
        // Валидация полей контактов
        if (errors.email) {
            this.contacts.setErrors(errors.email);
            this.contacts.setSubmitDisable(true);
        } else if (errors.phone) {
            this.contacts.setErrors(errors.phone);
            this.contacts.setSubmitDisable(true);
        } else {
            this.contacts.setErrors("");
            this.contacts.setSubmitDisable(false);
        }
    }

    /**
     * Обработчик клика по кнопке успеха
     */
    protected handleSuccesClick(): void {
        this.basket.clearBasket();
        this.buyer.clearData();
        this.modal.content = null;
        this.modal.close();
    }

}