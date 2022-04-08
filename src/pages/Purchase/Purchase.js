import Vue from 'vue'
import Home from './Purchase.vue'
import store from '../../store/index'
import Engine from '../../utils/engine_module.js';

Vue.prototype.$Engine = Engine;

import {NavBar, Form, Field, Button, Cell, CellGroup, Popup, Empty, Image as VanImage, ImagePreview} from 'vant';

Vue.use(NavBar);
Vue.use(Form);
Vue.use(Field);
Vue.use(Button);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Popup);
Vue.use(Empty);
Vue.use(VanImage);
Vue.use(ImagePreview);


let bus = new Vue;
Vue.prototype.$bus = bus;

Vue.config.productionTip = false;

new Vue({
    store,
    render: h => h(Home)
}).$mount('#app');



