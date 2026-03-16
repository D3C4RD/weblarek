# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

## Данные

Имеются два вида данных: Товар и Покупатель

Вот их интерфейсы
```
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
```

где 

`id` - это идентификатор товара

`description` - это описание товара

`image` - это изображение товара

`title` - это название товара

`category` - к какому виду товар относится

`price` - цена товара, с учетом такого значения как 'бесценно'
  

```
type TPayment = "сard" | "cash" | "";

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
} 
```

где 

`payment` - возможность оплаты товара: По карте или наличными

`email` - почта покупателя

`phone` - телефон покупателя

`address` - адрес покупателя

## Модели данных

#### Класс Products
Класс, который будет отображать список товаров и выбранный товар

Конструктор класса получает на вход данные(товары) с api сервера 

Поля класса:

`items: IProduct[]` - массив с товарами

`item: IProduct` - выбранная карточка товара

Методы класса:

 `getItems() : readonly IProduct[]` - получить список товаров

 `setItems(items: IProduct[]): void` - сохранить список товаров и послать событие `'products:changed'`

 `getItemById(id: string): Readonly<IProduct> | null` - получить выбранную карточку по id 

 `getItem(item: IProduct): Readonly<IProduct> | null` - получить выбранную карточку

 `setItem(item: IProduct): void` - сохранить выбранную карточку и послать событие `'product:selected'`
  
#### Класс Basket 

Класс, который будет хранить товары, который хочет купить покупатель

Конструктор класса не принимает параметров

Поля класса:

`items: IProduct[]` - массив покупаемых товаров

Методы класса:
 `getItems(): readonly IProduct[]` - возвращает список покупаемых товаров

 `addItem(item: IProduct): void` - добавляет товар в корзину и послать событие `'basket:changed'`

 `removeItem(item: IProduct): void` - удаляет товар из корзины и послать событие `'basket:changed'`

 `clearBusker(): void` - очищает корзину и послать событие `'basket:changed'`

 `getQuantity(): number` - возвращает количество товаров в корзине

 `getTotal(): number` - возвращает стоимость всех товаров

 `hasItem(id: numbber): boolean` - возвращает наличие товара
 
#### Класс Buyer

Класс, который будет хранить контактные данные покупателя

Конструктор класса не принимает параметров

Поля класса:

 `data: IBuyer` - данные покупателя

Методы класса:

 `getData(): Readonly<IBuyer>` - получить данные покупателя

 `setData(data: Partial<IBuyer>): void` - установить данные покупателя и послать событие `'buyer:changed'`

 `clearData(): void` - очистка данных покупателя и послать событие `'buyer:changed'`

 `checkData(): Partial<Record<keyof IBuyer, string>>` - проверить введенные данные, вернет объект, который будет указывать на неверные поля
  
 `isFilled(): boolean` - проверить на заполнение всех полей


## Слой коммуникации

Для взаимодействием с сервером определим следующие интерфейсы:

```
export interface IOrder extends IBuyer {
  total: number,
  items: string[]
}
```

такой интерфейс нужен для отправки заказа покупателя:
используются значения, что и у `IBuyer`, но добавлены:

`total` - итоговая стоимость заказа

`items` - список id товаров

```
export interface IGet  {
  total: number,
  items: IProduct[]
}
```

такой интерфейс пригодится для получения ответа с GET запроса:

`total` - количество товаров

`items` - массив товаров

```
export interface IPost {
  id: string,
  total: number
}
```

такой интерфейс пригодится для получения ответа с POST запроса:

`id` - номер заказа

`total` - итоговая стоимость заказа

#### Класс WebApi

Класс, который будет взаимодействовать с сервером через get и post запрос

Конструктор принимает параметр `IApi` 

Поля класса:

`api: IApi` - интерфейс Api с get и post запросом

Методы класса:

`getProducts(): Promise<IGet>` - метод, который получает список товаров с сервера

`senOrder(data: IOrder): Promise<IPost>` - метод, который отправляет заказ на сервер

## Слой представления (View)

Для наглядности изобразим схему классов

![View](/src/UML/Architecture%20View.png)

### Класс Header 

Класс отвечающий за заголовок сайта

Отображает количество товаров в корзине
А так же должен посылать presenter'у сигнал об открытии корзины

Используемый интерфейс для рендера

```
interface IHeader{
    counter: number;
}
```

Поля класса

`protected counterElement: HTMLElement` - содержит HTML элемент, отвечающий за отображение числа товара в корзине

`protected basketButton: HTMLButtonElement` - содержит HTML кнопку, к которой будет подключено событие: открытие корзины (`'basket:open'`) по клику

Конструктор класса

```
constructor(protected events: IEvents)
```

данный конструктор задает значения полям класса, а также вешает событие на нажатие кнопки

Методы класса

