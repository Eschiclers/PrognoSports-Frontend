import Vue from 'vue'
import VueRouter, {NavigationGuardNext, Route} from 'vue-router'
import store from '@/_store';
import LandingView from "@/views/landing/LandingView.vue";
import PrognoView from "@/views/PrognoView.vue";
import EmptyRoutedView from "@/views/EmptyRoutedView.vue";

Vue.use(VueRouter);

const routes = [

    // Landing, about y demás páginas genéricas
    {
        path: '/',
        component: LandingView,
        children: [
            {
                name: 'landing',
                alias: ['/landing'],
                path: '',
                component: () => import('@/components/landing/LandingHome.vue'),
            },
            {
                name: 'faq',
                path: '/faq',
                component: () => import('@/components/landing/FaqComponent.vue'),
            },
            {
                name: 'contact',
                path: '/contact',
                component: () => import('@/components/landing/ContactComponent.vue'),
            },
            {
                name: 'terms',
                path: '/terms',
                component: () => import('@/components/landing/TermsComponent.vue'),
            },
            {
                name: 'privacy',
                path: '/privacy',
                component: () => import('@/components/landing/PrivacyComponent.vue'),
            },
        ]
    },

    // Autentificación
    {
        path: '/login',
        component: LandingView,
        children: [{
            name: 'login',
            path: '',
            component: () => import('@/components/login/LoginComponent.vue'),
        }]
    },
    {
        path: '/logout',
        component: LandingView,
        children: [{
            name: 'lougout',
            path: '',
            component: () => import('@/components/login/LogoutComponent.vue'),
        }]
    },
    {
        path: '/register',
        component: LandingView,
        children: [{
            name: 'register',
            path: '',
            component: () => import('@/components/login/RegisterComponent.vue'),
        }]
    },
    {
        path: '/forgotpassword',
        component: LandingView,
        children: [{
            name: 'forgotpassword',
            path: '',
            component: () => import('@/components/login/ForgotPasswordComponent.vue'),
        }]
    },

    // Páginas de dentro de la aplicación iniciadas sesión
    {
        path: '/home',
        meta: { requiresAuth: true },
        component: PrognoView,
        children: [{
            path: '',
            name: 'home',
            component: () => import('@/components/home/HomeComponent.vue'),
        }]
    },

    // Admin
    {
        path: '/admin',
        meta: { requiresAuth: true },
        component: PrognoView,
        children: [
            {
                path: '',
                name: 'admin',
                component: () => import('@/components/admin/AdminPage.vue'),
            },
            {
                path: 'drivers',
                name: 'adminDrivers',
                component: () => import('@/components/admin/driver/DriversAdmin.vue'),
            },
            {
                path: 'constructors',
                name: 'adminConstructors',
                component: () => import('@/components/admin/ConstructorsAdmin.vue'),
            },
            {
                path: 'users',
                name: 'adminUsers',
                component: () => import('@/components/admin/UsersAdmin.vue'),
            },
            {
                path: 'competitions',
                component: EmptyRoutedView,
                children: [
                    {
                        path: '',
                        name: 'adminCompetitions',
                        component: () => import('@/components/admin/competitions/CompetitionsList.vue'),
                    },
                    {
                        path: ':competition',
                        name: 'adminCompetitionEdit',
                        component: () => import('@/components/admin/competitions/CompetitionEdit.vue'),
                    },
                ],
            },
            {
                path: 'seasons',
                component: EmptyRoutedView,
                children: [
                    {
                        path: '',
                        name: 'adminSeasons',
                        component: () => import('@/components/admin/seasons/SeasonsList.vue'),
                    },
                    {
                        path: ':season',
                        name: 'adminSeasonsEdit',
                        component: () => import('@/components/admin/seasons/SeasonEdit.vue'),
                    },
                ],
            },
        ]
    },

    // Creaciones de objetos / news
    {
        path: '/new',
        meta: {requiresAuth: true},
        component: PrognoView,
        children: [
            {
                path: 'competition',
                name: 'competitionCreate',
                component: () => import('@/components/admin/competitions/CompetitionCreate.vue'),
            },
            {
                path: 'season',
                name: 'seasonCreate',
                component: () => import('@/components/admin/seasons/SeasonCreate.vue'),
            },
            {
                path: 'circuit',
                name: 'circuitCreate',
                component: () => import('@/components/admin/circuit/CreateCircuit.vue'),
            },
            {
                path: 'driver',
                name: 'driverCreate',
                component: () => import('@/components/admin/driver/CreateDriver.vue'),
            },
            {
                path: 'community',
                name: 'communitiesCreate',
                component: () => import('@/components/communities/CreateCommunity.vue'),
            },
        ]
    },

    // Circuitos
    {
        path: '/circuits',
        component: PrognoView,
        children: [
            {
                path: '',
                name: 'circuitlist',
                component: () => import('@/components/circuits/ViewCircuitList.vue'),
            },
            {
                path: ':circuit/:variant?',
                name: 'circuitDetails',
                component: () => import('@/components/circuits/ViewOneCircuit.vue'),
            },
        ]
    },

    // Ranking
    {
        path: '/ranking',
        meta: { requiresAuth: true },
        component: PrognoView,
        children: [{
            path: '',
            name: 'ranking',
            component: () => import('@/components/ranking/Ranking.vue'),
        }]
    },

    // Comunidades
    {
        path: '/communities',
        meta: { requiresAuth: true },
        component: PrognoView,
        children: [
            {
                path: '',
                name: 'communitiesList',
                component: () => import('@/components/communities/ViewCommunitiesList.vue'),
            },
            {
                path: ':community',
                name: 'communitiesDetails',
                component: () => import('@/components/communities/ViewOneCommunity.vue'),
            }
        ]
    },
    {
        path: '/invitation/:community?/:code?',
        meta: { requiresAuth: true }, //FixMe: Si invitaciones requiere auth, el login y registro deben matener la redirección a la invitación
        component: PrognoView,
        children: [{
            path: '',
            name: 'invitation',
            component: () => import('@/components/communities/InvitationToCommunity.vue'),
        }]
    },

    // Grandes Premios
    {
        path: '/gps',
        meta: { requiresAuth: true },
        component: PrognoView,
        children: [
            {
                path: ':competition?/:season?',
                alias: ['', ':competition?'],
                name: 'gplist',
                component: () => import('@/components/gps/ViewGrandPrixList.vue'),
            },
            {
                path: ':competition/:season/:id',
                name: 'gpdetails',
                component: () => import('@/components/gps/ViewOneGrandPrix.vue'),
            }
        ]
    },

    // Fallback
    {
        path: "/404",
        component: LandingView,
        children: [{
            name: 'Not Found',
            path: '',
            component: () => import('@/components/error/ErrorNotFound.vue'),
        }]
    },
    {
        path: '*',
        redirect: { path: "/404" }
    }
];

