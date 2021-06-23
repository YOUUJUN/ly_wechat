import Vue from 'vue'
import Home from './Query.vue'
import router from '../../router/index'
import store from '../../store/index'
import Engine from './../../utils/engine_module.js';
Vue.prototype.$Engine = Engine;

import { NavBar, Form, Field, Button, List, PullRefresh, Cell, CellGroup, Popup, IndexBar, IndexAnchor, Uploader, ActionSheet } from 'vant';
Vue.use(NavBar);
Vue.use(Form);
Vue.use(Field);
Vue.use(Button);
Vue.use(List);
Vue.use(PullRefresh);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Popup);
Vue.use(IndexBar);
Vue.use(IndexAnchor);
Vue.use(Uploader);
Vue.use(ActionSheet);


let bus = new Vue;
Vue.prototype.$bus = bus;

Vue.config.productionTip = false;



new Vue({
  router,
  store,
  render: h => h(Home)
}).$mount('#app');



