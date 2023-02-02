window.Vue = require('vue');
Vue.use(VueRouter);
import VueRouter from 'vue-router';
let routes = [
    {path: '/chat-room', component: require('./Main.vue').default}
];

const router = new VueRouter({
    mode: 'history',
    routes
});

const app = new Vue({
    el: "#app",
    router
});