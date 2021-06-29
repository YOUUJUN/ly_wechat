import Vue from 'vue'
import Home from './Entire.vue'
import router from '../../router/entire_router.js'
import store from '../../store/index'
import Engine from './../../utils/engine_module.js';
Vue.prototype.$Engine = Engine;

import {
  Button,
  Cell,
  CellGroup,
  Field,
  NavBar,
  Tab,
  Tabs,
  Card,
  Popup,
  IndexBar,
  IndexAnchor,
  Swipe,
  SwipeItem,
  Lazyload,
  Form,
  Col,
  Row,
  Empty,
  ActionSheet,
  List,
  Tag,
  ImagePreview
} from 'vant';
Vue.use(NavBar);
Vue.use(CellGroup);
Vue.use(Cell);
Vue.use(Field);
Vue.use(Button);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Card);
Vue.use(Popup);
Vue.use(IndexBar);
Vue.use(IndexAnchor);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Lazyload);
Vue.use(Form);
Vue.use(Col);
Vue.use(Row);
Vue.use(Empty);
Vue.use(ActionSheet);
Vue.use(List);
Vue.use(Tag);
Vue.use(ImagePreview);




let bus = new Vue;
Vue.prototype.$bus = bus;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(Home)
}).$mount('#app');