`set counter(value:number)` - сеттер, которые задает число товаров в корзине

### Класс Modal

Класс, отвечающий за модальное окно сайта: отображает HTML контент других классов(CardPreview, BasketView, Order, Contacts, Succes), а так же отвечает за открытие и закрытие модального окна

Используемый интерфейс для рендера 

```
export interface IModalData {
    content: HTMLElement | null;
}
```

Поля класса

`protected contentContainer: HTMLElement` - хранит HTML элемент, отвечающий за подстановку содержимого из шаблонов для модального окна

`protected closeButton: HTMLButtonElement` - хранит кнопку закрытия модального окна

Конструктор класса

```
constructor(protected events: IEvents)
```

Данный конструктор находит нужные элементы для работы с модальным окном, а так же вешает события закрытия окна при нажатии крести и нажатии за рамки модального окна при помощи вызова события `'modal:close'`

Методы класса 

`set content(value: HTMLElement | null)` - сеттер, который задает контент, который будет отображаться в модальном окне

`open()` - метод, который позволяет отобразить модальное окно на странице

`close()` - метод, который позволяет закрыть модальное окно на странице

### Класс Card

Абстрактный класс, который собирает общие элементы дочерних элементов(CardGallery, CardBasket, CardPreview)

Используемый интерфейс для рендера: `IProduct`

Поля класса

`protected titleElement: HTMLElement` - хранит HTML элемент, который отвечает за название товара

`protected priceElement: HTMLElement` - хранит HTML элемент, который отвечает за цену товара

Конструктор класса 

```
constructor(protected events: IEvents, template: string)
```

устанавливает шаблон для отображения карточки, находит нужные элементы для работы с данными

Методы класса

`set title(value:string)` - сеттер, который устанавливает текст названия товара

`set price(value:number | null)` - сеттер, который устанавливает текст цены товара

### Класс CardGallery

Класс отвечающий за отображение карточки товара в галлерее, является наследником класса `Card`

Интерфейс используемый для рендера 

`такой же как у Card`

Поля класса 

`protected categoryElement: HTMLElement` - хранит HTML элемент, который отвечает за категорию товара

`protected imageElement: HTMLImageElement` - хранит HTML элемент, отвечающий за картинку товара

Конструктор класса 

```
constructor(protected events: IEvents, actions?: ICardActions)
```

Устанавливает нужный шаблон через родительский конструктор, устанавливает нужные элементы для работы с данными, а так же вешает на все свое тело(она же и кнопка) событие при нажатии

Методы класса 

`set category(value: string)` - сеттер, который устанавливает категорию товара

`set image(src: string)` - сеттер, который устанавливает картинку товара

### Класс CardBasket

Класс, который отвечает за отображение карточки в корзине товаров, является наследником класса `Card`

Интерфейс используемый для рендера 

`такой же как у Card`

Поля класса 

`protected indexElement: HTMLElement` - хранит HTML элемент позиции товара в корзине

`protected deleteButton: HTMLButtonElement` - хранит HTML элемент, отвечающий за удаление товара в корзине

Конструктор товара

```
constructor(events: IEvents, actions?: ICardActions)
```

Устанавливает шаблон через родительский конструктор, устанавливает нужные элементы для полей, а так же вешает на кнопку удаления событие при нажатии

Методы класса 

`set index(value: number)` - сеттер, который устанавливает позицию товара

### Класс CardPreview 

Класс, отвечающий за отображение выбранного товара из галлереи, является наследником класса `Card`

Интерфейс используемый для рендера 

`такой же как у Card`

Поля класса

`protected textElement: HTMLElement` - хранит описание товара

`protected categoryElement: HTMLElement` - хранит HTML элемент, который отвечает за категорию товара

`protected imageElement: HTMLImageElement` - хранит HTML элемент, отвечающий за картинку товара

`protected buttonElement: HTMLButtonElement` - хранит HTML элемент, отвечающий за кнопку добавления или удаления товара в/из корзины

Конструктор класса 

```
constructor(protected events: IEvents)
```

Устанавливает шаблон через конструктор родителя, устанавливает нужные элементы для полей, а также устанавливает событие `CardPreview:select` при нажатии на кнопку

Методы класса 

`set description(value: string)` - сеттер, который устанавливает описание товара

`set category(value: string)` - сеттер, который устанавливает категорию товара

`set image(src: string)` - сеттер, который устанавливает картинку товара

`set buttonText(value:string)` - сеттер, который устанавливает название кнопки

`set buttonDisabled(value: boolean)` - сеттер, который устанавливает доступность кнопки

### Класс Succes 

Класс, отвечающий за отображение подтверждения покупки

Интерфес используемый для рендера 

```
interface ISucces{
    total: number;
}
```

Поля класса 

`protected succesButton:HTMLButtonElement` - хранит HTML элемент, отвечающий за кнопку подтверждения успешной покупки

