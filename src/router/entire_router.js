import Vue from 'vue';
import VueRouter from 'vue-router';

import QueryIndex from '../pages/Entire/private/Index.vue';
import DetailIndex from '../pages/Entire/private/Detail.vue';


Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'index',
        component: QueryIndex,
        meta: { keepAlive: true }
    },

    {
        path: '/detail',
        name: 'detail',
        component: DetailIndex
    }

];

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
});

export default router
