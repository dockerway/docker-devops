import Home from '../pages/HomePage/HomePage.vue'
import About from '../pages/AboutPage/AboutPage.vue'
import ServerStatus from '../pages/ServerStatusPage'
import ServerTimeout from '../pages/ServerTimeoutPage'
import ErrorSamplePage from '../pages/ErrorSamplePage'

const routes = [
    {
        name: "root",
        path: '/',
        redirect: { name: 'home' },
        meta: {
            requiresAuth: true,
        }
    },
    {
        name: "home",
        path: '/home',
        component: Home,
        meta: {
            requiresAuth: true,
        }
    },
    {
        name: "about",
        path: '/about',
        component: About,
        meta: {
            requiresAuth: true,
        }
    },
    {
        name: "serverStatus",
        path: '/server-status',
        component: ServerStatus,
        meta: {
            requiresAuth: true,
        }
    },
    {
        name: "serverTimeout",
        path: '/server-timeout',
        component: ServerTimeout,
        meta: {
            requiresAuth: true,
        }
    },
    {
        name: "errorSample",
        path: '/error-sample',
        component: ErrorSamplePage,
        meta: {
            requiresAuth: true,
        }
    },

]

export default routes
