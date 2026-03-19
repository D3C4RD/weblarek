import { IEventEmitter } from "../base/Events";
import { ICardGalleryFactory, ICardBasketFactory } from "../../types/factory.ts";
import { IOrder, TPayment } from "../../types";
import { IBasketModel, IBuyerModel, IProductsModel } from "../../types/models";
import { IWebApi } from "../../types/api";
import { 
    IHeaderView, 
    IModalView, 
    IBasketView, 
    IOrderView, 
    IContactsView, 
    ISuccesView, 
    IGalleryView, 
    ICardPreviewView 
} from "../../types/views";


export class Presenter{
    //Брокер событий
    protected events: IEventEmitter;
    //Api
    protected webapi: IWebApi;

    //Modal
    protected products: IProductsModel;
    protected basket: IBasketModel;
    protected buyer: IBuyerModel;

    //View
    protected modal: IModalView;
    protected preview: ICardPreviewView;
    protected header: IHeaderView;
    protected basketView: IBasketView;
    protected order: IOrderView;
    protected contacts: IContactsView;
    protected succes: ISuccesView;

    //Gallery 
    protected gallery: IGalleryView;
    protected cardGalleryFactory: ICardGalleryFactory;
    protected cardBasketFactory: ICardBasketFactory;

    constructor(
        events: IEventEmitter,
        api:IWebApi, 
        products: IProductsModel,
        basket: IBasketModel, 
        buyer: IBuyerModel,
        modal: IModalView,
        preview: ICardPreviewView,
        header: IHeaderView,
        basketView: IBasketView,
        order: IOrderView,
        contacts: IContactsView,
        succes: ISuccesView,
        gallery: IGalleryView,
        cardGalleryFactory: ICardGalleryFactory,
        cardBasketFactory: ICardBasketFactory
    ){
        this.events = events;

        this.webapi = api;

        this.products = products;
        this.basket = basket;
        this.buyer = buyer;

        this.modal = modal;
        this.preview = preview;
        this.header = header;
        this.basketView = basketView;
        this.order = order;
        this.contacts = contacts;
        this.succes = succes;

        this.gallery = gallery;
        this.cardGalleryFactory = cardGalleryFactory;
        this.cardBasketFactory = cardBasketFactory;

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
        //события для карточек в галлерее
        this.events.on("CardGallery:select", this.handleCardGallerySelect.bind(this)); //View -> Presenter -> Models
        
        //События для карточки в модальном окне
        this.events.on('product:selected', this.handleProductSelected.bind(this)); // Models -> Presenter -> View
        this.events.on('CardPreview:select', this.handleCardPreviewSelected.bind(this)); //View -> Presenter -> Models
        
        //События для закрытия модального окна
        this.events.on("modal:close-request", this.handleModalCloseRequest.bind(this));  //View -> Presenter -> View (UI)

        //События для корзины
        this.events.on('basket:changed', this.handleBasketChanged.bind(this));  //Models -> Presenter -> View
        this.events.on('basket:open',this.handleBasketOpen.bind(this));  //View -> Presenter -> View (UI)
        this.events.on('cardBasket:delete', this.handleCardBasketDelete.bind(this));  //View -> Presenter -> Models
        this.events.on('basket:order', this.handleBasketOrder.bind(this)); //View -> Presenter -> View (UI)

        //События для оформления заказа
        this.events.on('order:payment', this.handleOrderPayment.bind(this)); //View -> Presenter -> Models
        this.events.on('order:address', this.handleOrderAddress.bind(this)); //View -> Presenter -> Models
        this.events.on('contacts:phone', this.handleContactsPhone.bind(this)); //View -> Presenter -> Models
        this.events.on('contacts:email', this.handleContactsEmail.bind(this)); //View -> Presenter -> Models
        this.events.on('buyer:changed', this.handleBuyerChanged.bind(this)); //Models -> Presenter -> View
        this.events.on('order:submit', this.handleOrderSubmit.bind(this)); //View -> Presenter -> View
        this.events.on('contacts:submit', this.handleContactsSubmit.bind(this)) //View -> Presenter -> View
    }

    private renderGallery(): void {
        const products = this.products.getItems();
        const cardElements = products.map(product => {
            return this.cardGalleryFactory.createCard(
                product,
                () => {this.events.emit("CardGallery:select", { id: product.id })}
            );
        });
        
        this.gallery.items = cardElements;
    }

