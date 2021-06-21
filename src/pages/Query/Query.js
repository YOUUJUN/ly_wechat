import Vue from 'vue'
import Home from './Query.vue'
import store from '../../store/index'

import { NavBar, Form, Field, Button, List, PullRefresh, Cell, CellGroup } from 'vant';
Vue.use(NavBar);
Vue.use(Form);
Vue.use(Field);
Vue.use(Button);
Vue.use(List);
Vue.use(PullRefresh);
Vue.use(Cell);
Vue.use(CellGroup);



let bus = new Vue;
Vue.prototype.$bus = bus;

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(Home)
}).$mount('#app');



