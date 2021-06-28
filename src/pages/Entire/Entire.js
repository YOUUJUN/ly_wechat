import Vue from 'vue'
import Home from './Entire.vue'
import store from '../../store/index'
import Engine from './../../utils/engine_module.js';
Vue.prototype.$Engine = Engine;

import {NavBar, Form, Field, Image as VanImage, Grid, GridItem, ImagePreview} from 'vant';
Vue.use(NavBar);
Vue.use(Form);
Vue.use(Field);
Vue.use(VanImage);
Vue.use(Grid);
Vue.use(GridItem);
Vue.use(ImagePreview);


let bus = new Vue;
Vue.prototype.$bus = bus;

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(Home)
}).$mount('#app');



