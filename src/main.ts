import './scss/styles.scss';
import { Api } from './components/base/Api';
import { WebApi } from './components/Models/WebApi';
import { Presenter } from './components/Presenter/Presenter';
import { API_URL } from './utils/constants';
import { Products } from './components/Models/Products';
import { EventEmitter } from './components/base/Events';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { Modal } from './components/View/Modal';
import { Header } from './components/View/Header';
import { BasketView } from './components/View/BasketView';
import { Order } from './components/View/Order';
import { Contacts } from './components/View/Contacts';
import { Succes } from './components/View/Succes';
import { Gallery } from './components/View/Gallery';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CardPreview } from './components/View/CardPreview';
import { CardGalleryFactory, CardBasketFactory } from './types/factory';

import.meta.glob('./content/**', {
    eager: true,
    import: 'default'
});

const events = new EventEmitter();

async function init() {
    try {
        const api = new Api(API_URL);
        const webapi = new WebApi(api);

        const presenter = new Presenter(
            events,
            webapi, 
            new Products(events),
            new Basket(events),
            new Buyer(events),
            new Modal(events, ensureElement<HTMLElement>(".modal")),
            new CardPreview(events, cloneTemplate("#card-preview")),
            new Header(events, ensureElement<HTMLLinkElement>(".header")),
            new BasketView(events, cloneTemplate("#basket")),
            new Order(events, cloneTemplate("#order")),
            new Contacts(events, cloneTemplate("#contacts")),
            new Succes(events, cloneTemplate("#success")),
            new Gallery(events, ensureElement(".gallery")),
            new CardGalleryFactory(events, "#card-catalog"),
            new CardBasketFactory(events,"#card-basket")
        );
        await presenter.init();
        
        console.log('Приложение запущено');
    } catch (error) {
        console.error('Ошибка при запуске приложения:', error);
    }
}

init();



