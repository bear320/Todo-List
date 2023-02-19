import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

createApp(App).use(store).use(router).mount("#app");

// Dynamic title
router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    next();
});
