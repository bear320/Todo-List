<template>
    <router-view></router-view>
</template>

<script>
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/auth";

export default {
    data() {
        return {
            user: null,
        };
    },
    methods: {},
    created() {
        // 使用 onAuthStateChanged() 偵聽 auth 對象的登錄狀態
        // 如果用戶登入狀態發生變化，即會傳遞當前的登入用戶 (currentUser)
        onAuthStateChanged(auth, (currentUser) => {
            // 將 currentUser 賦值給 this.user
            this.user = currentUser;
            if (this.user) {
                // 如果用戶已登入（ this.user 不為空）
                // 將 localStorage 中的 isLogIn 和 uid 分別設定為 true 和當前用戶之 uid
                localStorage.setItem("isLogIn", "true");
                localStorage.setItem("uid", `${this.user.uid}`);
            } else {
                // 如果用戶為登入
                // 移除 localStorage 中的 isLogIn 和 uid
                localStorage.removeItem("isLogIn");
                localStorage.removeItem("uid");
            }
        });
    },
};
</script>

<style lang="scss">
#app {
    position: relative;
    width: 100vw;
    height: 100vh;
    background: rgb(34, 193, 195);
    background: linear-gradient(188deg, rgba(34, 193, 195, 1) 0%, rgba(253, 187, 45, 1) 100%);
    font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>
