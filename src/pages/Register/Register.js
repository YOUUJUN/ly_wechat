import Vue from 'vue'
import Home from './Register.vue'
import store from '../../store/index'
import Engine from './../../utils/engine_module.js';
Vue.prototype.$Engine = Engine;

import { NavBar, Form, Field, Button, NoticeBar } from 'vant';
Vue.use(NavBar);
Vue.use(Form);
Vue.use(Field);
Vue.use(Button);
Vue.use(NoticeBar);



let bus = new Vue;
Vue.prototype.$bus = bus;

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(Home)
}).$mount('#app');



