import './scss/styles.scss';
import { Busket } from './components/Models/Busket';
import { Buyer} from './components/Models/Buyer';
import { Products } from './components/Models/Products';
import { WebApi } from './components/Models/WebApi';
import { IOrder } from './types/index';

import { Api } from './components/base/Api';
import { API_URL} from './utils/constants';

import { apiProducts } from './utils/data';

// Проверка классов
console.log("Проверка класса Products");
const productsModel = new Products();
productsModel.setItems(apiProducts.items);
console.log("Вывод каталога"); 
console.log(productsModel.getItems());
console.log("Поиск по id");
const item1 = productsModel.getItemById("854cef69-976d-4c2a-a18c-2aa45046c390");
const item2 = productsModel.getItemById("c101ab44-ed99-4a54-990d-47aa2bb4e7d9");
const item3 = productsModel.getItemById("b");

if(item1 && item2){
    console.log("Предметы найдены:");
    console.log(item1);
    console.log(item2);
}
else{
    console.log("Предметы не найдены");
}

if(item3){
    console.log(item3);
}
else{
    console.log("Предмет не найден");
}

if(productsModel.getItem()){
    console.log("Текущая карточка:");
    console.log(productsModel.getItem());
}
else
{
    console.log("Карточка не выбрана");
}

if(item1){
    productsModel.setItem(item1);
}
else{
    console.log("Не удалось выбрать карточку")
}

if(productsModel.getItem()){
    console.log("Текущая карточка:");
    console.log(productsModel.getItem());
}
else
{
    console.log("Карточка не выбрана");
}

console.log("\nПроверка класса Busket");
const busket = new Busket();
console.log("Изначально корзина пуста");
console.log(busket.getItems());

if(item1 && item2){
    busket.addItem(item1);
    busket.addItem(item2);
    console.log("Были добавлены товары");
    console.log(busket.getItems());

    console.log(`Количество товаров: ${busket.getQuantity()} Итоговая стоимоть: ${busket.getTotal()}`);
}
else{
    console.log("Проблема при добавлении товара в корзину");
}

if(item1){
    if(busket.hasItem(item1.id)){
        console.log("Такой товар есть!");
    }
    else 
    {
        console.log("Такого товара нет");
    }
}

if(busket.hasItem("item1.id")){
    console.log("Такой товар есть!");
}
else 
{
    console.log("Такого товара нет");
}

if(item2){
    busket.removeItem(item2);
    console.log("Был убран товар!\nСодержимое корзины:")
    console.log(busket.getItems());
}
else{
    console.log("Проблема при удалении товара");
}

busket.clearBusket();
console.log("Корзина очищена!");
console.log(busket.getItems());

console.log("\nПроверка класса Buyer");
const buyer = new Buyer();

function check():void {
    if(buyer.isFilled()){
        console.log("Поля верны");
        console.log(buyer.getData())
    }
    else
    {
        console.log("Поля не верны");
        console.log(buyer.checkData());
        console.log(buyer.getData());
    }
    console.log("");
}

check();

buyer.setData({payment: "сard"});
check();

buyer.setData({address:"DOM", email:"test@mail.ru", phone:"88005553535"});
check();

buyer.clearData();
console.log("Покупатель удален");
console.log(buyer.getData());
// Проверка запросов

const api = new Api(API_URL);
const webapi = new WebApi(api);
console.log("\nПроверка запросов");

async function init(){
    const data = await webapi.getProducts();
    console.log("Получены товары!");
    console.log(data);

    const busket = new Busket();
    busket.addItem(data.items[0]);
    busket.addItem(data.items[1]);
    const order: IOrder = {
        payment: "cash",
        address: "DOM",
        email: "test@mail.ru",
        phone: "88005553535",
        total: busket.getTotal(),
        items: busket.getItems().map(e=>e.id)
    }
    console.log("Формируем заказ");
    console.log(order);
    const answer = await webapi.sendOrder(order);
    console.log("Заказ отправлен!\nОтвет с сервера:");
    console.log(answer);
}

init().catch(console.error);




