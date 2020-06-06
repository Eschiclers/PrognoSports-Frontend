import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/_store";
import {AuthModule} from "@/_store/modules/AuthModule";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'landing',
        component: () => import('@/views/landing/Landing.vue'),
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/Home.vue'),
    },
    {
        path: '/gps/:competition',
        name: 'gplist',
        component: () => import('@/views/gps/ViewGrandPrixList.vue'),
    },
    {
        path: '/gps/:competition/:season',
        name: 'gplist',
        component: () => import('@/views/gps/ViewGrandPrixList.vue'),
    },
    {
        path: '/gps/:competition/:season/:id',
        name: 'gpdetails',
        component: () => import('@/views/gps/ViewOneGrandPrix.vue'),
    },
    {
        path: '/ranking',
        name: 'ranking',
        component: () => import('@/views/ranking/Ranking.vue'),
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/Login.vue'),
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/views/login/Register.vue'),
    },
    {
        path: '/forgotpassword',
        name: 'forgotpassword',
        component: () => import('@/views/login/ForgotPassword.vue'),
    },
];

export const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

router.beforeEach((to, from, next) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['/', '/login', '/register', '/forgotpassword'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = AuthModule.isAuthenticated;

    if (authRequired && !loggedIn) {
        return next('/login');
    }

    if (to.path === "/" && loggedIn) {
        return next('/home');
    }

    next();
});
