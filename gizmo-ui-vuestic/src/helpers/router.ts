import { createRouter, createWebHistory } from 'vue-router';

// @ts-expect-error TS(2307): Cannot find module '@/stores' or its corresponding... Remove this comment to see the full error message
import { useAuthStore } from '@/stores';
// @ts-expect-error TS(2307): Cannot find module '@/views' or its corresponding ... Remove this comment to see the full error message
import { HomeView, LoginView } from '@/views';

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    linkActiveClass: 'active',
    routes: [
        { path: '/', component: HomeView },
        { path: '/login', component: LoginView }
    ]
});

router.beforeEach(async (to) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['/login'];
    const authRequired = !publicPages.includes(to.path);
    const auth = useAuthStore();

    if (authRequired && !auth.user) {
        auth.returnUrl = to.fullPath;
        return '/login';
    }
});
