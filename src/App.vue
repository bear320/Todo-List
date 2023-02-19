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
        onAuthStateChanged(auth, (currentUser) => {
            this.user = currentUser;
            if (this.user) {
                localStorage.setItem("isLogIn", "true");
                localStorage.setItem("uid", `${this.user.uid}`);
            } else {
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
