import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/",
        name: "login",
        component: () => import("@/views/Login.vue"),
        beforeEnter: (to, from, next) => {
            // 從 localStorage 獲取資料並定義
            const isLogIn = localStorage.getItem("isLogIn");
            const uid = localStorage.getItem("uid");

            // 如果 isLogIn 和 uid 都有值，則使用 next() 導向 /todo 路由
            // 使用者已登入
            if (isLogIn && uid) next("/todo");
            // 如果 isLogIn 或 uid 其一為空或 null，則使用 next() 導向 / 路由（仍在登入頁面，不讓使用者跳轉）
            // 使用者未登入或登入失敗
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
            // 從 localStorage 獲取資料並定義
            const isLogIn = localStorage.getItem("isLogIn");
            const uid = localStorage.getItem("uid");

            // 如果 isLogIn 或 uid 其一為 null 或 undefined，則使用 next() 導向 / 路由
            // 使用者未登入或登入失敗
            if (!isLogIn || !uid) next("/");
            // 如果 isLogIn 或 uid 其一為空值，則使用 next() 導向 / 路由
            // 使用者未登入或登入失敗
            if (isLogIn == "" || uid == "") next("/");
            // 如果 isLogIn 為 false 或 uid 為 null，則使用 next() 導向 / 路由
            // 使用者未登入或登入失敗
            if (isLogIn === "false" || uid === "null") next("/");

            // 認證通過，使用 next() 通過路由守衛，進入 /todo 路由
            next();
        },
        meta: { title: "Todo List" },
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

// router 全局路由守衛
// 確保使用者只能訪問到已經定義好的有效路徑
router.beforeEach((to) => {
    // 目標路徑為 / 直接 return
    if (to.fullPath === "/") return;
    // 目標路並不為 / 或 /todo，將使用者導向 / 路由
    // 訪問無效路徑則會被自動導向 / 路由
    if (to.fullPath !== "/" && to.fullPath !== "/todo") return "/";
});

export default router;