`protected orderSucces:HTMLElement` - хранит HTML элемент, отвечающий за уведомление о списании денег за заказ

Конструктор класса 

```
constructor(protected events: IEvents)
```

Устанавливает нужный шаблон для отображени, устанавливает нужные элементы для полей, а также добавляет событие `modal:close` для кнопки

методы класса 

`set total(value:number)` - сеттер, которы устанавливает цену списанных денег за заказ

### Класс Form

Абстрактный класс, который собирает общие элементы дочерних классов (Order, Contacts)

Интерфес используемый для рендера: `IBuyer`

Поля класса 

`protected submit: HTMLButtonElement` - хранит HTML кнопку, отвечающую за подтверждения заполнения формы

`protected errors: HTMLElement` - хранит HTML элемент, отвечающий за отображение ошибок при заполнении полей формы 

Конструктор класса 

```
constructor(protected events: IEvents, template: string, event: string)
```

Устанавливает нужный шаблон, устанавливает нужные элементы для полей класса, а также вешает событие `event` для кнопки submit

Методы класса 

`set submitDisabled(value:boolean)` - сеттер, который устанавливает доступность кнопки submit

`set errorText(value:string)` - сеттер, который указывает ошибки при заполнении полей

### Класс Order

Класс, отвечающий за форму заполнения способы оплаты и адреса доставки, является наследником класса `Form`

Поля класса 

`protected cashButton: HTMLButtonElement` - HTML кнопка, которая отвечает за ввод одного из способв оплаты

`protected cardButton: HTMLButtonElement` -  HTML кнопка, которая отвечает за ввод одного из способв оплаты

`protected addressInput: HTMLInputElemtn` - HTML ввод, который отвечает за ввод адреса доставки

Конструктор класса 

```
constructor(protected events: IEvents)
```

Устанавливает шаблон формы и вешает событие `'order:submit'` на кнопку submit через родительский конструктор, устанавливает полям класса элементы, а так же вешает события на способы оплаты: `'order:payment'` с типом введеного данного и на адрес доставки `'order:address'` c веденным адресом

Методы класса 

`set payment(value: TPayment)` - сеттер, который отвечает за отображение введенного способа оплаты

`set address(value:string)` - сеттер, который отвечает за ввод адреса доставки

### Класс Contacts

Класс, отвечающий за форму заполнения почты и телефона покупателя, является наследником класса `Form`

Поля класса 

`protected emailInput: HTMLInputElement` - хранит HTML элемент, отвечающий за ввод почты покупателя

`protected phoneInput: HTMLInputElement` - хранит HTML элемент, отвечающий за ввод телефона покупателя 

Конструктор класса 

```
constructor(protected events:IEvents)
```

Устанавливает шаблон формы и вешает событие `'contacts:submit'` на кнопку submit через родительский класс устанавливает полям класса элементы, а так же вешает событие на почту: `'contacts:emai'` с введенной почтой и на телефон `'contacts:phone'` c веденным телефоном

Методы класса 

`set email(value:string)` - сеттер, устанавливающий введеную почту

`set phone(value:string)` - сеттер, устанавливающий введенный телефон

### Класс BasketView

Класс, отвечающий за отображение корзины товаров в модальном окне

Интерфейс использующийся для рендера

```
interface IBasketView{
    data: HTMLElement[],
    total: number
}
```

Поля класса 

`protected listElement: HTMLElement[]` - хранит список HTML элементов карточек товаров, добавленных в корзину

`protected totalElement: HTMLElement` - хранит HTML элемент итоговой стоимости заказа

`protected buttonElement: HTMLButtonElement` - хранит HTML кнопку для оформления заказа

Конструктор класса

```
constructor(protected events: IEvents)
```

Устанавливает шаблон корзины товаров через конструктор родителя `Component<T>`, устанавливает поля класса и вешает событие `'basket:order'` на кнопку оформления заказа 

Методы класса 

`set data(elements: HTMLElements[])` - сеттер, который устанавливает HTML элементы карточке товара в списке товаров

`set total(value: number)` - сеттер, который устанавливает итоговую стоимость товара

`set buttonDisabled(value: boolean)` - сеттер, который устанавливает доступность кнопки оформления заказа

### Класс Gallery

Класс, отвечающий за отображение галлереи из карточек на главной странице

Интерфейс использующийся для рендера

```
export interface IGallery{
    items: HTMLElement[];
}
```

Поля класса 

`protected content: HTMLElement` - HTML элемент, который хранит точку загрузки карточек

Конструктор класса 

```
constructor(protected events: IEvents)
```

Устанавливает нужный элемент в поле класса

Методы класса 

`set items(elements: HTMLElement[])` - сеттер, который устанавливает HTML элементы карточек товаров

## Presenter

Класс, который обрабатывает события из Models и View

