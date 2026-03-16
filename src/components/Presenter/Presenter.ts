import { EventEmitter } from "../base/Events";
import { CardGallery } from "../View/CardGallery";
import { CardPreview } from "../View/CardPreview";
import { IOrder, TPayment } from "../../types";
import { CardBasket } from "../View/CardBasket";
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
    protected events: EventEmitter;
    //Api
    protected webapi: IWebApi;

    //Modal
    protected products: IProductsModel;
    protected basket: IBasketModel;
    protected buyer: IBuyerModel;

    //View
    protected modal: IModalView;
    protected header: IHeaderView;
    protected BasketView: IBasketView;
    protected order: IOrderView;
    protected contacts: IContactsView;
    protected succes: ISuccesView;

    //Gallery 
    protected gallery: IGalleryView;
    
    protected currentPreview: ICardPreviewView | null = null; // Ссылка на текущее превью

    protected isBasketOpen: boolean = false;
    protected isOrderOpen: boolean = false;
    protected isContactsOpen: boolean = false;
    protected isSuccesOpen: boolean = false;

    constructor(
        events: EventEmitter,
        api:IWebApi, 
        products: IProductsModel,
        basket: IBasketModel, 
        buyer: IBuyerModel,
        modal: IModalView,
        header: IHeaderView,
        basketView: IBasketView,
        order: IOrderView,
        contacts: IContactsView,
        succes: ISuccesView,
        gallery: IGalleryView
    ){
        this.events = events;

        this.webapi = api;

        this.products = products;
        this.basket = basket;
        this.buyer = buyer;

        this.modal = modal;
        this.header = header;
        this.BasketView = basketView;
        this.order = order;
        this.contacts = contacts;
        this.succes = succes;
        //this.preview = new CardPreview(this.events);

        this.gallery = gallery;



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
        this.events.on("modal:close", this.handleModalClose.bind(this));  //View -> Presenter -> View (UI)

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
            const card = new CardGallery(this.events,{
                onClick: () => this.events.emit("CardGallery:select",{ id: product.id })
            });
            return card.render(product);
        });
        
        // Обновляем галерею через компонент View
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

        const preview = new CardPreview(this.events);
        const previewElement = preview.render(product);

        const isInBasket = this.basket.hasItem(product.id);
        if (isInBasket) {
            preview.buttonText = "Удалить из корзины";
        } else if (product.price) {
            preview.buttonText = "Купить";
        }
        else
        {
            preview.buttonText = "Недоступно";
            preview.buttonDisabled = true;
        }
        this.currentPreview = preview;

        this.modal.render({ content: previewElement });
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
    }

    protected handleModalClose(): void {
        this.modal.close();
        this.currentPreview = null;
        if(this.isBasketOpen) this.isBasketOpen = false;
        if(this.isContactsOpen) this.isContactsOpen = false;
        if(this.isOrderOpen) this.isOrderOpen = false;
    }

    private renderBasket(): void {
        const products = this.basket.getItems();
        const total = this.basket.getTotal();
        
        const cardElements: HTMLElement[] = products.map((product, index) => {
            const card = new CardBasket(this.events,{
                onClick: () => this.events.emit("cardBasket:delete",{ id: product.id })
            });
            card.index = index + 1;
            const cardElement = card.render(product);
            return cardElement;
        });
        
        this.BasketView.buttonDisabled = products.length === 0;
        this.BasketView.render({ 
            data: cardElements, 
            total: total 
        });
    }
    
    protected handleBasketChanged(): void{
        this.header.counter = this.basket.getQuantity();
        if(this.isBasketOpen)
        {
            this.renderBasket();
        }
        else if(this.isSuccesOpen){
            return;
        }
        else
        {
            this.modal.close();
            this.currentPreview = null;
        }
    }

    protected handleBasketOpen(): void{
        this.isBasketOpen = true;
        this.renderBasket();
        this.modal.render({content: this.BasketView.render()});
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
        this.isBasketOpen = false;
        this.isOrderOpen = true;
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
        this.isOrderOpen = false;
        this.isContactsOpen = true;
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
        this.isContactsOpen = false;
        this.isSuccesOpen = true;
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
                this.isSuccesOpen = false;
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

        if(this.isOrderOpen)
        {
            this.order.payment = buyer.payment;

            let errorOrder: string = "";
            if(errors.payment) errorOrder+= errors.payment+"\n";
            if(errors.address) errorOrder+= errors.address;
            this.order.errorText = errorOrder;
            if(errorOrder==="") 
                this.order.submitDisabled=false;
            else 
                this.order.submitDisabled=true;
        }
        
       
        if(this.isContactsOpen)
        {
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
    
}