import Vue from 'vue'
import Home from './Calc.vue'
import store from '../../store/index'

import { NavBar, Form, Field, Button, Picker, Popup } from 'vant';
Vue.use(NavBar);
Vue.use(Form);
Vue.use(Field);
Vue.use(Button);
Vue.use(Picker);
Vue.use(Popup);




let bus = new Vue;
Vue.prototype.$bus = bus;

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(Home)
}).$mount('#app');



