import './scss/styles.scss';
import { Api } from './components/base/Api';
import { WebApi } from './components/Models/WebApi';
import { Presenter } from './components/Presenter/Presenter';
import { API_URL } from './utils/constants';


const images = import.meta.glob('./content/**', {
    eager: true,
    import: 'default'
});


async function init() {
    try {
        const api = new Api(API_URL);
        const webapi = new WebApi(api);

        const presenter = new Presenter(webapi);
        await presenter.init();
        
        console.log('Приложение запущено');
    } catch (error) {
        console.error('Ошибка при запуске приложения:', error);
    }
}

init();