export const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

// Si está iniciado sesión y va a /, mandar a /home
router.beforeEach((to, from, next) => {
    checkLoggedIn(to, from, next);
    checkCommunity(to, from, next);
    sendToHome(to, from, next);
});

function sendToHome(to: Route, from: Route, next: NavigationGuardNext) {
    // Si está iniciado sesión y entra a /, redirigir a /home
    const loggedIn = store.getters['Auth/isLoggedIn'];
    if (to.path === "/" && loggedIn) {
        next('/home');
    } else {
        next();
    }
}

// Requerir login cuando sea necesario
function checkLoggedIn(to: Route, from: Route, next: NavigationGuardNext) {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // Si no está logged in y la ruta lo requiere, mandar al login
        const loggedIn = store.getters['Auth/isLoggedIn'];
        if (!loggedIn) {
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            })
        } else {
            next();
        }
    } else {
        next();
    }
}

// Asegurar que el usuario está en una comunidad si esa ruta lo requiere
function checkCommunity(to: Route, from: Route, next: NavigationGuardNext) {
    if (!to.name?.startsWith('/gps') && !to.name?.startsWith('/ranking') && !to.name?.startsWith('/rules')) {
        // Si no es ninguna de estas rutas, no hacer nada
        next();
    } else {
        const hasCommunity = store.getters['Auth/thereIsCurrentCommunity'];
        if (!hasCommunity) {
            // Si es una de esas rutas que necesitan comunidad, y no la tiene, mandar a /communities
            next('/communities');
        } else {
            next();
        }
    }
}
