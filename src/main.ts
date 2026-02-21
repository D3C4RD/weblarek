import './scss/styles.scss';
import { Busket } from './types/Busket';
import { Buyer} from './types/Buyer';
import { Products } from './types/Products';
import { WebApi } from './types/WebApi';
import { IBuyer, IOrder, IResponse } from './types/index';

import { Api } from './components/base/Api';
import { API_URL} from './utils/constants';

const api = new Api(API_URL);
const webapi = new WebApi(api);

// Получение продуктов с Api 
const results: IResponse = await webapi.getProducts();

// Проверка класса Products на методы
console.log("Проверяем Products");
const products = new Products();
if(results.items)
{
    products.setItems(results.items);
    console.log("Полученные товары:");
    console.log(products.getItems());
}
else{
    throw new Error("Ошибка при получении товаров");
}

const item1 = products.getItemById("c101ab44-ed99-4a54-990d-47aa2bb4e7d9");
const item2 = products.getItemById("b06cde61-912f-4663-9751-09956c0eed67");
const item3 = products.getItemById("412bcf81-7e75-4e70-bdb9-d3c73c9803b7");

products.setItem(item1);
console.log("Выбранная карточка:");
console.log(products.getItem());

// Проверка класса Busket на методы
console.log("\nПроверяем Busket")
const busket = new Busket();
console.log("Стартовый список коризины пустой!");
console.log(busket.getItems());

busket.addItem(item1);
busket.addItem(item2);
busket.addItem(item3);

console.log("Добавили товары в корзину:");
console.log(busket.getItems());

busket.removeItem(item2);

console.log("Был убран товар!");
console.log(busket.getItems());

console.log(`Кол-во товара в корзине:${busket.getQuantity()} Итоговая стоимость:${busket.getTotal()}`);

if(busket.hasItem("c101ab44-ed99-4a54-990d-47aa2bb4e7d9")){
    console.log("Такой товар есть");
}
if(!busket.hasItem("b06cde61-912f-4663-9751-09956c0eed67")){
    console.log("Такого товара нет");
}

busket.clearBusket();

console.log("Корзина очищена!");
console.log(busket.getItems());

//Проверяем класс Buyer 
const buyer = new Buyer();

let test: IBuyer = {
    payment: "a",
    address: "",
    phone: "b",
    email: "m"
}

console.log("\nПроверяем Buyer");
buyer.setData(test);
console.log("Покупатель с неправильными данными");
console.log(buyer.getData());
console.log("Проверка данных");
console.log(buyer.checkData());

test.address = "dom";
test.payment = "cash";
test.phone = "88005553535";
test.email = "test@mail.ru";
buyer.setData(test);
console.log("Проверка новых данных");
console.log(buyer.checkData());

console.log("Очистка данных");
buyer.clearData();
console.log(buyer.getData());

//Проверка отправки данных на сервер
busket.addItem(item1);
busket.addItem(item3);

buyer.setData(test);

const order: IOrder = {
    payment: buyer.getData().payment,
    email: buyer.getData().email,
    address: buyer.getData().address,
    phone: buyer.getData().phone,
    total: busket.getTotal(),
    items: busket.getItems().map(e=>e.id)
}

console.log("\n Отправляем данные на сервер");
const response: IResponse = await webapi.sendOrder(order);
console.log("Ответ получен");
console.log(response);








