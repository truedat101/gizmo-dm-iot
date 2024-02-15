import { createApp } from 'vue';
import { createPinia } from 'pinia';

// @ts-expect-error TS(2307): Cannot find module './App.vue' or its correspondin... Remove this comment to see the full error message
import App from './App.vue';
import { router } from './helpers';

// setup fake backend
// import { fakeBackend } from './helpers';
// fakeBackend();

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