    protected handleCardGallerySelect(data:{id: string}): void {
        const product = this.products.getItemById(data.id);
        if (!product) {
            console.error(`Товар с id ${data.id} не найден`);
            return;
        }

        this.products.setItem(product);
    }

    protected handleProductSelected(): void{
        const product = this.products.getItem();
        if(!product) return;

        this.preview.buttonDisabled = false;

        const isInBasket = this.basket.hasItem(product.id);
        if (isInBasket) {
            this.preview.buttonText = "Удалить из корзины";
        } else if (product.price) {
            this.preview.buttonText = "Купить";
        }
        else
        {
            this.preview.buttonText = "Недоступно";
            this.preview.buttonDisabled = true;
        }
        this.modal.render({ content: this.preview.render(product) });
        this.modal.open();
    }

    protected handleCardPreviewSelected(): void{
        const product = this.products.getItem();
        if(!product) return;
        const isInBasket = this.basket.hasItem(product.id);
        if(isInBasket) {
            this.basket.removeItem(product);
        }
        else
        {
            this.basket.addItem(product);
        }
        this.modal.close();
    }

    protected handleModalCloseRequest(): void {
        this.modal.close();

    }

    private renderBasket(): void {
        const products = this.basket.getItems();
        const total = this.basket.getTotal();
        
        const cardElements: HTMLElement[] = products.map((product, index) => {
            return this.cardBasketFactory.createCard(
                product,
                index,
                () => this.events.emit("cardBasket:delete",{ id: product.id },
                )
            );
        });
        
        this.basketView.buttonDisabled = products.length === 0;
        this.basketView.render({ 
            data: cardElements, 
            total: total 
        });
    }
    
    protected handleBasketChanged(): void{
        this.header.counter = this.basket.getQuantity();
        
        this.renderBasket();
    }

    protected handleBasketOpen(): void{
        this.modal.render({content: this.basketView.render()});
        this.modal.open();
    }

    protected handleCardBasketDelete(data:{id: string}): void{
        const product = this.products.getItemById(data.id);
        if(!product) return;
        this.basket.removeItem(product);
    }

    protected handleBasketOrder(): void{
        const temp = this.buyer.getData();
        const errors = this.buyer.checkData();
        let error: string = "";
        if(errors.payment) error+= errors.payment + "\n";
        if(errors.address) error+= errors.address;
        this.order.errorText = error;
        this.modal.render({content:this.order.render({
            payment: temp.payment,
            address: temp.address
        })});
    }

    protected handleOrderSubmit(): void{
        const temp = this.buyer.getData();
        const errors = this.buyer.checkData();
        let error: string = "";
        if(errors.email) error+= errors.email + "\n";
        if(errors.phone) error+= errors.phone;
        this.contacts.errorText = error;
        this.modal.render({
            content:this.contacts.render({
                phone: temp.phone,
                email: temp.email
            })});
    }

    protected handleContactsSubmit():void{
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
                this.basket.clearBasket();
            })
            .catch(error => { 
                console.error('Ошибка при отправке заказа:', error); 
            }); 

    }

    protected handleOrderPayment(data:{payment: TPayment}): void{
        this.buyer.setData({payment:data.payment});
    }

    protected handleOrderAddress(data:{address: string}):void{
        this.buyer.setData({address: data.address});
    }

    protected handleContactsEmail(data:{email:string}):void{
        this.buyer.setData({email:data.email});
    }

    protected handleContactsPhone(data:{phone:string}):void{
        this.buyer.setData({phone:data.phone});
    }

    protected handleBuyerChanged():void{
        const errors = this.buyer.checkData();
        const buyer = this.buyer.getData();

        this.order.payment = buyer.payment;
        this.order.address = buyer.address;

        let errorOrder: string = "";
        if(errors.payment) errorOrder+= errors.payment+"\n";
        if(errors.address) errorOrder+= errors.address;
        this.order.errorText = errorOrder;
        if(errorOrder==="") 
            this.order.submitDisabled=false;
        else 
            this.order.submitDisabled=true;

        this.contacts.phone = buyer.phone;
        this.contacts.email = buyer.email;
        
        let errorContacts: string ="";
        if(errors.email) errorContacts+= errors.email+"\n";
        if(errors.phone) errorContacts+= errors.phone;
        this.contacts.errorText = errorContacts;
        if(errorContacts==="") 
            this.contacts.submitDisabled=false;
        else   
            this.contacts.submitDisabled=true;
    } 
}