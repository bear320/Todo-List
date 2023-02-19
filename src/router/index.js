import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/",
        name: "login",
        component: () => import("@/views/Login.vue"),
        beforeEnter: (to, from, next) => {
            const isLogIn = localStorage.getItem("isLogIn");
            const uid = localStorage.getItem("uid");

            if (isLogIn && uid) next("/todo");
            if (isLogIn == "" || uid == "") next("/");

            next();
        },
        meta: { title: "Todo List" },
    },
    {
        path: "/todo",
        name: "todo",
        component: () => import("@/views/Todo.vue"),
        beforeEnter: (to, from, next) => {
            const isLogIn = localStorage.getItem("isLogIn");
            const uid = localStorage.getItem("uid");

            if (!isLogIn || !uid) next("/");
            if (isLogIn == "" || uid == "") next("/");
            if (isLogIn === "false" || uid === "null") next("/");

            next();
        },
        meta: { title: "Todo List" },
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach((to) => {
    if (to.fullPath === "/") return;
    if (to.fullPath !== "/" && to.fullPath !== "/todo") return "/";
});

export default router;
