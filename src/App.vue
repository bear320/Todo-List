<template>
    <!-- <nav>
        <div class="wrapper">
            <h2>Todo List</h2>
        </div>
    </nav> -->
    <router-view></router-view>
</template>

<script>
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/auth";
// const provider = new GoogleAuthProvider();

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

    nav {
        padding: 0.75rem 0;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background-color: #fff;
        box-shadow: 0 10px 10px #0003;
        z-index: 1;

        .wrapper {
            max-width: 768px;
            margin: auto;
            // display: flex;
            // justify-content: space-between;
            // align-items: center;

            h2 {
                margin: 0;
            }
        }
    }
}
</style>