Перед описание класса рассмотрим события, которые будут обрабатываться

### События в Models

`'products:changed'` - возникает, когда в `Products` изменились товары

`'product:selected'` - возникает, когда в `Products` выбрали один из товаров

`'basket:changed'` - возникает, когда в `Basket` изменились товары, добавили товар или удалили товар

`'Buyer:changed'` - возникает, когда очистили данные `Buyer` или изменили данные `Buyer`

### События в View 

`'CardGallery:select'` - возникает, когда пользователь нажал на карточку из галлереи

`'CardPreview:select'` - возникает, когда пользователь нажал на добавление или удаление товара из корзины через превью карточки в модальном окне

`'modal:close'` - возникает, когда пользователь закрывает модальное окно

`'basket:open'` - возникает, когда пользователь нажимает на кнопку корзины

`'cardBasket:delete'` - возникает, когда пользователь удаляет товар через окно корзины

`'basket:order'` - возникает, когда пользователь нажимает на кнопку оформления заказа 

`'order:payment'` - возникает, когда пользователь нажал на одну из кнопок способа оплаты

`'order:address'` - возникает, когда пользователь вводит адрес

`'contacts:phone'` - возникает, когда пользователь вводит телефон

`'contacts:email'` - возникает, когда пользователь вводит почту

`'order:submit'` - возникает, когда пользователь нажимает на кнопку submit в форме `Order`

`'contacts:submit'` - возникает, когда пользователь нажимает на кнопку submit в форме `Contacts`

### Описание класса 

Поля класса 

Классы из View и Models подставляются через интерфейсы `IClassName`, где `ClassName` это имя класса в каждом таком классе написаны поля и методы класса описанных классов 

Подробнее об этих интерфейсах в './types/*'

`protected events: EventEmitter` - брокке событий

`protected webapi: IWebApi` - api с сервером

`protected products: IProductsModel` - класс `Products` 

`protected basket: IBasketModel` - класс `Basket`

`protected buyer: IBuyerModel` - класс `Buyer`

`protected modal: IModalView` - класс `Modal`

`protected header: IHeaderView` - класс `Header`

`protected basketView: IBasketView` - класс `BasketView`

`protected order: IOrderView` - класс `Order`

`protected contacts: IContactsView` - класс `Contacts`

`protected succes: ISuccesView` - класс `Succes`

`protected gallery: IGalleryView` - класс `Gallery`

`protected currentPreview: ICardPreviewView | null = null` - Ссылка на текущее превью класса `CardPreview`

`protected isBasketOpen: boolean` - флаг на открытие корзины в модальном окне

`protected isOrderOpen: boolean` - флаг на открытие заполнения 1 формы заказа

`protected isContactsOpen: boolean` - флаг на открытие заполнения 2 формы заказа

`protected isSuccesOpen: boolean` - флаг на открытие завершения оформления заказа

Конструктор класса

```
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
    )
```

Задает поля класса и подписывается на события через метод `subscribeToEvents()`

Методы класса

`public async init(): Promise<void>` - получает товары с сервера, задает эти товары в поле `products` и рендерит товары на главной странице

`protected subscribeToEvents(): void` - подписывается на события 

`private renderGallery(): void` - рендерит галлерею

`protected handleCardGallerySelect(data:{id: string}): void` - функция, которая запускается по событию `'CardGallery:select'`

`protected handleProductSelected(): void` - функция, которая запускатся по событию `'product:selected'`

`protected handleCardPreviewSelected(): void` - функция, которая запускатся по событию `'CardPreview:select'`

`protected handleModalClose(): void` - функция, которая запускается по событию `'modal:close'`

`private renderBasket(): void` - функция, которая отображет товар в корзине

`protected handleBasketChanged(): void` - функция, которая запускается по событию `'basket:changed'` 

`protected handleBasketOpen(): void` - функция, которая запускается по событию `'basket:open'`

`protected handleCardBasketDelete(data:{id: string}): void` - функция, которая запускается по событию `cardBasket:delete`

`protected handleBasketOrder(): void` - функция, которая запускается по событию `'basket:order'`

`protected handleOrderSubmit(): void` - функция, которая запускается по событию `'order:submit'`

`protected handleContactsSubmit():void` - функция, которая запускается по событию `'contacts:submit'`

`protected handleOrderPayment(data:{payment: TPayment}): void` - функция, котораяя запускается по событию `'order:payment'`

`protected handleOrderAddress(data:{address: string}):void` - функция, которая запускается по событию `'order:address'`

`protected handleContactsEmail(data:{email:string}):void` - функция, которая запускается по событию `'contacts:email'`

`protected handleContactsPhone(data:{phone:string}):void` - функция, которая запускается по событию `contacts:phone`

`protected handleBuyerChanged():void` - функция, которая запускается по событию `'buyer:changed'`


 







